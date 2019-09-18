import httpRequest from '@/util/http-request'

export function itemBankList(ibSearch) {
    return httpRequest({
        url: "/admin/base-topic-type/list",
        method: "post",
        data: ibSearch
    })
}

export function saveItemBank(itemBank) {
    return httpRequest({
        url: '/admin/base-topic-type/add',
        method: "post",
        data: itemBank
    })
}

export function editItemBank(itemBank) {
    return httpRequest({
        url: '/admin/base-topic-type/edit',
        method: "post",
        data: itemBank
    })
}

export function deleteItemBank(ids) {
    return httpRequest({
        url: '/admin/base-topic-type/batchDel',
        method: "post",
        params: {
            'ids':ids
        }
    })
}

export function itemBankSelectList() {
    return httpRequest({
        url: '/admin//base-topic-type/listAll',
        method: 'post'
    })
}