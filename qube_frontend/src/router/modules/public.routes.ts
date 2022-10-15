/* eslint-disable import/prefer-default-export */
import { PUBLIC } from '../route_names'
import Index from '@/views/public/Index.vue'

export const PublicRoutes = [
  {
    path: '/',
    name: PUBLIC.INDEX,
    component: Index,
    meta: {
      requiresAuth: false
    }
  }
]
