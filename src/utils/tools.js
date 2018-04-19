import Cookies from 'js-cookie'
// import qiniu from 'qiniu'
import router from '../router'

const tools = {}

tools.queryString = search => {
  let rstObj = {}
  if (!!search) {
    let searchArr = search.substr(1).split('&')
    searchArr.forEach(each => {
      let item = each.split('=')
      rstObj[item[0]] = item[1]
    })
  }
  return rstObj
}

tools.goBeforeLoginUrl = () => {
  let url = tools.getCookie('beforeLoginUrl')
  if (!url || url.indexOf('/author') > -1) {
    router.push({ path: '/' })
  } else {
    router.push({ path: url })
    tools.setCookie('beforeLoginUrl', '')
  }
}

tools.getCookie = (key) => {
  const reg = /^\[|\]$/g
  let rst = Cookies.get(key)
  if (reg.test(rst)) {
    return JSON.parse(rst)
  } else {
    return rst
  }
}

tools.setCookie = (key, val) => {
  if (typeof val === 'string') {
    Cookies.set(key, val)
  } else {
    Cookies.set(key, JSON.stringify(val))
  }
}

tools.rmCookie = (key) => {
  Cookies.remove(key);
}

tools.getStorage = (key) => {
  const re = /^\[|\{|\}|\]$/g //判断字符中是否有[]{}
  let getIt = localStorage.getItem(key)
  if (re.test(getIt)) {
    return JSON.parse(getIt)
  } else {
    return getIt
  }
}

tools.rmStorage = (key) => {
  localStorage.removeItem(key);
}

tools.setStorage = (key, val) => {
  if (typeof val == 'string') {
    //如果传过来的是字符串，那么说明要保存的是id
    localStorage.setItem(key, val)
  } else {
    //如果传过来的不是字符串，要保存数组
    localStorage.setItem(key, JSON.stringify(val))
  }
}
tools.verifyPhone = (val) => {
  const re = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
  return re.test(val) ? val : false
}
tools.getDates = (times) => {
  if (times) {
    let thatTime = new Date(Number(times))
    let add0 = tools.add0
    return thatTime.getFullYear() + '.' + add0(thatTime.getMonth() + 1) + '.' + add0(thatTime.getDate()) + ' ' + add0(thatTime.getHours()) + ':' + add0(thatTime.getMinutes()) + ':' + add0(thatTime.getSeconds())
  } else {
    return 0
  }

}
tools.add0 = num => {
  return num < 10 ? ("0" + num) : ("" + num)
}

tools.getQueryString = name => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

//根据坐标计算两点距离(单位M,一般需求够用)
tools.getGreatCircleDistance = (lat1, lng1, lat2, lng2) => {
  const EARTH_RADIUS = 6378137.0 //单位M
  const PI = Math.PI
  let getRad = d => d * PI / 180

  let radLat1 = getRad(lat1)
  let radLat2 = getRad(lat2)

  let a = radLat1 - radLat2
  let b = getRad(lng1) - getRad(lng2)

  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * EARTH_RADIUS
  s = Math.round(s * 10000) / 10000.0

  return s
}

tools.cgetDistance = function(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  //s=s.toFixed(4);
  function Rad(d) {
    return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
  }
  return s;
}

//根据坐标计算两点距离(单位M,修正公式)
tools.getDistance = (lat1, lng1, lat2, lng2) => {
  const EARTH_RADIUS = 6378137.0 //单位M
  const PI = Math.PI
  let getRad = d => d * PI / 180

  let f = getRad((lat1 + lat2) / 2)
  let g = getRad((lat1 - lat2) / 2)
  let l = getRad((lng1 - lng2) / 2)

  let sg = Math.sin(g)
  let sl = Math.sin(l)
  let sf = Math.sin(f)

  let s, c, w, r, d, h1, h2
  let a = EARTH_RADIUS
  let fl = 1 / 298.257

  sg = sg * sg
  sl = sl * sl
  sf = sf * sf

  s = sg * (1 - sl) + (1 - sf) * sl
  c = (1 - sg) * (1 - sl) + sf * sl

  w = Math.atan(Math.sqrt(s / c))
  r = Math.sqrt(s * c) / w
  d = 2 * w * a
  h1 = (3 * r - 1) / 2 / c
  h2 = (3 * r + 1) / 2 / s

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
}

//七牛获取uploadToken
// tools.getUploadToken = () => {
//     const accessKey = 'PviQR6h2gQ7O2CW4l7L2SfwtZHATi6fdWooc5qyI'
//     const secretKey = 'utyHxciZexS20sTWsWj_vRB_yztHafks7eKkiUBn'
//     let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
//     let options = {
//         scope: 'sgagcloud-uber',
//         expires: 7200
//     }
//     let putPolicy = new qiniu.rs.PutPolicy(options)
//     let uploadToken = putPolicy.uploadToken(mac)
//     return uploadToken
// }

//七牛base64编码图片上传
tools.putb64 = (uploadToken, picBase) => {
  return new Promise((resolve, reject) => {
    //通过base64编码字符流计算文件流大小
    try {
      let getFileSize = (str) => {
        let indexOf = str.indexOf('=')
        if (indexOf > 0) {
          str = str.substring(0, indexOf)
        }
        let fsize = parseInt(str.length - (str.length / 8) * 2)
        return fsize
      }
      picBase = picBase.substring(22)
      let fsize = getFileSize(picBase)
      let url = `http://upload-z1.qiniu.com/putb64/-1`
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
          let status = xhr.status
          if (status >= 200 && status < 300) {
            let keyText = eval(`(${xhr.responseText})`)
            let picUrl = `http://on90fbix8.bkt.clouddn.com/${keyText.key}`
            resolve(picUrl)
          } else {
            reject(status)
          }
        }
      }
      xhr.open('POST', url, true)
      xhr.setRequestHeader('Content-Type', 'application/octet-stream')
      xhr.setRequestHeader('Authorization', `UpToken ${uploadToken}`)
      xhr.send(picBase)
    } catch (err) {
      reject(err)
    }
  })
}

//获取图片链接
tools.formatDate=time=>{
  return `${time.substring(0,4)}.${time.substring(4,6)}.${time.substring(6,8)} ${time.substring(8,10)}:${time.substring(10,12)}:${time.substring(12,14)}`
}
export default tools