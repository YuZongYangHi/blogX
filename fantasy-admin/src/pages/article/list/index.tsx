import { useRef } from 'react';
import {  Tag, Menu, Dropdown, Badge, message, modal} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable  from '@ant-design/pro-table';
import { DownOutlined, UpCircleTwoTone, CloseCircleTwoTone, StopTwoTone, EditTwoTone, SnippetsTwoTone  } from '@ant-design/icons';

// @ts-ignore
import type {ArticleItem, SearchItem}  from './typing'
import {SearchParamsReverse} from './typing'
import {
  ArticleCategorySearchRequest,
  ArticleTagsSearchRequest,
  ArticleAuthorSearchRequest,
  ArticleSearchRequest,
  ArticleOperationRequest
} from '@/services/article/article'

const asyncSearchCategoryRequest = async () => {
  const result = await  ArticleCategorySearchRequest()
  return result.data.list
}

const asyncSearchTagRequest = async () => {
  const result = await  ArticleTagsSearchRequest()
  return result.data.list
}

const asyncSearchAuthorRequest = async () => {
  const result = await ArticleAuthorSearchRequest()
  return result.data.list
}

const asyncArticleOperationRequest = async (data: any) => {
  const result = await ArticleOperationRequest(data)
  return result.data.list
}

const asyncTableSearchRequest = async (params: SearchItem, sort: any, filter: any) => {
  // 通用请求参数
  const combinationParams = {
    pageNum: params.current,
    pageSize: params.pageSize,
  }

  // 查询参数
  const searchParams = {}

  for (const key in params) {
    if (!SearchParamsReverse[key]) {
      continue
    }
    searchParams[SearchParamsReverse[key]] = params[key]
  }

  if (Object.keys(searchParams).length !== 0) {

    // 声明查询条件
    // 用于后端搜索使用
    let searchStr = ""

    // 循环遍历字符串
    for (const key in searchParams) {
      searchStr += `${key}=${searchParams[key]},`
    }

    // @ts-ignore
    combinationParams.filter = searchStr.substr(0, searchStr.lastIndexOf(','))
  }

  const result = await ArticleSearchRequest(combinationParams)

  return {
    data: result.data.list,
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: result.success,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: result.data.total,
  };
}

const articleDeleteModelConfig = (key, record, action) => {

  return {
    title: "删除提醒",
    onOk: () => {
      handlerArticleOperationRequest(key, record, action)
    },
    content: (
      <>
        确定要删除这篇文章吗?
      </>
    )
  }
}

const handlerArticleOperatorMenu = (action: any, record: ArticleItem) => {
  let commentText = "禁止评论"
  let draftText = "保存草稿"
  let topText = "文章置顶"

  if (record.isDraft) {
    draftText = "发布文章"
  }

  if (record.isDisabledComment) {
    commentText = "允许评论"
  }

  if (record.isTop) {
    topText = "取消置顶"
  }

  return (
    <Menu onClick={(key, ) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (key.key === '4') {
        modal.confirm(articleDeleteModelConfig(key, record, action));
        return
      }
      handlerArticleOperationRequest(key, record, action)
    }}>
      <Menu.Item key="0" icon={<UpCircleTwoTone />}>{topText}</Menu.Item>
      <Menu.Item key="1" icon={<SnippetsTwoTone />}>{draftText}</Menu.Item>
      <Menu.Item key="2" icon={<EditTwoTone />}>编辑文章</Menu.Item>
      <Menu.Item key="3" icon={<StopTwoTone />}>{commentText}</Menu.Item>
      <Menu.Divider />
      <Menu.Item danger key="4" icon={<CloseCircleTwoTone />}>删除文章</Menu.Item>
    </Menu>
  )
}

