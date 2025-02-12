import flutterApi from '@/public/utils/flutter-join'
import { gdMpKey } from '@/constants/config.json'

type getLocationProps = {
  type: 'gcj02'
  geocode: boolean
  locationTip?: string
}

type locationType = {
  latitude?: number
  longitude?: number
  cityCode?: number
  city?: string
  street?: string
  adCode?: number
  district?: string
  province?: string
}
export interface locationResultType {
  result: {
    location: {
      lat: number
      lng: number
    }
    address_component: {
      city: string
      province: string
      district: string
      street: string
    }
    ad_info: {
      adcode: string
    }
  }
}

class GetLocation {
  initData = {
    lat: undefined,
    lng: undefined,
    adCode: undefined,
    city: '',
  }

  constructor(props: {
    defaultData: {
      lat: number
      lng: number
      adCode: string
      city: string
    }
  }) {
    this.initData = props.defaultData
  }

  async getLocation(): Promise<locationType> {
    try {
      const res: locationType = await flutterApi.getLocation()
      return res || {}
    } catch (err) {
      console.error('Error getting location:', err)
      // 直接使用 reject 而不是 return Promise.reject
      return Promise.reject(err)
    }
  }

  hasLatitude(res) {
    const { latitude, longitude } = res || {}
    const latitudeVal = +latitude
    return latitudeVal && latitudeVal !== -1
  }

  loopGetLocation(): Promise<locationType> {
    let interval: number
    let timeout: number
    let locationData: locationType = {
      longitude: undefined,
      latitude: undefined,
      cityCode: undefined,
    }
    const clearTime = () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
    return new Promise(async (resolve, reject) => {
      locationData = await this.getLocation()
      if (this.hasLatitude(locationData)) {
        resolve(locationData)
        return
      }
      interval = setInterval(async () => {
        locationData = await this.getLocation()
        if (this.hasLatitude(locationData)) {
          resolve(locationData)
          clearTime()
        }
      }, 300)
      timeout = setTimeout(() => {
        if (this.hasLatitude(locationData)) {
          resolve(locationData)
          clearTime()
          return
        }
        reject(new Error('获取定位失败'))
        clearTime()
      }, 6000)
    })
  }

  async getAddressByCoordinates(lat: number, lng: number): Promise<locationResultType> {
    const apiUrl = `https://restapi.amap.com/v3/geocode/regeo?key=${gdMpKey}&location=${lng},${lat}`
    try {
      const response = await fetch(apiUrl)
      const res = await response.json()
      if (res.status === '1') {
        // eslint-disable-next-line
        const { formatted_address, addressComponent } = res.regeocode
        const { adcode, streetNumber, province, city } = addressComponent
        const array = streetNumber.location.split(',')
        const data = {
          result: {
            location: {
              lat: +array[1],
              lng: +array[0],
            },
            address_component: {
              city: city || province,
              province,
              // eslint-disable-next-line
              district: formatted_address,
              street: '',
            },
            ad_info: {
              adcode,
            },
          },
        }
        return data
      }
      throw res
    } catch (error) {
      console.error('Error fetching address by coordinates:', error)
      return Promise.reject(error)
    }
  }

  async getLocationData(data: getLocationProps): Promise<locationResultType> {
    try {
      const locationPermissionStatus = await flutterApi.getLocationPermissionStatus(data)
      if (locationPermissionStatus.hasLocationPermission) {
        await flutterApi.resetLocation()
      }
      const res = await this.loopGetLocation()
      /** ios 只返回经纬度 不返回其他信息。这里需要调用一下高德的 webapi 服务,获取其他信息 */
      if (!res?.adCode && res.latitude && res.longitude) {
        const GDWebServerData = await this.getAddressByCoordinates(res.latitude, res.longitude)
        return GDWebServerData
      }
      return {
        result: {
          location: {
            lat: res.adCode ? res.latitude : this.initData.lat,
            lng: res.adCode ? res.longitude : this.initData.lng,
          },
          address_component: {
            city: res.city || this.initData.city,
            province: res.province || '',
            district: res.district || '',
            street: res.street || '',
          },
          ad_info: {
            adcode: res.adCode || this.initData.adCode,
          },
        },
      }
    } catch (err) {
      console.error('Error getting location data:', err)
      return Promise.reject(err)
    } finally {
      // 可以在这里添加一些资源释放或清理操作
    }
  }
}

export default GetLocation
