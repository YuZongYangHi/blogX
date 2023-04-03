import React from 'react';
import moment from 'moment';
import {  Tag } from 'antd';
import { MessageOutlined, LikeOutlined, TagOutlined, FieldTimeOutlined, EyeOutlined, UserOutlined  } from '@ant-design/icons';
import ProList from '@ant-design/pro-list';
import {ArticleListRequest} from '@/services/article/article'

const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

const ListItemMenu = (text: string, style: object) => {
  return (
    <span key={1111} style={{marginRight: 8, ...style}}>
      {text}
    </span>
  )
}

const searchQueryRemap = {
  title: "title__icontains",
  category: "category__name",
  tags: "tags__tag__name",
  search: "content__icontains"
}

const OriginalTextRender = (item: any) => {
  let text: string;
  let color: string;

  switch (item.isOriginal) {
    case true:
      text = "原创";
      color = "#e33e33";
      break;
    case false:
      text = "转载";
      color = "#67bb55";
      break;
  }
  // @ts-ignore
  return  ListItemMenu(text, {
    "color": color,
    "background": 'rgba(227,62,51,.1)',
    "textAlign": "center",
    "width": 34,
    "height": 20,
    "borderRadius": 2,
    "fontSize": 12
  })
}

export default class ArticleList extends React.Component<any, any> {

  state = {
    queryParams: {},
    show: false
  }

  componentDidMount() {
    const urlParams = window.location.pathname.split('/')

    // 根据url找到对应的查询参数
    this.setState({
      queryParams: {
        [urlParams[1]]: urlParams[2]
      }
    })
  }

  fetch = async (params: any , sort: any, filter: any) => {
    console.log(sort, filter)

    const query = {
      pageNum: params.current,
      pageSize: params.pageSize,
    }

    // 查询参数
    const searchParams = {}

    for (const key in this.state.queryParams) {
      if (!searchQueryRemap[key]) {
        continue
      }
      searchParams[searchQueryRemap[key]] = this.state.queryParams[key]
    }

    if (Object.keys(searchParams).length !== 0) {

      // 声明查询条件
      // 用于后端搜索使用
      let searchStr = ""

      // 循环遍历字符串
      for (const key in searchParams) {
        searchStr += `${key}=${decodeURI(searchParams[key])},`
      }

      // @ts-ignore
      query.filter = searchStr.substr(0, searchStr.lastIndexOf(','))
    }

    const result = await ArticleListRequest(query)

    if (result.data.list && result.data.list.length > 0) {
      this.setState({show: true})
    }

    return {
      data: result.data.list,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: result.success,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: result.data.total,
    };
  }

  render() {
    return (
      <ProList<{ title: string }>
        itemLayout="vertical"
        rowKey="id"
        split={true}
        request={this.fetch}
        pagination={this.state.show &&  {pageSize: 10} ||false}
        onItem={(record, _)=>{
          return {
            onMouseEnter: () => {
            },
            onClick: () => {
              window.location.href = `/category/${record.category.name}/article/${record.Id}`
            },
          };
        }}
        metas={{
          title: {},
          description: {
            dataIndex: "tags",
            render: (_, item) => (
              item.tags.length > 0 && item.tags.map(i => (
                <Tag color={"blue"} key={i.id}>{i.name}</Tag>
              ))
            )
          },
          actions: {
            render: (_, item) => [
              OriginalTextRender(item),
              <IconText icon={UserOutlined} text={item.author.display.length > 0 && item.author.display || item.author.name} key="list-vertical-UserOutlined" />,
              <IconText icon={FieldTimeOutlined} text={moment(item.created).format('YYYY-MM-DD HH:mm')} key="list-vertical-FieldTimeOutlined" />,
              <IconText icon={EyeOutlined} text={item.viewNum} key="list-vertical-FolderViewOutlined" />,
              <IconText icon={LikeOutlined} text={item.likeNum} key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text={item.comments && item.comments.length || 0} key="list-vertical-message" />,
              <IconText icon={TagOutlined} text={item.category.name} key="list-vertical-TagOutlined" />,
            ],
          },
          extra: {
            render: (_, item) => (
              <img
                width={272}
                height={168}
                alt="logo"
                src={item.image}
              />
            ),
          },
          content: {
            dataIndex: "content",
            render: (_, item) => {
              const data = item.content.replace(/<\/?.+?>/g,"").replace(/ /g,"");
              return (
                <div>
                  {data.slice(0, 100)}......
                </div>
              );
            },
          },
        }}
      />
    );
  }
}
