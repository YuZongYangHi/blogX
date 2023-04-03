import requests from '../../utils/request';

export async function ArticleCategoryListRequest() {
    return requests.get('/category/routers/');
}