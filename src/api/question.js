/*
  问卷调查的接口
*/
import fetch from 'utils/sagaCloudFetch'
import tools from 'utils/tools'
import { proxy } from 'api/config'
//模拟请求
export function mock() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, 1000);
  })
}
//添加调查问卷个人信息
export function addQuestionnaireUser({ userName, sex, age, address, post }) {
  let openId = tools.getCookie('openId')
  let data = {
    openId,
    userName,
    sex,
    age,
    address,
    post
  }
  return fetch({
    method: 'POST',
    url: `${proxy}/addQuestionnaireUser`,
    data
  })
}

//获取第一部分调查问卷内容 
export function getQuestionnaireList() {
  let openId = tools.getCookie('openId')
  let data = {}
  return fetch({
    method: 'POST',
    url: `${proxy}/getQuestionnaireList?openId=${openId}`,
    data
  })
}
//添加第一部分调查记录
export function addQuestionnaireList(data) {
  let openId = tools.getCookie('openId')
  return fetch({
    method: 'POST',
    url: `${proxy}/addQuestionnaireList?openId=${openId}`,
    data
  })
}
//--------------------------------------------------GET start
//获取调查问卷状态 1-进入userInfo ，2-进入part1，3-进入part2，,4-进入result
export function getQuestionnaireStatus(openId) {
  return fetch({
    method: 'GET',
    url: `${proxy}/getQuestionnaireStatus?openId=${openId}`,
  })
}
//第一部分调查结果report1
export function getQuestionnaireAnswer() {
  let sopenId = tools.getCookie('openId')
  return fetch({
    method: 'GET',
    url: `${proxy}/getQuestionnaireAnswer?openId=${sopenId}`,
  })
}
//第二部分查询记录
export function getSecQuestionnaireAnswer() {
  let openId = tools.getCookie('openId')
  return fetch({
    method: 'GET',
    url: `${proxy}/getSecQuestionnaireAnswer?openId=${openId}`,
  })
}
//--------------------------------------------------GET end
//第二部分添加记录
export function addSecQuestionnaireAnswer(data) {
  let openId = tools.getCookie('openId')
  return fetch({
    method: 'POST',
    url: `${proxy}/addSecQuestionnaireAnswer?openId=${openId}`,
    data
  })
}