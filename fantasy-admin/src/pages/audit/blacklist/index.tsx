import React, {useRef, useState} from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {AuditUserBlackListRequest, AuditUserAddBlackListRequest} from "@/services/audit/audit";
import { message, Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons'
import  {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';

type ColumnsType = {
  id: number;
  remoteIp: string;
  created: string;
  updated: string
};

export const SearchParamsReverse = {
  remoteIp: "remote_ip"
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

  const result = await AuditUserBlackListRequest(combinationParams)

  return {
    data: result.data.list,
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: result.success,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: result.data.total,
  };
}

export default () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false)

  const handleAddBlacklistRequest = async (action: any, record: any) => {
    setVisible(true)
  }

  const closeAddVisible = () => {
    setVisible(false)
  }

  const columns: ProColumns<ColumnsType>[] = [
    {
      title: '来源地址',
      dataIndex: 'remoteIp',
      copyable: true,
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true
    },
    {
      title: '更新时间',
      dataIndex: 'updated',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true
    },
  ];

  return (
    <>
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
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleAddBlacklistRequest}>
          新建
        </Button>,
      ]}

      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 20,
      }}
      dateFormatter="string"
      headerTitle={false}
    />

      <ModalForm<{
        name: string;
        company: string;
      }>
        title="新建黑名单"
        autoFocusFirstInput
        modalProps={{
          onCancel: () => closeAddVisible(),
        }}
        visible={visible}
        onFinish={async (values) => {
          try {
            const result = await AuditUserAddBlackListRequest(values)
            if (result.success) {
              message.success("创建成功")
              setVisible(false)
              actionRef.current?.reload()
            }
          }catch (err) {
            message.error(err.message)
          }
          return true;
        }}
      >
          <ProFormText
            name="remoteIp"
            label="来源地址"
            tooltip="请输入来源IP"
            placeholder="请输入来源IP"
            rules={[{ required: true, message: '请输入来源地址' }]}
          />
      </ModalForm>

    </>
  );
};
