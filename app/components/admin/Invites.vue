<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon name="ph:envelope-simple-bold" class="text-text-muted" />
          <h3
            class="text-xs font-bold uppercase tracking-wider text-text-primary"
          >
            Invitations
          </h3>
        </div>
      </div>
    </div>
    <div class="card-body">
      <!-- Grant Invites Form -->
      <div class="mb-6 p-3 rounded border border-border bg-bg-tertiary/50">
        <h4
          class="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3"
        >
          Grant Invites to User
        </h4>
        <div class="flex gap-2">
          <input
            v-model="grantUserId"
            type="text"
            placeholder="User ID"
            class="input flex-1 !py-2 text-xs font-mono"
          />
          <input
            v-model.number="grantCount"
            type="number"
            min="1"
            max="100"
            placeholder="Count"
            class="input w-20 !py-2 text-xs"
          />
          <button
            @click="grantInvites"
            :disabled="!grantUserId || !grantCount || isGranting"
            class="btn btn-primary !px-4 !py-2 text-xs"
          >
            <Icon
              v-if="isGranting"
              name="ph:circle-notch"
              class="animate-spin mr-1"
            />
            Grant
          </button>
        </div>
      </div>

      <!-- Invites List -->
      <div v-if="invites?.data && invites.data.length > 0" class="space-y-2">
        <div
          v-for="invite in invites.data"
          :key="invite.id"
          class="flex items-center justify-between p-3 rounded border border-border bg-bg-tertiary/50"
        >
          <div>
            <div class="flex items-center gap-2 mb-1">
              <code
                class="px-2 py-0.5 text-xs font-mono bg-bg-primary rounded border border-border"
              >
                {{ invite.code }}
              </code>
              <span
                class="px-2 py-0.5 text-[10px] font-bold uppercase rounded"
                :class="
                  invite.usedBy
                    ? 'bg-success/20 text-success'
                    : 'bg-warning/20 text-warning'
                "
              >
                {{ invite.usedBy ? 'Used' : 'Pending' }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-[10px] text-text-muted">
              <span>
                Created by:
                <span class="font-mono">{{ invite.creator?.username }}</span>
              </span>
              <span v-if="invite.usedByUser">
                Used by:
                <span class="font-mono">{{ invite.usedByUser.username }}</span>
              </span>
              <span>
                {{ formatDate(invite.createdAt) }}
              </span>
              <span
                v-if="invite.expiresAt && !invite.usedBy"
                :class="isExpired(invite.expiresAt) ? 'text-error' : ''"
              >
                Expires: {{ formatDate(invite.expiresAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-xs text-text-muted text-center py-4">
        No invitations found
      </p>

      <!-- Pagination -->
      <div
        v-if="invites?.pagination && invites.pagination.pages > 1"
        class="flex justify-center gap-2 mt-4"
      >
        <button
          @click="page--"
          :disabled="page <= 1"
          class="btn btn-secondary !px-3 !py-1 text-[10px]"
        >
          Prev
        </button>
        <span class="text-xs text-text-muted self-center">
          {{ page }} / {{ invites.pagination.pages }}
        </span>
        <button
          @click="page++"
          :disabled="page >= invites.pagination.pages"
          class="btn btn-secondary !px-3 !py-1 text-[10px]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Invitation {
  id: string;
  code: string;
  createdBy: string;
  usedBy?: string;
  createdAt: string;
  usedAt?: string;
  expiresAt?: string;
  creator?: { id: string; username: string };
  usedByUser?: { id: string; username: string };
}

interface InvitesResponse {
  data: Invitation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const page = ref(1);
const grantUserId = ref('');
const grantCount = ref(2);
const isGranting = ref(false);

const { data: invites, refresh } = await useFetch<InvitesResponse>(
  '/api/admin/invites',
  {
    query: computed(() => ({ page: page.value })),
  }
);

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isExpired(date: string) {
  return new Date(date) < new Date();
}

async function grantInvites() {
  if (!grantUserId.value || !grantCount.value) return;
  isGranting.value = true;
  try {
    await $fetch('/api/admin/invites/grant', {
      method: 'POST',
      body: {
        userId: grantUserId.value,
        count: grantCount.value,
      },
    });
    grantUserId.value = '';
    grantCount.value = 2;
    await refresh();
  } catch (error: any) {
    console.error('Failed to grant invites:', error);
  } finally {
    isGranting.value = false;
  }
}
</script>
