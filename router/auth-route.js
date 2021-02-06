/**
 * Routes for authentication
 */
 
const authRouter = [  
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/login.vue')
  },
]

export default authRouter