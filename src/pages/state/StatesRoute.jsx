import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

const StatesRoute = {
  id: 'states-group',
  title: 'States',
  type: 'group',
  children: [
    {
      id: 'states-list',
      title: 'States List',
      type: 'item',
      url: '/states/list',
      icon: icons.LoginOutlined,
      target: false
    }
  ]
};

export default StatesRoute;