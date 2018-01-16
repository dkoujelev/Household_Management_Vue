import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import HelloWorld from '@/components/HelloWorld'
import Test from '@/components/Test'
import Task from '@/components/Task'
import Login from '@/components/Login'
import Register from '@/components/Register'
import AddCostRegister from '@/components/AddCostRegister'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hjem',
      component: Home
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Test',
      name: 'Test',
      component: Test
    },
    {
      path: '/Task',
      name: 'Task',
      component: Task
    },
    {
      path: '/AddCostRegister',
      name: 'AddCostRegister',
      component: AddCostRegister
    },
  ]
})
