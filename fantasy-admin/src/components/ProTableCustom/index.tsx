import React, {useRef, useState} from "react";
import ProTable, {ActionType} from "@ant-design/pro-table";
import {Button, Form, Input, Menu, Modal, Message} from "antd";
import {CloseCircleTwoTone, EditTwoTone, PlusOutlined} from "@ant-design/icons";
import { FormInstance } from 'antd/es/form';


const handlerArticleOperatorMenu = (action: any, record: any) => {


  return (
    <Menu onClick={(key, ) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (key.key === '4') {
        return
      }
    }}>
      <Menu.Item key="2" icon={<EditTwoTone />}>修改标签</Menu.Item>
      <Menu.Divider />
      <Menu.Item danger key="4" icon={<CloseCircleTwoTone />}>删除标签</Menu.Item>
    </Menu>
  )
}

const TableSearchRequest = async (params: any, sort: any, filter: any, props: any) => {

  // 通用请求参数
  const combinationParams = {
    pageNum: params.current,
    pageSize: params.pageSize,
  }

  // 查询参数
  const searchParams = {}

  for (const key in params) {
    if (!props.searchParamsReverse[key]) {
      continue
    }
    searchParams[props.searchParamsReverse[key]] = params[key]
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

  const result = await props.searchRequest(combinationParams)

  return {
    data: result.data.list,
    // success 请返回 true，
    // 不然 table 会停止解析数据，即使有数据
    success: result.success,
    // 不传会使用 data 的长度，如果是分页一定要传
    total: result.data.total,
  };
}

const handlerCreate =  (formRef: any, request: any, actionRef: any, setCreateVisible: any) => {
  formRef.current.validateFields()
    .then(values => {

      request(values).then(res=>{

        if (res.status) {
          return
        }
        Message.success("创建成功")
        actionRef.current.reload();
        setCreateVisible(false)
        formRef.current.resetFields()

      }).catch(err => {
        console.log("create error:", err)
        Message.error("创建失败!")
      })
    })
    .catch(info => {
      console.log('Validate Failed:', info);
    });
}


export default (props: any) => {
  const actionRef = useRef<ActionType>();

  // 创建
  const [createVisible, setCreateVisible] = useState(false);

  // 创建ref
  const createFormRef = React.createRef<FormInstance>();

  // 修改
  const handlerUpdateRecord = async (rowKey, data, row) => {
    const result = await props.putRequest(data.id, data)

    if (!result.status) {
      Message.success("修改成功")
      actionRef.current?.reload()
    }
  }

  // 删除
  const handlerDeleteRecord = async (id: number, row: any) => {
    const result = await props.deleteRequest(id);

    if (result.success) {
      Message.success("删除成功");
      actionRef.current?.reload()
    }

  }

 const columns = [
   ...props.columns,
   {
     title: '操作',
     valueType: 'option',
     render: (text, record, _, action) => [
       <a
         key="editable"
         onClick={() => {
           action?.startEditable?.(record.id);
         }}
       >
         编辑
       </a>
     ]
   }
   ]

 const handlerCreateTrigger = (cond: boolean) => {
    setCreateVisible(cond)
  }

  // @ts-ignore
  return (
    <div>
      <Modal
        visible={createVisible}
        title={props.createModalTitle}
        okText="创建"
        cancelText="取消"
        onCancel={() => handlerCreateTrigger(false)}
        onOk={() => {handlerCreate(createFormRef, props.createRequest, actionRef, setCreateVisible)}}
      >
        <Form
          ref={createFormRef}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          <Form.Item
            name={props.createNameName}
            label={props.createNameLabel}
            rules={[{ required: true, message: props.createNameMessage }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <ProTable<props.columnsItem>
        columns={columns}
        actionRef={actionRef}
        size={'large'}
        request={async (params = {}, sort, filter) => {
          return await TableSearchRequest(params, sort, filter,props)
        }}
        editable={{
          type: 'single',
          onSave: handlerUpdateRecord,
          onDelete: handlerDeleteRecord,
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
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={ () => handlerCreateTrigger(true)}>
            新建
          </Button>,
        ]}
      />
    </div>
  );
};
