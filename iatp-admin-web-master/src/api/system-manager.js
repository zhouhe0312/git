import httpRequest from '@/util/http-request'

//获取系统管理员列表
export function getTableData(val) {
	console.log(val)
    return httpRequest({
        url:"/admin/sysuser/list",
        method:"post",
        data:{
        	"page": {
			    "current": val.current,
			    "size": val.size
			},
		    "params":{
		  		'type':'1',
		  		"acount": val.acount
		  }
        }
    })
}

//批量删除系统管理员
export function DelTableData(val) {
    return httpRequest({
        url:"/admin/sysuser/batchDel",
        method:"post",
        params: {
		    'ids':val
		}
    })
}

//删除单条系统管理员
export function DelOneData(id) {
    return httpRequest({
        url:"/admin/sysuser/del",
        method:"post",
        params: {
		    'id':id
		}
		
    })
}

//系统管理员新增
export function addTableData(val) {
    return httpRequest({
        url:"/admin/sysuser/add",
        method:"post",
        data:val
    })
}
//编辑管理员
export function editOneData(val) {
    return httpRequest({
        url:"/admin/sysuser/edit",
        method:"post",
        data:val
    })
}
//改密码
export function resetPassw(val) {
    return httpRequest({
        url:"/admin/sysuser/resetPwd",
        method:"post",
        data:val
    })
}
//获取角色列表
export function getRole() {
    return httpRequest({
        url:"/admin/role/listAll",
        method:"post",
    })
}
//获取部门树
export function getDeptTree() {
    return httpRequest({
        url:"/admin/dept/tree",
        method:"post",
    })
}
//系统管理用户授权角色
export function addRole(val) {
    return httpRequest({
        url:"/admin/sysuser/auth",
        method:"post",
        data:val
    })
}
//用户角色关系-分配角色回显
export function getRoleRela(uid) {
    return httpRequest({
        url:"/admin/role/listAll/"+uid,
        method:"get",
    })
}

//验证账户唯一性
export function memberAcountChecking(acountAndId) {
    return httpRequest({
        url: "/admin/sysuser/checkUserNameOnly",
        method: "post",
        params: acountAndId
    })
}