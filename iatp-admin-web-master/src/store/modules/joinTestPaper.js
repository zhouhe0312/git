import {
    getTestList,//题库
    getAllTestPage,//试题分页
    joinTestPaper,//组卷
    selectListAct,
    compositionTest

} from '@/api/join-testPaper'

const state = {
   testAllData:[],//题库
   testAllTableData:[],//试题分页
   selectListActData:[],
   pageAllInfo:{}
}

const getters = {
    getTestList: state => state.testAllData,//题库
    getAllTestPage: state => state.testAllTableData,//试题分页
    selectListAct: state => state.selectListActData
}

const actions = {
    
   //获取题库
   getTestAllList({ commit,state }) {
        return new Promise((resolve,reject) => {
            getTestList().then(response => {
                if(!response) {
                    reject('获取题库失败')
                }
                commit('testAllData',response.data)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
   //获取下拉框实验list
   getSelectListAct({ commit,state },val) {
        return new Promise((resolve,reject) => {
            selectListAct(val).then(response => {
                if(!response) {
                    reject('获取实验列表失败')
                }
                commit('selectListActData',response.data)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getAllTestPages({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            getAllTestPage(val).then(response => {
                if(!response) {
                    reject('获取试题失败')
                }
                commit('testAllTableData',response.data)
                commit('pageAllInfo',response)
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    toJoinTestPaper({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            joinTestPaper(val).then(response => {
                if(!response) {
                    reject('组卷失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    compositionTestAct({ commit,state },params) {
        return new Promise((resolve,reject) => {
            compositionTest(params).then(response => {
                if(!response) {
                    reject('组卷失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

const mutations = {
    testAllData(state, testAllData) {
        state.testAllData = testAllData
    },
    testAllTableData(state, testAllTableData) {
        state.testAllTableData = testAllTableData
    }, 
    pageAllInfo(state, pageAllInfo) {
        state.pageAllInfo = pageAllInfo
    }, 
    selectListActData(state, selectListActData) {
        state.selectListActData = selectListActData
    }, 
}

export default {
   namespaced: true,
   state,
   getters,
   actions,
   mutations
 }