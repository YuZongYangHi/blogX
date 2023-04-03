import "./index.css"
import React from 'react';
import ArticleTopCarousel from '@/pages/top'
import ProCard from '@ant-design/pro-card';
import ArticleList from '@/pages/article/list'
import Article from '@/pages/article/article'
import {Comment, List, message, Space, Tag} from 'antd';
import ProList from '@ant-design/pro-list';
import {EyeOutlined} from "@ant-design/icons";
import {
  ArticlePopularListRequest,
  TagPoolListRequest,
  ArticleNewestRequest,
  ArticleNewestCommentsRequest,
} from '@/services/article/article'
import moment from "moment";
import Settings from '@/pages/user/settings'

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

const tagPoolColors = [
  "magenta", "red", "volcano",
  "orange", "gold", "lime",
  "green", "cyan", "blue",
  "geekblue", "purple"
]

const getRandomColor = (): string => {
  return tagPoolColors[Math.floor(Math.random()*tagPoolColors.length)]
}

const CommentList = ({ comments }) => (
  <List
    split={true}
    dataSource={comments}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} s />}
  />
);

export default class BackgroundComponent extends React.Component<any, any> {

  state = {
    Component: <></>,
    popularList: [],
    popularLoading: true,
    tagList: [],
    tagLoading: true,
    newestList: [],
    newestLoading: true,
    commentList: [],
    commentLoading: true,
  }

  componentDidMount = async ()  => {
    const url = window.location.pathname;

    const articleRouter = url.split('/').length === 5 ? url :  "/article/"

    const componentRouters = {
      [articleRouter]: <Article/>,
      "/category/": <ArticleList/>,
      "/tags/": <ArticleList/>,
      "/search/": <ArticleList/>,
      "/users/settings": <Settings/>
    }
    for (const uri in componentRouters) {

      if (url.startsWith(uri)) {
        this.setState({
         Component: componentRouters[uri]
       })
        break
      }
    }

    await this.handlerPopularFetch()
    await this.handlerTagFetch()
    await this.handlerNewestFetch()
    await this.handlerCommentFetch()
  }

  handlerCommentFetch = async () => {
    try {
      const result = await ArticleNewestCommentsRequest()
      if (result.success) {
        const data = result.data.list;
        if (data) {
          this.setState({
            commentLoading: false,
            commentList: data.map((item)=>({
              key: moment(item.Created).format('YYYY-MM-DD HH:mm'),
              author: item.display && item.display || item.username,
              avatar:  item.avatar,
              content: <p>{item.comment}</p>,
              datetime: moment(item.Created).format('YYYY-MM-DD HH:mm'),
            }))
          })

        }
      }
    }catch (err) {
      message.error(err.message)
    }
  }

  handlerNewestFetch = async () => {
    const newestResult = await ArticleNewestRequest();

    if (!newestResult.success) {
      message.error("获取最新文章失败!")
      return
    }

    const list = newestResult.data.list.map((item)=> ({
      name: item.title.slice(0, 40),
      image: item.author.avatar,
      desc: moment(item.created).format('YYYY-MM-DD HH:mm'),
      view: item.viewNum,
      id: item.Id,
      category: item.category.name,
      icon: "https://ay-blog-oss.oss-accelerate.aliyuncs.com/_system_clock.svg"
    }))

    this.setState({
      newestList: list,
      newestLoading: false
    })
  }

  handlerPopularFetch = async () => {
    const popularResult = await ArticlePopularListRequest();

    if (!popularResult.success) {
      message.error("获取热门文章失败!")
      return
    }

    const pl = popularResult.data.list.map((item) => ({
      name: item.title.slice(0, 40),
      image: item.author.avatar,
      desc: `${item.content.replace(/<\/?.+?>/g,"").replace(/ /g,"").slice(0, 60)}....`,
      view: item.viewNum,
      id: item.Id,
      category: item.category.name
    }))

    this.setState({
      popularList: pl,
      popularLoading: false
    })
  }

  handlerTagFetch = async () => {
    const result = await TagPoolListRequest();
    if (!result.success) {
      message.error("获取标签池错误!")
      return
    }

    const list = <Space size={[4, 8]} wrap>
      {
        result.data.list.map(item => (
          <Tag color={getRandomColor()} style={{cursor: 'pointer'}} onClick={()=>{window.location.href = `/tags/${item.name}`}}  key={item.name}>{item.name}</Tag>
        ))
      }
    </Space>

    this.setState({
      tagList: list,
      tagLoading: false
    })
  }

  render() {
    const {Component, popularList, popularLoading,
      tagList, tagLoading, newestList, newestLoading,
      commentLoading, commentList
    } = this.state;
    return (
      <>
        <ArticleTopCarousel/>
        <ProCard  ghost split="vertical" gutter={16} style={{marginTop: 16}}>
          <ProCard ghost  >
            {Component}
          </ProCard>
          <ProCard  colSpan="30%" ghost  direction="column" gutter={[0,16]}  >
            <ProCard loading={popularLoading}  title={"热门文章"} bodyStyle={{ padding: 0, overflow: 'hidden'}} >
              <ProList<any>
              rowClassName="pro-list-custom-style"
              loading={popularLoading}
              split={true}
              onRow={(record: any) => {
                return {
                  onMouseEnter: () => {
                  },
                  onClick: () => {
                    window.location.href = `/category/${record.category}/article/${record.id}`
                  },
                };
              }}
              rowKey="name"
              dataSource={popularList}
              metas={{
                title: {
                  dataIndex: 'name',
                },

                description: {
                  dataIndex: 'desc',

                },
                subTitle: {
                  render: (_, item) => {
                    return (
                      <Space size={0}>
                        <IconText icon={EyeOutlined} text={item.view} key="list-vertical-FolderViewOutlined" />
                      </Space>
                    );
                  },
                },
              }}
            /></ProCard>
            <ProCard loading={commentLoading}  title={"最新评论"} bodyStyle={{ padding: 0, overflow: 'hidden', marginLeft: 24}}>

              {commentList.length > 0 && <CommentList comments={commentList} />}
            </ProCard>
            <ProCard loading={tagLoading}      title={"标签"} > {tagList}</ProCard>
            <ProCard loading={newestLoading}  title={"最新文章"} bodyStyle={{ padding: 0, overflow: 'hidden'}} > <ProList<any>
              rowClassName="pro-list-custom-style"
              loading={popularLoading}
              split={true}
              onRow={(record: any) => {
                return {
                  onMouseEnter: () => {
                  },
                  onClick: () => {
                    window.location.href = `/category/${record.category}/article/${record.id}`
                  },
                };
              }}
              rowKey="name"
              dataSource={newestList}
              metas={{
                title: {
                  dataIndex: 'name',
                },
                avatar: {
                  dataIndex: "icon"
                },
                description: {
                  dataIndex: 'desc'
                }
              }}
            /></ProCard>
          </ProCard>
        </ProCard>
      </>
    );
  }
}
