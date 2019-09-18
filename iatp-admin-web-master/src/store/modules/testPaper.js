import { testPaperList,deleteTestPaper,chapterSelectList,enableDisabledTestPaper,saveTestPaper,editTestPaper,seeTestList,isTestAssembly } from '@/api/test-paper'

const state = {
    testPaperList: [],
    testPaperPage: {},
    chapterSelectList: [],
    seeTestList:[],
    isTestAssembly: false
}

const getters = {

}

const actions = {
    testPaperListAct({commit,state},search) {
        return new Promise((resolve,reject) => {
            testPaperList(search).then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('testPaperList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    chapterSelectListAct({commit,state},search) {
        return new Promise((resolve,reject) => {
            chapterSelectList(search).then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('chapterSelectList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    saveTestPaperAct({ commit,state },testPaper) {
        return new Promise((resolve,reject) => {
            saveTestPaper(testPaper).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    editTestPaperAct({ commit,state },testPaper) {
        return new Promise((resolve,reject) => {
            editTestPaper(testPaper).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteTestPaperAct({ commit,state },ids) {
        return new Promise((resolve,reject) => {
            deleteTestPaper(ids).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    enableDisabledTestPaperAct({commit,state},id) {
        return new Promise((resolve,reject) => {
            enableDisabledTestPaper(id).then(response => {
                if (!response) {
                    reject('启用禁用试卷失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    seeTestListAct({commit,state},id) {
        return new Promise((resolve,reject) => {
            seeTestList(id).then(response => {
                if (!response) {
                    reject('启用禁用试卷失败！')
                }
                commit('seeTestList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    isTestAssemblyAct({commit,state},testPaperId) {
        return new Promise((resolve,reject) => {
            isTestAssembly(testPaperId).then(response => {
                if (!response) {
                    reject('查询是否组卷异常！')
                }
                commit('isTestAssembly', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

const mutations = {
    testPaperList(state,{ data, total,size}){
        state.testPaperList = data
        state.testPaperPage = {total,size}
    },
    chapterSelectList(state,{data}) {
        state.chapterSelectList = data
    },
    seeTestList(state,{data}) {
        state.seeTestList = data
    },
    isTestAssembly(state,{data}) {
        state.isTestAssembly = data.testAssembly
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}