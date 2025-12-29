<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center gap-2">
        <Icon name="ph:broadcast-bold" class="text-text-muted" />
        <h3
          class="text-xs font-bold uppercase tracking-wider text-text-primary"
        >
          Endpoints
        </h3>
      </div>
    </div>
    <div class="card-body space-y-4">
      <div>
        <label
          class="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1"
          >HTTP Announce</label
        >
        <div class="flex items-center gap-2 mt-1">
          <code
            class="flex-1 text-[10px] font-mono bg-bg-primary border border-border px-2 py-1.5 rounded text-text-secondary truncate"
          >
            http://localhost:8080/announce
          </code>
          <button
            class="p-1.5 text-text-muted hover:text-white transition-colors"
            @click="copyToClipboard('http://localhost:8080/announce')"
          >
            <Icon name="ph:copy" />
          </button>
        </div>
      </div>
      <div>
        <label
          class="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1"
          >UDP Announce</label
        >
        <div class="flex items-center gap-2 mt-1">
          <code
            class="flex-1 text-[10px] font-mono bg-bg-primary border border-border px-2 py-1.5 rounded text-text-secondary truncate"
          >
            udp://localhost:8081/announce
          </code>
          <button
            class="p-1.5 text-text-muted hover:text-white transition-colors"
            @click="copyToClipboard('udp://localhost:8081/announce')"
          >
            <Icon name="ph:copy" />
          </button>
        </div>
      </div>
      <div>
        <label
          class="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1"
          >WebSocket</label
        >
        <div class="flex items-center gap-2 mt-1">
          <code
            class="flex-1 text-[10px] font-mono bg-bg-primary border border-border px-2 py-1.5 rounded text-text-secondary truncate"
          >
            ws://localhost:8082
          </code>
          <button
            class="p-1.5 text-text-muted hover:text-white transition-colors"
            @click="copyToClipboard('ws://localhost:8082')"
          >
            <Icon name="ph:copy" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
</script>
