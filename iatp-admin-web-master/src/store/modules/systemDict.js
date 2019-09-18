import { dictTypeList,dictList,deleteDict,dictSave,dictEdit } from '@/api/system-dict'

const state = {
    dictTypeList: [],
    dictList: [],
    dictPage: {}
}

const getters = {

}

const actions = {
    obtainDictTypeList({ commit, state }) {
        return new Promise((resolve,reject) => {
            dictTypeList().then(response => {
                if (!response) {
                    reject('获取字典类型失败！')
                }
                commit('dictTypeList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    obtainDictList({commit,state},dictSearch) {
        return new Promise((resolve,reject) => {
            dictList(dictSearch).then(response => {
                if (!response) {
                    reject('获取字典类型失败！')
                }
                commit('dictList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteDictAct({commit,state},ids) {
        return new Promise((resolve,reject) => {
            deleteDict(ids).then(response => {
                if (!response) {
                    reject('删除字典失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    dictSaveAct({commit,state},dictInfo) {
        return new Promise((resolve,reject) => {
            dictSave(dictInfo).then(response => {
                if (!response) {
                    reject('保存字典失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    dictEditAct({commit,state},dictInfo) {
        return new Promise((resolve,reject) => {
            dictEdit(dictInfo).then(response => {
                if (!response) {
                    reject('保存字典失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

const mutations = {
    dictTypeList(state, { data }) {
        state.dictTypeList = data
    },
    dictList(state, { data, total,size}) {
        state.dictList = data
        state.dictPage = {total,size}
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}