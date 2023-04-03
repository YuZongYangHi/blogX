import 'braft-editor/dist/output.css'
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import React from 'react';
import BraftEditor from 'braft-editor';
import {ArticleDetailRequest, ArticleAutoViewRequest,
  ArticleLikeRequest, ArticleCommentsRequest, ArticleAddCommentsRequest} from '@/services/article/article'
import {message, Card, Avatar, Space, Typography, Divider, Tag, Comment, Form, Button, List, Input, Modal } from "antd";
import ProCard from "@ant-design/pro-card";
import { MessageOutlined, EllipsisOutlined,
  PlusOutlined, FieldTimeOutlined,
  UserOutlined, EyeOutlined,
  TagOutlined, TagsOutlined,
  LikeOutlined, CommentOutlined,
  MinusOutlined
} from '@ant-design/icons';
import {IsLogin} from '@/components/user/user'
import moment from "moment";
import {CurrentUser} from '@/components/user/user'
import {
  UserFollowerRequest, UserFollowerAddRequest,
  UserPrivateAuthorMessageGetRequest, UserPrivateAuthorMessageAddRequest
} from '@/services/author/author';

const { TextArea } = Input;
const {Meta} = Card
const { Title, Paragraph } = Typography;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length >= 1 ? '条评论' : '条评论'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
    locale={"暂无评论，赶快抢第一个沙发吧!"}
    split={true}
  />
);

let beforeDatetime = ""

const handleRenderDeadLines = (datetime: any) => {
  if (beforeDatetime.length === 0) {
    beforeDatetime = datetime
    return <Divider plain>{datetime}</Divider>
  }

  const elem = moment(datetime).diff(moment(beforeDatetime),'days') >= 1 &&  <Divider plain >{datetime}</Divider> || "";
  beforeDatetime = datetime;
  return elem

}
const MessageCommentList = ({ comments }) => {
  return  <div key={"comments"} className="space-align-container"> {comments.map(item=>(
    <>
      {
        handleRenderDeadLines(item.datetime)
      }
      {item.type === 0 ?
        (
          <div className="space-align-block" key={item.key} style={{marginBottom: 32, height: 40}}>
            <Space align="center" style={{float: "right", clear: 'both'}}>
              <span style={{
                padding: 8,
                color: "#222226",
                background: "#cad9ff",
                display: "inline-block"
              }}>{item.content}</span>
              <Avatar src={item.avatar}/>
            </Space>
          </div>
        ) :
        (
          <div className="space-align-block" style={{marginBottom: 32}} key={item.key}>
            <Space align="baseline">
              <Avatar src={item.avatar}/>
              <span style={{
                padding: 8,
                display: "inline-block",
                color: "#8b4513",
                background: "#f5f6f7",
                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 10%)"
              }}>{item.content}</span>
            </Space>
          </div>
        )
      }
    </>
  ))
  }
  </div>
}

const Editor = ({ onChange, onSubmit, submitting, value, resetValue }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} placeholder={"想说点什么嘛......"} />
    </Form.Item>
    <Form.Item>
      <Space style={{float: 'right'}}>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary" >
          发布
        </Button>
        {/* <Button onClick={resetValue}  >
          清空
        </Button>*/}
      </Space>
    </Form.Item>
  </>
);


const PrivateMessageEditor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} placeholder={"想说点什么......"} />
    </Form.Item>
    <Form.Item>
      <Space style={{float: 'right'}}>
        <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary" >
          发送
        </Button>
      </Space>
    </Form.Item>
  </>
);


const IconText = ({ icon, text }: { icon: any; text: string }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 5 } })}
    {text}
  </span>
);

const ListItemMenu = (text: string, style: object) => {
  return (
    <span key={1111} style={{marginRight: 5, ...style}}>
      {text}
    </span>
  )
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
    "fontSize": 13
  })
}

