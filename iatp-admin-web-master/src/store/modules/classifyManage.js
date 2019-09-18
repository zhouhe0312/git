import { classifyList,classifyTree,deleteClassify,addClassify,editClassify } from '@/api/classify-manage'

// initial state
// shape: [{ id, quantity }]
const state = {
    classifyList: [],
    classifyPage: {},
    classifyTreeList: []
}

// getters
const getters = {

}

// actions
const actions = {
    classifyListAct({commit,state},search) {
        return new Promise((resolve,reject) => {
            classifyList(search).then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('classifyList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    classifyTreeAct({commit,state}) {
        return new Promise((resolve,reject) => {
            classifyTree().then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('classifyTree', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteClassifyAct({commit,state},ids) {
        return new Promise((resolve,reject) => {
            deleteClassify(ids).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    addClassifyAct({commit,state},classify) {
        return new Promise((resolve,reject) => {
            addClassify(classify).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    editClassifyAct({commit,state},classify) {
        return new Promise((resolve,reject) => {
            editClassify(classify).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

// mutations
const mutations = {
    classifyList(state,{ data, total,size}) {
        state.classifyList = data
        state.classifyPage = {total,size}
    },
    classifyTree(state,{ data }) {
        state.classifyTreeList = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}