import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/OutSite.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      { path: '/change-password', component: () => import('pages/ChangePassword.vue') },
      { path: '/request-pin-code', component: () => import('pages/RequestPinCode.vue') },
      { path: '/signup', component: () => import('pages/SignUp.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('src/layouts/InSite.vue'),
    children: [
      { path: '/assignments', component: () => import('src/pages/Assignments.vue') },
      { path: '/week-template', component: () => import('src/pages/WeekTemplate.vue') },
      { path: '/volunteers', component: () => import('src/pages/Volunteers.vue') },
      { path: '/congregations', component: () => import('src/pages/Congregations.vue') },
      { path: '/roles', component: () => import('src/pages/Roles.vue') },
      { path: '/locations', component: () => import('src/pages/Locations.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Login.vue')
  },
];

export default routes;
