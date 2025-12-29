<template>
  <div class="card">
    <div class="card-header">
      <div class="flex items-center gap-2">
        <Icon name="ph:user-plus" class="text-text-muted" />
        <h3
          class="text-xs font-bold uppercase tracking-wider text-text-primary"
        >
          Registration
        </h3>
      </div>
    </div>
    <div class="card-body">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-text-primary">Open Registration</p>
          <p class="text-xs text-text-muted mt-0.5">
            Allow new users to create accounts
          </p>
        </div>
        <button
          @click="toggleRegistration"
          :disabled="settingsLoading"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
          :class="
            registrationOpen
              ? 'bg-success'
              : 'bg-bg-tertiary border border-border'
          "
        >
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="registrationOpen ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>
      <div
        class="mt-4 p-3 rounded border"
        :class="
          registrationOpen
            ? 'bg-success/10 border-success/20'
            : 'bg-bg-tertiary border-border'
        "
      >
        <div class="flex items-center gap-2">
          <Icon
            :name="registrationOpen ? 'ph:lock-open' : 'ph:lock-simple'"
            :class="registrationOpen ? 'text-success' : 'text-text-muted'"
          />
          <span
            class="text-xs font-medium"
            :class="registrationOpen ? 'text-success' : 'text-text-secondary'"
          >
            {{
              registrationOpen
                ? 'Registration is currently open'
                : 'Registration is closed (invite only)'
            }}
          </span>
        </div>
      </div>

      <div class="mt-8 space-y-6">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label
              class="text-[10px] font-bold uppercase tracking-widest text-text-muted"
            >
              Minimum Ratio
            </label>
            <span class="text-[10px] font-mono text-text-muted">
              {{ minRatio > 0 ? minRatio.toFixed(2) : 'DISABLED' }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <input
              v-model.number="minRatio"
              type="number"
              step="0.1"
              min="0"
              class="flex-1 bg-bg-tertiary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-white/20 font-mono"
              placeholder="0.00"
            />
          </div>
          <p class="text-[10px] text-text-muted mt-1.5 leading-relaxed">
            Users with a ratio below this value will be blocked from
            downloading. Set to 0 to disable enforcement.
          </p>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label
              class="text-[10px] font-bold uppercase tracking-widest text-text-muted"
            >
              Starter Credit (GB)
            </label>
            <span class="text-[10px] font-mono text-text-muted">
              {{ starterUploadGB }} GB
            </span>
          </div>
          <div class="flex items-center gap-3">
            <input
              v-model.number="starterUploadGB"
              type="number"
              min="0"
              class="flex-1 bg-bg-tertiary border border-border rounded px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-white/20 font-mono"
              placeholder="0"
            />
          </div>
          <p class="text-[10px] text-text-muted mt-1.5 leading-relaxed">
            Initial upload amount given to new users to prevent immediate ratio
            blocking.
          </p>
        </div>

        <button
          @click="saveSettings"
          :disabled="settingsLoading"
          class="w-full bg-text-primary text-bg-primary text-[10px] font-bold uppercase tracking-widest py-2.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Icon
            v-if="settingsLoading"
            name="ph:circle-notch"
            class="animate-spin"
          />
          {{ settingsLoading ? 'Saving...' : 'Save Configuration' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const registrationOpen = ref(false);
const minRatio = ref(0);
const starterUploadGB = ref(0);
const settingsLoading = ref(false);

// Fetch settings on mount
onMounted(async () => {
  try {
    const settings = await $fetch<{
      registrationOpen: boolean;
      minRatio: number;
      starterUpload: number;
    }>('/api/admin/settings');
    registrationOpen.value = settings.registrationOpen;
    minRatio.value = settings.minRatio;
    starterUploadGB.value = Math.floor(settings.starterUpload / 1024 ** 3);
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
});

async function toggleRegistration() {
  settingsLoading.value = true;
  try {
    const newValue = !registrationOpen.value;
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: { registrationOpen: newValue },
    });
    registrationOpen.value = newValue;
  } catch (error) {
    console.error('Failed to update settings:', error);
  } finally {
    settingsLoading.value = false;
  }
}

async function saveSettings() {
  settingsLoading.value = true;
  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: {
        minRatio: minRatio.value,
        starterUpload: starterUploadGB.value * 1024 ** 3,
      },
    });
  } catch (error) {
    console.error('Failed to save settings:', error);
  } finally {
    settingsLoading.value = false;
  }
}
</script>
