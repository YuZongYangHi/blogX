import requests from '../../utils/request';

export async function ArticleTopListRequest() {
    return requests.get('/article/topList/');
}

export async function ArticleListRequest(category) {
    const params = {
        filter: `category__name=${category}`,
        pageSize: 10000
    }
    return requests.get('/article/list/', {
        params: params
    });
}


export async function ArticleDetailRequest(articleId) {
    return requests.get(`/article/detail/${articleId}/`);
}