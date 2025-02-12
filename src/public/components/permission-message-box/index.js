import { createApp } from 'vue'
import { platform } from '@/constants/env'
import permissionMessageBox from './temp.vue'

permissionMessageBox.show = (props, { confirmCallback, cancelCallback }) => {
  if (platform.isWeapp) {
    return
  }
  // 创建一个容器 并将其添加到body下面
  const containerBox = document.createElement('div')
  document.body.appendChild(containerBox)

  // 定义一个处理 确认删除操作 的函数
  function remove() {
    // 卸载实例
    DialogApp.unmount()
    // 卸载容器
    containerBox.remove()
  }

  function confirm() {
    if (confirmCallback) confirmCallback()
  }

  function cancel() {
    remove()
    if (cancelCallback) cancelCallback()
  }

  // 将函数放在props里传入组件中
  props.confirm = confirm
  props.cancel = cancel

  // 调用createApp方法来创建一个应用实例
  const DialogApp = createApp(permissionMessageBox, props)

  // 调用app.mount()方法 将DialogApp实例挂载创建的容器中来显示它
  DialogApp.mount(containerBox)

  return () => {
    remove()
  }
}

export default permissionMessageBox
