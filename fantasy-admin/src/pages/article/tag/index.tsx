import type { ProColumns } from '@ant-design/pro-table';

// @ts-ignore
import { SearchParamsReverse} from './typing';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import  {TagItem}  from './typing'
import {TagListRequest, TagPutRequest,
  TagCreateRequest, TagDeleteRequest
} from '@/services/tag'
import ProTableDesign from '@/components/ProTableCustom'


const columns: ProColumns<TagItem>[] = [

  {
    title: '标签名称',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
    readonly: true
  },
  {
    title: '更新时间',
    dataIndex: 'updated',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
    readonly: true
  }
];

export default () => {
  const props = {
    createModalTitle: "创建标签",
    createNameName: "name",
    createNameLabel: "标签名称",
    createNameMessage: "标签名称不能为空",
    columnsItem: TagItem,
    columns: columns,
    searchRequest: TagListRequest,
    putRequest: TagPutRequest,
    createRequest: TagCreateRequest,
    deleteRequest: TagDeleteRequest,
    searchParamsReverse: SearchParamsReverse
  }

  return (
    <ProTableDesign {...props} />
  )
};
