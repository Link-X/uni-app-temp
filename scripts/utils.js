const fs = require('fs-extra')
const path = require('path')
const archiver = require('archiver')
const crypto = require('crypto')
const { pipeline } = require('stream')
const { promisify } = require('util')
const fetch = require('node-fetch')

// 检查文件是否存在
function checkFileExistsSync(filePath) {
  return fs.existsSync(filePath)
}

// 删除文件
async function unlinkFile(path) {
  if (checkFileExistsSync(path)) {
    try {
      await fs.unlink(path)
      console.log('删除上一次h5.zip')
    } catch (err) {
      console.error(`删除文件 ${path} 时出错:`, err)
    }
  }
}

// 计算文件的 MD5 哈希值
async function getFileMd5(filePath) {
  const hash = crypto.createHash('md5')
  const pipelinePromise = promisify(pipeline)
  await pipelinePromise(fs.createReadStream(filePath), hash)
  return hash.digest('hex')
}

// 清空文件夹
async function emptyFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    const files = await fs.readdir(folderPath)
    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const stat = await fs.lstat(filePath)
      if (stat.isDirectory()) {
        await emptyFolder(filePath)
        await fs.rmdir(filePath)
      } else {
        await fs.unlink(filePath)
      }
    }
  }
}

// 压缩目录
async function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } })
    const stream = fs.createWriteStream(outPath)

    archive.directory(sourceDir, 'h5')
    archive.pipe(stream)

    archive.on('error', (err) => reject(err))
    stream.on('close', () => {
      console.log('zip 打包完成')
      resolve()
    })

    archive.finalize()
  })
}

// 复制文件夹
async function copyFolder(src, dest) {
  try {
    await fs.copy(src, dest)
    console.log('文件夹复制成功')
  } catch (err) {
    console.error('文件夹复制失败:', err)
  }
}

// 发布到投放平台
async function publishTf(TF_DATA) {
  const header = {
    'cg-ac': 'cityxxconsole',
    'cg-ts': new Date().getTime(),
    token: TF_DATA.TOKEN,
  }
  const body = JSON.stringify({
    contentId: TF_DATA.ID,
    tenantCode: TF_DATA.tenantCode,
  })
  const response = await fetch(`${process.env.VITE_TF_BASE}/livelihood/distri/content/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8', ...header },
    body,
  })
  const json = await response.json()
  console.log('投放离线包发布完成', json)
  console.log('请求数据:', body)
}

// 更新投放平台
async function updateTf(TF_DATA, packageJSON) {
  const data = {
    content: JSON.stringify([packageJSON]),
    id: TF_DATA.ID,
    statusDesc: '已发布',
    tenantCode: TF_DATA.tenantCode,
    validDesc: '是',
  }
  const header = {
    'cg-ac': 'cityxxconsole',
    'cg-ts': new Date().getTime(),
    token: TF_DATA.TOKEN,
    'Content-Type': 'application/json;charset=utf-8',
  }
  const response = await fetch(`${process.env.VITE_TF_BASE}/livelihood/distri/content/update`, {
    method: 'POST',
    headers: { ...header },
    body: JSON.stringify(data),
  })
  const json = await response.json()
  console.log('投放离线包更新完成', json)
  console.log(`请求数据${JSON.stringify(data)}`)
}

async function getDdOfContentDeliveredInTheCurrentVersion(TF_DATA) {
  const data = {
    deleted: 1,
    pageNumber: 1,
    pageSize: 20,
    sceneId: TF_DATA.sceneId,
    tenantCode: TF_DATA.tenantCode,
  }
  const header = {
    'cg-ac': 'cityxxconsole',
    'cg-ts': new Date().getTime(),
    token: TF_DATA.TOKEN,
    'Content-Type': 'application/json;charset=utf-8',
  }
  const response = await fetch(`${process.env.VITE_TF_BASE}/livelihood/distri/content/list`, {
    method: 'POST',
    headers: { ...header },
    body: JSON.stringify(data),
  })
  const json = await response.json()
  if (json.code === 0) {
    const currentVersionItem = (json?.data?.list || []).find((v) =>
      v.name.includes(process.env.VITE_VERSION),
    )
    if (currentVersionItem) {
      TF_DATA.ID = currentVersionItem.id
      console.log(`找到版本${process.env.VITE_VERSION}: id为:${currentVersionItem.id}`)
      return TF_DATA
    }
    console.log(`未找到${process.env.VITE_VERSION}投放内容,使用默认id${TF_DATA.ID}`)
    return TF_DATA.ID
  }
  console.log(`未找到${process.env.VITE_VERSION}投放内容,使用默认id${TF_DATA.ID}`)
  return TF_DATA.ID
}

async function updatePackageVersion(TF_DATA, packageJSON) {
  const header = {
    'cg-ac': 'cityxxconsole',
    'cg-ts': new Date().getTime(),
    token: TF_DATA.TOKEN,
    'Content-Type': 'application/json;charset=utf-8',
  }
  const localVersion = packageJSON.packages[0].version
  try {
    const response = await fetch(`${process.env.VITE_TF_BASE}/livelihood/distri/content/get`, {
      method: 'POST',
      headers: { ...header },
      body: JSON.stringify({
        contentId: TF_DATA.ID,
        tenantCode: TF_DATA.tenantCode,
      }),
    })
    const json = await response.json()
    const data = JSON.parse(json?.data?.content || '[]')
    if (data && data[0]) {
      const newVersion = versionAdd(data[0].packages[0].version)
      packageJSON.packages[0].version = newVersion
      console.log(`使用远程版本号${newVersion}`)
      return newVersion
    }
    console.log(`使用本地本地版本号${localVersion}`)
    console.log(`远程数据${data}`)
    return packageJSON.packages[0].version
  } catch (err) {
    console.log(err)
    console.log(`error:使用本地本地版本号${localVersion}`)
    return packageJSON.packages[0].version
  }
}

function versionAdd(value) {
  let versionItems = value
    .split('.')
    .map((item) => parseInt(item))
    .reverse()
  if (versionItems[0] + 1 >= 10) {
    versionItems[0] = 0
    if (versionItems[1] + 1 >= 10) {
      versionItems[1] = 0
      versionItems[2] += 1
    } else {
      versionItems[1] += 1
    }
  } else {
    versionItems[0] += 1
  }
  versionItems = versionItems.reverse()
  return versionItems.join('.')
}

// 清空 Flutter H5 目录并复制文件，写入 package.json
async function clearFlutterH5AndCopy(FLUTTER_PROJECT_H5_PATH, packageJSON, h5Path) {
  if (!checkFileExistsSync(FLUTTER_PROJECT_H5_PATH)) return
  await emptyFolder(FLUTTER_PROJECT_H5_PATH)
  console.log('flutter 清空完成 h5项目文件')
  await copyFolder(h5Path, FLUTTER_PROJECT_H5_PATH)
  console.log('flutter 拷贝完成 h5项目文件')
  await fs.writeFile(
    `${FLUTTER_PROJECT_H5_PATH}/packages.json`,
    JSON.stringify(packageJSON, null, 4),
  )
  console.log('flutter package.json 写入成功')
  return packageJSON
}

module.exports = {
  checkFileExistsSync,
  unlinkFile,
  getFileMd5,
  emptyFolder,
  zipDirectory,
  copyFolder,
  publishTf,
  updateTf,
  clearFlutterH5AndCopy,
  updatePackageVersion,
  versionAdd,
  getDdOfContentDeliveredInTheCurrentVersion,
}
