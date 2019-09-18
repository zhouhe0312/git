import {
    getRoleData,
    addTableData,
    editOneData,
    DelOneData,
    DelTableData,
    getAllAuth,
    addAuth,
} from '@/api/system-role'

const state = {
   roleTableData: [],//角色基础表格
   allInfo:{},
   roleData:[],//权限树
}

const getters = {
    getRoleData: state => state.roleTableData,
    getAllAuth: state => state.roleData,
}

const actions = {
    getRoleTableData({ commit,state }, data) {
       return new Promise((resolve,reject) => {
        getRoleData(data).then(response => {
               if(!response) {
                   reject('获取角色列表失败')
               }
               commit('roleTableData',response.data)
               commit('allInfo',response)
               resolve(response.data)
           }).catch(error => {
               reject(error)
           })
       })
   },

   //角色新增
   tableDataAdd({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            addTableData(val).then(response => {
                if(!response) {
                    reject('新增角色失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
 
     //编辑单条角色
   editDataOne({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            editOneData(val).then(response => {
                if(!response) {
                    reject('编辑角色失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
     //删除单条角色
   tableDataDelOne({ commit,state }, id) {
        return new Promise((resolve,reject) => {
            DelOneData(id).then(response => {
                if(!response) {
                    reject('删除角色失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

   //批量删除角色
   tableDataDel({ commit,state }, data) {
       return new Promise((resolve,reject) => {
           DelTableData(data).then(response => {
               if(!response) {
                   reject('删除角色失败')
               }
               resolve(response.data)
           }).catch(error => {
               reject(error)
           })
       })
   },
   
   //获取权限树
   getAllAuthTree({ commit,state },val) {
       return new Promise((resolve,reject) => {
        getAllAuth(val).then(response => {
               if(!response) {
                   reject('获取失败')
               }
               commit('roleData',response.data)
               resolve(response)
           }).catch(error => {
               reject(error)
           })
       })
   },

   //给角色添加权限
   addRoleAuthData({ commit,state },val) {
       return new Promise((resolve,reject) => {
           addAuth(val).then(response => {
               if(!response) {
                   reject('添加权限失败')
               }
               resolve(response)
           }).catch(error => {
               reject(error)
           })
       })
   },
   


}

const mutations = {
   roleTableData(state, roleTableData) {
       state.roleTableData = roleTableData
   },
   allInfo(state, allInfo) {
       state.allInfo = allInfo
   },
   roleData(state, roleData) {
       state.roleData = roleData
   },
  
}

export default {
   namespaced: true,
   state,
   getters,
   actions,
   mutations
 }