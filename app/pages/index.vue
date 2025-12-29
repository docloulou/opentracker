<template>
  <div class="max-w-5xl mx-auto py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-secondary border border-border mb-6"
      >
        <span class="relative flex h-2 w-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"
          ></span>
          <span
            class="relative inline-flex rounded-full h-2 w-2 bg-success"
          ></span>
        </span>
        <span
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted"
          >Tracker Online & Operational</span
        >
      </div>
      <h1
        class="text-4xl md:text-6xl font-black text-text-primary tracking-tighter uppercase mb-4"
      >
        Open<span class="text-text-muted">Tracker</span>
      </h1>
      <p class="text-sm text-text-muted font-mono max-w-xl mx-auto mb-10">
        High-performance, minimalist P2P tracking engine. Search through our
        indexed database of verified torrents.
      </p>

      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto">
        <SearchBar
          v-model="search"
          placeholder="Search torrents by name, tag or infohash..."
          size="lg"
          @search="handleSearch"
        />
        <div class="flex flex-wrap justify-center gap-4 mt-6">
          <div
            class="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest"
          >
            <Icon name="ph:package" />
            <span>{{ stats?.live?.torrents ?? 0 }} Torrents</span>
          </div>
          <div
            class="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest"
          >
            <Icon name="ph:users-three" />
            <span>{{ stats?.cached?.peers ?? 0 }} Peers</span>
          </div>
          <div
            class="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-widest"
          >
            <Icon name="ph:lightning" />
            <span>Ultra-low Latency</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="space-y-4">
      <div class="flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <Icon name="ph:clock-counter-clockwise" class="text-text-muted" />
          <h3 class="text-xs font-bold uppercase tracking-wider">
            Recently Indexed
          </h3>
        </div>
        <NuxtLink
          to="/torrents"
          class="text-[10px] font-bold uppercase text-text-muted hover:text-white transition-colors flex items-center gap-1"
        >
          Browse all <Icon name="ph:arrow-right" />
        </NuxtLink>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <TorrentTable :torrents="recentTorrents" :compact="true" />
        </div>
      </div>
    </div>

    <!-- Info Section -->
    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 border-t border-border pt-12"
    >
      <div>
        <h4
          class="text-xs font-bold uppercase tracking-widest text-text-primary mb-3"
        >
          High Performance
        </h4>
        <p class="text-xs text-text-muted leading-relaxed font-mono">
          Built with Node.js and Redis for sub-millisecond response times and
          high concurrency support.
        </p>
      </div>
      <div>
        <h4
          class="text-xs font-bold uppercase tracking-widest text-text-primary mb-3"
        >
          Multi-Protocol
        </h4>
        <p class="text-xs text-text-muted leading-relaxed font-mono">
          Supports HTTP, UDP, and WebSocket protocols for maximum compatibility
          with all BitTorrent clients.
        </p>
      </div>
      <div>
        <h4
          class="text-xs font-bold uppercase tracking-widest text-text-primary mb-3"
        >
          Open Source
        </h4>
        <p class="text-xs text-text-muted leading-relaxed font-mono">
          Fully transparent and community-driven. Designed for privacy and
          efficiency in the P2P ecosystem.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TrackerStats {
  status: string;
  cached: {
    torrents: number;
    peers: number;
    seeders: number;
    updatedAt: number;
  };
  live: {
    torrents: number;
    peers: number;
  };
  protocols: {
    http: boolean;
    udp: boolean;
    ws: boolean;
  };
}

interface TorrentWithStats {
  id: string;
  infoHash: string;
  name: string;
  size: number;
  createdAt: string;
  stats: {
    seeders: number;
    leechers: number;
    completed: number;
  };
}

const search = ref('');
const router = useRouter();

function handleSearch() {
  if (!search.value.trim()) return;
  router.push({
    path: '/search',
    query: { q: search.value.trim() },
  });
}

// Fetch tracker stats for the hero section
const { data: stats } = await useFetch<TrackerStats>('/api/admin/stats');

// Fetch recent torrents
const { data: torrentsData } = await useFetch<{ data: TorrentWithStats[] }>(
  '/api/torrents',
  {
    query: { limit: 10 },
  }
);

const recentTorrents = computed(() => torrentsData.value?.data ?? []);
</script>
