import httpRequest from '@/util/http-request'

export function safetyDetails() {
    return httpRequest({
        url:"/admin/sysSafeStrategy/details",
        method:"get"
    })
}

export function saveSafetyInfo(safetyInfo) {
    return httpRequest({
        url: "/admin/sysSafeStrategy/edit",
        method: "post",
        data:safetyInfo
    })
}