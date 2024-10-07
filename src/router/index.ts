import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '@/views/TabsPage.vue';
import LoginPage from "@/views/LoginPage.vue";
import SignUpPage from '@/views/SignUpPage.vue';
import EpisodePage from '@/views/episode/[id].vue';
import LocationPage from '@/views/location/[id].vue';
//import CharacterPage from '@/views/character/[id].vue';
import auth from './middleware/auth';
import CharacterDetails from '@/views/CharacterDetails.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'Sign Up',
    component: SignUpPage,
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
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
        path: 'tab4',
        component: () => import('@/views/Tab4Page.vue')
      }
    ]
  },
  {
    path: '/episode/:id',
    name: 'Episode',
    component: EpisodePage
  },
  {
    path: '/character/:id',
    name: 'Character',
    component: CharacterDetails
  },
  {
    path: '/location/:id',
    name: 'Location',
    component: LocationPage
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(auth);

export default router
