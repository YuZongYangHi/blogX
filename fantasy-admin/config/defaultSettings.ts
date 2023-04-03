import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#ff8000', // #3949AB #1890ff
  layout: 'side',
  logo: '/admin/logo.png',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  title: 'FANTASY',
  pwa: false,
  iconfontUrl: '//at.alicdn.com/t/font_2451557_1sxc518pk8x.js',
  menu: {
    locale: false,
  },
  headerHeight: 48,
  splitMenus: false,
};

export default Settings;
