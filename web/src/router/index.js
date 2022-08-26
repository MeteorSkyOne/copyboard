import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'CopyBoard',
        component: () => import(/* webpackChunkName: "CopyBoard" */ '@/views/CopyBoardView.vue')
    }, {
        path: '/add',
        name: 'Add',
        component: () => import(/* webpackChunkName: "Add" */ '@/views/AddView.vue')
    }
    , {
        path: '/manage',
        name: 'Manage',
        component: () => import(/* webpackChunkName: "Manage" */ '@/views/ManageView.vue')
    }
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
