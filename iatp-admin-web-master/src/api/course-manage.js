import httpRequest from '@/util/http-request'

//获取课程/实验列表
export function getCourseData(val) {
    return httpRequest({
        url:"/admin/base-course/list",
        method:"post",
        data:{
        	"page": {
			    "current": val.current,
			    "size": val.size
			},
		    "params":{
		  		'type':val.type,//1 课程 ，2 实验
		  		"courseName": val.courseName
		  }
        }
    })
}
//课程/实验新增
export function addTableData(val) {
    return httpRequest({
        url:"/admin/base-course/add",
        method:"post",
        data:val
    })
}

//编辑课程/实验
export function editOneData(val) {
    return httpRequest({
        url:"/admin/base-course/edit",
        method:"post",
        data:val
    })
}


//删除课程/实验
export function DelOneData(ids) {
    return httpRequest({
        url:"/admin/base-course/batchDel/"+ids,
        method:"post",
    })
}

//获取课程/实验分类
export function classData(val) {
    return httpRequest({
        url:"/admin/base-classify/tree",
        method:"post",
    })
}
