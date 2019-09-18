import httpRequest from '@/util/http-request'

/**
 * 知识库目录列表
 */
export function knowledgeCatalogList(search) {
    return httpRequest({
        url: "/admin/base-knowledge-info/list",
        method: 'post',
        data: search
    })
}
/**
 * 知识库目录新增
 */
export function saveKnowledgeCatalog(knowledgeCatalog) {
    return httpRequest({
        url: '/admin/base-knowledge-info/add',
        method: "post",
        data: knowledgeCatalog
    })
}

/**
 * 知识库目录详情
 * @param id 目录ID
 */
export function knowledgeCatalogInfo(id) {
    return httpRequest({
        url: '/admin/base-knowledge-info/details/' + id,
        method: "get"
    })
}

/**
 * 编辑知识库目录
 */
export function editKnowledgeCatalog(knowledgeCatalog) {
    return httpRequest({
        url: '/admin/base-knowledge-info/edit',
        method: "post",
        data: knowledgeCatalog
    })
}

/**
 * 知识库目录删除
 */
export function deleteKnowledgeCatalog(ids) {
    return httpRequest({
        url: '/admin/base-knowledge-info/batchDel',
        method: "post",
        params: {
            'ids':ids
        }
    })
}

export function updateFileName(fileInfo) {
    return httpRequest({
        url: '/admin/base-knowledge-info/uploadFile',
        method: "post",
        params: fileInfo
    })
}

export function downloadKnowledgeCatalog(id) {
    return httpRequest({
        url: "/fileserver/file/download/" + id,
        method: "get",
        responseType: 'blob'
    })
}

export function officePdfToPic(id) {
    return httpRequest({
        url: '/fileserver/filePreview/onlinePreview',
        method: "get",
        params: {
            'uri':id
        }
    })
}