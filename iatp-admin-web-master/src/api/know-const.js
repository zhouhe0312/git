import httpRequest from '@/util/http-request'

//获取知识库内容树
export function getKnowTree(val) {
    return httpRequest({
        url:"/admin/base-knowledge-content/tree",
        method:"post",
        params: {
            'name':val.name,
            'pid':val.pid
		}
    })
}
//获取知识树根目录列表
export function getAllKnowData(val) {
    return httpRequest({
        url:"/admin/base-knowledge-info/list",
        method:"post",
        data:{
        	"page": {
			    "current": val.current,
			    "size": val.size
			},
		    "params":{
                "name":val.name,
		  }
        }
    })
}
//二级菜单顶部详情
export function getMenu2Data(id) {
    return httpRequest({
        url:"/admin/base-knowledge-info/details/"+id,
        method:"get",
    })
}
//三级菜单顶部详情
export function getMenu3Data(id) {
    return httpRequest({
        url:"/admin/base-knowledge-content/details/"+id,
        method:"get",
    })
}

//二.三级菜单content列表
export function getContentData(pid) {
    return httpRequest({
        url:"/admin/base-knowledge-content/list/"+pid,
        method:"get",
    })
}

//2级菜单新增-top
export function addMenu2Data(val) {
    return httpRequest({
        url:"/admin/base-knowledge-content/add",
        method:"post",
        data:val
    })
}

//2级菜单编辑-content
export function editMenu2Data(val) {
    return httpRequest({
        url:"/admin/base-knowledge-content/edit",
        method:"post",
        data:val
    })
}

//2级菜单删除-content
export function DelTableData(val) {
    return httpRequest({
        url:"/admin/base-knowledge-content/batchDel",
        method:"post",
        params: {
		    'ids':val
		}
    })
}

//2级菜单上传图片
export function uploadPic(val) {
    return httpRequest({
        url:"/admin/base-knowledge-content/uploadPicture",
        method:"post",
        params: {
            'filename':val.filename,
		    'id':val.id
		}
    })
}
