import httpRequest from '@/util/http-request'

//获取部门列表
export function getDeptData(val) {
	console.log(val)
    return httpRequest({
        url:"/admin/dept/list",
        method:"post",
        data:{
        	"page": {
			    "current": val.current,
			    "size": val.size
			},
		    "params":{
		  		'code':"",
                "name":val.name,
                "pid" :val.pid
		  }
        }
    })
}
//部门新增
export function addTableData(val) {
    return httpRequest({
        url:"/admin/dept/add",
        method:"post",
        data:val
    })
}

//编辑部门
export function editOneData(val) {
    return httpRequest({
        url:"/admin/dept/edit",
        method:"post",
        data:val
    })
}

//删除单条部门
export function DelOneData(id) {
    return httpRequest({
        url:"/admin/dept/del",
        method:"post",
        params: {
		    'id':id
		}
		
    })
}

//批量删除部门
export function DelTableData(val) {
    return httpRequest({
        url:"/admin/dept/batchDel",
        method:"post",
        params: {
		    'ids':val
		}
    })
}

//获取部门树
export function getDeptTree(type) {
    return httpRequest({
        url:"/admin/dept/tree",
        method:"post",
        params: {
            'type':type
        }
    })
}

export function checkNameAndCodeOnly(nameCodeAndId) {
    return httpRequest({
        url:"/admin/dept/checkNameAndCodeOnly",
        method:"get",
        params: nameCodeAndId
    })
}