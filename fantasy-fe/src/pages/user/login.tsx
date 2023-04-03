import { LoginForm, ProFormText, ProFormCaptcha, ProFormCheckbox } from '@ant-design/pro-form';
import {
  UserOutlined,
  LockOutlined,
  AlipayCircleOutlined,
  TaobaoCircleOutlined,
  WeiboCircleOutlined,
  MailOutlined
} from '@ant-design/icons';
import  {
  ModalForm,
} from '@ant-design/pro-form';
import { message, Tabs, Space, Alert } from 'antd';
import type { CSSProperties } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import {useEffect, useState, useRef} from 'react';
import {Logout, SaveUserInfo} from '@/components/user/user'
import styles from './index.less';
import {
  IsMatchEmo, IsMatchSpecial, IsMatchCn, IsMatchNumberStart, checkPasswordSecurityLevel,
  CheckEmailValid
} from '/utils/rules'

import {UserLoginRequest} from '@/services/users/login'
import {UserRegisterRequest, UserResetPasswordCaptchaRequest, UserResetPasswordRequest} from '@/services/users/user'

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
  marginLeft: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const defaultCaptcheURL = '/api/v1/common/captcha/';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('login');
  const [CallbackResultState, setCallbackResultState] = useState("")
  const [captcha, setcaptcha] = useState(defaultCaptcheURL)
  const [visible, setVisible] = useState(false);
  const formRef = useRef<ProFormInstance>();
  const [errorMessage, setErrorMessage] = useState("")

  const tagOnChange = (activeKey: string) => {
    setLoginType(activeKey as LoginType)
    setCallbackResultState("")
  }
  useEffect(() => {
    // clear localstorage token
    Logout()
  }, []);

  const handleLoginSubmit = async (values: any) => {

    try {
      const result = await UserLoginRequest(values);
      if (result.success) {
        SaveUserInfo(result.data.list)
        window.location.href = "/"
      }
    }catch (err) {
      message.error(err.message)
    }
  }

  const handleRegisterSubmit =  async (values: any) => {
    if (values.registerUsername.length < 5 ) {
      setCallbackResultState("用户名长度过短")
      return
    }

    if (IsMatchNumberStart(values.registerUsername)) {
      setCallbackResultState("用户名不允许以数字开头")
      return
    }

    if (IsMatchCn(values.registerUsername)) {
      setCallbackResultState("用户名不允许包含中文")
      return
    }

    if (IsMatchSpecial(values.registerUsername)) {
      setCallbackResultState("用户名不允许包含特殊字符")
      return
    }

    if (IsMatchEmo(values.registerUsername)) {
      setCallbackResultState("用户名不允许包含Emo表情")
      return
    }

    if (values.registerPassword.length <=5 ) {
      setCallbackResultState("密码长度过短")
      return
    }

    if (checkPasswordSecurityLevel(values.registerPassword) <= 1) {
      setCallbackResultState("密码强度较弱")
      return
    }

    if (values.registerPassword != values.registerConfirmPassword) {
      setCallbackResultState("两次密码输入不一致")
      return
    }

    if (!CheckEmailValid(values.registerEmail)) {
      setCallbackResultState("邮箱格式有误")
      return
    }

    if (values.registerCaptcha.length != 6) {
      setCallbackResultState("验证码长度有误")
      return
    }

    setCallbackResultState("")

    try {
      const result = await UserRegisterRequest(values);
      if (result.success) {
        message.success("我们已向您的邮箱发送了一封邮件, 请点击链接进行激活用户。")
        setTimeout(()=>{
          window.location.href = "/"
        }, 2000)
      }
    } catch (err) {
      message.error(err.message)
    }
  }

  const handleSubmit = async (values: API.LoginParams) => {
    loginType == "login" ? await handleLoginSubmit(values) : await handleRegisterSubmit(values)
  };

  const handleSeedCaptcha = () => {
    setcaptcha(`${captcha}?seed=${parseInt(100*Math.random())}`)
  }

  const handleResetPasswordSubmit = async (values) => {

    if (values.password.length <=5 ) {
      setErrorMessage("密码长度过短")
      return
    }

    if (checkPasswordSecurityLevel(values.password) <= 1) {
      setErrorMessage("密码强度较弱")
      return
    }

    if (values.password != values.confirmPassword) {
      setErrorMessage("两次密码输入不一致")
      return
    }

    setErrorMessage("")

    try {
      const result = await UserResetPasswordRequest(values)
      if (result.success) {
        message.success("密码重置成功")
        setVisible(false)
      }

    }catch (err) {
      setErrorMessage(err.message)
    }
  }

  return (
    <div className={styles.container}>
    <div className={styles.content}>
      <LoginForm
        submitter={{
          searchConfig: {
            submitText: loginType === "login" ? "登录": "注册",
          }}}
        logo="/logo.png"
        title="FANTASY"
        subTitle="保持热爱，奔赴山海。"
        initialValues={{
          autoLogin: true,
        }}
        onFinish={async (values) => {
          await handleSubmit(values as API.LoginParams);
        }}
        actions={
          <Space>
            其他登录方式
            <AlipayCircleOutlined style={iconStyles} disabled />
            <TaobaoCircleOutlined style={iconStyles} disabled/>
            <WeiboCircleOutlined style={iconStyles} disabled />
          </Space>
        }
      >
        <Tabs activeKey={loginType} onChange={(activeKey) => tagOnChange(activeKey)}>
          <Tabs.TabPane key={'login'} tab={'登录'} />
          <Tabs.TabPane key={'register'} tab={'注册'} />
        </Tabs>

        {CallbackResultState !== '' &&  (
          <LoginMessage
            content={CallbackResultState}
          />
        )}

        {loginType === 'login' && (
          <>
            <ProFormText
              name="loginUsername"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'用户名: '}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="loginPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码: '}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              captchaProps={{
                size: 'large',
                disabled: false
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                return <img style={{width: 100}} alt={"captcha"} src={captcha}/>;
              }}
              name="loginCaptcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                handleSeedCaptcha()
              }}
            />
          </>
        )}
        {loginType === 'register' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              name="registerUsername"
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名！',
                }
              ]}
            />
            <ProFormText.Password
              name="registerPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码: '}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <ProFormText.Password
              name="registerConfirmPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'确认密码: '}
              rules={[
                {
                  required: true,
                  message: '请输入确认密码！',
                },
              ]}
            />

            <ProFormText
              name="registerEmail"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined  className={'prefixIcon'} />,
              }}
              placeholder={'邮箱: '}
              rules={[
                {
                  required: true,
                  message: '请输入邮箱!',
                },
              ]}
            />

            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              captchaProps={{
                size: 'large',
                disabled: false
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                return <img style={{width: 100}} alt={"captcha"} src={captcha}/>;
              }}
              name="registerCaptcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                handleSeedCaptcha()
              }}
            />
          </>
        )}
        {
          loginType === 'login' &&
          (
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                自动登录
              </ProFormCheckbox>
              <a
                onClick={()=>{setVisible(true)}}
                style={{
                  float: 'right',
                }}
              >
                忘记密码
              </a>
            </div>
          )
        }
      </LoginForm>
    </div>

      <ModalForm<{
        name: string;
        company: string;
      }>
        title="重置密码"
        visible={visible}
        autoFocusFirstInput
        formRef={formRef}
        width={500}
        submitter={{
          searchConfig: {
            submitText: '重置密码',
            resetText: '取消',
          },
        }}
        modalProps={{
          onCancel: () => setVisible(false),
        }}
        onFinish={async (values) => {
          await handleResetPasswordSubmit(values)
          return true;
        }}
      >

        {errorMessage !== '' &&  (
          <LoginMessage
            content={errorMessage}
          />
        )}

        <ProFormText
          name="email"
          label="邮箱"
          tooltip="最长为 24 位"
          placeholder="请输入邮箱"
          rules={[
            {
              required: true,
              message: '请输入邮箱！',
              type: "email",
            },
          ]}
          fieldProps={{
            prefix: <MailOutlined className={'prefixIcon'} />,
          }}
        />

        <ProFormCaptcha
          label={"验证码"}
          fieldProps={{
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          captchaProps={{
          }}
          placeholder={'请输入验证码'}
          name="captcha"
          phoneName="email"
          rules={[
            {
              required: true,
              message: '请输入验证码！',
            },
          ]}
          onGetCaptcha={async (email) => {
            try {
              const result = await UserResetPasswordCaptchaRequest(email);
              if (result.success) {
                message.success("我们向你的邮箱发送了一条验证码, 请注意查收邮箱!")
              }
            } catch (err) {
              message.error(err.message)
            }
          }}
        />

        <ProFormText.Password
          label="新密码"
          name="password"
          fieldProps={{
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'请输入新密码 '}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />

        <ProFormText.Password
          label="重复新密码"
          name="confirmPassword"
          fieldProps={{
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'请在输入一遍新密码'}
          rules={[
            {
              required: true,
              message: '请输入确认密码！',
            },
          ]}
        />
      </ModalForm>
    </div>
  );
};
