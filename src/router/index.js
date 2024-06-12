import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../pages/HomeView.vue';
import ListView from '../pages/ListView.vue';
import SummaryView from '../pages/SummaryView.vue';
import EditPage from '../pages/editpage.vue';
import UpdatePage from '../pages/UpdatePage.vue';
import GraphView from '@/pages/GraphView.vue';
import LoadingView from '../pages/LoadingView.vue';
import LoginPage from '../pages/LoginPage.vue';
const routes = [
  { path: '/', name: 'Loading', component: LoadingView },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/home',
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
  {
    path: '/update/:id', // 새로운 라우트
    name: 'Update',
    component: UpdatePage,
  },
  {
    path: '/Graph', // 수정: 경로를 /Graph로 변경
    name: 'Graph', // 수정: 라우트 이름 수정
    component: GraphView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