export default class Article extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.affixRef = React.createRef();
    this.state = {
      data: {},
      editorState: null,
      comments: [],
      submitting: false,
      value: '',
      articleId: "",
      isFollower: false,
      messageVisible: false,
      messageValue: "",
      messageLoading: false,
      privateMessageList: [],
      privateMessageFetchLoading: false,
      authorLoading: true,
      code: ""
    }
  }

  IconLikeText = ({ icon, text }: { icon: any; text: string }) => (
    <span style={{cursor: 'pointer'}} onClick={this.handlerLikeRequest}>
    {React.createElement(icon, { style: { marginRight: 5 } })}
      {text}
  </span>
  );

  handlerLikeRequest = async () => {
    if (!IsLogin()) {
      message.warning("继续操作前请注册或者登录.")
      return
    }

    const user = CurrentUser();
    const {data} = this.state;
    const body = {
      userId: user.userId,
      articleId: data.Id,
    }

    try {
      const result = await ArticleLikeRequest(body)
      if (result.success) {
        message.success("谢谢你的点赞哟!")

        const {data} = this.state;
        const newData = data
        newData.likeNum ++
        this.setState({data: newData})
      }
    }catch (err) {
      message.error(err.message)
    }
  }

  handleSubmit = async () => {
    if (!this.state.value) {
      return;
    }

    if (!IsLogin()) {
      message.warning("请登录后进行操作")
      return
    }

    this.setState({
      submitting: true,
    });

    const user = CurrentUser();

    const data = {
      userId: user.userId,
      comment:  this.state.value,
      articleId: parseInt(this.state.articleId),
    }

    try {
      const result = await ArticleAddCommentsRequest(data)
      if (result.success) {
        this.setState({
          submitting: false,
          value: '',
          comments: [
            {
              author: user.display && user.display || user.name,
              avatar:  user.avatar,
              content: <p>{this.state.value}</p>,
              datetime: moment().fromNow(),
            },
            ...this.state.comments
          ],
        })
      }
    }catch (err) {
      message.error(err.message)
      return
    }
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };


  handleMessageSubmit = async () => {
    const {messageValue} = this.state;

    this.setState({messageLoading: true})

    const userInfo = CurrentUser()

    if (!userInfo) {
      message.warning("用户身份已过期");
      this.setState({messageVisible: false})
      return
    }

    const {data} = this.state;

    const body = {
      type: 0,
      userId: userInfo.userId,
      articleId: data.Id,
      authorId: data.author.userId,
      content: messageValue
    }
    try {
      const result = await UserPrivateAuthorMessageAddRequest(body);
      if (result.success) {
        this.setState({
          privateMessageList: [
            ...this.state.privateMessageList,
            {
              key: moment().format('YYYY-MM-DD HH:mm'),
              author: userInfo.display || userInfo.name ,
              avatar: userInfo.avatar,
              content: messageValue,
              datetime: moment().format('YYYY-MM-DD HH:mm'),
              type: 0
            }
          ],
          messageLoading: false,
          messageValue: ""
        })
        beforeDatetime = ""
      }
    }catch (err) {
      message.error(err.message)
    }
  }
  handleMessageOnChange = e => {
    beforeDatetime = ""
    this.setState({
      messageValue: e.target.value,
    });

  }
  fetch = async (articleId: string) => {
    const result = await ArticleDetailRequest(articleId)

    if (!result.success) {
      message.error("请求文章数据失败!")
      return []
    }

    this.highlightCodeInHTML(result.data.list)

    return result.data.list;
  }

  componentDidMount = async () => {

    const uriIndex = window.location.pathname.split('/').length -1
    const articleId =  window.location.pathname.split('/')[uriIndex]

    this.setState({articleId: articleId})

    const data = await this.fetch(articleId)

    if (Object.keys(data).length === 0) {
      message.error("文章不存在!")
      window.location.href = "/"
      return
    }

    document.title = `${data.title} - FANTASY`;
    this.setState({data:data, editorState: BraftEditor.createEditorState(data.content), authorLoading: false})

    // 点一次增加一次view的查看
    const autoViewResult = await ArticleAutoViewRequest(articleId);
    if (!autoViewResult.success) {
      message.warning("记录文章浏览接口请求错误!")
    }

    // 获取评论列表
    await this.handleRequestCommentList()

    const userInfo = CurrentUser()

    if (!userInfo) {
      return
    }
    // 获取该用户是否关注作者
    await this.handleFollower()

  }

  handleRequestCommentList = async () => {
    try {
      const result = await ArticleCommentsRequest(this.state.articleId);
      if (result.success) {
        const data = result.data.list;
        if (data) {
          this.setState({
            comments: data.map((item)=>({
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
      message.error("文章评论信息获取失败")
      return
    }

  }

  handleFollower = async () => {
    try {
      const userInfo = CurrentUser()
      const authorId = this.state.data.author.userId
      const userId = userInfo.userId
      const result = await UserFollowerRequest(userId, authorId);
      if (result.success) {
        this.setState({
          isFollower: true
        })
      }
    }catch (err) {
      this.setState({
        isFollower: false
      })
    }
  }
  handlerAuthorFollow = async () => {
    if (!IsLogin()) {
      message.warning("继续操作前请注册或者登录.")
      return
    }

    this.setState({authorLoading: true})

    const data = {
      type: this.state.isFollower === true ? 0 : 1,
      authorId: this.state.data.author.userId,
      userId: CurrentUser().userId
    }

    try {
      const result = await UserFollowerAddRequest(data)
      if (result.success) {
        message.success("操作成功")
        this.setState({
          isFollower: !this.state.isFollower,
          authorLoading: false
        })
      }

    }catch (err) {
      message.error(err.message)
      return
    }
  }

  handlerAuthorSendMessage = async () => {
    if (!IsLogin()) {
      message.warning("继续操作前请注册或者登录.")
      return
    }

    if ( this.state.isFollower !== true) {
      message.warning("请先关注作者后方可进行私聊")
      return
    }

    this.setState({privateMessageFetchLoading: true})

    const userInfo = CurrentUser();
    const {data} = this.state;

    try {
      const params = {
        userId: userInfo.userId,
        authorId: data.author.userId,
        articleId: data.Id
      }

      const result = await UserPrivateAuthorMessageGetRequest(params);

      if (result.success) {
        this.setState({
          privateMessageList: result.data.list && result.data.list.map((item: any)=>({
            key: item.id,
            author: item.author,
            avatar:  item.avatar,
            content: item.content,
            datetime: moment(item.created).format('YYYY-MM-DD HH:mm'),
            type: item.type
          })) || [],
          privateMessageFetchLoading: false
        })
      }
      this.setState({messageVisible: true})
    }catch (err) {
      message.error(err.message)
      return
    }
  }
  handleCloseMessageVisible = () => {
    this.setState({messageVisible: false})
    beforeDatetime = ""
  }

  highlightCodeInHTML = (data: object) => {

    if (this.state.data) {
      const container = document.createElement("div");
      container.innerHTML = data.content.replace(/<br\s*\/?>/g,'\n');
      container.code = data.content.replace(/^(?:\r?\n|\r)/,'');
      Prism.highlightAllUnder(container);
      this.setState({
        code: container.innerHTML
      })
      return container.innerHTML;
    }

    return ""
  }

  render() {
    const {data, editorState, comments, submitting,
      value, isFollower, messageLoading,
      messageValue, privateMessageList, authorLoading } = this.state;
    const user = CurrentUser()
    beforeDatetime = ""

    return (
      <ProCard  ghost gutter={16} style={{ overflow: 'hidden'}}  >
        <Card
          loading={authorLoading}
          hoverable
          style={{ width: 300, height: 250, marginRight: 8 }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <MessageOutlined key="setting" onClick={this.handlerAuthorSendMessage} />,
            isFollower && <MinusOutlined key="edit" onClick={this.handlerAuthorFollow} /> || <PlusOutlined key="edit" onClick={this.handlerAuthorFollow} />,
            <EllipsisOutlined key="ellipsis" disabled />,
          ]}
        >
          <Meta
            avatar={<Avatar src={data.author && data.author.avatar} />}
            title={data.author && data.author.display}
            description={data.author && data.author.description}
          />
        </Card>

        <ProCard  >
          <Typography>
            <Title level={3}> {data.title}</Title>
            <div style={{color: "#999AAA"}}>
              <Space size={"middle"}>
                {OriginalTextRender(data)}
                <IconText icon={UserOutlined} text={data.author && data.author.display} key={"author"} />
                <IconText icon={FieldTimeOutlined} text={data.created && moment(data.created).format('YYYY-MM-DD HH:mm')}  key={"time"}/>
                <IconText icon={EyeOutlined} text={data.viewNum}/>
                <IconText icon={TagOutlined} text={data.category && <span style={{cursor: 'pointer'}} onClick={() => {window.location.href = `/category/${data.category.name}`}}>{data.category.name}</span>}/>
                <IconText icon={TagsOutlined} text={data.tags && data.tags.map(item => (
                  <Tag style={{cursor: 'pointer'}} onClick={()=> {window.location.href = `/tags/${item.name}`}} key={item.name} color={"blue"}>{item.name}</Tag>
                ))} />
              </Space>
            </div>
            <Divider/>
            <Paragraph>
              <>
                <div className="braft-output-content" dangerouslySetInnerHTML={{__html: this.state.code}}/>
              </>
            </Paragraph>
            <div style={{color: "#999AAA", float: 'right', marginBottom: 8}}>
              <Space size={"middle"}>
                <this.IconLikeText icon={LikeOutlined} text={data.likeNum} key={"like"} />
                <IconText icon={CommentOutlined} text={comments.length || 0}  key={"comments"}/>
              </Space>
            </div>
            <Divider/>
          </Typography>

          <Comment
            avatar={<Avatar src={user && user.avatar} alt={"avatar"} />}
            content={
              <Editor
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                submitting={submitting}
                value={value}
                resetValue={()=>{this.setState({value: ""})}}
              />
            }
          />

          {comments.length > 0 && <CommentList comments={comments} />}

          <Modal
              title={`与作者${data.author && data.author.display}的对话消息`}
              visible={this.state.messageVisible}
              onCancel={this.handleCloseMessageVisible}
              width={1000}
              footer={[
              ]}
          >
            <div>
            <MessageCommentList key={"MessageCommentList"} comments={privateMessageList} />

              <Comment
              content={
                <PrivateMessageEditor
                  onChange={this.handleMessageOnChange}
                  onSubmit={this.handleMessageSubmit}
                  submitting={messageLoading}
                  value={messageValue}
                />
              }
              />
            </div>
          </Modal>
        </ProCard>
      </ProCard>
    );
  }
}
