import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
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
import ShoppingList from '@/components/ShoppingList/ShoppingList'
import Innmelding from  '@/components/Innmelding'
import TestMail from  '@/components/TestMail'
import TodoList from '@/components/TODO/TodoList'
import ViewShoppingList from '@/components/ShoppingList/ViewShoppingList'
import GjeldInn from '@/components/Gjeld/GjeldInn'
import GjeldUt from '@/components/Gjeld/GjeldUt'
import GjeldInnSpesifisert from '@/components/Gjeld/GjeldInnSpesifisert'
import NewUser from '@/components/NewUser'
import ChangePassword from '@/components/ChangePassword'

Vue.use(Router);

export default new Router({
    routes: [
      {
        path: '/',
        name: 'Root',
        component: Login
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
      },
      {
        path: '/GjeldInn',
        name: 'GjeldInn',
        component: GjeldInn
      },
      {
        path: '/GjeldUt',
        name: 'GjeldUt',
        component: GjeldUt
      },
      {
        path: '/GjeldInnSpesifisert/:bruker_skylder_id',
        name: 'GjeldInnSpesifisert',
        component: GjeldInnSpesifisert
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
      },
      {
        path: '/NewUser',
        name: 'NewUser',
        component: NewUser
      },
      {
        path: '/ChangePassword',
        name: 'ChangePassword',
        component: ChangePassword
      }
    ]
  }
)
