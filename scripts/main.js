const path = require('path')
const data = require('./zip-data')
const utils = require('./utils')

const envData = data[process.env.NODE_ENV]

const TF_DATA = envData.TF_DATA
const VITE_WEB_BASE = process.env.VITE_WEB_BASE
const packageJSON = envData.packageJSON

const zipName = `h5-${process.env.VITE_VERSION}-${envData.name}.zip`
const currentFilePath = path.join(process.cwd(), '/dist/build')
const zipPath = `${currentFilePath}/${zipName}`
const h5Path = `${currentFilePath}/h5`
// 对应flutter app h5目录

async function packH5AndCreateMd5() {
  await utils.unlinkFile(zipPath)
  await utils.zipDirectory(h5Path, zipPath)
  const md5 = await utils.getFileMd5(zipPath)
  console.log(`生成md5: ${md5}`)
  packageJSON.packages[0].shasum = md5
  packageJSON.packages[0].url = `${VITE_WEB_BASE}/${zipName}`
}

async function getTfDataUpdatePackageJson() {
  await utils.getDdOfContentDeliveredInTheCurrentVersion(TF_DATA)
  await utils.updatePackageVersion(TF_DATA, packageJSON)
}

// 更新投放平台
async function updateTfItem() {
  await utils.updateTf(TF_DATA, packageJSON)
  await utils.publishTf(TF_DATA)
}

// 主函数
async function main(params) {
  try {
    await packH5AndCreateMd5()
    await getTfDataUpdatePackageJson()
    await utils.clearFlutterH5AndCopy(data.FLUTTER_PROJECT_H5_PATH, packageJSON, h5Path)
    await updateTfItem()
  } catch (err) {
    console.error('Error:', err)
  }
}
module.exports = {
  main,
}
