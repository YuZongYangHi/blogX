import React from 'react';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import {UserOverviewRequest} from '@/services/dashboard/index'
import {message} from "antd";

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};
export default class UserDashboard extends React.Component<any, any> {

  state = {
    data: {}
  }

  componentDidMount = async () =>  {
    try {
      const result = await UserOverviewRequest()
      if (result.success) {
        this.setState({data: result.data.list})
      }
    }catch (err) {
      message.error(err.message)
    }
  }

  render() {
    const {data} = this.state;
    return (
      <div style={{marginBottom: 24}}>
      <RcResizeObserver
        key="resize-observer"

      >
        <StatisticCard.Group direction={'row'}>
          <StatisticCard
            statistic={{
              title: '用户数',
              value: data.userNum,
              icon: (
                <img
                  style={imgStyle}
                  src="/admin/icons/user_dashboard.svg"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '点赞数',
              value: data.likeNum,
              icon: (
                <img
                  style={imgStyle}
                  src="/admin/icons/like_dashboard.svg"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '评论数',
              value: data.commentNum,
              icon: (
                <img
                  style={imgStyle}
                  src="/admin/icons/comment_dashboard.svg"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '私聊数',
              value: data.privateMessageNum,
              icon: (
                <img
                  style={imgStyle}
                  src="/admin/icons/chat_dashboard.svg"
                  alt="icon"
                />
              ),
            }}
          />
        </StatisticCard.Group>
      </RcResizeObserver>
      </div>
    )
  }
}
