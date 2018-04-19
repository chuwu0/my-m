import tools from 'utils/tools'
import {
  weChatConfig
} from 'api/global'
import { getAccessToken, getJsapiTicket, getUploadToken } from 'api/other'

const common = {
  state: {
    openId: '',
    access_token: '',
    jsapi_ticket: '',
    upload_token: ''
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      tools.setCookie('access_token', access_token)
    },
    SET_JSAPI_TICKET: (state, jsapi_ticket) => {
      state.jsapi_ticket = jsapi_ticket
      tools.setCookie('jsapi_ticket', jsapi_ticket)
    },
    SET_OPENID: (state, openId) => {
      state.openId = openId
      tools.setCookie('openId', openId)
    },
    SET_UPLOAD_TOKEN: (state, upload_token) => {
      state.upload_token = upload_token
      tools.setCookie('upload_token', upload_token)
    }
  },
  actions: {
    async SetCommon({ commit }, fullPath) {
      let { data: uploadToken } = await getUploadToken()
      if (uploadToken.result === 'success') {
        commit('SET_UPLOAD_TOKEN', uploadToken.upload_token)
      }
      let { data: accessToken } = await getAccessToken()
      if (accessToken.result === 'success') {
        commit('SET_ACCESS_TOKEN', accessToken.acesstoken)
      }

      let { data: jsApiTicket } = await getJsapiTicket()
      if (jsApiTicket.result === 'success') {
        //获取ticket
        commit('SET_JSAPI_TICKET', jsApiTicket.ticket)
          //利用当前的路径，获取权限
        weChatConfig(fullPath)
      }
    },
    SetOpenId: ({ commit }, openId) => {
      commit('SET_OPENID', openId)
    }
  }
}

export default common