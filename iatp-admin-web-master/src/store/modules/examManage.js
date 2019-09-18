import { examList,deleteExam,saveExam,editExam,enableDisabledExam } from '@/api/exam-manage'

const state = {
    examList: [],
    examPage: {}
}

const getters = {

}

const actions = {
    examList({commit,state},search) {
        return new Promise((resolve,reject) => {
            examList(search).then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('examList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    saveExamAct({ commit,state },exam) {
        return new Promise((resolve,reject) => {
            saveExam(exam).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    editExamAct({ commit,state },exam) {
        return new Promise((resolve,reject) => {
            editExam(exam).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteExamAct({ commit,state },ids) {
        return new Promise((resolve,reject) => {
            deleteExam(ids).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    enableDisabledExamAct({commit,state},id) {
        return new Promise((resolve,reject) => {
            enableDisabledExam(id).then(response => {
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

const mutations = {
    examList(state,{ data, total,size}){
        state.examList = data
        state.examPage = {total,size}
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}