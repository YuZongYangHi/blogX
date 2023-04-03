import cookie from 'react-cookies';
import {UserLogoutRequest} from '@/services/users/user';

// 获取当前用户
export const CurrentUser = () => {
  return cookie.load("fantasyUser");
}

// 判断是否登录
// 前端判断cookie是否登录或是否过期
export const IsLogin = (): boolean => {
  const user = CurrentUser();
  return typeof (user) === 'object';
}

// 退出登录
// 请求后端删除session
// 前端删除cookie
export const Logout = async () => {
  // await fetch
  await UserLogoutRequest();
  LogoutByFe()
}

// 请求后端删除session
export const LogoutByFe = () => {
  cookie.remove("fantasyUser", { path: '/' });
}

// 登录信息存储消息
export const SaveUserInfo = (user: any): boolean => {
  cookie.save("fantasyUser", user, { path: '/' });
  return true;
}
