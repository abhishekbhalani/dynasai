import { createRouter, createWebHistory } from 'vue-router';
import AnalyticsView from './views/AnalyticsView.vue';
import LeadsView from './views/LeadsView.vue';

export function createAdminRouter(base: string) {
  return createRouter({
    history: createWebHistory(base),
    routes: [
      { path: '/', name: 'analytics', component: AnalyticsView },
      { path: '/leads', name: 'leads', component: LeadsView },
    ],
  });
}
