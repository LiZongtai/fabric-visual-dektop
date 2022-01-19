/**
 * 网络请求配置
 */
import axios from "axios";


const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZXhwbG9yZXJhZG1pbiIsIm5ldHdvcmsiOiJ0ZXN0LW5ldHdvcmsiLCJpYXQiOjE2NDI1Mjg5NjYsImV4cCI6MTY0MjUzNjE2Nn0.qe_5Tni3e_pwd8gfiXG5iBdbgNV72n0ZgfBtNbIv05M";
localStorage.setItem("token",token);
axios.defaults.timeout = 100000;
axios.defaults.baseURL = "http://127.0.0.1:8081";
// axios.interceptors.request.use(
//     config => {
//       if (token) {  
//         // 判断是否存在token，如果存在的话，则每个http header都加上token
//         config.headers.Authorization =`Bearer ${token}`; // 根据实际情况自行修改
//       }
//       return config;
//     },
//     err => {
//       return Promise.reject(err);
//     }
//   );
/**
 * http request 拦截器
 */
// axios.interceptors.request.use(
//     (config) => {
//         config.data = JSON.stringify(config.data);
//         config.headers = {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         };
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

/**
 * 封装Axios的各种请求
 * @param method
 * @param url
 * @param data
 * @returns {Promise<unknown>}
 */
export function request(method, url, params = {}) {
    return new Promise((resolve, reject) => {
        let data = {};
        if (method === 'GET') {
            data = {params};
        } else {
            data = {data: params};
        }
        axios({
            method,
            url,
            ...data
        }).then((response) => {
            resolve(response.data);
        }, (error) => {
            reject(error);
        })
    })
}
