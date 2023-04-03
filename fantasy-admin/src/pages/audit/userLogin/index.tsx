import React, { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {AuditUserLoginRequest} from "@/services/audit/audit";

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
  loginName: "loginName"
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

  const result = await AuditUserLoginRequest(combinationParams)

  return {
    data: result.data.list,
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: result.success,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: result.data.total,
  };
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
    dataIndex: 'loginName',
    copyable: true,
    ellipsis: true
  },
  {
    title: '登录时间',
    dataIndex: 'created',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  }
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
