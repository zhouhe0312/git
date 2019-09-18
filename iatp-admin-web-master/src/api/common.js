import httpRequest from '@/util/http-request'

export function templateDownload(no) {
    return httpRequest({
        url: "/fileserver/file/template/" + no,
        responseType: 'blob',
        method: 'get'
    })
}