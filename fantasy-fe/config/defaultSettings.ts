import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "light",
  "primaryColor": "#13C2C2",
  "layout": "top",
  "title": "FANTASY",
  "contentWidth": "Fluid",
  "fixedHeader": true,
  "fixSiderbar": true,
  "iconfontUrl": '//at.alicdn.com/t/font_2451557_1sxc518pk8x.js',
  "pwa": false,
  "menu": {
    locale: false,
  },
  "logo": "/logo.png",
  "headerHeight": 48,
  "splitMenus": false
}

export default Settings;
