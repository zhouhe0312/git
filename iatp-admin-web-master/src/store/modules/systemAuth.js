import {
    getAuthData,
    addTableData,
    editOneData,
    DelOneData,
    DelTableData,
    getAuthTree,
} from '@/api/system-auth'

const state = {
   authTableData: [],//权限基础表格
   allInfo:{},
   authData:[],//权限树
}

const getters = {
    getAuthData: state => state.authTableData,
}

const actions = {
    getAuthTableData({ commit,state }, data) {
       return new Promise((resolve,reject) => {
        getAuthData(data).then(response => {
               if(!response) {
                   reject('获取列表失败')
               }
               commit('authTableData',response.data)
               commit('allInfo',response)
               resolve(response.data)
           }).catch(error => {
               reject(error)
           })
       })
   },

   //权限新增
   tableDataAdd({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            addTableData(val).then(response => {
                if(!response) {
                    reject('新增权限失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
 
     //编辑单条权限
   editDataOne({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            editOneData(val).then(response => {
                if(!response) {
                    reject('编辑权限失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
     //删除单条权限
   tableDataDelOne({ commit,state }, id) {
        return new Promise((resolve,reject) => {
            DelOneData(id).then(response => {
                if(!response) {
                    reject('删除失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

   //批量删除权限
   tableDataDel({ commit,state }, data) {
       return new Promise((resolve,reject) => {
           DelTableData(data).then(response => {
               if(!response) {
                   reject('批量删除失败')
               }
               resolve(response.data)
           }).catch(error => {
               reject(error)
           })
       })
   },
   
   //获取权限树
   getAllAuthTree({ commit,state }) {
       return new Promise((resolve,reject) => {
        getAuthTree().then(response => {
               if(!response) {
                   reject('获取权限失败')
               }
               commit('authData',response.data)
               resolve(response)
           }).catch(error => {
               reject(error)
           })
       })
   },
   

}

const mutations = {
    authTableData(state, authTableData) {
       state.authTableData = authTableData
   },
   allInfo(state, allInfo) {
       state.allInfo = allInfo
   },
   authData(state, authData) {
       state.authData = authData
   },
  
}

export default {
   namespaced: true,
   state,
   getters,
   actions,
   mutations
 }