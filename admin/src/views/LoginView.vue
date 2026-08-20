<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{ 'signed-in': [] }>();
const status = ref('');
const sitekey =
  document.documentElement.getAttribute('data-turnstile') || import.meta.env.PUBLIC_TURNSTILE_SITEKEY || '';
const widget = ref<HTMLElement | null>(null);
const turnstileToken = ref('');
let widgetId = '';

function waitForTurnstile() {
  return new Promise<void>((resolve) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const timer = window.setInterval(() => {
      if (window.turnstile) {
        window.clearInterval(timer);
        resolve();
      }
    }, 50);
  });
}

onMounted(async () => {
  if (!sitekey || !widget.value) return;
  await waitForTurnstile();
  if (widget.value && window.turnstile) {
    widgetId = window.turnstile.render(widget.value, {
      sitekey,
      action: 'admin-login',
      theme: 'auto',
      callback: (value: string) => {
        turnstileToken.value = value;
      },
    });
  }
});

async function onSubmit(event: Event) {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  status.value = 'Signing in…';
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: data.get('username'),
        password: data.get('password'),
        turnstileToken: turnstileToken.value || data.get('cf-turnstile-response'),
      }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!json.ok) {
      status.value = json.error || 'Could not sign in.';
      window.turnstile?.reset(widgetId);
      return;
    }
    document.documentElement.setAttribute('data-auth', '1');
    emit('signed-in');
  } catch {
    status.value = 'Could not sign in.';
    window.turnstile?.reset(widgetId);
  }
}
</script>

<template>
  <section class="admin-shell">
    <h1>Analytics</h1>
    <p class="admin-lede">Sign in to view consented visits and leads on dynasai.ai.</p>
    <form class="admin-login" @submit="onSubmit">
      <label>
        Username
        <input name="username" type="text" required autocomplete="username" spellcheck="false" />
      </label>
      <label>
        Password
        <input name="password" type="password" required autocomplete="current-password" />
      </label>
      <div v-if="sitekey" ref="widget"></div>
      <p v-else class="admin-status">Turnstile is not configured yet.</p>
      <button class="admin-btn admin-btn-primary" type="submit">Sign in</button>
      <p v-if="status" class="admin-status">{{ status }}</p>
    </form>
  </section>
</template>
