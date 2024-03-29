import axios from  'axios'
import {baseUrl} from "../config/config";
import { createBrowserHistory } from 'history'
import {getLocalOrg, getLocalSys, getLocalUser} from "./StorageUtils";
const history = createBrowserHistory()


axios.defaults.withCredentials =true;

const instance=axios.create({
    withCredentials: true,
    baseURL:baseUrl,
    timeout: 5000,
});



// 添加请求拦截器
instance.interceptors.request.use(function (config) {


    config.withCredentials=true;
    let user=getLocalUser();
    if(user){
        config.headers.userId=user.id;
        config.headers.token=user.session.token;
    }
    let sys=getLocalSys();
    if(sys){
        config.headers.sysId=sys.id;
    }
    let org=getLocalOrg();
    if(org){
        config.headers.orgId=org.id;
    }
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {

    if(response.data.status=='3'){
        // notification.error({message:"系统提示",description:'用户身份过期，请重新登录'});
        localStorage.clear()
        history.push("/login")
        history.go();
    }
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance;