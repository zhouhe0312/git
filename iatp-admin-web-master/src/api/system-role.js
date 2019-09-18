import httpRequest from '@/util/http-request'

//获取角色列表
export function getRoleData(val) {
	console.log(val)
    return httpRequest({
        url:"/admin/role/list",
        method:"post",
        data:{
        	"page": {
			    "current": val.current,
			    "size": val.size
			},
		    "params":{
		  		'code':"",
		  		"name":val.name
		  }
        }
    })
}
//角色新增
export function addTableData(val) {
    return httpRequest({
        url:"/admin/role/add",
        method:"post",
        data:val
    })
}

//编辑角色
export function editOneData(val) {
    return httpRequest({
        url:"/admin/role/edit",
        method:"post",
        data:val
    })
}

//删除单条角色
export function DelOneData(id) {
    return httpRequest({
        url:"/admin/role/del",
        method:"post",
        params: {
		    'id':id
		}
		
    })
}

//批量删除角色
export function DelTableData(val) {
    return httpRequest({
        url:"/admin/role/batchDel",
        method:"post",
        params: {
		    'ids':val
		}
    })
}

//获取权限树
export function getAllAuth(val) {
    return httpRequest({
        url:"/admin/res/elementTree",
        method:"post",
        params: {
		    'roleId':val
		}
    })
}

//保存角色授权
export function addAuth(val) {
    return httpRequest({
        url:"/admin/role/auth",
        method:"post",
        data:val
    })
}

//验证编码code唯一性
export function memberCodeChecking(acountAndId) {
    return httpRequest({
        url: "/admin/role/checkNameAndCodeOnly",
        method: "post",
        params: acountAndId
    })
}