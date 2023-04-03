import React from 'react';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import {ArticleOverviewRequest} from '@/services/dashboard/index'
import {message} from "antd";

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};
export default class ArticleDashboard extends React.Component<any, any> {

  state = {
    data: {}
  }

  componentDidMount = async () =>  {
    try {
      const result = await ArticleOverviewRequest()
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
              title: '文章总数',
              value: data.articleNum,
              icon: (
                <img
                  style={imgStyle}
                  src="/admin/icons/article_dashboard.svg"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '原创总数',
              value: data.originNum,
              icon: (
                <img
                  style={imgStyle}
                  src="/admin/icons/origin_dashboard.svg"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '文章分类',
              value: data.categoryNum,
              icon: (
                <img
                  style={imgStyle}
                  src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                  alt="icon"
                />
              ),
            }}
          />
          <StatisticCard
            statistic={{
              title: '文章标签',
              value: data.tagNum,
              icon: (
                <img
                  style={imgStyle}
                  src="/admin/icons/tag_dashboard.svg"
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
