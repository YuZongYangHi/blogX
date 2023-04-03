import type { ProColumns } from '@ant-design/pro-table';

// @ts-ignore
import { SearchParamsReverse} from './typing';
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import  {CategoryItem}  from './typing'
import {CategoryListRequest, CategoryPutRequest,
  CategoryCreateRequest, CategoryDeleteRequest
} from '@/services/category'
import ProTableDesign from '@/components/ProTableCustom'


const columns: ProColumns<CategoryItem>[] = [

  {
    title: '分类名称',
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
    createModalTitle: "创建分类",
    createNameName: "name",
    createNameLabel: "分类名称",
    createNameMessage: "分类名称不能为空",
    columnsItem: CategoryItem,
    columns: columns,
    searchRequest: CategoryListRequest,
    putRequest: CategoryPutRequest,
    createRequest: CategoryCreateRequest,
    deleteRequest: CategoryDeleteRequest,
    searchParamsReverse: SearchParamsReverse
  }

  return (
    <ProTableDesign {...props} />
  )
};
