<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Lead = {
  id: string;
  source: string;
  name: string;
  email: string;
  company: string;
  message: string;
  path: string;
  created_at: string;
};

const loading = ref(true);
const error = ref('');
const leads = ref<Lead[]>([]);
const store = ref('');

function when(value: string) {
  return value.replace('T', ' ').slice(0, 19);
}

function sourceLabel(value: string) {
  if (value === 'quick-contact') return 'Quick contact';
  if (value.includes('playbook') || value === 'insurance-playbook') return 'Playbook';
  return value || '—';
}

async function load() {
  loading.value = true;
  error.value = '';
  const res = await fetch('/api/admin/leads');
  if (res.status === 401) {
    document.documentElement.setAttribute('data-auth', '0');
    window.location.reload();
    return;
  }
  const json = (await res.json()) as { ok?: boolean; leads?: Lead[]; store?: string; error?: string };
  if (!json.ok) {
    error.value = json.error || 'Could not load leads.';
    loading.value = false;
    return;
  }
  leads.value = json.leads || [];
  store.value = json.store || '';
  loading.value = false;
}

onMounted(() => {
  void load();
});
</script>

<template>
  <section class="admin-shell">
    <h1>Leads</h1>
    <p class="admin-lede">
      Playbook OTP and quick-contact submissions. Email sending is still off, so playbook rows appear after a visitor
      verifies a code. Quick contact is live.
    </p>
    <div class="admin-toolbar">
      <p>{{ store === 'd1' ? 'Stored in D1' : 'Stored in KV until D1 is attached' }}</p>
      <button class="admin-btn" type="button" @click="load">Refresh</button>
    </div>
    <p v-if="error" class="admin-status">{{ error }}</p>
    <p v-else-if="loading" class="admin-status">Loading…</p>
    <div v-else class="table-wrap">
      <table>
        <caption class="visually-hidden">Inbound leads</caption>
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Source</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Company</th>
            <th scope="col">Message / path</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!leads.length">
            <td colspan="6"><p class="admin-empty">No leads yet.</p></td>
          </tr>
          <tr v-for="lead in leads" :key="lead.id">
            <td>{{ when(lead.created_at) }}</td>
            <td>{{ sourceLabel(lead.source) }}</td>
            <td>{{ lead.name || '—' }}</td>
            <td>{{ lead.email }}</td>
            <td>{{ lead.company || '—' }}</td>
            <td>{{ lead.message || lead.path || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
