import { ACCESS_TOKEN, EXPIRE_TIME } from './constants'

/**
 *  获取localStorage中的值
 * @param key 键值
 * @param day 有效时间
 */
export const getStorage = (
  key = ACCESS_TOKEN,
  day = EXPIRE_TIME
) => {
  const dateStr = localStorage.getItem(key);
  if (!dateStr) {
    return null
  }
  const obj = JSON.parse(dateStr);
  if (new Date().getTime() - Number(obj.date) > 86400000 * day) {
    removeStorage(key);
    return null
  }
  return obj.value
}

/**
 *  存储值
 * @param value 值
 * @param key 键名，默认为ACCESS_TOKEN所指示的值
 */
export const setStorage = (value, key = ACCESS_TOKEN) => {
  const params = {
    date: new Date().getTime(),
    value
  }
  localStorage.setItem(key, JSON.stringify(params))
}

/**
 *  移除localStorage中的值
 * @param key
 */
export const removeStorage = (key = ACCESS_TOKEN) => {
  localStorage.removeItem(key)
}

/**
 * 清空localStorage中的值
 */
export const clearStorage = () => {
  localStorage.clear()
}


// 路由懒加载
export const loadView = (view) => {
  return () => import(`@views/${view}`)
}

export const nextFactory = (ctx, middleware, index) => {
  const currMiddleware = middleware[index]
  if (!currMiddleware) {
    return ctx.next
  }
  return (...params) => {
    ctx.next(...params)
    const nextMiddleware = nextFactory(ctx, middleware, index + 1)
    currMiddleware({ ...ctx, next: nextMiddleware })
  }
}

export const nextHandlar = (
  to,
  from,
  next,
  router
) => {
  let middleware = to.meta.middleware
  if (!middleware) {
    return next()
  }
  middleware = Array.isArray(middleware) ? middleware : [middleware]
  const ctx = { to, from, next, router }
  const nextMiddleware = nextFactory(ctx, middleware, 1)
  return middleware[0]({ ...ctx, next: nextMiddleware })
}
