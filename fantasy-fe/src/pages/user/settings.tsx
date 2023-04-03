import React from 'react';
import ProCard from '@ant-design/pro-card';
import Basic from './basic';
import Security from './security'

export default class Settings extends React.Component<any, any> {
  state = {
    key: "basic"
  }

  handleOnTabChange = (key) => {
    this.setState({key: key})
  }

  componentDidMount = async () => {
    document.title = "个人设置 - FANTASY"
  }

  render() {
    const {key} = this.state;
    return (
      <ProCard
        tabs={{
          tabBarStyle: {
            width: 220
          },
          tabPosition: "left",
          activeKey: key,
          onChange: (key) => {
            this.handleOnTabChange(key)
          },
        }}
      >
        <ProCard.TabPane key="basic" tab="基本设置" >
          <h2>基本设置</h2>
          <Basic/>
        </ProCard.TabPane>
        <ProCard.TabPane key="security" tab="安全设置">
          <h2>安全设置</h2>
          <Security/>
        </ProCard.TabPane>
      </ProCard>
    );
  }
}


