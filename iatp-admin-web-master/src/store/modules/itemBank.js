import { itemBankList,itemBankSelectList,saveItemBank,editItemBank,deleteItemBank } from '@/api/itemBank-manage'

const state = {
    itemBankList: [],
    itemBankPage: {},
    itemBankSelectList: []
}

const getters = {

}

const actions = {
    itemBankList({commit,state},ibSearch) {
        return new Promise((resolve,reject) => {
            itemBankList(ibSearch).then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('itemBankList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    itemBankSelectList({commit,state}) {
        return new Promise((resolve,reject) => {
            itemBankSelectList().then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('itemBankSelectList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    saveItemBankAct({ commit,state },itemBank) {
        return new Promise((resolve,reject) => {
            saveItemBank(itemBank).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    editItemBankAct({ commit,state },itemBank) {
        return new Promise((resolve,reject) => {
            editItemBank(itemBank).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteItemBankAct({ commit,state },ids) {
        return new Promise((resolve,reject) => {
            deleteItemBank(ids).then(response => {
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
    itemBankList(state,{ data, total,size}){
        state.itemBankList = data
        state.itemBankPage = {total,size}
    },
    itemBankSelectList(state,{data}) {
        state.itemBankSelectList = data
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}