<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Forum</h1>
        <p class="text-text-muted text-sm">
          Community discussions and announcements.
        </p>
      </div>
      <div v-if="user?.isAdmin">
        <button
          @click="showCreateCategory = true"
          class="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Icon name="ph:plus-bold" />
          New Category
        </button>
      </div>
    </div>

    <div v-if="pending" class="space-y-4">
      <div
        v-for="i in 3"
        :key="i"
        class="h-24 bg-bg-secondary animate-pulse rounded-lg border border-border"
      ></div>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-bg-secondary border border-border rounded-lg overflow-hidden group hover:border-white/20 transition-colors"
      >
        <NuxtLink :to="`/forum/category/${category.id}`" class="block p-6">
          <div class="flex justify-between items-start">
            <div>
              <h2
                class="text-lg font-bold group-hover:text-white transition-colors"
              >
                {{ category.name }}
              </h2>
              <p class="text-text-muted text-sm mt-1">
                {{ category.description }}
              </p>
            </div>
            <div class="text-right">
              <div
                class="text-xs font-mono text-text-muted uppercase tracking-widest"
              >
                Last Activity
              </div>
              <div v-if="category.topics?.[0]" class="text-sm mt-1">
                {{ formatDate(category.topics[0].updatedAt) }}
              </div>
              <div v-else class="text-sm mt-1 text-text-muted italic">
                No topics yet
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Create Category Modal -->
    <div
      v-if="showCreateCategory"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        class="bg-bg-secondary border border-border rounded-lg w-full max-w-md p-6 space-y-4"
      >
        <h3 class="text-lg font-bold">Create New Category</h3>
        <div class="space-y-4">
          <div>
            <label
              class="block text-[10px] uppercase tracking-widest text-text-muted mb-1.5 font-bold"
              >Name</label
            >
            <input
              v-model="newCategory.name"
              type="text"
              class="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-white/40 transition-colors"
              placeholder="General Discussion"
            />
          </div>
          <div>
            <label
              class="block text-[10px] uppercase tracking-widest text-text-muted mb-1.5 font-bold"
              >Description</label
            >
            <textarea
              v-model="newCategory.description"
              class="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-white/40 transition-colors h-24 resize-none"
              placeholder="Talk about anything here..."
            ></textarea>
          </div>
          <div>
            <label
              class="block text-[10px] uppercase tracking-widest text-text-muted mb-1.5 font-bold"
              >Order</label
            >
            <input
              v-model.number="newCategory.order"
              type="number"
              class="w-full bg-bg-tertiary border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button
            @click="showCreateCategory = false"
            class="flex-1 px-4 py-2 bg-bg-tertiary text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleCreateCategory"
            :disabled="creating"
            class="flex-1 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-wider rounded hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            {{ creating ? 'Creating...' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
const {
  data: categories,
  pending,
  refresh,
} = await useFetch('/api/forum/categories');

const showCreateCategory = ref(false);
const creating = ref(false);
const newCategory = ref({
  name: '',
  description: '',
  order: 0,
});

async function handleCreateCategory() {
  if (!newCategory.value.name) return;

  creating.value = true;
  try {
    await $fetch('/api/forum/categories', {
      method: 'POST',
      body: newCategory.value,
    });
    showCreateCategory.value = false;
    newCategory.value = { name: '', description: '', order: 0 };
    await refresh();
  } catch (e) {
    console.error(e);
  } finally {
    creating.value = false;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>
