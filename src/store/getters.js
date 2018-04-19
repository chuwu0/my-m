import tools from 'utils/tools'
const getters = {
    openId: state => state.common.openId,
    access_token: state => state.common.access_token,
    jsapi_ticket: state => state.common.jsapi_ticket,
    upload_token: state => state.common.upload_token,
    buildingArr: state => state.repair.buildingArr,
    buildingMes: state => {
        let buildingMes = state.repair.buildingMes
        if (!buildingMes) {
            buildingMes = tools.getStorage('buildingMes')
        }
        return buildingMes
    },
    spaceArr: state => state.repair.spaceArr,
    spaceMes: state => state.repair.spaceMes,
    jobId: state => {
        let jobId = state.repair.jobId
        if (!jobId) {
            jobId = tools.getStorage('jobId')

        }
        return jobId
    },
}

export default getters
