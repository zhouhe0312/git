import {
    getKnowTree,
    getAllKnowData,//知识树根目录
    getContentData,
    addMenu2Data,
    editMenu2Data,
    DelTableData,
    getMenu2Data,
    getMenu3Data,
    uploadPic,
    knowCatalogInfo,

} from '@/api/know-const'

const state = {
   knowAllTableData:[],//知识树根目录
   knowAllInfo:{},
   menu2TableData:[],
   knowTableData: [],//知识库内容基础表格
   knowData:[],//知识库内容树
}

const getters = {
    getAllKnowData: state => state.knowAllTableData,//根目录列表
    getContentData: state => state.knowTableData,//2&3级菜单内容
    getMenu2Data: state => state.menu2TableData,//2级菜单头部
    getMenu3Data: state => state.menu3TableData,//3级菜单头部
    getKnowTree: state => state.knowData,//知识库树
}

const actions = {
    
   //获取知识库内容树
   getAllKnowTree({ commit,state },pid) {
        return new Promise((resolve,reject) => {
            getKnowTree(pid).then(response => {
                if(!response) {
                    reject('操作失败')
                }
                commit('knowData',response.data)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    AllKnowData({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            getAllKnowData(val).then(response => {
                if(!response) {
                    reject('操作失败')
                }
                commit('knowAllTableData',response.data)
                commit('knowAllInfo',response)
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getmenu2TableData({ commit,state }, id) {
        return new Promise((resolve,reject) => {
            getMenu2Data(id).then(response => {
                if(!response) {
                    reject('操作失败')
                }
                commit('menu2TableData',response.data)
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getmenu3TableData({ commit,state }, id) {
        return new Promise((resolve,reject) => {
            getMenu3Data(id).then(response => {
                if(!response) {
                    reject('操作失败')
                }
                commit('menu3TableData',response.data)
                resolve(response.data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    getmenu2Content({ commit,state }, pid) {
       return new Promise((resolve,reject) => {
        getContentData(pid).then(response => {
               if(!response) {
                   reject('操作失败')
               }
               commit('knowTableData',response.data)
               resolve(response.data)
           }).catch(error => {
               reject(error)
           })
       })
   },

   //知识库内容新增
   tableMenu2Add({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            addMenu2Data(val).then(response => {
                if(!response) {
                    reject('操作失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
 
     //编辑单条知识库内容
     tableMenu2Edit({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            editMenu2Data(val).then(response => {
                if(!response) {
                    reject('操作失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

   //删除单条知识库内容
   tableMenu2Del({ commit,state }, val) {
       return new Promise((resolve,reject) => {
           DelTableData(val).then(response => {
               if(!response) {
                   reject('操作失败')
               }
               resolve(response)
           }).catch(error => {
               reject(error)
           })
       })
   },

   //上传图片
   toUploadPic({ commit,state }, val) {
    return new Promise((resolve,reject) => {
        uploadPic(val).then(response => {
            if(!response) {
                reject('操作失败')
            }
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
},
   
   

}

const mutations = {
    knowAllTableData(state, knowAllTableData) {
        state.knowAllTableData = knowAllTableData
    },
    menu2TableData(state, menu2TableData) {
        state.menu2TableData = menu2TableData
    },
    menu3TableData(state, menu3TableData) {
        state.menu3TableData = menu3TableData
    },
    knowAllInfo(state, knowAllInfo) {
        state.knowAllInfo = knowAllInfo
    },
    knowTableData(state, knowTableData) {
       state.knowTableData = knowTableData
   },
   knowData(state, knowData) {
       state.knowData = knowData
   },
  
}

export default {
   namespaced: true,
   state,
   getters,
   actions,
   mutations
 }