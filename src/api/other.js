import fetch from 'utils/sagaCloudFetch'
import { proxy } from 'api/config'


//获取access_token
export function getAccessToken() {
  let data = {}
  return fetch({
    method: 'POST',
    url: `${proxy}/accesstoken`,
    data
  })
}

//获取jsapi_ticket
export function getJsapiTicket() {
  let data = {}
  return fetch({
    method: 'POST',
    url: `${proxy}/getTicket`,
    data
  })
}

//七牛获取uploadToken
export function getUploadToken() {
  let data = {}
  return fetch({
    method: 'POST',
    url: `${proxy}/getUploadToken`,
    data
  })
}