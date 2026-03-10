import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

import LoginPage from '@/pages/LoginPage.vue'
import AccountPage from '@/pages/AccountPage.vue'
import FarmPage from '@/pages/FarmPage.vue'
import HelpPage from '@/pages/HelpPage.vue'

async function requireUser() {
  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

async function resolveRootRedirect() {
  const user = await requireUser()

  if (!user) {
    return '/login'
  }

  const lastFarmId = localStorage.getItem('lastFarmId')

  if (!lastFarmId) {
    return '/account'
  }

  const { data: farm } = await supabase.from('farms').select('code').eq('id', lastFarmId).single()

  if (farm?.code) {
    return `/farm/${farm.code}`
  }

  return '/account'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountPage,
      async beforeEnter() {
        const user = await requireUser()

        if (!user) {
          return '/login'
        }

        return true
      },
    },
    {
      path: '/farm/:code',
      name: 'farm',
      component: FarmPage,
      props: true,
      async beforeEnter() {
        const user = await requireUser()

        if (!user) {
          return '/login'
        }

        return true
      },
    },
    {
      path: '/help',
      name: 'help',
      component: HelpPage,
    },
    {
      path: '/',
      name: 'root',
      component: {
        render() {
          return null
        },
      },
      async beforeEnter() {
        return await resolveRootRedirect()
      },
    },
  ],
})

export default router
