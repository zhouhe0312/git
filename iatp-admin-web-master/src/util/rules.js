/** 自定义验证 **/

const validatePhone = (rule, value, callback) => {
    if (value === '') {
        callback();
    } else {
        if(!(/^1[3456789]\d{9}$/.test(value))){
            callback(new Error('手机号码格式错误'));
        } else {
            callback();
        }
    }
};


/** 安全策略验证 **/
const safetyRules = {
    pwdIntensity: [
        { required: true, message: '密码强度不能为空', trigger: 'blur' }
    ],
    loginFailTime: [
        { required: true, message: '允许登陆失败次数不能为空', trigger: 'blur' }
    ],
    lockLoginTime: [
        { required: true, message: '锁定用户登陆时间不能为空', trigger: 'blur' }
    ],
    pwdValidTime: [
        { required: true, message: '密码有效时间不能为空', trigger: 'blur' }
    ],
    webFailureTime: [
        { required: true, message: '页面失效时间不能为空', trigger: 'blur' }
    ],
    logRetentionTime: [
        { required: true, message: '日志保留最短时间不能为空', trigger: 'blur' }
    ],
    minPwdLength: [
        { required: true, message: '密码最小长度不能为空', trigger: 'blur' }
    ]
}

/** 新增编辑字典验证 **/
const dictRules = {
    typeId: [
        { required: true, message: '请选择字典类型', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '字典名称不能为空', trigger: 'blur' }
    ],
    value: [
        { required: true, message: '字典值不能为空', trigger: 'blur' }
    ]
}


const modifyPwdRules = {
    oldPassword: [
        {
            required: true, message: '请输入原始密码', trigger: 'blur'
        }
    ],
    newPassword: [
        {
            required: true, message: '请输入新密码', trigger: 'blur'
        }
    ],
    repPassword: [
        {
            required: true, message: '请再次输入新密码', trigger: 'blur'
        }
    ],
}

const resetPwdRules = {
    newPassword: [
        {
            required: true, message: '请输入新密码', trigger: 'blur'
        }
    ],
    repPassword: [
        {
            required: true, message: '请再次输入新密码', trigger: 'blur'
        }
    ],
}

const codeRules = {
    name: [
            {
                    required: true, message: '请输入角色名称', trigger: 'blur'
            }
    ],
    code: [
            {
                    required: true, message: '请输入角色编码', trigger: 'blur'
            }
    ],
        
}
const deptRules = {
    name: [
            {
                    required: true, message: '请输入部门名称', trigger: 'blur'
            }
    ],
    code: [
            {
                    required: true, message: '请输入部门编码', trigger: 'blur'
            }
    ],
        
}
const authRules = {
    name: [
            {
                    required: true, message: '请输入菜单名称', trigger: 'blur'
            }
    ],
    permission: [
            {
                    required: true, message: '请输入菜单编码', trigger: 'blur'
            }
    ],
        
}
const courseRules = {
    courseName: [
            {
                    required: true, message: '请输入课程名称', trigger: 'blur'
            }
    ],
    classifyId: [
            {
                    required: true, message: '请选择课程分类', trigger: 'blur'
            }
    ],

}

const itemBankRules = {
    title: [
        { required: true, message: '请输入题库名称', trigger: 'blur' }
    ]
}

const classifyRules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ]
}

// const courseImportFormRules = {
//     courseClassifyId: [
//         { required: true, message: '请选择分类', trigger: 'blur' }
//     ]
// }

