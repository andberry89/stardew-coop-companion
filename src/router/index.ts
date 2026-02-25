import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'
import { getFarmByCode } from '@/lib/farms'

import Login from '@/components/AuthLogin.vue'
import AccountPage from '@/components/AccountPage.vue'
import FarmPage from '@/components/pages/FarmPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountPage,
    },
    {
      path: '/farm/:code',
      name: 'farm',
      component: FarmPage,
      props: true,
      async beforeEnter(to) {
        const { data } = await supabase.auth.getUser()
        const user = data.user ?? null

        if (!user) {
          return '/login'
        }

        return true
      },
    },
    {
      path: '/',
      name: 'root',
      component: {
        async beforeRouteEnter(_, __, next) {
          const { data } = await supabase.auth.getUser()
          const user = data.user ?? null

          if (!user) {
            next('/login')
            return
          }

          const lastFarmId = localStorage.getItem('lastFarmId')

          if (lastFarmId) {
            const { data: farm } = await supabase
              .from('farms')
              .select('*')
              .eq('id', lastFarmId)
              .single()

            if (farm) {
              next(`/farm/${farm.code}`)
              return
            }
          }

          next('/account')
        },
        render() {
          return null
        },
      },
    },
  ],
})

export default router
