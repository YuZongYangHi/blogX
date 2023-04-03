import React from 'react';
import {DialogueListRequest, DialogueDetailRequest, DialogueAddMessageRequest} from '@/services/comment/comment'
import {queryCurrentUser} from '@/services/users/user'
import {message, Avatar, List, Space, Divider, Input, Form, Button, Comment} from "antd";
import ProCard from '@ant-design/pro-card';
import moment from 'moment'

const { TextArea } = Input;

let beforeDatetime = ""

const handleRenderDeadLines = (datetime: any) => {

  if (beforeDatetime === undefined) {
    return "";
  }

  if (beforeDatetime.length === 0) {
    beforeDatetime = datetime
    return <Divider plain>{moment(datetime).format('YYYY-MM-DD HH:mm')}</Divider>
  }

  const elem = moment(datetime).diff(moment(beforeDatetime),'days') >= 1 &&  <Divider plain >{moment(datetime).format('YYYY-MM-DD HH:mm')}</Divider> || "";
  beforeDatetime = datetime
  return elem
}

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

const MessageCommentList = ({ comments}) => {
  return  <div key={"comments"} className="space-align-container"> {comments.map(item=>(
    <>
      {
        handleRenderDeadLines(item.created)
      }
      {item.type === 1 ?
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

export default class DialogueComponent extends React.Component<any, any> {

  state = {
    dialogueList: [],
    activeKey: 0,
    articleId: 0,
    userId: "",
    authorId: "",
    dialogueListLoading: true,
    dialogueDetailLoading: true,
    dialogueDetailList: [],
    messageLoading: false,
    messageValue: "",
    beforeDatetime: "",
    userInfo: {},
    dstArticleId: 0,
    dstUserId: ""
  }

  handleDialogueListFetch = async () => {
    try {
      const result = await DialogueListRequest();
      if (result.success) {
        this.setState({
          dialogueList: result.data.list,
        })

        if ( result.data.list.length > 0) {
          this.setState({
            activeKey: result.data.list[0].id,
            userId: result.data.list[0].userId,
            authorId: result.data.list[0].authorId,
            articleId: result.data.list[0].articleId,
            dstArticleId: result.data.list[0].articleId,
            dstUserId: result.data.list[0].userId
          })
        }
      }
    } catch (err) {
      message.error(err.message)
    }
  }

  handleDialogueDetailFetch = async () => {
    const params = {
      articleId: this.state.articleId,
      userId: this.state.userId,
      authorId: this.state.authorId
    }

    try {
      const result = await DialogueDetailRequest(params)
      if (result.success) {
        this.setState({
          dialogueDetailList: result.data.list,
          dialogueListLoading: false,
          dialogueDetailLoading: false
        })
      }
    }catch (err) {
      message.error("获取对话框消息详细失败")
      console.log(err)
    }
  }

  userInfo = async () => {
    const result = await queryCurrentUser();
    this.setState({
      userInfo: result
    })
  }

  componentDidMount = async () => {
    await this.userInfo()
    await this.handleDialogueListFetch()

    if (this.state.activeKey > 0) {
      await this.handleDialogueDetailFetch()
    }
  }

  handleChange = async (item: any) => {
    this.setState({
      activeKey: item.id,
      articleId: item.articleId,
      userId: item.userId,
      authorId: item.authorId,
      dialogueDetailLoading: true,
      dialogueListLoading: true,
      dstArticleId: item.articleId,
      dstUserId: item.userId

    }, async ()  => {
      beforeDatetime = ""
      await this.handleDialogueDetailFetch()
    })
  }

  handleMessageOnChange = e => {
    this.setState({
      messageValue: e.target.value,
    });

  }

  handleMessageSubmit = async () => {
    const {messageValue} = this.state;

    this.setState({messageLoading: true})

    const {userInfo} = this.state;


    const body = {
      type: 1,
      userId: this.state.dstUserId,
      articleId: this.state.dstArticleId,
      authorId: userInfo.userId,
      content: messageValue
    }
    try {
      const result = await  DialogueAddMessageRequest(body)
      if (result.success) {
        this.setState({
          dialogueDetailList: [
            ...this.state.dialogueDetailList,
            {
              key: moment().format('YYYY-MM-DD HH:mm'),
              author: userInfo.display || userInfo.name ,
              avatar: userInfo.avatar,
              content: messageValue,
              datetime: moment().format('YYYY-MM-DD HH:mm'),
              type: 1
            }
          ],
          messageLoading: false,
          messageValue: "",
        })
        beforeDatetime =  ""
      }
    }catch (err) {
      message.error(err.message)
    }
  }

  render() {
    const {dialogueList, dialogueDetailList, messageLoading, messageValue} = this.state;
    beforeDatetime = ""
    return (
      <ProCard  ghost split="vertical" gutter={16} >
        <ProCard bodyStyle={{ padding: 8, maxWidth: 312, height: "100%"}} loading={this.state.dialogueListLoading} >
          <div
            id="scrollableDiv"
            style={{
              overflow: 'auto',
            }}
          >
            <List
              size={"small"}
              itemLayout="horizontal"
              dataSource={dialogueList}
              renderItem={item => (
                <List.Item key={item.id} onClick={()=>{this.handleChange(item)}} style={{cursor: 'pointer'}} >
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a  style={{color: this.state.activeKey === item.id ? '#1890ff': "rgba(0, 0, 0, 0.85)"}} >{item.nickName ? item.nickName : item.loginName}</a>}
                    description={`${item.content.replace(/<\/?.+?>/g,"").replace(/ /g,"").slice(0, 10)}...`}
                  />
                </List.Item>
              )}
              />
          </div>
        </ProCard>

        <ProCard  colSpan="80%" loading={this.state.dialogueDetailLoading}  >
          <MessageCommentList
            key={"MessageCommentList"}
            comments={dialogueDetailList }
          />

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
        </ProCard>

      </ProCard>
    )
  }
}
