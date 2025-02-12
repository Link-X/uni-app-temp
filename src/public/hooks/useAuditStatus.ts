import { reactive } from 'vue'

import { asyncTaskDone } from '@/public/utils/methods'
import { getExclusiveConfig } from '@/service/global'

const { onReady, readyResolve } = asyncTaskDone()

const useAuditStatus = () => {
  const getStatus = async () => {
    const res = await getExclusiveConfig({
      code: 'xx',
    })
    const auditStatus = res.data === '1'
    readyResolve(auditStatus)
    return auditStatus
  }

  onLoad(() => {
    getStatus()
  })

  return {
    onAuditStatusReady: onReady,
  }
}

export default useAuditStatus
