import { knowledgeCatalogList
    ,saveKnowledgeCatalog
    ,deleteKnowledgeCatalog
    ,editKnowledgeCatalog
    ,knowledgeCatalogInfo
    ,downloadKnowledgeCatalog
    ,updateFileName
    ,officePdfToPic } from '@/api/knowledge'
import { downloadFile } from "@/util/common";


const state = {
    knowledgeCatalogList: [],
    knowledgeCatalogPage: {},
    knowledgeCatalogInfo: {},
    knowledgeImages:[]
}

const getters = {

}

const actions = {
    knowledgeCatalogList({commit,state},search) {
        return new Promise((resolve,reject) => {
            knowledgeCatalogList(search).then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('knowledgeCatalogList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    knowledgeCatalogInfoAct({commit,state},id) {
        return new Promise((resolve,reject) => {
            knowledgeCatalogInfo(id).then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                commit('knowledgeCatalogInfo', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    saveKnowledgeCatalogAct({ commit,state },knowledgeCatalog) {
        return new Promise((resolve,reject) => {
            saveKnowledgeCatalog(knowledgeCatalog).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    editKnowledgeCatalogAct({ commit,state },knowledgeCatalog) {
        return new Promise((resolve,reject) => {
            editKnowledgeCatalog(knowledgeCatalog).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteKnowledgeCatalogAct({ commit,state },ids) {
        return new Promise((resolve,reject) => {
            deleteKnowledgeCatalog(ids).then(response => {
                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    updateFileNameAct({commit,state},fileInfo) {
        return new Promise((resolve,reject) => {
            updateFileName(fileInfo).then(response => {

                if (!response) {
                    reject('保存题库失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    downloadKnowledgeCatalogAct({commit,state},id) {
        return new Promise((resolve,reject) => {
            downloadKnowledgeCatalog(id).then(response => {

                let headers = response.headers;
                let contentType = headers['content-type'];

                if (!response.data) {
                    reject("下载相应异常")
                } else {
                    const blob = new Blob([response.data], {type: contentType});

                    const contentDisposition = response.headers['content-disposition'];
                    let fileName = 'unknown';
                    if (contentDisposition) {
                        fileName = window.decodeURI(response.headers['content-disposition'].split('=')[1]);
                    }
                    downloadFile(blob, fileName);
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    officePdfToPicAct({commit,state},id) {
        return new Promise((resolve,reject) => {
            officePdfToPic(id).then(response => {
                if (!response) {
                    reject('获取题库列表失败！')
                }
                const code = response.code
                if(code !== 200) {
                    reject(response.message)
                }
                commit('knowledgeImages', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

const mutations = {
    knowledgeCatalogList(state,{ data, total,size}){
        state.knowledgeCatalogList = data
        state.knowledgeCatalogPage = {total,size}
    },
    knowledgeCatalogInfo(state,{data}) {
        state.knowledgeCatalogInfo = data
    },
    knowledgeImages(state,{ imgUrls }) {
        state.knowledgeImages = imgUrls
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}