import React, {useRef, useState} from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {AuditUserOperationRequest} from "@/services/audit/audit";
import {Modal, Divider} from 'antd'
import ReactJson from 'react-json-view'

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
  url: "url",
  method: "method",
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

  const result = await AuditUserOperationRequest(combinationParams)

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
  const [visible, setVisible] = useState(false);
  const [srcData, setSrcData] = useState("{}")
  const [drcData, setDrcData] = useState("{}")

  const handleOpenVisible = (record: any) => {
    setVisible(true)
    setSrcData(JSON.parse(record.srcData))
    setDrcData(JSON.parse(record.dstData))
  }

  const closeVisible = () => {
    setVisible(false)
    setSrcData("{}")
    setDrcData("{}")
  }

  const columns: ProColumns<ColumnsType>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      copyable: true,
      ellipsis: true
    },
    {
      title: '请求地址',
      dataIndex: 'url',
      copyable: true,
      ellipsis: true
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      ellipsis: true
    },
    {
      title: '描述信息',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '操作时间',
      dataIndex: 'created',
      valueType: 'dateTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a onClick={()=>{handleOpenVisible(record)}} target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>
      ],
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
    <Modal
      title={"操作信息"}
      visible={visible}
      onOk={closeVisible}
      onCancel={closeVisible}
    >
      <div>
        <h3>请求参数</h3>
        <ReactJson src={srcData} />
      </div>
      <Divider/>
      <h3>响应参数</h3>
      <div><ReactJson src={drcData} /></div>
    </Modal>
    </>
  );
};
