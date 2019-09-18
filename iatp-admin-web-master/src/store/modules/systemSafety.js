import {safetyDetails,saveSafetyInfo} from '@/api/system-safety'

const state = {
    safetyInfo: {}
}

const getters = {
    
}

const actions = {
    obtainSafetyInfo({ commit, state }) {
        return new Promise((resolve,reject) => {
            safetyDetails().then(response => {
                if (!response) {
                    reject('获取安全信息失败！')
                }
                commit('safetyInfo', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    saveSafetyInfoAct({commit,state},safetyInfo) {
        return new Promise((resolve,reject) => {
            saveSafetyInfo(safetyInfo).then(response => {
                if (!response) {
                    reject('保存安全信息失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

const mutations = {
    safetyInfo(state, { data }) {
        state.safetyInfo = data
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}