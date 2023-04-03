import React from 'react';
import { List, Skeleton, message } from 'antd';
import  {
  ModalForm,
  ProFormText,
  ProFormCaptcha,
} from '@ant-design/pro-form';
import { FormInstance } from 'antd/es/form';

import {
  UserSecurityInfoRequest, UserSecuritySendEmailRequest,
  UserSecurityChangeEmailRequest, UserSecurityChangePasswordRequest
} from '@/services/users/user'
import {PasswordStrengthDisplayComponent, CheckEmailValid, checkPasswordSecurityLevel} from "/utils/rules";
import {MailTwoTone} from '@ant-design/icons'

export default class Security extends React.Component {
  formRef = React.createRef<FormInstance>();
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
    visible: false,
    selectedKey: "",
    formItems: []
  };

  fetch = async () => {
    const result = await UserSecurityInfoRequest();
    if (!result.success) {
      message.error("获取用户安全信息失败!")
      window.location.href = "/user/login"
      return
    }

    const data = result.data.list;

    const email = `${data.email.split('@')[0].slice(0, 3)}***${data.email.split("@")[1]}`
    const list = [
      {
        key: "id",
        title: "用户ID",
        description: <>用户唯一标识符: <span style={{color: "#000000"}}>{data.userName}</span></>,
      },
      {
        key: "account",
        title: "账户密码",
        description: <>当前密码强度: {PasswordStrengthDisplayComponent(data.password)}</>
      }, {
        key: 'email',
        title: '绑定邮箱',
        description: `已绑定邮箱: ${email}`,
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

  handlerAsyncChangeEmailRequest = async (values: any) => {
    if (values.captcha.length != 6) {
      message.warning("验证码长度错误!")
      return
    }

    if (!CheckEmailValid(values.dstEmail)) {
      message.error("无效的邮箱地址!")
      return
    }
    const data = {
      userId: this.state.data.userId,
      srcEmail: values.srcEmail,
      dstEmail: values.dstEmail,
      captcha: values.captcha
    }
    return UserSecurityChangeEmailRequest(data)
  }

  handlerAsyncChangePasswordRequest = async (values: any) => {
    if (values.dstPassword !== values.confirmPassword) {
      message.warning("两次密码输入有误!")
      return
    }
    if (checkPasswordSecurityLevel(values.dstPassword) <= 1) {
      message.warning("密码强度较弱!")
      return
    }

    const {data} = this.state;
    values.userId = data.userId
    values.email = data.email

    return UserSecurityChangePasswordRequest(values)
  }

  handlerChangePassword = (key: string) => {
    let items = [];
    const {data} = this.state;

    switch (key) {
      case "account":
        const forms = {
          userId: data.userId,
          userName: data.userName,
        }

        this.formRef.current?.setFieldsValue(forms);

        items = [
          <ProFormText
            key={"userName"}
            width={600}
            name="userName"
            label="登录名称"
            placeholder="用户名称"
            disabled={true}
            rules={[
              {
                required: true,
                message: '用户名称',
              },
            ]}
          />,
          <ProFormText.Password label="原密码" name="srcPassword" key={"srcPassword"} width={600} rules={[{required: true, message: '原密码不能为空'}]}
          />,
          <ProFormText.Password label="新密码" name="dstPassword" key={"dstPassword"} width={600} rules={[{required: true, message: '新密码不能为空'}]} />,
          <ProFormText.Password label="确认密码" name="confirmPassword" key={"confirmPassword"} width={600} rules={[{required: true, message: '确认密码不能为空'}]}/>,
          <ProFormCaptcha
            key={"captcha"}
            width={600}
            label="邮箱验证码"
            name="captcha"
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
            ]}
            placeholder="请输入验证码"
            onGetCaptcha={async () => {
              const params = {
                email: this.state.data.email
              }
              const result = await UserSecuritySendEmailRequest(params);
              if (result.success) {
                message.success(`邮箱 ${this.state.data.email} 验证码发送成功!`);
              }
            }}
          />
        ]
        break;
      case "email":
        const f = {srcEmail: data.email}
        this.formRef.current?.setFieldsValue(f);
        items = [
          <ProFormText
            key={"srcEmail"}
            width={600}
            name="srcEmail"
            label="原邮箱地址"
            placeholder="用户原邮箱"
            disabled={true}
            rules={[
              {
                required: true,
                message: '原邮箱地址',
              },
            ]}
          />,
          <ProFormText
            key={"dstEmail"}
            width={600}
            name="dstEmail"
            label="新邮箱地址"
            placeholder="用户新邮箱"
            rules={[
              {
                required: true,
                message: '新邮箱地址',
              },
            ]}
          />,
          <ProFormCaptcha
            key={"captcha"}
            width={600}
            label="邮箱验证码"
            fieldProps={{
              //  size: 'large',
              prefix: <MailTwoTone />,
            }}
            name="captcha"
            rules={[
              {
                required: true,
                message: '请输入验证码',
              },
            ]}
            placeholder="请输入验证码"
            onGetCaptcha={async () => {
              const params = {
                email: this.state.data.email
              }
              const result = await UserSecuritySendEmailRequest(params);
              if (result.success) {
                message.success(`邮箱 ${this.state.data.email} 验证码发送成功!`);
              }
            }}
          />
        ]
        break;
    }
    this.setState({
      visible: true,
      formItems: items,
      selectedKey: key
    })
  }

  render() {
    const { initLoading, list, formItems } = this.state;
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
              actions={[<a key="list-loadmore-edit" disabled={item.key === "id"} onClick={()=>{this.handlerChangePassword(item.key)}} >修改</a>]}
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

        <ModalForm<{
          srcEmail: string;
          dstEmail: string;
          captcha: string;
          userId: string;
        }>
          formRef={this.formRef}
          width={700}
          title="修改信息"
          visible={this.state.visible}
          autoFocusFirstInput
          modalProps={{
            onCancel: () => this.setState({visible: false}),
          }}
          onFinish={async (values) => {
            const {selectedKey} = this.state;
            let requests: any;
            if (selectedKey === "email") {
              requests = this.handlerAsyncChangeEmailRequest
            } else {
              requests = this.handlerAsyncChangePasswordRequest
            }

            try {
              const result = await requests(values);
              if (result.success) {
                message.success('修改成功');
                await this.fetch()
                this.formRef.current?.resetFields();
                this.setState({visible: false})
              }
              return true;
            }catch (err) {
              message.error(err.message)
            }
          }}
        >
          {formItems}
        </ModalForm>
      </div>
    );
  }
}
