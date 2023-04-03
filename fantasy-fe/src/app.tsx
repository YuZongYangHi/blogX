import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import defaultSettings from '../config/defaultSettings';
import {HeaderTopRoutersRequest} from '@/services/category/router'
import BackgroundComponent from '@/pages/background/'
import UserLogin from '@/pages/user/login';
import { Link, history } from 'umi';
import {UserInfoRequest} from '@/services/users/user'
import {LogoutByFe, SaveUserInfo} from "@/components/user/user";

let authorRouters = [];

function parseRoutes(authorRouters: []) {

  if (authorRouters) {
    return authorRouters.map((item) => ({
      path: `/category/${item.path}`,
      name: item.name,
      component: BackgroundComponent,
      routes: []
    }));
  }
  return [];
}

export function patchRoutes({ routes }) {
  parseRoutes(authorRouters).forEach((item) => {
    routes[0].routes.push(item);
  });

  for (const i in routes[0].routes) {
    try {
      routes[0].routes[i].routes.push({
        key: routes[0].routes[i].name,
        path: `/category/${routes[0].routes[i].name}/article/:articleId`,
        hideInMenu: true,
        component: BackgroundComponent,
      })
    }catch (err) {
    }
  }

  routes[0].routes.push({
    path: "/tags/:tagName",
    name: "/tags/:tagName",
    hideInMenu: true,
    component: BackgroundComponent,
  })

  routes[0].routes.push({
    path: "/search/:content",
    name: "/search/:content",
    hideInMenu: true,
    component: BackgroundComponent,
  })

  routes[0].routes.push({
    path: "/user/login",
    name: "/user/login",
    hideInMenu: true,
    component: UserLogin,
    layout: false
  })

  routes[0].routes.push({
    path: "/users/settings",
    name: "/users/settings",
    hideInMenu: true,
    component: BackgroundComponent,
  })

  const defaultPath = routes[0].routes[0].path

  routes[0].routes.push({
    path: "/",
    hideInMenu: true,
    redirect: defaultPath,
    exact: true
  })
}


export const render = async (oldRoutes: any) => {
  const result = await HeaderTopRoutersRequest();

  if (result.success) {
    const data = result.data.list;
    for (const item of data) {
      authorRouters.push({
        path: item.name,
        name: item.name,
      });
    }
    oldRoutes();
  }
}

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {

  const fetchUserInfo = async () => {
    try {
      const msg = await UserInfoRequest();
      const data = msg.data.list;
      SaveUserInfo(data)
      return data;
    } catch (error) {
      LogoutByFe()
    }
    return undefined;
  };

  if (history.location.pathname !== "/users/login") {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
    return {
      fetchUserInfo,
      settings: defaultSettings,
    };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {

  const handlerCurrentDom = (newPath?: string) => {
    const currentPath = window.location.pathname;

    // 如果连续点击一个content-path多次
    if (currentPath == newPath) {
      window.location.href = newPath;
    }

    // 如果是文章详情想点击自己的父路由
    const patentCategory = newPath?.split('/')[2];
    const childrenCategory = currentPath.split('/')[2];

    if (patentCategory == childrenCategory) {
      window.location.href = newPath;
    }
  }
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: "FANTASY",
    },
    onMenuHeaderClick: (e: React.MouseEvent<HTMLDivElement>) =>  {
      window.location.href = "/"
    },
    menuItemRender: (item, dom) => {
      return <Link onClick={ () => handlerCurrentDom(item.path)} to={item.path}>{dom}</Link>
    },
    footerRender: () => <Footer />,
    links:  [],
    menuHeaderRender: undefined,
    title: "FANTASY",
    ...initialState?.settings,
  };
};
