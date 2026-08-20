<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Rank = { name: string; count: number };
type Series = { t: string; visitors: number; pageViews: number };
type Activity = {
  ok?: boolean;
  visitors?: number;
  pageViews?: number;
  events?: number;
  series?: Series[];
  countries?: Rank[];
  pages?: Rank[];
  referrers?: Rank[];
  recent?: Array<Record<string, unknown>>;
};

const loading = ref(true);
const error = ref('');
const data = ref<Activity>({});

function maxCount(list: Rank[]) {
  return Math.max(...list.map((item) => item.count), 1);
}

function barHeight(value: number, max: number) {
  return `${Math.max(6, Math.round((value / max) * 100))}%`;
}

function fmtMs(value: unknown) {
  const n = Number(value) || 0;
  if (n < 1000) return `${n} ms`;
  return `${(n / 1000).toFixed(1)} s`;
}

function when(value: unknown) {
  return String(value || '').replace('T', ' ').slice(0, 19);
}

function place(event: Record<string, unknown>) {
  return [event.city, event.region, event.country].filter(Boolean).join(', ') || '—';
}

function net(event: Record<string, unknown>) {
  return [event.network, event.isp].filter(Boolean).join(' · ') || '—';
}

async function load() {
  loading.value = true;
  error.value = '';
  const res = await fetch('/api/admin/activity');
  if (res.status === 401) {
    document.documentElement.setAttribute('data-auth', '0');
    window.location.reload();
    return;
  }
  const json = (await res.json()) as Activity;
  if (!json.ok) {
    error.value = 'Could not load analytics.';
    loading.value = false;
    return;
  }
  data.value = json;
  loading.value = false;
}

onMounted(() => {
  void load();
});

const maxVisitors = () => Math.max(...(data.value.series || []).map((item) => item.visitors), 1);
</script>

<template>
  <section class="admin-shell">
    <h1>Analytics</h1>
    <p class="admin-lede">
      Consented first-party visits on dynasai.ai. Same shape as Cloudflare Analytics: visitors, page views,
      countries, and top paths. This admin host is not measured.
    </p>
    <div class="admin-toolbar">
      <p>Last 7 days · consented visits</p>
      <button class="admin-btn" type="button" @click="load">Refresh</button>
    </div>
    <p v-if="error" class="admin-status">{{ error }}</p>
    <p v-else-if="loading" class="admin-status">Loading…</p>
    <template v-else>
      <div class="admin-kpis">
        <article>
          <h2>Unique visitors</h2>
          <p>{{ data.visitors || 0 }}</p>
        </article>
        <article>
          <h2>Page views</h2>
          <p>{{ data.pageViews || 0 }}</p>
        </article>
        <article>
          <h2>Events</h2>
          <p>{{ data.events || 0 }}</p>
        </article>
        <article>
          <h2>Countries</h2>
          <p>{{ (data.countries || []).length }}</p>
        </article>
      </div>
      <div class="admin-grid">
        <section class="admin-panel">
          <h2>Visitors over time</h2>
          <div v-if="data.series?.length" class="admin-chart" role="img" aria-label="Visitors by hour">
            <button
              v-for="item in data.series"
              :key="item.t"
              type="button"
              :title="`${item.t} · ${item.visitors} visitors`"
              :aria-label="`${item.t} ${item.visitors} visitors`"
              :style="{ '--h': barHeight(item.visitors, maxVisitors()) }"
            ></button>
          </div>
          <p v-else class="admin-empty">No traffic in the current window.</p>
        </section>
        <section class="admin-panel">
          <h2>Top countries</h2>
          <ol v-if="data.countries?.length" class="admin-rank">
            <li v-for="item in data.countries" :key="item.name">
              <div class="admin-rank-meta">
                <span>{{ item.name }}</span>
                <span>{{ item.count }}</span>
              </div>
              <div class="admin-rank-track">
                <div class="admin-rank-fill" :style="{ '--w': `${Math.round((item.count / maxCount(data.countries || [])) * 100)}%` }"></div>
              </div>
            </li>
          </ol>
          <p v-else class="admin-empty">No data yet.</p>
        </section>
      </div>
      <div class="admin-split">
        <section class="admin-panel">
          <h2>Top pages</h2>
          <ol v-if="data.pages?.length" class="admin-rank">
            <li v-for="item in data.pages" :key="item.name">
              <div class="admin-rank-meta">
                <span>{{ item.name }}</span>
                <span>{{ item.count }}</span>
              </div>
              <div class="admin-rank-track">
                <div class="admin-rank-fill" :style="{ '--w': `${Math.round((item.count / maxCount(data.pages || [])) * 100)}%` }"></div>
              </div>
            </li>
          </ol>
          <p v-else class="admin-empty">No data yet.</p>
        </section>
        <section class="admin-panel">
          <h2>Referrers</h2>
          <ol v-if="data.referrers?.length" class="admin-rank">
            <li v-for="item in data.referrers" :key="item.name">
              <div class="admin-rank-meta">
                <span>{{ item.name }}</span>
                <span>{{ item.count }}</span>
              </div>
              <div class="admin-rank-track">
                <div class="admin-rank-fill" :style="{ '--w': `${Math.round((item.count / maxCount(data.referrers || [])) * 100)}%` }"></div>
              </div>
            </li>
          </ol>
          <p v-else class="admin-empty">No data yet.</p>
        </section>
      </div>
      <div class="table-wrap">
        <table>
          <caption class="visually-hidden">Recent visitor events</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Type</th>
              <th scope="col">Page / section</th>
              <th scope="col">Dwell</th>
              <th scope="col">Location</th>
              <th scope="col">Network / ISP</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(event, index) in data.recent || []" :key="String(event.id || index)">
              <td>{{ when(event.ts) }}</td>
              <td>{{ event.type }}</td>
              <td>{{ event.path }}{{ event.section ? ` · ${event.section}` : '' }}</td>
              <td>{{ fmtMs(event.dwellMs || event.visibleMs || event.holdMs) }}</td>
              <td>{{ place(event) }}</td>
              <td>{{ net(event) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>
