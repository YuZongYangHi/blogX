import React, {useCallback, useEffect} from 'react';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Menu } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import type { MenuInfo } from 'rc-menu/lib/interface';
import {CurrentUser} from '@/components/user/user'

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {


  const {initialState, setInitialState } = useModel('@@initialState');
  const userInfo = CurrentUser();
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        history.push('/user/login');
        return;
      }
      history.push(`/users/${key}`);
    },
    [setInitialState],
  );


  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return <a onClick={()=>{history.push('/user/login')}} className={`${styles.action} ${styles.account}`}>登录｜注册</a>
  }

  return (
    userInfo &&
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown> || <a onClick={()=>{history.push('/user/login')}} className={`${styles.action} ${styles.account}`}>登录｜注册</a>
  );
};

export default AvatarDropdown;
