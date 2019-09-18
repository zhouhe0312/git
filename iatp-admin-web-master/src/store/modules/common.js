import { templateDownload } from '@/api/common'
import { downloadFile } from "@/util/common";

const state = {

}

// actions
const actions = {
    //获取章节树
    templateDownloadAct({ commit,state }, no) {
        return new Promise((resolve,reject) => {
            templateDownload(no).then(response => {

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
}

// mutations
const mutations = {

}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}