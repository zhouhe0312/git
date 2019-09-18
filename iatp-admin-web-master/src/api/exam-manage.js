import httpRequest from '@/util/http-request'

export function examList(search) {
    return httpRequest({
        url: '/admin/base-topic/list',
        method: 'post',
        data: search
    })
}

export function saveExam(exam) {
    return httpRequest({
        url: '/admin/base-topic/add',
        method: "post",
        data: exam
    })
}

export function editExam(exam) {
    return httpRequest({
        url: '/admin/base-topic/edit',
        method: "post",
        data: exam
    })
}

export function deleteExam(ids) {
    return httpRequest({
        url: '/admin/base-topic/batchDel',
        method: "post",
        params: {
            'ids':ids
        }
    })
}

export function enableDisabledExam(id) {
    return httpRequest({
        url: "/admin/base-topic/enableDisabled/" + id,
        method: 'post'
    })
}