import router from '@router/index'
import AxiosInstance from 'axios'
import { Loading, Message } from 'element-ui'

import { getStorage } from '@utils/index'

const qs = require('qs')
// 普通错误码
const ERRORS = {
  666: '请求超时',
  888: '请求已取消'
}
// 权限错误码
const AUTH_ERRORS = {}

let loadingInstance // loading对象
// 显示loading
const showLoading = () => {
  loadingInstance = Loading.service({ fullscreen: true })
}
// 隐藏loading
const hideLoading = () => {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

// 错误处理
const handlerError = error => {
  // 权限错误
  if (AUTH_ERRORS[error.code]) {
    Message({
      message: AUTH_ERRORS[error.code],
      type: 'error',
      onClose: () => {}
    })
    router.replace('/login')
    return
  }
  if (ERRORS[error.code]) {
    return Message({
      message: ERRORS[error.code],
      type: 'error',
      onClose: () => {}
    })
  }
  if (error.message) {
    return Message({
      message: error.message,
      type: 'error',
      onClose: () => {}
    })
  }
}

// token拦截器
const tokenInterceptor = config => {
  const token = getStorage()
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    }
  }
  return config
}

// 格式化参数拦截器
const paramsInterceptor = config => {
  config.paramsSerializer = params => {
    return qs.stringify(params, {
      arrayFormat: 'brackets',
      encode: false
    })
  }
  return config
}

// 显示loading拦截器
const loadingInterceptor = config => {
  showLoading()
  return config
}

// 创建axios实例
const createInstance = (
  options = { showLoading: false, hideLoading: true },
  config = {}
) => {
  // 默认配置
  const defaultConfig = {
    baseURL:
      process.env.NODE_ENV === 'production'
        ? process.env.VUE_APP_BASE_API
        : '/api',
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
      // 'X-Requested-With': 'XMLHttpRequest',
      // Authorization: `Bearer ${localStorage.getItem('token')}`,
      // post: {
      //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      // }
    },
    ...config
  }

  const httpClient = AxiosInstance.create(defaultConfig)

  httpClient.interceptors.request.use(tokenInterceptor)
  httpClient.interceptors.request.use(paramsInterceptor)

  if (options.showLoading) {
    httpClient.interceptors.request.use(loadingInterceptor)
  }

  httpClient.interceptors.response.use(
    res => {
      if (options.hideLoading) {
        hideLoading()
      }
      if (!res.data) {
        return res
      }
      if (res.data.code !== '0000') {
        // 如果code码不符合，则进入拦截层
        handlerError(res.data)
        return Promise.reject(res.data)
      }
      return res.data.data ? res.data.data : res.data
    },
    err => {
      if (options.hideLoading) {
        hideLoading()
      }

      if (AxiosInstance.isCancel(err)) {
        // 请求已取消
        handlerError({
          code: '888'
        })
        return Promise.reject('REQUEST_CANCELED')
      }
      if (err.message.includes('timeout')) {
        // 请求超时
        handlerError({
          code: '666'
        })
        return Promise.reject('REQUEST_TIMEOUT')
      }
      const { status, statusText, data, headers, request } = err.response
      // 这里拦截错误根据自己情况进行修改
      handlerError(data)
      return Promise.reject(err.response)
    }
  )

  return httpClient
}

// 无loading实例
export const axios = createInstance()
// 有Loading实例
export const axiosLoading = createInstance({
  showLoading: true,
  hideLoading: true
})
// 获取实例方法
export const getAxios = createInstance
export default axios
