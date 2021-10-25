import axios from 'axios';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//进行请求拦截
axios.interceptors.request.use(config => {
    NProgress.start();
    if (window.sessionStorage.getItem('token')) {
        config.headers.Authorization = window.sessionStorage.getItem('token');
    }
    return config   //此时拦截到的为请求配置
}, err => {
    // console.error(err)
})

//进行响应拦截
axios.interceptors.response.use(res => {
    NProgress.done();
    return res.data  //此时拦截到的为数据

}, err => {
    // console.error(err)
})