import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import {getValue} from  '@/util/localStorage'
import router from '@/router'


const httpRequest = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// request interceptor
httpRequest.interceptors.request.use(
    config => {
    	// do something before request is sent
    	let token = getValue('token');
		if (token && config.url != '/captcha' && config.url != '/login/oauth/token') {
           config.headers['Authorization'] = token;
    	}
        
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
httpRequest.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        //处理下载
        const responseType = response.config.responseType
        if(responseType === "blob") {
            return response
        }
        const res = response.data
        //处理登录
		if(res.access_token) {
			return res
		} else if (res.code !== 200) {

            const msg = res.message || '系统错误，请稍后重试！'

		    if(res.code === 10000) {
		        return Promise.reject(msg)
            }

            Message({
                message: msg,
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//          if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//              MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//                  confirmButtonText: 'Re-Login',
//                  cancelButtonText: 'Cancel',
//                  type: 'warning'
//              }).then(() => {
//                  store.dispatch('user/resetToken').then(() => {
//                      location.reload()
//                  })
//              })
//          }
            return Promise.reject(msg)
        } else {
            return res
        }
    },
    error => {
        let msg = error.response.data.message || "系统错误，请稍后重试！"
        let httpStatus = error.response.status
        if(httpStatus === 404) {
            Message({
                message: "页面没有找到！",
                type: 'error',
                duration: 5 * 1000
            })
        } else if(httpStatus === 406) {
            Message({
                message: "暂无导出数据！",
                type: 'warning',
                duration: 5 * 1000
            })
        } else if(httpStatus === 401) {
            if(error.response.data.code === 1005) {
                router.push({path: '/index/reset-pwd'})
                return
            }

            router.push({path: '/login'})
            return
        } else {
            Message({
                message: msg,
                type: 'error',
                duration: 5 * 1000
            })
        }

        return Promise.reject(error)
    }
)

export default httpRequest