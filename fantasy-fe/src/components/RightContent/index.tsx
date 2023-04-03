import { Space, Modal,Divider } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel, history } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

function info() {
  Modal.info({
    width: 600,
    title: '需要帮助?',
    content: (
      <div>
        <p>如技术相关、职场相关问题咨询或交流可与我联系(请备注来源)</p>
        <p><b>QQ:</b> 1301927919</p>
        <p><b>Email:</b> 1301927919@qq.com</p>
        <p><b>Wechat:</b> ellisoncool7</p>
      </div>
    ),
    onOk() {},
  });
}

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="请输入文章关键字"
        onSearch={value => {
          if (!value) {
            return
          }
          window.location.href = `/search/${value}`
       }}
      />
      <span
        className={styles.action}
        onClick={info}
      >
        <QuestionCircleOutlined />
      </span>
      <Avatar />
    </Space>
  );
};
export default GlobalHeaderRight;
