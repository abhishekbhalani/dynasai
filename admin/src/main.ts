import '../../public/js/boot.js';
import { createApp } from 'vue';
import App from './App.vue';
import { createAdminRouter } from './router';
import '../../src/styles/tokens.css';
import '../../src/styles/admin.css';

const base = document.documentElement.getAttribute('data-base') || '/';
createApp(App).use(createAdminRouter(base)).mount('#app');
