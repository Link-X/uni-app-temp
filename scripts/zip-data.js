const data = {
  FLUTTER_PROJECT_H5_PATH: '/Users/xdb/Desktop/cb-code/xinxiang-nexus-app/assets/h5',
  development: {
    // 离线包配置
    name: 'test',
    packageJSON: {
      packages: [
        {
          name: 'smartxx',
          version: '1.0.0',
          url: 'https://smartxx.cbyzx.com/h5-1.0.0-test.zip',
          shasum: '03d7b57e646e4eb980774e32131fc5e3',
          mustBeUpdated: false,
        },
      ],
    },
    TF_DATA: {
      TOKEN: '03d7b57e646e4eb980774e32131fc5e3',
      ID: 255,
      sceneId: 79,
      tenantCode: 'ha.xinx.gov.smartxinx.platform',
    },
  },
  production: {
    // 离线包配置
    name: 'prod',
    packageJSON: {
      packages: [
        {
          name: 'smartxx',
          version: '1.0.0',
          url: 'https://smartxx.cbyzx.com/h5-1.0.0-prod.zip',
          shasum: '',
          mustBeUpdated: false,
        },
      ],
    },
    TF_DATA: {
      TOKEN: '0ba6abfa5a284578947e6559ce64f55f',
      ID: 136,
      sceneId: 50,
      tenantCode: 'ha.xinx.gov.smartxinx.platform',
    },
  },
}
module.exports = data
