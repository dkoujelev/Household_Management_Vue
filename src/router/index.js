import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import HelloWorld from '@/components/HelloWorld'
import Test from '@/components/Test'
import Task from '@/components/Task'
import Login from '@/components/Login'
import Register from '@/components/Register'
import SeeAccounting from '@/components/SeeAccounting'
import AddExpence from '@/components/AddExpence'
import AddCostRegister from '@/components/AddCostRegister'
import Nyhetsfeed from '@/components/Nyhetsfeed'
import Newsfeedhome from '@/components/home/Newsfeedhome'
import Shoppinglistshome from '@/components/home/Shoppinglistshome'
import Shoppinglists from '@/components/Shoppinglists'
import Addnews from '@/components/Addnews'
import ShowExpences from '@/components/ShowExpences'
import Utgifter from '@/components/Utgifter'
import ShoppingList from '@/components/ShoppingList/ShoppingList'
import TodoList from '@/components/TODO/TodoList'
import ViewShoppingList from '@/components/ShoppingList/ViewShoppingList'

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
        path: '/SeeAccounting',
        name: 'SeeAccounting',
        component: SeeAccounting
      },
      {
        path: '/AddCostRegister',
        name: 'AddCostRegister',
        component: AddCostRegister
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
        path: '/AddExpence',
        name: 'AddExpence',
        component: AddExpence
      },
      {
        path: '/ShowExpences',
        name: 'ShowExpences',
        component: ShowExpences
      },
      {
        path: '/Utgifter',
        name: 'Utgifter',
        component: Utgifter
      },
      {
        path: '/ShoppingList',
        name: 'ShoppingList',
        component: ShoppingList
      },
      {
        path: '/TodoList',
        name: 'TodoList',
        component: TodoList
      },
      {
        path: '/ViewShoppingList',
        name: 'ViewShoppingList',
        component: ViewShoppingList
      }
    ]
  }
)
