<script setup lang="ts">
import { computed, ref } from 'vue';
import LoginView from './views/LoginView.vue';

const logoMark = '/img/logo-mark.svg';
const root = document.documentElement;
const authed = ref(root.getAttribute('data-auth') === '1');

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

async function logout() {
  await fetch('/api/admin/logout', { method: 'POST' });
  root.setAttribute('data-auth', '0');
  authed.value = false;
}

const title = computed(() => (authed.value ? 'Visitor analytics' : 'Admin sign in'));
</script>

<template>
  <header class="admin-bar">
    <div class="admin-bar-inner">
      <p class="brand">
        <img class="brand-mark" :src="logoMark" alt="" width="130" height="36" decoding="async" />
        <span class="brand-tagline">{{ title }}</span>
      </p>
      <div class="admin-bar-actions">
        <a href="https://dynasai.ai">View site</a>
        <button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme" @click="toggleTheme">
          <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8"></circle>
            <path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
          </svg>
          <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16.5 13.2A6.8 6.8 0 0 1 11 5.2 7 7 0 1 0 18.8 15a6.7 6.7 0 0 1-2.3-1.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></path>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <main id="content">
    <LoginView v-if="!authed" @signed-in="authed = true" />
    <template v-else>
      <nav class="admin-nav" aria-label="Admin">
        <router-link to="/">Analytics</router-link>
        <router-link to="/leads">Leads</router-link>
        <button class="admin-btn" type="button" @click="logout">Sign out</button>
      </nav>
      <router-view />
    </template>
  </main>
</template>
