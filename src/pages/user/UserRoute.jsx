import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

const UserRoute = {
  id: 'user-group',
  title: 'Users',
  type: 'group',
  children: [
    {
      id: 'user-list',
      title: 'User List',
      type: 'item',
      url: '/user/list',
      icon: icons.LoginOutlined,
      target: false
    }
  ]
};

export default UserRoute;