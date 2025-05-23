/**
 * 获取目标原始类型
 * @param target 任意类型
 * @returns {string} type 数据类型
 */
export function getType(target: unknown): string {
  // 得到原生类型
  const typeStr = Object.prototype.toString.call(target)
  // 拿到类型值
  const match = typeStr.match(/\[object (\w+)\]/)
  const type = match && match.length ? match[1].toLowerCase() : ''
  // 类型值转小写并返回
  return type
}
/**
 * 检查给定值是否为数组。
 * @param {any} value 要检查的值
 * @returns {boolean} 如果是数组则返回 true，否则返回 false
 */
export function isArray(value: any): value is Array<any> {
  // 如果 Array.isArray 函数可用，直接使用该函数检查
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value)
  }
  // 否则，使用对象原型的 toString 方法进行检查
  return Object.prototype.toString.call(value) === '[object Array]'
}

/**
 * 检查给定值是否为函数。
 * @param {any} value 要检查的值
 * @returns {boolean} 如果是函数则返回 true，否则返回 false
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction<T extends Function>(value: any): value is T {
  return getType(value) === 'function' || getType(value) === 'asyncfunction'
}

/**
 * 检查给定值是否为字符串。
 * @param {unknown} value 要检查的值
 * @returns {value is string} 如果是字符串则返回 true，否则返回 false
 */
export function isString(value: unknown): value is string {
  return getType(value) === 'string'
}

/**
 * @description 判断target是否对象
 * @param value
 * @return {boolean}
 */
export function isObj(value: any): value is object {
  return Object.prototype.toString.call(value) === '[object Object]' || typeof value === 'object'
}
/**
 * @description 检查值是否不为空
 * @param value 值
 * @return {Boolean} 是否不为空
 */
export const isDef = <T>(value: T): value is NonNullable<T> => value !== undefined && value !== null

/**
 * 检查给定值是否为 Promise 对象。
 * @param {unknown} value 要检查的值
 * @returns {value is Promise<any>} 如果是 Promise 对象则返回 true，否则返回 false
 */
export function isPromise(value: unknown): value is Promise<any> {
  // 先将 value 断言为 object 类型
  if (isObj(value) && isDef(value)) {
    // 然后进一步检查 value 是否具有 then 和 catch 方法，并且它们是函数类型
    return isFunction((value as Promise<any>).then) && isFunction((value as Promise<any>).catch)
  }
  return false // 如果 value 不是对象类型，则肯定不是 Promise
}

/**
 * 将驼峰命名转换为短横线命名。
 * @param {string} word 待转换的词条
 * @returns {string} 转换后的结果
 */
export function kebabCase(word: string): string {
  // 使用正则表达式匹配所有大写字母，并在前面加上短横线，然后转换为小写
  const newWord: string = word
    .replace(/[A-Z]/g, function (match) {
      return '-' + match
    })
    .toLowerCase()

  return newWord
}

/**
 * 否是数值
 * @param {*} value
 */
export function isNumber(value: any): value is number {
  return getType(value) === 'number'
}
/**
 * 将外部传入的样式格式化为可读的 CSS 样式。
 * @param {object | object[]} styles 外部传入的样式对象或数组
 * @returns {string} 格式化后的 CSS 样式字符串
 */
export function objToStyle(styles: Record<string, any> | Record<string, any>[]): string {
  // 如果 styles 是数组类型
  if (isArray(styles)) {
    // 使用过滤函数去除空值和 null 值的元素
    // 对每个非空元素递归调用 objToStyle，然后通过分号连接
    const result = styles
      .filter(function (item) {
        return item != null && item !== ''
      })
      .map(function (item) {
        return objToStyle(item)
      })
      .join(';')

    // 如果结果不为空，确保末尾有分号
    return result ? (result.endsWith(';') ? result : result + ';') : ''
  }

  if (isString(styles)) {
    // 如果是字符串且不为空，确保末尾有分号
    return styles ? (styles.endsWith(';') ? styles : styles + ';') : ''
  }

  // 如果 styles 是对象类型
  if (isObj(styles)) {
    // 使用 Object.keys 获取所有属性名
    // 使用过滤函数去除值为 null 或空字符串的属性
    // 对每个属性名和属性值进行格式化，通过分号连接
    const result = Object.keys(styles)
      .filter(function (key) {
        return styles[key] != null && styles[key] !== ''
      })
      .map(function (key) {
        // 使用 kebabCase 函数将属性名转换为 kebab-case 格式
        // 将属性名和属性值格式化为 CSS 样式的键值对
        return [kebabCase(key), styles[key]].join(':')
      })
      .join(';')

    // 如果结果不为空，确保末尾有分号
    return result ? (result.endsWith(';') ? result : result + ';') : ''
  }
  // 如果 styles 不是对象也不是数组，则直接返回
  return ''
}
export function addUnit(num: number | string) {
  return Number.isNaN(Number(num)) ? `${num}` : `${num}px`
}
