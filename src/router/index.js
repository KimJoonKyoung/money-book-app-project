import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/HomeView.vue';
import ListView from '../pages/ListView.vue';
import SummaryView from '../pages/SummaryView.vue';
import EditPage from '../pages/editpage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/list',
    name: 'List',
    component: ListView,
  },
  {
    path: '/summary',
    name: 'Summary',
    component: SummaryView,
  },
  {
    path: '/edit',
    name: 'Edit',
    component: EditPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
