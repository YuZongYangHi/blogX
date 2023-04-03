import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {AuditUserRequest, AuditUserLoginUpdateRequest} from "@/services/audit/audit";
import {Badge, message} from 'antd'

type ColumnsType = {
  userId: string;
  name: string;
  display: string;
  email: string;
  is_active: string;
  createTime: string;
  updateTime: string;
};

export const SearchParamsReverse = {
  userId: "userId",
  name: "name",
  email: "email",
  is_active: "is_active"
}

const asyncTableSearchRequest = async (params: any, sort: any, filter: any) => {
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

  const result = await AuditUserRequest(combinationParams)

  return {
    data: result.data.list,
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: result.success,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: result.data.total,
  };
}

const handleUserRequest = async (action: any, record: any) => {
  const data = {
    userId: record.userId,
    allowLogin: record.is_active === true ? 0 : 1,
  }

  try {
    const result = await AuditUserLoginUpdateRequest(data)
    if (result.success) {
      message.success("操作成功")
      action.reload();
    }
  }catch (err) {
    message.error(err.message)
    return
  }
}

const columns: ProColumns<ColumnsType>[] = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    copyable: true,
    ellipsis: true
  },
  {
    title: '登录名称',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true
  },
  {
    title: '邮箱地址',
    dataIndex: 'email',
    copyable: true,
    ellipsis: true
  },
  {
    title: '用户状态',
    dataIndex: 'is_active',
    filters: true,
    onFilter: true,
    valueType: 'select',
    render: (_, record) => {
      return record.is_active ? <Badge status="success" text="已激活"/> : <Badge status="error" text="未激活"/>
  },
    valueEnum: {
      0: {
        text: '未激活',
        status: 0,
      },
      1: {
        text: '已激活',
        status: 1,
      },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '修改时间',
    dataIndex: 'updated',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a onClick={async ()=> {await handleUserRequest(action, record)}} target="_blank" rel="noopener noreferrer" key="view">
        {record.is_active === true ? "禁止登录": "允许登录"}
      </a>
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<ColumnsType>
      columns={columns}
      actionRef={actionRef}
      request={asyncTableSearchRequest}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
      }}
      rowKey="userId"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 20,
      }}
      dateFormatter="string"
      headerTitle={false}
    />
  );
};
