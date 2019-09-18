import httpRequest from '@/util/http-request'
import qs from 'qs'

export function login(data) {
    return httpRequest({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization":"Basic d2ViYXBwOndlYmFwcA==",
            'captcha':data.keywords,
            'captchaKey':data.vCode
        },
        url:"/login/oauth/token",
        method:"post",
        data: qs.stringify({
            client:"webapp",
            grant_type:"password",
            username:data.name,
            password:data.password
        })
    })
}

export function VfCode(vcode) {
    return httpRequest({
        url:"/captcha",
        method:"get",
        data:vcode
    })
}

export function userInfo() {
    return httpRequest({
        url:"/admin/sysuser/userInfo",
        method:"get"
    })
}

export function getUserMenus() {
    return httpRequest({
        url:"/admin/res/menuTree",
        method:"get"
    })
}

/**
 * 课程使用的Key Value
 */
export function courseKeyValue(type) {
    return httpRequest({
        url:"/admin/base-course/select/list",
        method:"get",
        params: {
            'type':type
        }
    })
}

/**
 * 试卷Select的key value
 */
export function chapelTestKeyValue() {
    return httpRequest({
        url:"/admin/base-chapel-test/select/list",
        method:"get"
    })
}

/**
 * ------------------------------------------
 * 用户错题管理
 * ------------------------------------------
 */
export function wrongQuestionsList(wqSearch) {
    return httpRequest({
        url:"/admin/base-wrong-questions/list",
        method:"post",
        data:wqSearch
    })
}

export function deleteWrongQuestions(ids) {
    return httpRequest({
        url:"/admin/base-wrong-questions/delete",
        method:"post",
        data:ids
    })
}

/**
 * ------------------------------------------
 * 用户收藏管理
 * ------------------------------------------
 */
export function userCollectList(ucSearch) {
    return httpRequest({
        url:"/admin/base-user-collect/list",
        method:"post",
        data:ucSearch
    })
}
export function deleteUserCollect(ids) {
    return httpRequest({
        url:"/admin/base-user-collect/delete",
        method:"post",
        data:ids
    })
}

/**
 * ------------------------------------------
 * 用户考试管理
 * ------------------------------------------
 */
export function userExamList(ueSearch) {
    return httpRequest({
        url:"/admin/base-examination-result/list",
        method:"post",
        data:ueSearch
    })
}
export function deleteUserExam(ids) {
    return httpRequest({
        url:"/admin/base-examination-result/delete",
        method:"post",
        data:ids
    })
}

/**
 * ------------------------------------------
 * 用户学习管理
 * ------------------------------------------
 */
export function userLearningList(ueSearch) {
    return httpRequest({
        url:"/admin/base-user-learning-record/list",
        method:"post",
        data:ueSearch
    })
}
export function deleteUserLearning(ids) {
    return httpRequest({
        url:"/admin/base-user-learning-record/delete",
        method:"post",
        data:ids
    })
}
/**
 * ------------------------------------------
 * C端用户管理
 * ------------------------------------------
 */
export function memberInfoList(memberSearch) {
    return httpRequest({
        url: "/admin/sysuser/list",
        method: "post",
        data: memberSearch
    })
}

export function deleteMemberInfo(ids) {
    return httpRequest({
        url:"/admin/sysuser/batchDel",
        method: "post",
        params: {
            'ids':ids
        }
    })
}

export function depTreeData() {
    return httpRequest({
        url: "/admin/dept/tree",
        method: "post"
    })
}

export function memberInfoSave(memberInfo) {
    return httpRequest({
        url: "/admin/sysuser/add",
        method: "post",
        data: memberInfo
    })
}

export function memberInfoEdit(memberInfo) {
    return httpRequest({
        url: "/admin/sysuser/edit",
        method: "post",
        data: memberInfo
    })
}

export function accountInfoUpdate(memberInfo) {
    return httpRequest({
        url: "/admin/sysuser/update/account",
        method: "post",
        data: memberInfo
    })
}
export function memberModifyPwd(pwdInfo) {
    return httpRequest({
        url: "/admin/sysuser/updatePwd",
        method: "post",
        data: pwdInfo
    })
}

export function memberAcountChecking(acountAndId) {
    return httpRequest({
        url: "/admin/sysuser/checkUserNameOnly",
        method: "post",
        params: acountAndId
    })
}

export function userButtons(resId) {
    return httpRequest({
        url: "/admin/res/buttons/" + resId,
        method: "get"
    })
}