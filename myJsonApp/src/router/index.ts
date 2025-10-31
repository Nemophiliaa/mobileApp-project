import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/login'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/login'
      },
      {
        path: 'login',
        component: () => import('@/views/login.vue')
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue')
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      },
      {
        path: 'create',
        component: () => import('@/views/createPostPage.vue')
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/editPostPage.vue')
      },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 🔒 Tambahkan guard **sebelum export**
router.beforeEach((to, from, next) => {
  const publicPages = ['/tabs/login', '/tabs/register']; // halaman bebas
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    alert('Silakan login terlebih dahulu!');
    return next('/tabs/login');
  }

  next();
});

export default router;
