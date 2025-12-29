import { getGlobalStats } from '../../redis/cache';
import { db, schema } from '../../db';
import { sql } from 'drizzle-orm';
import { redis } from '../../redis/client';
import { requireAdminSession } from '../../utils/adminAuth';

export default defineEventHandler(async (event) => {
  // Require admin authentication
  await requireAdminSession(event);
  // Get total torrents from DB
  const torrentsCountResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.torrents);
  const totalTorrents = torrentsCountResult[0]?.count || 0;

  // Get total peers and seeders from Redis using SCAN for safety
  let totalPeers = 0;
  let totalSeeders = 0;
  let cursor = '0';
  try {
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        'MATCH',
        'peers:*',
        'COUNT',
        100
      );
      cursor = nextCursor;
      for (const key of keys) {
        const peersData = await redis.hgetall(key);
        for (const json of Object.values(peersData)) {
          try {
            const peer = JSON.parse(json as string);
            totalPeers++;
            if (peer.isSeeder) totalSeeders++;
          } catch (e) {
            // Ignore invalid JSON
          }
        }
      }
    } while (cursor !== '0');
  } catch (err) {
    console.error('[Stats] Failed to fetch peer count from Redis:', err);
  }

  // Try to get tracker, may fail if native modules aren't built
  let tracker = null;
  let protocols = { http: false, udp: false, ws: false };

  try {
    const { getTracker } = await import('../../tracker');
    tracker = getTracker();
    if (tracker) {
      protocols = {
        http: !!tracker.http,
        udp: !!tracker.udp,
        ws: !!tracker.ws,
      };
    }
  } catch {
    // Tracker not available (native modules not built)
  }

  return {
    status: tracker ? 'running' : 'stopped',
    cached: {
      torrents: totalTorrents,
      peers: totalPeers,
      seeders: totalSeeders,
      updatedAt: Date.now(),
    },
    live: {
      torrents: totalTorrents,
      peers: totalPeers,
    },
    protocols,
  };
});
