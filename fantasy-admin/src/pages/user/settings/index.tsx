import { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import BasicComponent from './basic'
import Security from './security'
import Notice from './notice'

export default () => {
  const [tab, setTab] = useState('basic');

  return (
    <div>
      <ProCard

        tabs={{
          tabBarStyle: {
            width: 220
          },
          tabPosition: "left",
          activeKey: tab,
          onChange: (key) => {
            setTab(key);
          },
        }}
      >
          <ProCard.TabPane key="basic" tab="基本设置" >
              <h2>基本设置</h2>
              <BasicComponent/>
          </ProCard.TabPane>
          <ProCard.TabPane key="security" tab="安全设置">
            <h2>安全设置</h2>
            <Security/>
          </ProCard.TabPane>
        <ProCard.TabPane key="notice" tab="消息通知">
          <h2>消息通知</h2>
          <Notice/>
        </ProCard.TabPane>
      </ProCard>
    </div>
  );
};
