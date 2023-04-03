import React from 'react';
import { List, Skeleton, message, Switch } from 'antd';

// @ts-ignore
import {UserNoticeSettingInfoRequest, UserNoticeSettingPutRequest} from '@/services/users/user'

export default class Notice extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };

  fetch = async () => {
    const result = await UserNoticeSettingInfoRequest();

    if (!result.success) {
      message.error("获取用户安全信息失败!")
      return
    }

    const data = result.data.list;

    const list = [
      {
        key: "article",
        title: "文章点赞",
        description: "你的文章被用户点赞后, 会进行邮箱方式通知",
        checked: data.isLikeNotice
      },
      {
        key: "comment",
        title: "文章评论",
        description: "文章被评论后, 会进行邮箱方式通知",
        checked: data.isCommentNotice
      }, {
        key: 'follow',
        title: '关注通知',
        description: "你被关注后，会进行邮箱方式通知",
        checked: data.IsFollowNotice

      }, {
        key: "private",
        title: "私信通知",
        description: "当用户私信您时，会进行邮箱方式通知",
        checked: data.isPrivateChatNotice
      }
    ]

    this.setState({
      data,
      list,
      initLoading: false
    })

  }
  componentDidMount = async () => {
    await this.fetch()
  }

  handlerChange = async (key: string) => {
    const {data} = this.state;

    const body = {
      isLikeNotice: data.isLikeNotice,
      isCommentNotice: data.isCommentNotice,
      IsFollowNotice: data.IsFollowNotice,
      isPrivateChatNotice: data.isPrivateChatNotice,
      userId: data.userId
    }

    switch (key) {
      case "article":
        body.isLikeNotice = !body.isLikeNotice;
        break;
      case "comment":
        body.isCommentNotice = !body.isCommentNotice;
        break;
      case "follow":
        body.IsFollowNotice = !body.IsFollowNotice;
        break;
      case "private":
        body.isPrivateChatNotice = !body.isPrivateChatNotice;
        break;
    }

    const result = await UserNoticeSettingPutRequest(body);

    if (result.success) {
      this.setState({data: body}, ()=> {
        message.success("更新成功")
      })
    }

  }

  render() {
    const { initLoading, list } = this.state;
    return (
      <div>
        <br/>
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={item => (
            <List.Item
              actions={[<a key="list-loadmore-edit" disabled={item.key === "id"} onClick={()=>{this.handlerChange(item.key)}} >   <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={item.checked} /></a>]}
            >
              <Skeleton avatar title={false} loading={false} active>
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </Skeleton>
            </List.Item>
          )}
        />


      </div>
    );
  }
}
