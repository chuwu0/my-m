import {
	getQuestionnaireStatus
} from 'api/question'
import tools from 'utils/tools'
export function questionsurvey(to, from, next) {
	let openId = tools.getCookie('openId')
	if(!!openId) {
		getQuestionnaireStatus(openId).then(res => {
			let status = res.data.status
			console.log('当前问卷调查进度：' + status)
			if(!status || status == undefined || status == 1) {
				next('/questionsurvey/introduce')
			} else if(status == 2) {
				next('/questionsurvey/firstpart')
			} else if(status == 3) {
				next('/questionsurvey/secondpart')
			} else if(status == 4) {
				next('/questionsurvey/questionresult')
			}
		})
	}else{
		console.log('openId不存在')
		next()
	}
}
