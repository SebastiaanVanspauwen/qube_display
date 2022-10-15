import { createRouter, createWebHistory } from 'vue-router'
import { PublicRoutes } from './modules/public.routes'

interface RouteMeta {
  meta: {
    requiresAuth: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...PublicRoutes
  ],
  scrollBehavior () {
    return { top: 0 }
  }
})

const isPublicRoute = (to: RouteMeta): boolean => !to.meta.requiresAuth

router.beforeEach(async (to, from, next) => {
  if (isPublicRoute(to as unknown as RouteMeta)) {
    next()
  } else {
    next()
  }
})

export default router
