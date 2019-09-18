import { logList,deleteLog,exportLog } from '@/api/system-log'
import { downloadFile } from "@/util/common";

const state = {
    logList: [],
    logPage: {}
}

const getters = {

}

const actions = {
    obtainLogList({commit,state},logSearch) {
        return new Promise((resolve,reject) => {
            logList(logSearch).then(response => {
                if (!response) {
                    reject('获取字典类型失败！')
                }
                commit('logList', response)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    deleteLogAct({commit,state},ids) {
        return new Promise((resolve,reject) => {
            deleteLog(ids).then(response => {
                if (!response) {
                    reject('删除字典失败！')
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    exportLogFile({commit,state},logSearch) {
        return new Promise((resolve,reject) => {
            exportLog(logSearch).then(response => {

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
    }
}

const mutations = {
    logList(state,{ data, total,size}){
        state.logList = data
        state.logPage = {total,size}
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}