const handlerArticleOperationRequest = async (item: any, record: ArticleItem, ref: any) => {
  let action = "update";
  let field = ""
  let where = false
  let params = {
    articleId: record.Id,
  }

  switch (item.key) {
    case '0':
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      field = "isTop"
      where = !record.isTop
      break;
    case '1':
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      field = "isDraft"
      where = !record.isDraft
      break;
    case '2':
      window.location.href = `/admin/assets/article/create?articleId=${record.Id}`
      break;
    case '3':
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      field = "isDisabledComment"
      where = !record.isDisabledComment
      break;
    case '4':
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action = "delete";
      break;
    default:
      console.log('no selected match')
      break;
  }

  params.action = action
  params.where = where
  params.field = field

  await asyncArticleOperationRequest(params)

  message.success("操作成功")
  ref.reload()

}

const articleStateRender = (record: any) => {
  let status = "success"
  let text = "已发布"
  if (record.isDraft === true) {
     status = "warning"
     text = "未发布"
  }
  // @ts-ignore
  return  <Badge status={status} text={text} />
}

const articleOriginalRender = (record: any) => {
  let text = "转载"
  let color = "warning"
  if (record.isOriginal === true) {
    text = "原创"
    color = "success"
  }
  return <Tag color={color}>{text}</Tag>
}

const articleStatus = {
  0: {
    text: '未发布',
  },
  1: {
    text: '已发布',
  },
}

const articleOriginal = {
  0: {
    text: '转载',
  },
  1: {
    text: '原创',
  },
}

const articleIsTop = {
  0: {
    text: '未置顶',
  },
  1: {
    text: '已置顶',
  },
}

const columns: ProColumns<ArticleItem>[] = [

  {
    title: '文章标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    render: (dom, record) => {
      // @ts-ignore
      dom.props.style.color = "#1890FF"
      return<a target="_blank" href={`/admin/assets/article/create?articleId=${record.Id}`} rel="noreferrer">{dom}</a>
    }
  },
  {
    title: '文章分类',
    dataIndex: 'category',
    filters: true,
    onFilter: true,
    valueType: 'select',
    request: asyncSearchCategoryRequest,
    render: (dom, record) => {
      return <Tag color="#2db7f5" key={record.category && record.category.name || record.id}>{record.category && record.category.name || ""}</Tag>
    }
  },
  {
    title: '文章标签',
    dataIndex: 'tags',
    filters: true,
    onFilter: true,
    valueType: 'select',
    request: asyncSearchTagRequest,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (

    <div >
        {record.tags && record.tags.map(({ name }) => (
            <Tag color="cyan" key={name} style={{marginBottom: 5}}>
              {name}
            </Tag>
        ))
        }
    </div>
    )
  },
  {
    title: '文章状态',
    dataIndex: 'isDraft',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: articleStatus,
    render: (dom, record) => {
      return articleStateRender(record)
    }
  },

  {
    title: '文章置顶',
    dataIndex: 'isTop',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: articleIsTop,
    hideInTable: true
  },

  {
    title: '文章来源',
    dataIndex: 'isOriginal',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: articleOriginal,
    render: (dom, record) => {
      return articleOriginalRender(record)
    }
  },
  {
    title: '文章作者',
    dataIndex: 'author',
    filters: true,
    onFilter: true,
    valueType: 'select',
    request: asyncSearchAuthorRequest,
    render: (dom, record) => {
      return <>{record.author.name}</>
    }
  },
  {
    title: '创建时间',
    dataIndex: 'created',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '更新时间',
    dataIndex: 'updated',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
      <Dropdown overlay={handlerArticleOperatorMenu(action, record)} trigger={['click']}>
        <a className="ant-dropdown-link" >
          操作 <DownOutlined />
        </a>
      </Dropdown>,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  // @ts-ignore
  return (
    <ProTable<ArticleItem>
      columns={columns}
      actionRef={actionRef}
      size={'large'}
      request={asyncTableSearchRequest}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="id"
      scroll={{ x: 1300 }}
      options={{
        density: false,
        fullScreen: true,
        setting: true,
      }}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 20,
      }}
      dateFormatter="string"
      headerTitle={false}
      toolBarRender={() => []}
    />
  );
};
