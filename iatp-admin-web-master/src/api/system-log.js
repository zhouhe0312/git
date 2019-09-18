import httpRequest from '@/util/http-request'

export function logList(logSearch) {
    return httpRequest({
        url: "/admin/sysLog/list",
        method: "post",
        data: logSearch
    })
}

export function deleteLog(ids) {
    return httpRequest({
        url: "/admin/sysLog/delete",
        method: "post",
        data: ids
    })
}

export function exportLog(logSearch) {
    return httpRequest({
        url: "/admin/sysLog/import",
        method: "post",
        responseType: 'blob',
        data: logSearch
    })
}