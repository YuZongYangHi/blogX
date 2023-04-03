import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/code-highlighter.css'
import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Form, Input, Button, Upload, message, Modal, Alert, Select, Switch, Radio } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';
import { SaveDraftRequest, ArticleFetchByIdRequest, ArticleCreateRequest } from '@/services/article/article';
import { CategoryListRequest } from '@/services/category';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { TagListRequest } from '@/services/tag';
import RemoteTransfer from '@/components/custom/remoteTransfer';

const OSS = require('ali-oss');
const AccessKey = '';
const AccessKeySecret = '';
const domain = 'http://ay-blog-oss.oss-accelerate.aliyuncs.com';
const { Option } = Select;

const client = new OSS({
  region: 'cn-beijing',
  accessKeyId: AccessKey,
  accessKeySecret: AccessKeySecret,
  bucket: 'ay-blog-oss',
  cname: true,
  endpoint: 'ay-blog-oss.oss-accelerate.aliyuncs.com',
});

Prism.hooks.add('editor-with-code-highlighter', function(env: any) {
  env.element.innerHTML = env.element.innerHTML.replace(/<br\s*\/?>/g,'\n');
  env.code = env.element.textContent.replace(/^(?:\r?\n|\r)/,'');
});
Prism.highlightAll()

const options = {
  syntaxs: [
    {
      name: 'JavaScript',
      syntax: 'javascript'
    }, {
      name: 'HTML',
      syntax: 'html'
    }, {
      name: 'CSS',
      syntax: 'css'
    }, {
      name: 'Java',
      syntax: 'java',
    }, {
      name: 'PHP',
      syntax: 'php'
    }, {
      name: 'Go',
      syntax: 'go'
    }, {
      name: 'Python',
      syntax: 'python'
    }, {
      name: 'YAML',
      syntax: 'yaml'
    }, {
      name: 'JSON',
      syntax: 'json'
    }, {
      name: 'Shell',
      syntax: 'bash'
    }
  ]
}

BraftEditor.use(CodeHighlighter(options))

/*
const options = {
  includeEditors: ['editor-with-code-highlighter'],
};

BraftEditor.use(CodeHighlighter(options));
*/

export default class CreateArticleComponent extends React.Component {
  formRef = React.createRef<FormInstance>();
  createformRef = React.createRef<FormInstance>();

  state = {
    editorState: BraftEditor.createEditorState('<p>元气满满的一天!</p>'),
    outputHTML: '<p></p>',
    imageUploading: false,
    isLoading: false,
    isGlobalLoading: true,
    defaultTitle: '',
    defaultContent: '',
    drfatData: {},
    // 发布模态框显示
    visible: false,
    // 默认分类
    defaultCategory: {},
    // 默认标签
    defaultTags: [],
    // 封面loading
    imageUploadLoading: false,
    // 封面图片地址
    imageUrl: '',
    // 标签列表
    tagsList: [],
    // 分类列表
    categoryList: [],
    // 点击保存草稿后，后端返回的文章id
    articleId: 0
  };

  componentDidMount = async () => {
    const articleId = this.handleGetArticleId();

    if (articleId != 0) {
      // 获取编辑的文章
      const data = await ArticleFetchByIdRequest(articleId);

      if (data.success === true) {
        const result = data.data.list;
        this.setState({
          drfatData: data.data.list,
          defaultTitle: data.data.list.title,
          defaultContent: BraftEditor.createEditorState(data.data.list.content),
          imageUrl: data.data.list.image
        });

        if (result.tags) {
          const rrr = result.tags.map((item) => (
            item.id
          ));
          this.setState({
            defaultTags: rrr,
          });
        }

        if (result.category) {
          this.setState({
            defaultCategory: {
              name: result.category.name,
              id: result.category.id,
            },
          });
        }
      }
    }

    const params = {
      pageSize: 1000,
    };

    // 获取分类
    const categoryData = await CategoryListRequest(params);
    if (categoryData.success === true) {
      const c = categoryData.data.list.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      this.setState({ categoryList: c });
    }

    // 获取标签
    const tagData = await TagListRequest(params);

    if (tagData.success === true) {
      const l = tagData.data.list.map((item) => ({
        id: item.id,
        name: item.name,
      }));
      this.setState({ tagsList: l });
    }
    this.setState({
      isGlobalLoading: false,
    });
  };

  handleGetArticleId = () => {
    const query = window.location.search;

    if (!query) {
      return 0;
    }

    return parseInt(window.location.search.split('?')[1].split('=')[1]);
  };

