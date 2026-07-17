import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

const CategoriesRoute = {
  id: 'categories-group',
  title: 'Categories',
  type: 'group',
  children: [
    {
      id: 'categories-list',
      title: 'Categories List',
      type: 'item',
      url: '/categories/list',
      icon: icons.LoginOutlined,
      target: false
    },
    {
      id: 'categories-create',
      title: 'Create Categories',
      type: 'item',
      url: '/categories/create',
      icon: icons.ProfileOutlined,
      target: false
    }
  ]
};

export default CategoriesRoute;