const examRules = {
    topicStem:[
        { required: true, message: '请输入题干', trigger: 'blur' }
    ],
    optionA: [
        { required: true, message: '请输入选项A', trigger: 'blur' }
    ],
    optionB: [
        { required: true, message: '请输入选项B', trigger: 'blur' }
    ],
    optionC: [
        { required: true, message: '请输入选项C', trigger: 'blur' }
    ],
    optionD: [
        { required: true, message: '请输入选项D', trigger: 'blur' }
    ],
    typeId: [
        { required: true, message: '请选择题库', trigger: 'blur' }
    ],
    scoreValue: [
        { required: true, message: '请输入分值', trigger: 'blur' },
        { required: true, message: '分值输入格式错误', pattern: /^\d+(\.\d+)?$/, trigger: 'blur' },
        {
            validator: (rule,value,callback) => {
                if (value < 1) {
                    callback(new Error('分值不能小于1'));
                }else if (100<value) {
                    callback(new Error('分值不能大于100'));
                }
                else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ],
    topicAnswer: [
        { required: true, message: '请输入正确答案', trigger: 'blur' }
    ],
    topicAnalysis: [
        { required: true, message: '请输入解析', trigger: 'blur' }
    ],
}

//添加实训
const addTestFormRules = {
    username:[
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ],
    resourceName: [
        { required: true, message: '请输入实训名', trigger: 'blur' }
    ],
    ip: [
        { required: true, message: '请输入IP地址', trigger: 'blur' }
    ],
    port: [
        { required: true, message: '请输入1~65535之间的正整数', trigger: 'blur' },
        { min: 1, max: 5, message: '数值为1~65535之间的正整数', trigger: 'blur' }
    ],
    servicePort: [
        { required: true, message: '请输入1~65535之间的正整数', trigger: 'blur' },
        { min: 1, max: 5, message: '数值为1~65535之间的正整数', trigger: 'blur' }
    ],
}

const examImportFormRules = {
    typeId: [
        { required: true, message: '请选择题库', trigger: 'blur' }
    ]
}


const addSectioneFormRules = {
    pid: [
        {
            required: true, message: '请选择所属章节', trigger: 'blur'
        }
    ],
    chapterName: [
        {
            required: true, message: '请输入章节名称', trigger: 'blur'
        }
    ],
}

const uploadFileFormRules = {
    resourceName: [
            {
                    required: true, message: '请输入文件名称', trigger: 'blur'
            }
    ]
   
        
}
const menu2Rules = {
    name:[
            {
                    required: true, message: '请输入章节名称', trigger: 'blur'
            }
    ],
        
}

const knowledgeCatalogFormRules = {
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    keyword: [
        { required: true, message: '请输入关键字', trigger: 'blur' }
    ],
    summary: [
        { required: true, message: '请输入摘要', trigger: 'blur' }
    ],
    version: [
        { required: true, message: '请输入文号', trigger: 'blur' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'blur' }
    ],
    category: [
        { required: true, message: '请选择类别', trigger: 'blur' }
    ],
    classes: [
        { required: true, message: '请选择小类', trigger: 'blur' }
    ],
    issued: [
        { required: true, message: '请输入发布单位', trigger: 'blur' }
    ],
    releaseDate: [
        { required: true, message: '请输入发布日期', trigger: 'blur' }
    ],
    // discardDate: [
    //     { required: true, message: '请输入废止日期', trigger: 'blur' }
    // ],
}

const testPaperFormRules = {
    title:[
        { required: true, message: '请输入试卷名称', trigger: 'blur' }
    ],
    testType: [
        { required: true, message: '请选择试卷类型', trigger: 'blur' }
    ],
    ascription: [
        { required: true, message: '请选择试卷归属', trigger: 'blur' }
    ],
    paperDuration: [
        { required: true, message: '请输入考试时长(分)', trigger: 'blur' },
        { required: true, message: '考试时长输入格式错误', pattern: /^\d+(\.\d+)?$/, trigger: 'blur' },
        {
            validator:(rule,value,callback) => {
                if (value < 1) {
                    callback(new Error('考试时长不能小于1'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ],
    score: [
        { required: true, message: '请输入分值', trigger: 'blur' },
        { required: true, message: '分值输入格式错误', pattern: /^\d+(\.\d+)?$/, trigger: 'blur' },
        {
            validator: (rule,value,callback) => {
                if (value < 1) {
                    callback(new Error('分值不能小于1'));
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ]
}

/** 用户管理员新增 && 用户管理新增验证 **/
const memberRules = {
    username: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
    ],
    // phone: [
    //     { validator: validatePhone, trigger: 'blur' }
    // ],
    acount: [
        { required: true, message: '请输入账户', trigger: 'blur' },
        { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
       
    ],
    repeatPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' }
    ],
    email: [
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    unitId:[
        { required: true, message: '请选择所属部门', trigger: 'blur' }
    ]
}

const accountModifyRules = {
    acount:[
        { required: true, message: '请输入帐号', trigger: 'blur' },
        { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
    ],
    email:[
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    username:[
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    phone:[
        { validator: validatePhone, trigger: 'blur' }
    ],
}

export {
    // courseImportFormRules,
    safetyRules,
    dictRules,
    memberRules,
    modifyPwdRules,
    resetPwdRules,
    deptRules,
    codeRules,
    courseRules,
    itemBankRules,
    classifyRules,
    authRules,
    examRules,
    examImportFormRules,
    addSectioneFormRules,
    uploadFileFormRules,
    knowledgeCatalogFormRules,
    testPaperFormRules,
    addTestFormRules,
    menu2Rules,
    accountModifyRules

}


