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
import Shoppinglists from '@/components/Shoppinglists'
import Addnews from '@/components/Addnews'
import ShowExpences from '@/components/ShowExpences'
import ShoppingList from '@/components/ShoppingList/ShoppingList'
import Innmelding from  '@/components/Innmelding'
import TodoList from '@/components/TODO/TodoList'
import ViewShoppingList from '@/components/ShoppingList/ViewShoppingList'
import GjeldInn from '@/components/Gjeld/GjeldInn'
import GjeldUt from '@/components/Gjeld/GjeldUt'
import GjeldInnSpesifisert from '@/components/Gjeld/GjeldInnSpesifisert'
import NewUser from '@/components/NewUser'
import ChangePassword from '@/components/ChangePassword'
import Grupper from '@/components/Grupper'
import UserInfo from '@/components/UserInfo'
import ShowAccounting from '@/components/ShowAccounting.vue'
import GjeldUtSpesifisert from '@/components/Gjeld/GjeldUtSpesifisert.vue'
import MyTestPanel from '@/components/MyTestPanel.vue'
import ItemChart from '@/components/Charts/ItemChart'
import ForgottenPassword from '@/components/ForgottenPassword'

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
        path: '/ViewShoppingList/:shoppinglist_id',
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
        path: '/Grupper',
        name: 'Grupper',
        component: Grupper,
        props: true
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
      },
      {
        path: '/UserInfo',
        name: 'UserInfo',
        component: UserInfo
      },
      {
        path: '/ShowAccounting',
        name: 'ShowAccounting',
        component: ShowAccounting
      },
      {
        path: '/GjeldUtSpesifisert/:bruker_skylder_id',
        name: 'GjeldUtSpesifisert',
        component: GjeldUtSpesifisert
      },
      {
        path: '/MyTestPanel',
        name: 'MyTestPanel',
        component: MyTestPanel
      },
      {
        path: '/ItemChart',
        name: 'ItemChart',
        component: ItemChart
      },
      {
        path: '/ForgottenPassword',
        name: 'ForgottenPassword',
        component: ForgottenPassword
      },
    ]
  }
)
