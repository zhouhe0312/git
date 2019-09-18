import httpRequest from '@/util/http-request'

export function classifyList(search) {
    return httpRequest({
        url: "/admin/base-classify/list",
        method: "post",
        data: search
    })
}

export function classifyTree() {
    return httpRequest({
        url: "/admin/base-classify/tree",
        method: "post"
    })
}

export function deleteClassify(ids) {
    return httpRequest({
        url: "/admin/base-classify/batchDel/"+ids,
        method: 'post',
    })
}

export function addClassify(classify) {
    return httpRequest({
        url: '/admin/base-classify/add',
        method: 'post',
        data: classify
    })
}

export function editClassify(classify) {
    return httpRequest({
        url: '/admin/base-classify/edit',
        method: 'post',
        data: classify
    })
}