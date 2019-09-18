import httpRequest from '@/util/http-request'

export function testPaperList(search) {
    return httpRequest({
        url: '/admin/base-chapel-test/list',
        method: 'post',
        data: search
    })
}

export function saveTestPaper(testPaper) {
    return httpRequest({
        url: '/admin/base-chapel-test/add',
        method: "post",
        data: testPaper
    })
}

export function editTestPaper(testPaper) {
    return httpRequest({
        url: '/admin/base-chapel-test/edit',
        method: "post",
        data: testPaper
    })
}

export function deleteTestPaper(ids) {
    return httpRequest({
        url: '/admin/base-chapel-test/batchDel',
        method: "post",
        params: {
            'ids':ids
        }
    })
}
//启用禁用试卷
export function enableDisabledTestPaper(id) {
    return httpRequest({
        url: '/admin/base-chapel-test/enableDisabled/' + id,
        method: "post"
    })
}

//章节选择框
export function chapterSelectList(search) {
    return httpRequest({
        url: '/admin/base-chapter/select/list',
        method: 'post',
        params: search
    })
}

export function seeTestList(id) {
    return httpRequest({
        url: '/admin/base-chapel-test/getTopicListByChapelId/' + id,
        method: 'get'
    })
}

export function isTestAssembly(testPaperId) {
    return httpRequest({
        url: "/admin/base-examination-paper/istest-assembly/" + testPaperId,
        method: 'get'
    })
}