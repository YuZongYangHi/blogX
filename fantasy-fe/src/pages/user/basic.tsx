import {message} from 'antd';
import ProForm, { ProFormText, ProFormUploadButton, ProFormTextArea, ProFormRadio } from '@ant-design/pro-form';
import {UserInfoRequest, UserUpdateRequest} from '@/services/users/user'
import {useState} from "react";

const OSS = require('ali-oss');
const AccessKey = 'LTAI5t8LtTRTLvMQrWcTZLt3';
const AccessKeySecret = 'Ve1Qr0fIkYoQlXRCgl7XznqF7wKbgS';
const domain = 'http://ay-blog-oss.oss-accelerate.aliyuncs.com';

const client = new OSS({
  region: 'cn-beijing',
  accessKeyId: AccessKey,
  accessKeySecret: AccessKeySecret,
  bucket: 'ay-blog-oss',
  cname: true,
  endpoint: 'ay-blog-oss.oss-accelerate.aliyuncs.com',
});

export default () => {
  const [userId, setUserId] = useState("");

  const uploadImageHandler = async (param: any) => {
    if (!param) {
      return false;
    }

    const uploadImageURL: string = await ossImagePut(param);

    if (uploadImageURL.length === 0) {
      message.error('图片上传失败!');
      return;
    }
  }
  const ossImagePut = async (file: any) => {
    try {

      const r1 = await client.put(file.name, file);
      console.log('put success: %j', r1);
    } catch (e) {
      console.error('error: %j', e);
      return '';
    }

    return `${domain}/${file.name}`;
  };
  const handlerPutSubmit = async (values: any) => {
    let avatarURL = values.avatar[0].name;
    if (avatarURL.indexOf("/") === -1 ) {
      avatarURL = `${domain}/${values.avatar[0].name}`;
    }
    values.avatar = avatarURL

    if (values.display.length === 1) {
      message.warning("昵称请至少保持2位及以上")
      return
    }

    try {
      const result = await UserUpdateRequest(userId, values)
      if (result.success) {
        message.success("更新成功!")
      } else {
        message.error("更新失败")
      }
    }catch (err) {
      message.error("后端异常")
    }
  }

  return (
    <ProForm<{
      display: string;
      description: string;
      avatar?: {
        name: string;
        url: string;
      }[];
      city: string;
      gender: number;
    }>
      submitter={{
        // 配置按钮文本
        searchConfig: {
          resetText: '重置',
          submitText: '提交',
        },
        // 配置按钮的属性
        resetButtonProps: {
          style: {
            // 隐藏重置按钮
            display: 'none',
          },
        }
      }}
      onFinish={handlerPutSubmit}
      params={{}}
      request={async () => {
        try {
          const result = await UserInfoRequest();
          const data = result.data.list;
          setUserId(data.userId)
          return {
            display: data.display,
            avatar: [{
              name: data.avatar,
              url: data.avatar
            }],
            description: data.description,
            gender: data.gender,
            city: data.city
          };

        }catch (err) {
          window.location.href = "/user/login"
        }

      }}
    >
      <br/>
      <ProFormUploadButton
        name="avatar"
        label="头像"
        max={1}
        rules={[{ required: true, message: '请上传一个头像' }]}
        action={uploadImageHandler}
        fieldProps={{
          name: 'fileList',
          listType: 'picture-card',
        }}
      />

      <ProFormText
        width="md"
        name="display"
        label="用户昵称"
        placeholder="请输入用户昵称"
        rules={[{ required: true, message: '请填写一个用户昵称' }]}
      />

      <ProFormRadio.Group
        name="gender"
        label="性别"
        rules={[{ required: true, message: '请选择您的性别' }]}
        options={[
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 0,
          },
        ]}
      />

      <ProFormTextArea
        width="md"
        name="description"
        label="个人介绍"
        placeholder="请描述一下风流倜傥的你......"
      />
    </ProForm>
  );
};
