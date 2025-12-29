import { db } from '~~/server/db';
import { users } from '~~/server/db/schema';
import { requireModeratorSession } from '~~/server/utils/adminAuth';
import { ilike, or } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await requireModeratorSession(event);
  const query = getQuery(event);
  const search = query.search as string;

  if (!search) {
    return [];
  }

  const results = await db.query.users.findMany({
    where: or(
      ilike(users.username, `%${search}%`),
      ilike(users.email, `%${search}%`)
    ),
    limit: 10,
    columns: {
      id: true,
      username: true,
      email: true,
      isAdmin: true,
      isModerator: true,
      isBanned: true,
      lastIp: true,
      createdAt: true,
    },
  });

  return results;
});
