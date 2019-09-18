import httpRequest from '@/util/http-request'

//获取题库
export function getTestList() {
    return httpRequest({
        url:"/admin/base-topic-type/listAll",
        method:"post", 
    })
}

//获取试题分页列表
export function getAllTestPage(val) {
    return httpRequest({
        url:"/admin/base-topic/list",
        method:"post",
        data:{
        	"page": {
			    "current": val.current,
			    "size": val.size
			},
		    "params":{
        	    "selectType":val.selectType,
                "topicStem":val.topicStem,
                "typeId":val.typeId
		  }
        }
    })
}
//组卷
export function joinTestPaper(val) {
    return httpRequest({
        url:"/admin/base-examination-paper/build",
        method:"post",
        data:val 
    })
}

//综合卷-下拉框获取实验list
export function selectListAct(val) {
    return httpRequest({
        url:"/admin/base-course/select/list",
        method:"get",
        params:{
            "type":val.type,
        }
    })
}

/**
 * 综合组卷
 */
export function compositionTest(param) {
    return httpRequest({
        url:"/admin/base-examination-paper/synthesizeBuild",
        method:"post",
        data:param
    })
}
