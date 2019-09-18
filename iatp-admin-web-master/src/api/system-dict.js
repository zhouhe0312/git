import httpRequest from '@/util/http-request'

export function dictTypeList() {
    return httpRequest({
        url:"/admin/dict/type/listAll",
        method:"get"
    })
}

export function dictList(dictSearch) {
    return httpRequest({
        url: "/admin/dict/list",
        method: "post",
        data: dictSearch
    })
}
//删除字典
export function deleteDict(ids) {
    return httpRequest({
        url: "/admin/dict/batchDel",
        method: "post",
        params: {
            'ids':ids
        }
    })
}

export function dictSave(dictInfo) {
    return httpRequest({
        url: "/admin/dict/add",
        method: "post",
        data: dictInfo
    })
}
export function dictEdit(dictInfo) {
    return httpRequest({
        url: "/admin/dict/edit",
        method: "post",
        data: dictInfo
    })
}

export function checkNameAndValueOnly(nameAndValue) {
    return httpRequest({
        url: "/admin/dict/checkNameAndValueOnly",
        method: "post",
        params: nameAndValue
    })
}