  OssImagePut = async (file: any) => {
    try {
      this.setState({
        imageUploading: true,
      });
      // object表示上传到OSS的文件名称。
      // file表示浏览器中需要上传的文件，支持HTML5 file和Blob类型。
      const r1 = await client.put(file.name, file);
      console.log('put success: %j', r1);
    } catch (e) {
      console.error('error: %j', e);
      this.setState({
        imageUploading: false,
      });
      return '';
    }

    this.setState({
      imageUploading: false,
    });

    return `${domain}/${file.name}`;
  };

  uploadImageHandler = async (param: any) => {
    if (!param.file) {
      return false;
    }

    const imageUrl = await this.OssImagePut(param.file);

    if (imageUrl.length === 0) {
      message.error('图片上传失败!');
      return;
    }

    this.setState({
      imageUrl: imageUrl,
    });
  };
  uploadHandler = async (param: any) => {
    if (!param.file) {
      return false;
    }

    const imageUrl = await this.OssImagePut(param.file);

    if (imageUrl.length === 0) {
      message.error('图片上传失败!');
      return;
    }

    const editorState = this.formRef.current?.getFieldValue('content');

    this.formRef.current?.setFieldsValue({
      content: ContentUtils.insertMedias(editorState, [
        {
          type: 'IMAGE',
          url: imageUrl,
        },
      ]),
    });
  };

  preview = () => {
    if (window.previewWindow) {
      window.previewWindow.close();
    }

    window.previewWindow = window.open();
    window.previewWindow.document.write(this.buildPreviewHtml());
    window.previewWindow.document.close();
  };

