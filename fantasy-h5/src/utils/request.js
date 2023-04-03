import axios from 'axios';

// baseURL
export const BaseURL = 'https://igolang.cn/api/v1/public';
//export const BaseURL = 'http://localhost:8001/api/v1/public';

//前端请求默认超时时间
const Timeout = 10000;

//数据类型
const DataType = 'JSONP';

//定义新的实例, 添加后台的auth头
const requests = axios.create({
    baseURL: BaseURL,
    timeout: Timeout,
    dataType: DataType,
});

requests.interceptors.request.use(
    function(config) {
        return config;
    },

    function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 添加响应拦截器
requests.interceptors.response.use(
    function(response) {
        // 对响应数据做点什么
        return response.data;
    },
    function(error) {
        // 对响应错误做点什么
        return Promise.reject(error.response);
    }
);

export default requests;