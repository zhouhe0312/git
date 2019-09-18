import {
    getCourseData,
    addTableData,
    editOneData,
    DelOneData,
    classData,
} from '@/api/course-manage'

const state = {
   coursesData: [],//课程/实验基础表格
   getClassData:[],//分类选择
   allInfo:{},
}

const getters = {
    getCourseData: state => state.coursesData,
    classData: state => state.getClassData,
}

const actions = {
    getcoursesData({ commit,state }, data) {
       return new Promise((resolve,reject) => {
        getCourseData(data).then(response => {
               if(!response) {
                   reject('操作失败')
               }
               commit('coursesData',response.data)
               commit('allInfo',response)
               resolve(response.data)
           }).catch(error => {
               reject(error)
           })
       })
   },

   //课程/实验新增
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
 
     //编辑单条课程/实验
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
     //删除单条课程/实验
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
  
     //新增下拉框-课程/实验分类
    courseClassData({ commit,state }, val) {
        return new Promise((resolve,reject) => {
            classData(val).then(response => {
                if(!response) {
                    reject('获取分类失败')
                }
                commit('getClassData',response.data)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },


}

const mutations = {
    coursesData(state, coursesData) {
       state.coursesData = coursesData
   },
   allInfo(state, allInfo) {
    state.allInfo = allInfo
},
   getClassData(state,getClassData){
       state.getClassData = getClassData
   }
  
}

export default {
   namespaced: true,
   state,
   getters,
   actions,
   mutations
 }