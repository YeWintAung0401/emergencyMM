import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import UserList from '../pages/user/view/UserList';
import UserDetail from '../pages/user/view/UserDetail';
import UserCreate from '../pages/user/entry/UserCreate';
import UserUpdate from '../pages/user/entry/UserUpdate';

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
    }
  ]
};

export default MainRoutes;
