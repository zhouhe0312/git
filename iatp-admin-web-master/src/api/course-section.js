import httpRequest from '@/util/http-request'

//获取课程/实验章节树
export function getSection(val) {
    return httpRequest({
        url:"/admin/base-chapter/tree",
        method:"post",
        params: {
            'courseId':val.courseId,
            'type':val.type
		}
    })
}
//课程/实验章节新增
export function addTableData(val) {
    return httpRequest({
        url:"/admin/base-chapter/add",
        method:"post",
        data:val
    })
}

//编辑课程/实验章节
export function editOneData(val) {
    return httpRequest({
        url:"/admin/base-chapter/edit",
        method:"post",
        data:val
    })
}


//删除课程/实验章节
export function DelOneData(ids) {
    return httpRequest({
        url:"/admin/base-chapter/batchDel/"+ids,
        method:"post",
    })
}

//////////////////////////资源部分///////////////////////////////////

//获取节点下的资源
export function getNodeData(val) {
    return httpRequest({
        url:"/admin/base-resource/listAll",
        method:"post",
        params: {
            'chapterId':val.chapterId,
            'chapterPid':val.chapterPid
		}
    })
}

//删除章节下的文件
export function DelFileData(ids) {
    return httpRequest({
        url:"/admin/base-resource/batchDel/"+ids,
        method:"post",
    })
}

//新增章节下的文件
export function addFileData(val) {
    return httpRequest({
        url:"/admin/base-resource/addResource/",
        method:"post",
        data:val
    })
}

//编辑章节下的文件
export function editFileData(val) {
    return httpRequest({
        url:"/admin/base-resource/editResource/",
        method:"post",
        data:val
    })
}


//新增实训
export function addTestData(val) {
    return httpRequest({
         url:"/admin/base-resource/addResourceTraining/",
         method:"post",
         data:val
     })
 }

 //编辑实训
 export function editTestData(val) {
     return httpRequest({
         url:"/admin/base-resource/editResourceTraining/",
         method:"post",
         data:val
     })
 }

 //拖动排序
 export function datadragData(val) {
    return httpRequest({
        url:"/admin/base-resource/sort/",
        method:"post",
        data:val
    })
}