  buildPreviewHtml() {
    const value = this.formRef.current?.getFieldsValue();
    value.content = value.content.toHTML();
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
          </style>
        </head>
        <body>
          <div class="container">${value.content}</div>
        </body>
      </html>
    `;
  }

  onFinish = (values) => {
    //console.log('Success:', values.content.toHTML());
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  handleFormIsValid = () => {
    const value = this.formRef.current?.getFieldsValue();
    value.content = value.content.toHTML();

    if (!value.title || value.content.length <= 20) {
      return false;
    }
    return true;
  };

  handleTitleContentValid = (): boolean => {
    const value = this.formRef.current?.getFieldsValue();
    value.content = value.content.toHTML();

    if (!value.title || value.content.length <= 20) {
      message.error('请检查标题与正文是否达到应该保存的条件');
      return false;
    }
    return true
}

  handleDraftCreate = async () => {
    const value = this.formRef.current?.getFieldsValue();
    value.content = value.content.toHTML();

    if (!value.title || value.content.length <= 20) {
      message.error('无法保存为草稿箱, 请检查标题与正文是否达到应该保存的条件');
      return;
    }

    this.setState({ isLoading: true });

    const data = {
      articleId: this.handleGetArticleId(),
      title: value.title,
      content: value.content,
      author: '',
    };

    const msg = await SaveDraftRequest(data);

    if (msg.success) {
      Modal.success({
        content: '文章保存成功!',
      });

      this.setState({
        articleId: msg.data.list.Id
      })
    }

    this.setState({ isLoading: false });
  };
  hideCancelModal = () => {
    this.setState({
      visible: false,
    });
  };
  hideModal = async () => {
    this.createformRef.current
      ?.validateFields()
      .then((values) => {

        const step1 = this.formRef.current?.getFieldsValue();

        if (!this.handleTitleContentValid()) {
          return
        }

        const image = typeof values.image === "string" ? values.image : `http://ay-blog-oss.oss-accelerate.aliyuncs.com/${values.image.file.name}`
        const body = {
          "title": step1.title,
          "content": step1.content.toHTML(),
          "image": image,
          "categoryId": values.category,
          "tagIds": values.tags,
          "isTop": values.isTop,
          "isOriginal": values.isOriginal,
          "articleId": this.state.articleId || this.handleGetArticleId()
        }

        ArticleCreateRequest(body).then(res=> {
          if (!res.success) {
            return
          }

          Modal.success({
            content: '文章发布成功!',
            okText: "我知道了",
            onOk: () => {
              window.location.href = "/admin/assets/article/create"
            }
          })
        }).catch(err => {
          message.error('文章创建失败, 请检查后端服务是否正常')
        })

      })
      .catch((info) => {
        console.log(info)
        message.error('文章发布失败, 请检查必填项');
        return;
      });
  };

  showModal = () => {
    if (!this.handleFormIsValid()) {
      // message.error('无法进行发布文章, 请确认标题与正文是否满足发布条件');
      return;
    }

    this.setState({
      visible: true,
    });
  };

  handleCreateArticle = () => {


  };



  handleFailArticle = () => {};

  render() {
    const {
      editorState,
      outputHTML,
      defaultContent,
      defaultTitle,
      imageUploadLoading,
      imageUrl,
      defaultCategory,
      categoryList,
      tagsList,
      defaultTags,
    } = this.state;
    const uploadButton = (
      <div>
        {imageUploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );

    const extendControls = [
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            accept="image/*"
            showUploadList={this.state.imageUploading}
            customRequest={this.uploadHandler}
          >
            <Button
              type="primary"
              className="control-item button upload-button"
              data-title="插入图片"
            >
              <FileImageOutlined />
            </Button>
          </Upload>
        ),
      },
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview,
      },
    ];

    return (
      <PageContainer ghost title={false} loading={this.state.isGlobalLoading}>
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard>
            <Form
              layout="vertical"
              ref={this.formRef}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
            >
              <Form.Item label="文章标题">
                <Form.Item
                  noStyle
                  name="title"
                  initialValue={defaultTitle}
                  rules={[
                    {
                      required: true,
                      message: '请填写文章标题',
                    },
                  ]}
                >
                  <Input style={{ width: '80%' }} />
                </Form.Item>

                <Button
                  danger
                  htmlType="button"
                  onClick={this.handleDraftCreate}
                  style={{ marginLeft: 10 }}
                  disabled={this.state.isLoading}
                >
                  保存草稿
                </Button>
                <Button
                  disabled={this.state.isLoading}
                  type="primary"
                  danger
                  htmlType="submit"
                  onClick={this.showModal}
                  style={{ marginLeft: 10 }}
                >
                  发布文章
                </Button>
              </Form.Item>

              <Form.Item
                label="文章正文"
                name="content"
                initialValue={defaultContent || editorState}
                rules={[
                  {
                    required: true,
                    validator: (_, value, callback) => {
                      if (!value) {
                        callback('请输入正文内容');
                      } else if (value.toHTML().length <= 20) {
                        callback('正文文字过于少');
                      } else {
                        callback();
                      }
                    },
                  },
                ]}
              >
                <BraftEditor
                  extendControls={extendControls}
                  placeholder="请输入正文内容"
                  className="my-editor"
                />
              </Form.Item>
            </Form>
          </ProCard>
        </ProCard>

        <Modal
          title="发布文章"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideCancelModal}
          okText="发布"
          cancelText="等等"
          width={700}
        >
          <Alert
            message="请勿发布涉及政治、广告、营销、翻墙、违反国家法律法规等内容"
            type="warning"
            showIcon
            closable
          />
          <br />
          <div>
            <Form
              ref={this.createformRef}
              onFinish={this.handleCreateArticle}
              onFinishFailed={this.handleFailArticle}
            >
              <Form.Item
                label="文章封面"
                name="image"
                initialValue={imageUrl}
                rules={[
                  {
                    required: true,
                    message: '请上传文章封面',
                  },
                ]}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  accept="image/*"
                  showUploadList={imageUploadLoading}
                  customRequest={this.uploadImageHandler}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
              <Form.Item
                label="分类专栏"
                name="category"
                initialValue={defaultCategory.id ? defaultCategory.id : ''}
                rules={[
                  {
                    required: true,
                    message: '请选择一个分类专栏',
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="请选择分类"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {categoryList.map((item) => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="isOriginal" label="文章类型"  initialValue={this.state.drfatData.isOriginal}   rules={[
                {
                  required: true,
                  message: '请选择一个文章类型',
                },
              ]}>
                <Radio.Group>
                  <Radio value={true}>原创</Radio>
                  <Radio value={false}>转载</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="isTop" label="文章置顶"  valuePropName="checked" initialValue={this.state.drfatData.isTop || false} rules={[
                {
                  required: true,
                  message: '是否置顶',
                },
              ]} >
                <Switch />
              </Form.Item>

              <Form.Item
                label="文章标签"
                name="tags"
                initialValue={defaultTags}
                rules={[
                  {
                    required: true,
                    message: '请填写文章标题',
                  },
                ]}
              >
                <RemoteTransfer onChange={(targetKeys) => {console.log(targetKeys)} } anydata={tagsList} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </PageContainer>
    );
  }
}
