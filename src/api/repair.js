import fetch from 'utils/sagaCloudFetch'
import tools from 'utils/tools'
import { api, sass, img, physics } from 'api/config'


//获取label标签内容
export function getEquipmentLabel(
    code
) {
    return fetch({ method: 'GET', url: `${physics}/data-platform-2/infocode/query_property?type=${code}` })
}
//获取value内容
export function getEquipmentValue(
    FmId,
    projectId,
    secret
) {
    let data = {
        "criterias": [
            { "id": FmId }
        ]
    }
    return fetch({ method: 'POST', url: `${physics}/data-platform-2/property/id_query?projectId=${projectId}&secret=${secret}`, data })
}