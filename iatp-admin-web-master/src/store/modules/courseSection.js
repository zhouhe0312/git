import {
    getSection,
    addTableData,
    editOneData,
    DelOneData,
    getNodeData,
    DelFileData,
    addFileData,
    editFileData,
    addTestData,
    editTestData,
    datadragData,

} from '@/api/course-section'

const state = {
    treeData:[],
    nodeData:[],
}

const getters = {
    getSection: state => state.treeData,
    getNodeData: state => state.nodeData,
}
const actions = {

    //获取章节树
    getSectionTree({ commit,state }, val) {
        return new Promise((resolve,reject) => {
        getSection(val).then(response => {
                if(!response) {
                    reject('获取章节失败')
                }
                commit('treeData',response.data)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

   //课程章节新增
   tableDataAdd({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            addTableData(val).then(response => {
                if(!response) {
                    reject('新增失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
 
     //编辑单条课程章节
   editDataOne({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            editOneData(val).then(response => {
                if(!response) {
                    reject('编辑失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
     //删除单条课程章节
    tableDataDelOne({ commit,state }, data) {
        return new Promise((resolve,reject) => {
            DelOneData(data).then(response => {
                if(!response) {
                    reject('删除失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
   
   //获取节点下的资源
    getAllNodeData({ commit,state },val) {
        return new Promise((resolve,reject) => {
            getNodeData(val).then(response => {
                if(!response) {
                    reject('获取资源失败')
                }
                commit('nodeData',response.data)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

/////////////////////////资源部分///////////////////////////////

     //删除单条文件
    DelOneFile({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            DelFileData(val).then(response => {
                if(!response) {
                    reject('删除失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

     //新增文件保存
     addFileToUp({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            addFileData(val).then(response => {
                if(!response) {
                    reject('新增失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

     //课程章节编辑
     editFileToUp({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            editFileData(val).then(response => {
                if(!response) {
                    reject('编辑失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    //新增实训
    toAddTestData({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            addTestData(val).then(response => {
                if(!response) {
                    reject('新增实训失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

     //编辑实训
     toEditTestData({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            editTestData(val).then(response => {
                if(!response) {
                    reject('编辑实训失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    //拖动排序
    toDatadragData({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            datadragData(val).then(response => {
                if(!response) {
                    reject('排序失败')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },


}
const mutations = {
    treeData(state, treeData) {
       state.treeData = treeData
   },
   nodeData(state, nodeData) {
       state.nodeData = nodeData
   },
}

export default {
   namespaced: true,
   state,
   getters,
   actions,
   mutations
 }