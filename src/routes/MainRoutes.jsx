import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
//User
import UserList from '../pages/user/view/UserList';
import UserDetail from '../pages/user/view/UserDetail';
import UserCreate from '../pages/user/entry/UserCreate';
import UserUpdate from '../pages/user/entry/UserUpdate';
//Categories
import CategoriesList from '../pages/categories/view/CategoriesList';
import CategoriesCreate from '../pages/categories/entry/CategoriesCreate';

//State
import StatesList from '../pages/state/view/StatesList';
import CategoriesUpdate from '../pages/categories/entry/CategoriesUpdate';
import CategoriesDetail from '../pages/categories/view/CategoriesDetail';


// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    //User
    {
      path: '/user/list',
      element: <UserList />
    },
    {
      path: '/user/create',
      element: <UserCreate />
    },
    {
      path: '/user/:id',
      element: <UserDetail />
    },
    {
      path: '/user/update/:id',
      element: <UserUpdate />
    },
    //Categories
    {
      path: '/categories/list',
      element: <CategoriesList />
    },
    {
      path: '/categories/create',
      element: <CategoriesCreate />
    },
    {
      path: '/categories/update/:id',
      element: <CategoriesUpdate />
    },
    {
      path: '/categories/:id',
      element: <CategoriesDetail />
    },
    //State
    {
      path: '/states/list',
      element: <StatesList />
    },
  ]
};

export default MainRoutes;
