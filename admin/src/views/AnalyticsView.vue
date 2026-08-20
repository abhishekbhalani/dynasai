<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

type Rank = { name: string; count: number };
type Series = { t: string; visitors: number; pageViews: number };
type Activity = {
  ok?: boolean;
  source?: string;
  visitors?: number;
  pageViews?: number;
  requests?: number;
  bytes?: number;
  countriesCount?: number;
  avgPages?: number;
  series?: Series[];
  countries?: Rank[];
  pages?: Rank[];
  referrers?: Rank[];
  cachedAt?: string;
  cache?: 'fresh' | 'stale' | 'live';
};

const loading = ref(true);
const error = ref('');
const data = ref<Activity>({});
const fmt = new Intl.NumberFormat('en-US');

function n(value: unknown) {
  return fmt.format(Number(value) || 0);
}

function bytes(value: unknown) {
  const n = Number(value) || 0;
  if (n >= 1024 * 1024 * 1024) return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  if (n >= 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

function maxCount(list: Rank[]) {
  return Math.max(...list.map((item) => item.count), 1);
}

function barHeight(value: number, max: number) {
  return `${Math.max(8, Math.round((value / Math.max(max, 1)) * 100))}%`;
}

function dayLabel(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
}

function cacheLabel(activity: Activity) {
  const state = activity.cache || 'live';
  const at = activity.cachedAt ? Date.parse(activity.cachedAt) : NaN;
  if (!Number.isFinite(at)) return state === 'live' ? 'Live from Cloudflare' : 'Cached snapshot';
  const mins = Math.max(0, Math.round((Date.now() - at) / 60000));
  const when = mins < 1 ? 'just now' : `${mins} min ago`;
  if (state === 'stale') return `Cached ${when} · updating`;
  if (state === 'fresh') return `Cached ${when}`;
  return `Fetched ${when}`;
}

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/admin/activity', { cache: 'no-store', credentials: 'same-origin' });
    if (res.status === 401) {
      document.documentElement.setAttribute('data-auth', '0');
      window.location.reload();
      return;
    }
    const json = (await res.json()) as Activity & { error?: string };
    if (!json.ok) {
      error.value = json.error || 'Could not load analytics.';
      loading.value = false;
      return;
    }
    data.value = json;
  } catch {
    error.value = 'Could not load analytics.';
  }
  loading.value = false;
}

onMounted(() => {
  void load();
});

const maxVisitors = computed(() => Math.max(...(data.value.series || []).map((item) => item.visitors), 1));
</script>

<template>
  <section class="admin-shell">
    <h1>Traffic</h1>
    <p class="admin-lede">
      Unique visitors on dynasai.ai from Cloudflare Analytics — the same traffic numbers as the Cloudflare dashboard.
    </p>
    <div class="admin-toolbar">
      <div class="admin-toolbar-copy">
        <p>{{ data.source === 'cloudflare' ? 'Cloudflare Analytics · last 7 days' : 'Last 7 days · unique visitors' }}</p>
        <p
          v-if="!loading && data.cachedAt"
          class="admin-cache"
          :data-state="data.cache || 'live'"
          aria-live="polite"
        >
          {{ cacheLabel(data) }}
        </p>
      </div>
      <button class="admin-btn" type="button" @click="load">Refresh</button>
    </div>
    <p v-if="error" class="admin-status">{{ error }}</p>
    <p v-else-if="loading" class="admin-status">Loading…</p>
    <template v-else>
      <div class="admin-kpis">
        <article>
          <h2>Unique visitors</h2>
          <p>{{ n(data.visitors) }}</p>
        </article>
        <article>
          <h2>Page views</h2>
          <p>{{ n(data.pageViews) }}</p>
        </article>
        <article>
          <h2>Requests</h2>
          <p>{{ n(data.requests) }}</p>
        </article>
        <article>
          <h2>Bandwidth</h2>
          <p>{{ bytes(data.bytes) }}</p>
        </article>
      </div>
      <div class="admin-grid">
        <section class="admin-panel">
          <h2>Visitors over time</h2>
          <div class="admin-chart" role="img" aria-label="Unique visitors by day">
            <div v-for="item in data.series || []" :key="item.t" class="admin-chart-col">
              <button
                type="button"
                :title="`${item.t} · ${item.visitors} unique visitors · ${item.pageViews} page views`"
                :aria-label="`${item.t} ${item.visitors} unique visitors`"
                :style="{ '--h': barHeight(item.visitors, maxVisitors) }"
              ></button>
              <span>{{ dayLabel(item.t) }}</span>
            </div>
          </div>
        </section>
        <section class="admin-panel">
          <h2>Top countries</h2>
          <ol v-if="data.countries?.length" class="admin-rank">
            <li v-for="item in data.countries" :key="item.name">
              <div class="admin-rank-meta">
                <span>{{ item.name }}</span>
                <span>{{ n(item.count) }}</span>
              </div>
              <div class="admin-rank-track">
                <div class="admin-rank-fill" :style="{ '--w': `${Math.round((item.count / maxCount(data.countries || [])) * 100)}%` }"></div>
              </div>
            </li>
          </ol>
          <p v-else class="admin-empty">No country data in this window.</p>
        </section>
      </div>
      <div class="admin-split">
        <section class="admin-panel">
          <h2>Top pages</h2>
          <ol v-if="data.pages?.length" class="admin-rank">
            <li v-for="item in data.pages" :key="item.name">
              <div class="admin-rank-meta">
                <span>{{ item.name }}</span>
                <span>{{ n(item.count) }}</span>
              </div>
              <div class="admin-rank-track">
                <div class="admin-rank-fill" :style="{ '--w': `${Math.round((item.count / maxCount(data.pages || [])) * 100)}%` }"></div>
              </div>
            </li>
          </ol>
          <p v-else class="admin-empty">No page views yet.</p>
        </section>
        <section class="admin-panel">
          <h2>Referrers</h2>
          <ol v-if="data.referrers?.length" class="admin-rank">
            <li v-for="item in data.referrers" :key="item.name">
              <div class="admin-rank-meta">
                <span>{{ item.name }}</span>
                <span>{{ n(item.count) }}</span>
              </div>
              <div class="admin-rank-track">
                <div class="admin-rank-fill" :style="{ '--w': `${Math.round((item.count / maxCount(data.referrers || [])) * 100)}%` }"></div>
              </div>
            </li>
          </ol>
          <p v-else class="admin-empty">No referrers yet.</p>
        </section>
      </div>
    </template>
  </section>
</template>
