
## 使用规则

投放平台地址: ansible.chenbang-inc.cn

- 添加离线包投放(添加内容和规则,内容的名称请设置为版本号,VITE_VERSION)
- 离线包投放内容新增一个内容, 将名称修改成和app版本一致如 1.0.0,发布时会根据VITE_VERSION版本匹配这个名称更新对应的投放内容,后续添加版本命名规则也是一样

- 修改VITE_WEB_BASE 这个地址为放zip包的域名
- 修改 FLUTTER_PROJECT_H5_PATH(flutter项目本地址,可以为空)
- 在投放平台获取离线包的sceneId,把zip-data.json development或production 的sceneId ID之类的信息 替换掉

- 前往jenksin 发布

tips: 离线包的投放规则配置则根据app版本,返回不通版本内容即可

### zip-data.js 配置文件

#### 如果需要更换项目,修改 TF_DATA 的 sceneId、tenantCode

```javascript
  development: {
    // 离线包配置
    packageJSON: {
      packages: [
        {
          name: 'luckydraw-user',
          version: '1.1.6',
          url: 'https://luckymoney.yunzhuxue.com/h52.zip',
          shasum: 'd4230e93cd96f57cecac1616c28ddff7',
          mustBeUpdated: false,
        },
      ],
    },
    TF_DATA: {
      TOKEN: '60726e7c828e498ea5a6260ca797b059',
      ID: '', // 当前app版本投放内容的id 
      sceneId: 68, // 需要修改,当前项目离线包的sceneId
      tenantCode: 'ha.xinx.luckydraw.platform', // 需要修改,当前项目在投放平台的租户
    },
  },
  production: {
    // 离线包配置
    packageJSON: {
      packages: [
        {
          name: 'luckydraw-user',
          version: '1.0.1',
          url: 'https://luckymoney.yunzhuxue.com/h5.zip',
          shasum: '',
          mustBeUpdated: false,
        },
      ],
    },
    TF_DATA: {
      TOKEN: '0ba6abfa5a284578947e6559ce64f55f',
      ID: '', //当前app版本投放内容的id
      sceneId: 50, // 需要修改,当前项目离线包的sceneId
      tenantCode: 'ha.xinx.luckydraw.platform', // 需要修改,当前项目在投放平台的租户
    },
  },
}
```
