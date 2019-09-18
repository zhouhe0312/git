import {
    getDeptData,
    addTableData,
    editOneData,
    DelOneData,
    DelTableData,
    getDeptTree,
} from '@/api/system-department'

const state = {
   deptTableData: [],//部门基础表格
   allInfo:{},
   deptData:[],//部门树
}

const getters = {
    getDeptData: state => state.deptTableData,
}

const actions = {
    getRoleTableData({ commit,state }, data) {
       return new Promise((resolve,reject) => {
        getDeptData(data).then(response => {
               if(!response) {
                   reject('获取部门列表失败')
               }
               commit('deptTableData',response.data)
               commit('allInfo',response)
               resolve(response.data)
           }).catch(error => {
               reject(error)
           })
       })
   },

   //部门新增
   tableDataAdd({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            addTableData(val).then(response => {
                if(!response) {
                    reject('新增部门失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
 
     //编辑单条部门
   editDataOne({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            editOneData(val).then(response => {
                if(!response) {
                    reject('编辑部门失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
     //删除单条部门
   tableDataDelOne({ commit,state }, id) {
        return new Promise((resolve,reject) => {
            DelOneData(id).then(response => {
                if(!response) {
                    reject('删除部门失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

   //批量删除部门
   tableDataDel({ commit,state }, data) {
       return new Promise((resolve,reject) => {
           DelTableData(data).then(response => {
               if(!response) {
                   reject('删除部门失败')
               }
               resolve(response.data)
           }).catch(error => {
               reject(error)
           })
       })
   },
   
   //获取部门树
   getAllDeptTree({ commit,state },type) {
       return new Promise((resolve,reject) => {
        getDeptTree(type).then(response => {
               if(!response) {
                   reject('获取部门树失败')
               }
               commit('deptData',response.data)
               resolve(response)
           }).catch(error => {
               reject(error)
           })
       })
   },
   

}

const mutations = {
    deptTableData(state, deptTableData) {
       state.deptTableData = deptTableData
   },
   allInfo(state, allInfo) {
       state.allInfo = allInfo
   },
   deptData(state, deptData) {
       state.deptData = deptData
   },
  
}

export default {
   namespaced: true,
   state,
   getters,
   actions,
   mutations
 }