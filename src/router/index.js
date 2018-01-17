import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import HelloWorld from '@/components/HelloWorld'
import Test from '@/components/Test'
import Task from '@/components/Task'
import Taskhome from '@/components/home/Taskhome'
import Login from '@/components/Login'
import Register from '@/components/Register'
import AddCostRegister from '@/components/AddCostRegister'
import Nyhetsfeed from '@/components/Nyhetsfeed'
import Newsfeedhome from '@/components/home/Newsfeedhome'
import Shoppinglistshome from '@/components/home/Shoppinglistshome'
import Shoppinglists from '@/components/Shoppinglists'
import Addnews from '@/components/Addnews'
import Paging from  '@/components/Paging'
import ShoppingList from '@/components/ShoppingList/ShoppingList'
import Innmelding from  '@/components/Innmelding'
import TestMail from  '@/components/TestMail'



Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hjem',
      component: Home
    },
    {
      path: '/home',
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
    {
      path: '/Taskhome',
      name: 'Taskhome',
      component: Taskhome
    },
    {
      path: '/Nyhetsfeed',
      name: 'Nyhetsfeed',
      component: Nyhetsfeed
    },
    {
      path: '/Newsfeedhome',
      name: 'Newfeedhome',
      component: Newsfeedhome
    },
    {
      path: '/Shoppinglistshome',
      name: 'Shoppinglistshome',
      component: Shoppinglistshome
    },
    {
      path: '/Shoppinglists',
      name: 'Shoppinglists',
      component: Shoppinglists
    },
    {
      path: '/Addnews',
      name: 'Addnews',
      component: Addnews
    },
    {
      path: '/Paging',
      name: 'Paging',
      component: Paging
    },
    {
      path: '/Innmelding',
      name: 'Innmelding',
      component: Innmelding
    },
    {
      path: '/TestMail',
      name: 'TestMail',
      component: TestMail
    }
  ]
})
