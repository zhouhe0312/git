export const common = {
    
    // 格式化时间
    onlyDateFormat: function(str) {
        if (str === null || typeof str === 'undefined' || str === '') {
            return undefined
        } else {
            let oDate = new Date(str),
                oYear = oDate.getFullYear(),
                oMonth = oDate.getMonth() + 1,
                oDay = oDate.getDate(),
                oHours = oDate.date.getHours(),
                oMinutes = oDate.date.getMinutes(),
                oSeconds = oDate.date.getSeconds(),
                oTime = oYear + '-' + this.getzf(oMonth) + '-' + this.getzf(oDay)+ '-' + this.getzf(oHours)+ '-' + this.getzf(oMinutes)+ '-' + this.getzf(oSeconds)
            return oTime
        }
    },
    //补0操作
    getzf: function(num) {
        if (parseInt(num) < 10) {
            num = '0' + num
        }
        return num
    },
   
    //验证数字
    ruleDoble: (rule, value, callback) => {
        if (!value) {
            callback();
            return;
        }
        if (!/^\d+(\.\d+)?$/.test(value)) {
            callback(new Error("只能为数字"));
        } else {
            callback();
        }
    }
}

export function downloadFile(blob, fileName) {
    // 非IE下载
    if ('download' in document.createElement('a')) {
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob); // 创建下载的链接
        link.download = fileName; // 下载后文件名
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click(); // 点击下载
        window.URL.revokeObjectURL(link.href); // 释放掉blob对象
        document.body.removeChild(link); // 下载完成移除元素
    } else {
        // IE10+下载
        window.navigator.msSaveBlob(blob, fileName);
    }
}

export const constants = {
    //上传URL
    uploadUrl: process.env.VUE_APP_BASE_API + "/fileserver/file/upload",
    //下载URL
    downloadUrl: process.env.VUE_APP_BASE_API + "/fileserver/file/download/",
    //预览URL
    //previewUrl: process.env.VUE_APP_BASE_API + "/fileserver/file/preview/"

    uploadFileTypes:{
        "3":"application/pdf",//pdf
        "2":"application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",//ppt,pptx
        "1":"video/mp4" //mp4
    }
}