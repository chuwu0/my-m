import tools from 'utils/tools'
import { getBuildingArr, getRepairPlaceArr } from 'api/repair'

const repair = {
  state: {
    buildingArr: [],
    buildingMes: null,
    spaceArr: [],
    spaceMes: null,
    jobId: 0
  },
  mutations: {
    SAVE_BUILDING_ARR: (state, arr) => {
      state.buildingArr = arr
    },
    SAVE_BUILDING_MES: (state, obj) => {
      state.buildingMes = obj
      tools.setStorage('buildingMes', obj)
    },
    SAVE_SPACE_ARR: (state, arr) => {
      state.spaceArr = arr
    },
    SAVE_SPACE_MES: (state, obj) => {
      state.spaceMes = obj
    },
    SAVE_JOB_ID: (state, id) => {
      state.jobId = id
      tools.setStorage('jobId', id)
    }
  },
  actions: {
    SaveBuildingArr: ({
      commit
    }, arr) => {
      commit('SAVE_BUILDING_ARR', arr)
    },
    SaveBuildingMes: ({
      commit
    }, obj) => {
      commit('SAVE_BUILDING_MES', obj)
    },
    GetRepairPlaceArr: ({
      commit
    }, id) => {
      return new Promise((resolve, reject) => {
        //id是projectId
        getRepairPlaceArr(id).then(res => {
          let rstObj = {
              renderArr: [],
              repairType: 'place',
              left: '楼层',
              right: '地点'
            }
            //在dialog页，用repairType作为区分要渲染的东西
          if (!!res.data && !!res.data.Content && res.data.Content.length > 0 && res.data.result == "success") {
            let renderArr = res.data.Content.map(item => {
              return {
                id: item.id,
                name: item.name,
                child: item.space
              }
            })
            rstObj.renderArr = renderArr
            commit('SAVE_SPACE_ARR', renderArr)
          }
          resolve(rstObj)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SaveSpaceMes: ({
      commit
    }, obj) => {
      commit('SAVE_SPACE_MES', obj)
    },
    SelectBuildingAndRepair: ({
      commit
    }, obj) => {
      console.log('params:' + JSON.stringify(obj))
      return new Promise((resolve, reject) => {
        getBuildingArr().then(res => { //获取建筑列表
          let buildingArr = res.data.Content
          commit('SAVE_BUILDING_ARR', buildingArr)
            // state.buildingArr = buildingArr
          let selectedBuildArr = buildingArr.filter(eachBuild => {
            //链接中保存的projectId与建筑列表比对
            return eachBuild.id == obj.projectId
          })
          if (selectedBuildArr.length > 0) {
            let buildingMes = selectedBuildArr[0]
              // state.buildingMes = buildingMes
            commit('SAVE_BUILDING_MES', buildingMes)
            getRepairPlaceArr(buildingMes.id).then(res => {
              //在dialog页，用repairType作为区分要渲染的东西
              if (!!res.data && !!res.data.Content && res.data.Content.length > 0 && res.data.result == "success") {
                let renderArr = res.data.Content.map(item => {
                  return {
                    id: item.id,
                    name: item.name,
                    child: item.space
                  }
                })
                console.log(buildingMes)
                  // state.spaceArr = renderArr
                commit('SAVE_SPACE_ARR', renderArr)
                renderArr.forEach(eachFloor => {
                  let spaceArr = eachFloor.child || []
                  let filterSpaceArr = spaceArr.filter(eachSpace => {
                    //eachSpace:{id:'spaceId123',name:'5层'}
                    return eachSpace.id == obj.spaceId
                  })
                  if (filterSpaceArr.length > 0) {
                    let spaceMes = {
                        leftVal: eachFloor.name,
                        rightVal: filterSpaceArr[0].name,
                        wrapId: eachFloor.id,
                        insetId: filterSpaceArr[0].id
                      }
                      // state.spaceMes = spaceMes
                    commit('SAVE_SPACE_MES', spaceMes)
                    resolve(spaceMes)
                  }
                })
              }
            }).catch(err => {
              console.log(err)
              reject(err)
            })
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      })
    },
    SaveJobId: ({
      commit
    }, id) => {
      commit('SAVE_JOB_ID', id)
    }
  }
}

export default repair