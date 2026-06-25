// project import
import dashboard from './dashboard';
import UserRoute from '../pages/user/UserRoute';
import CategoriesRoute from '../pages/categories/CategoriesRoute';
import StatesRoute from '../pages/state/StatesRoute';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, UserRoute, CategoriesRoute, StatesRoute]
};

export default menuItems;
