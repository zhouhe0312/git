import httpRequest from '@/util/http-request'

//获取权限列表
export function getAuthData(val) {
    return httpRequest({
        url:"/admin/res/list",
        method:"post",
        data:{
        	"page": {
			    "current": val.current,
			    "size": val.size
			},
		    "params":{
                "name":val.name,
                "pid" :val.pid
		  }
        }
    })
}
//权限新增
export function addTableData(val) {
    return httpRequest({
        url:"/admin/res/add",
        method:"post",
        data:val
    })
}

//编辑权限
export function editOneData(val) {
    return httpRequest({
        url:"/admin/res/edit",
        method:"post",
        data:val
    })
}

//删除单条权限
export function DelOneData(id) {
    return httpRequest({
        url:"/admin/res/del",
        method:"post",
        params: {
		    'id':id
		}
		
    })
}

//批量删除权限
export function DelTableData(val) {
    return httpRequest({
        url:"/admin/res/batchDel",
        method:"post",
        params: {
		    'ids':val
		}
    })
}

//获取权限树
export function getAuthTree() {
    return httpRequest({
        url:"/admin/res/tree",
        method:"post",
    })
}

//验证唯一性
export function memberAuthChecking(nameCodeAndId) {
    return httpRequest({
        url: "/admin/res/checkNameAndCodeOnly",
        method: "post",
        params: nameCodeAndId
    })
}