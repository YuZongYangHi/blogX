import {message} from 'antd';
import ProForm, { ProFormText, ProFormUploadButton, ProFormTextArea, ProFormSelect, ProFormRadio } from '@ant-design/pro-form';
import {UserInfoRequest, UserUpdateRequest} from '@/services/users/user'
import {useState} from "react";

const OSS = require('ali-oss');
const AccessKey = '';
const AccessKeySecret = '';
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

    const result = await UserUpdateRequest(userId, values)

    if (result.success) {
      message.success("更新成功!")
    } else {
      message.error("更新失败")
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

      <ProFormSelect
        width="md"
        name="city"
        label="省份"
        valueEnum={{
          '北京': '北京',
          '天津': '天津',
          '上海': '上海',
          '重庆': '重庆',
          '河北': '河北',
          '山西': '山西',
          '辽宁': '辽宁',
          '吉林': '吉林',
          '黑龙江': '黑龙江',
          '江苏': '江苏',
          '浙江': '浙江',
          '安徽': '安徽',
          '福建': '福建',
          '江西': '江西',
          '山东': '山东',
          '河南': '河南',
          '湖北': '湖北',
          '湖南': '湖南',
          '广东': '广东',
          '海南': '海南',
          '四川': '四川',
          '贵州': '贵州',
          '云南': '云南',
          '陕西': '陕西',
          '甘肃': '甘肃',
          '青海': '青海',
          '台湾': '台湾',
          '内蒙古自治区': '内蒙古',
          '广西壮族自治区': '广西',
          '西藏自治区': '西藏',
          '宁夏回族自治区': '宁夏',
          '新疆维吾尔自治区': '新疆',
          '香港特别行政区': '香港',
          '澳门特别行政区': '澳门',
          '海外': '海外'
        }}
        placeholder="请选择一个省份"
        rules={[{ required: true, message: '请选择一个省份' }]}
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
