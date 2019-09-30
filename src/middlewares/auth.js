import { getStorage } from '@/utils'
import { Message } from 'element-ui'

const Auth = ({ next, router }) => {
  if (!getStorage()) {
    Message({
      message: '登录已失效，请重新登录',
      type: 'error',
      onClose: () => {}
    })
    router.replace({ name: 'login' })
  }
  return next()
}

export default Auth
