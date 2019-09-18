<template>
    <div class="wrapper">
        <el-row type="flex" justify="space-between">
            <el-col :span="4">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('exam_manage:paper:add')" size="medium" type="warning" style='background: #f38916; float: left' @click='handleSaveDialog("testPaperForm")'>新增</el-button>
                    <!--<el-button size="medium" style='border:1px solid #f38916;color: #f38916;' @click='handleExamImportDialog'>删除</el-button>-->
                </div>
            </el-col>
            <el-col :span="20" class="search">
                <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="试卷名称">
                        <el-input v-model="searchInfo.params.title" @keyup.enter.native="dataSearch" class="search_right" clearable placeholder="请输入试卷名称"></el-input>
                    </el-form-item>
                    <el-form-item label="试卷类型" style="margin-left:10px;">
                        <el-select v-model="searchInfo.params.testType"
                         class="search_right"
                                   placeholder="试卷类型">
                            <el-option label="全部" :value="0"></el-option>
                            <el-option
                                    v-for="item in testPaperOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="_search" icon="el-icon-search" @click="dataSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row style='margin-top: 22px;'>
            <el-col>
                <el-table
                        highlight-current-row
                        ref="multipleTable"
                        :data="tableData"
                        :header-cell-style="{background:'#e9ecf3'}"
                        tooltip-effect="dark"
                        style="width: 100%"
                        show-header
                        center
                        stripe
                        v-loading="loading"
                        @selection-change="handleSelectionChange">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form label-position="right" label-width="80px" class="test-paper-table-expand _expend">
                                <el-form-item label="归属">
                                    {{props.row.courseName}}
                                    {{props.row.chapterPname ? (" < " + props.row.chapterPname):''}}
                                    {{props.row.chapterName ? (" < " + props.row.chapterName):''}}
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="60"
                            type='index'
                            :index="indexNum"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="试卷名称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="testType"
                            label="试卷类型"
                            :formatter="handleTestType">
                    </el-table-column>
                    <el-table-column
                            prop="score"
                            label="总分">
                    </el-table-column>
                    <el-table-column
                            prop="paperDuration"
                            label="考试时长(分)">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态">
                        <template  slot-scope="scope">
                            <el-switch
                                class="mySwitch"
                                :active-value="scope.row.status == 0 && 'exam_manage:paper:enable'"
                                :inactive-value="scope.row.status == 1 && 'exam_manage:paper:disable'"
                                @change = "handleStatus(scope.row.id)"
                                active-color="#f38916"
                                inactive-color="#bfbfbf" :title="scope.row.status == 1?'启用':'禁用'">
							</el-switch>
                            <!-- <el-link v-if="scope.row.status === 1 && 'exam_manage:paper:enable'" :underline="false" style="color:#f38916" @click="handleStatus(scope.row.id)" type="success">启用</el-link> -->
                            <!-- <el-link v-if="scope.row.status === 0 && 'exam_manage:paper:disable'" :underline="false" style="color:#999" @click="handleStatus(scope.row.id)" type="danger">禁用</el-link> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="操作对象"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <template v-if="scope.row.assessed === 1">
                                <i @click="toJumpJoinTestPage(scope.row)" class="el-icon-reading mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" v-if="handleButtonHash('exam_manage:paper:compose')" title="组卷"></i>
                                <!-- <el-link
                                        v-if="handleButtonHash('exam_manage:paper:compose')"
                                        type="primary"
                                        :underline="false"
                                        @click="toJumpJoinTestPage(scope.row)"
                                        style="margin-right: 10px;">组卷
                                </el-link> -->
                            </template>
                            <template v-if="scope.row.assessed === 0">
                                <i @click="handleSeeTest(scope.row)" class="el-icon-view mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" title="查看"></i>
                                
                                <!-- <el-link
                                        type="primary"
                                        :underline="false"
                                        @click="handleSeeTest(scope.row)"
                                        style="margin-right: 10px;">查看
                                </el-link> -->
                            </template>
                            <i @click="handleEditDialog(scope.row,'testPaperForm')" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" v-if="handleButtonHash('exam_manage:paper:edit')"></i>
                            <i @click="deleteWQ(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer" v-if="handleButtonHash('exam_manage:paper:delete')"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="Number(pages.total)"
                        :size="Number(pages.size)"
                        :current-page="Number(pages.current)"
                        @current-change = "currentChange"
                >
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 新增/编辑试卷 -->
        <el-dialog class="test-paper" width="50%" :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" @close="handleDialogClose" :close-on-click-modal="false">
            <el-form :model="testPaperForm" :rules="rules" ref="testPaperForm" label-width="110px" class="demo-ruleForm">
                <el-form-item label="试卷名称" prop="title">
                    <el-input v-model="testPaperForm.title"></el-input>
                </el-form-item>
                <el-form-item label="试卷类型" prop="testType">
                    <el-select v-model="testPaperForm.testType" @change="handleChangeTestType" placeholder="试卷类型" style="width: 100%;">
                        <el-option
                                v-for="item in testPaperOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="试卷归属" prop="ascription">
                    <el-cascader
                            style="width: 100%"
                            :options="ascriptions"
                            :props="props"
                            v-model="testPaperForm.ascription"
                            @active-item-change="handleItemChange"
                            @change="handleCasaderChange"></el-cascader>
                </el-form-item>

                <el-form-item label="分值" prop="score">
                    <el-input v-model.number="testPaperForm.score" :disabled="scoreIsReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="考试时长(分)" prop="paperDuration">
                    <el-input v-model.number="testPaperForm.paperDuration"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="handleSave">确 定</el-button>
		  </span>
        </el-dialog>

        <!-- 综合考试 -->
        <el-dialog class="showCompreDia" :close-on-click-modal="false"  width="40%" :visible.sync="showCompreTest">
            <el-form :inline="true">
                <el-row>
                    <el-col :span="24" style="margin-bottom: 30px">
                        <P  style="text-align: center;font-weight:600;font-size:15px">{{compreTest.title}}</P>
                        <P  style="text-align: center;color:#999;font-size:12px;margin-top:10px">{{'满分 '+compreTest.score+'分，总时长 '+compreTest.paperDuration+'分钟'}}</P> 
                    </el-col>
                
                    <el-col :span="12">
                        <el-form-item label="课程：">
                            <el-input readonly :value="compreTest.courseName?compreTest.courseName:''"></el-input>
                        </el-form-item>
                    </el-col>
                
                    <el-col :span="12">
                        <el-form-item label="实验：" prop="">
                            <el-select v-model="currTest" placeholder="请选择">
                                <el-option label="无" :value="0"></el-option>
                                <el-option v-for="item in TestList" :key="item.key" :label="item.value" :value="item.key"> 
                                </el-option>
                            </el-select>  
                            </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="showCompreTest = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitPaper">确 定</el-button>
            </span>
		</el-dialog>

        <!-- 查看试题 -->
        <el-dialog class="test-paper" title="查看试题" width="50%" :before-close="handleClose" :visible.sync="dialogVisibleSeeTest">
            <el-table
                    highlight-current-row
                    :data="seeTestList"
                    :header-cell-style="{background:'#e9ecf3'}"
                    tooltip-effect="dark"
                    style="width: 100%"
                    show-header
                    stripe
                    v-loading="loading">
                <el-table-column
                        width="60"
                        type='index'
                        label="序号">
                </el-table-column>
                <el-table-column
                        prop="topicStem"
                        label="题干"
                        width="auto"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        prop="optionA"
                        width="auto"
                        label="选项A">
                </el-table-column>
                <el-table-column
                        prop="optionB"
                        width="auto"
                        label="选项B">
                </el-table-column>
                <el-table-column
                        prop="optionC"
                        width="auto"
                        label="选择C">
                </el-table-column>
                <el-table-column
                        prop="optionD"
                        width="auto"
                        label="选择D">
                </el-table-column>
                <el-table-column
                        prop="scoreValue"
                        width="50"
                        label="分值">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisibleSeeTest = false">关 闭</el-button>
            </span>
        </el-dialog>

        <delete-model :deleteObj="deleteObj"></delete-model>
    </div>
</template>

<script>
    import deleteModel from "@/components/deleteModel"
    import {testPaperFormRules} from '@/util/rules'

    export default {
        data() {
            return {
                loading:false,
                dialogVisible: false, //新增编辑
                tableData: [],
                multipleSelection: [],
                indexNum: 1,
                isSave: true,
                dialogTitle:'',
                testPaperForm: {
                    id:"",
                    title:'',
                    testType: '',
                    ascription: [],
                    paperDuration: 0,
                    score: 0,
                    courseId:"", //课程ID
                    chapterId: "", //章ID
                    subsection: "",  //节ID
                    courseOneId: "" //如果是综合试卷课程ID放到此处
                },
                pages:{
                    total: 0,
                    size: 10,
                    current: 1
                },
                searchInfo:{
                    page: {
                        current: 1,
                        size: 10
                    },
                    params: {
                        title: '',
                        testType: 0
                    }
                },
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                },
                rules: testPaperFormRules,
                ascriptions:[],
                props: {
                    value: 'key',
                    label: 'value',
                    children: 'children'
                },
                //1:课程随堂，2：课程单元，3：课程，4：实验随堂，5：实验单元，6：实验，7：综合'
                testPaperOptions: [
                    {label:"课程-随堂测",value:1},
                    {label:"课程-单元测",value:2},
                    {label:"课程考试",value:3},
                    {label:"实验-随堂测",value:4},
                    {label:"实验考试",value:6},
                    {label:"综合考试",value:7}
                ],
                //实验类型
                experimentArray:[4,6],
                //有子数据的
                childrenArray:[1,2,4],
                level3Array:[1,4],
                showCompreTest:false, //综合考试
                compreTest:'',
                TestList:[],
                currTest:0,
                seeTestList:[],
                dialogVisibleSeeTest:false,
                scoreIsReadOnly:false,
                scoreFlag: false,
                score: 0
            }
        },
        mounted() {
            this.getData(this.searchInfo)
        },
        methods:{
            //状态切换
            handleStatus(id) {
                const that = this
                this.$store.dispatch("testPaper/enableDisabledTestPaperAct",id).then(() => {
                    that.loading = true
                    that.initPages();
                    that.getData(that.searchInfo)
                }).catch(() => {
                })
            },
             toJumpJoinTestPage(item){
                 if(item.testType === 7){//综合考试
                    this.compreTest = item
                    this.getTestList()//获取实验
                     this.currTest = 0
                    this.showCompreTest = true
                 }else{
                    localStorage.setItem('JUMPTESTPAGER',JSON.stringify(item))
                    this.$router.push({
                        path:"/index/joinTestPaper",
                    });
                 }
            },

             //完成组卷
            submitPaper(){
                const params = {
                    "chapelTestId": this.compreTest.id,
                    "courseId": this.currTest
                }
                this.$store.dispatch('joinTestPaper/compositionTestAct',params)
                .then((response) => {
                    this.showCompreTest = false
                    this.$message({
                        message: response.message,
                        type: "success",
                        center:'true',
                        duration: 3 * 1000
                    })
                })
                .catch((error) => {
                     //this.showCompreTest = false
				})	
            },
            //下拉框实验list
            getTestList(){
                var val ={type:2}
                this.$store.dispatch('joinTestPaper/getSelectListAct',val)
                .then((response) => {
                    this.TestList = this.$store.state.joinTestPaper.selectListActData
                })
                .catch((error) => {
                    
				})	
            },
             handleButtonHash(btnKey) {
                const btns = this.$store.getters.buttons
                for(let key in btns) {
                    if(key === btnKey) {
                        return btns[key]
                    }
                }
                return null
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
		    //获取表格数据
            getData(value) {
                this.loading = true
                this.$store.dispatch('testPaper/testPaperListAct',value)
                    .then(() => {
                        this.tableData  = this.$store.state.testPaper.testPaperList
                        this.pages = this.$store.state.testPaper.testPaperPage;
                        this.loading = false
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
		    //删除
            deleteWQ(row) {
                let that = this
                let ids = []
                if(row.id) {
                    ids.push(row.id)
                } else {
                    if(that.multipleSelection.length === 0) {
                        that.$message({
                            message: '请选择要删除的项！',
                            type: 'warning',
                            center:'true',
                        });
                        return
                    }
                    that.multipleSelection.map(val => {
                        ids.push(val.id)
                    })
                }
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {

                        that.$store.dispatch('testPaper/deleteTestPaperAct',ids.join())
                            .then(() => {
                                that.deleteObj.deleteModel = false;
                                // 消息提示
                                that.$message({
                                    message: '删除成功。',
                                    type: "success",
                                    center:'true',
                                    duration: 3 * 1000
                                })
                                that.initPages();
                                that.getData(that.searchInfo)
                                that.loading = false
                                that.indexNum = 1
                            })
                            .catch((error) => {
                                that.loading = false
                            })
                    }
                }

            },
           
            handleSave() {
                let that = this
                this.$refs['testPaperForm'].validate((valid) => {
                    if (valid) {
                        const loading = that.$loading({target:document.querySelector(".wrapper"),fullscreen:false})
                        let action = "testPaper/saveTestPaperAct";
                        if(!that.isSave) {
                            action = "testPaper/editTestPaperAct";
                        }
                        that.$store.dispatch(action,that.testPaperForm).then(() => {
                            that.dialogVisible = false
                            loading.close()
                            this.$message({
                                message: '保存成功。',
                                type: "success",
                                center:'true',
                                duration: 5 * 1000
                            })
                            that.initPages();
                            that.getData(that.searchInfo)
                           
                        }).catch(() => {
                            loading.close()
                        })
                    } else {
                        that.$message({
                                message: '请检查填写内容',
                                type: "warning",
                                center:'true',
                            })
                    }
                });
            },
             //新增
            handleSaveDialog(formName) {
                this.dialogVisible = true

                this.testPaperForm = {
                    id:"",
                    title:'',
                    testType: '',
                    ascription: [],
                    paperDuration: 0,
                    score: 0,
                    courseId:"", //课程ID
                    chapterId: "", //章ID
                    subsection: "",  //节ID
                    courseOneId: "" //如果是综合试卷课程ID放到此处
                }
                
                this.dialogTitle = "新增试卷"
                this.isSave = true
            },
            handleEditDialog(row,formName) {
                const loading = this.$loading({target:document.querySelector(".wrapper"),fullscreen:false})
                this.dialogTitle = "编辑试卷"
                this.isSave = false
                Object.assign(this.testPaperForm, row)

                const that = this
                if(that.testPaperForm.testType !== 7) {
                    that.$store.dispatch("testPaper/isTestAssemblyAct",row.id).then(() => {
                        that.scoreIsReadOnly = that.$store.state.testPaper.isTestAssembly
                        that.scoreFlag = that.scoreIsReadOnly
                        if(that.scoreIsReadOnly) {
                            that.testPaperOptions[that.testPaperOptions.length - 1].disabled = true
                        }
                        Object.assign(this.testPaperForm, row)
                    }).catch(() => {

                    })
                } else {
                    Object.assign(this.testPaperForm, row)
                }

                const temp = []
                const testType = this.testPaperForm.testType
                if(testType === 7) {
                    temp.push(row.courseOneId)
                } else {
                    temp.push(row.courseId)
                }
                this.handleChangeTestType(testType).then(() => {
                    if(that.childrenArray.includes(testType)) {
                        that.handleChapterSelectList(temp).then(()=> {
                            if(row.chapterId) {
                                temp.push(row.chapterId)
                                if(that.level3Array.includes(testType)) {
                                    that.handleChapterSelectList(temp).then(() => {
                                        if(row.subsection) {
                                            temp.push(row.subsection)
                                        }
                                        that.dialogVisible = true
                                        loading.close()
                                    }).catch(() => {
                                        loading.close()
                                    })
                                } else {
                                    that.dialogVisible = true
                                    loading.close()
                                }
                            } else {
                                that.dialogVisible = true
                                loading.close()
                            }
                        }).catch((err) => {
                            loading.close()
                            console.error(err)
                        })
                    } else {
                        that.dialogVisible = true
                        loading.close()
                    }
                    that.testPaperForm.ascription = temp
                }).catch((err) => {
                    loading.close()
                    console.error(err)
                })
            },
//		    搜索
            dataSearch() {
                this.initPages();
                this.getData(this.searchInfo)
            },
//		    分页
            currentChange(current) {
                this.searchInfo.page.size = this.pages.size
                this.searchInfo.page.current = current
                this.getData(this.searchInfo)
                this.indexNumber(current,this.pages.size)
            },

            handleCourseList(type,val) {
                const that = this
                return new Promise((resolve,reject) => {
                    that.$store.dispatch("user/obtainCourseKeyValueList",type).then(() => {
                        that.handleClearCCS()
                        that.ascriptions = this.$store.state.user.courseKeyValueList
                        if(that.childrenArray.includes(val)) {
                            for(let item of that.ascriptions) {
                                item["children"] = []
                            }
                        }
                        resolve()
                    }).catch((err) => {
                        reject(err)
                    })
                })
            },
            
            handleChangeTestType(val) {
                const that = this
                if(this.isSave) {
                    //新建
                    if(val === 7) {
                        this.scoreIsReadOnly = true
                        this.testPaperForm.score = 100
                    } else {
                        this.scoreIsReadOnly = false
                        this.testPaperForm.score = 0
                    }
                } else {
                    //编辑
                    if(!that.scoreFlag) {
                        if(val === 7) {
                            this.scoreIsReadOnly = true
                            that.score = this.testPaperForm.score
                            this.testPaperForm.score = 100
                        } else {
                            this.scoreIsReadOnly = false
                            if(that.score !== 0)
                                this.testPaperForm.score = that.score
                        }
                    }
                }


                let type = 1
                if(that.experimentArray.includes(val)) {
                    type = 2

                }
                return new Promise((resolve,reject) => {
                    that.handleCourseList(type,val).then(() => {
                        resolve()
                    }).catch((err) => {
                        reject(err)
                    })
                })
            },
            handleItemChange(val) {
                const loading = this.$loading({target:document.querySelector(".test-paper"),fullscreen:false})
                this.handleChapterSelectList(val).then(()=> {
                    loading.close()
                }).catch(() => {
                    loading.close()
                })
            },
            handleClearCCS() {
                this.testPaperForm.ascription = []
            },
            handleCasaderChange(val) {
                if(this.testPaperForm.testType === 7) {
                    this.testPaperForm.courseOneId = val[0]
                } else {
                    const len = val.length
                    if(len === 1) {
                        this.testPaperForm.courseId = val[0]
                    } else if(len === 2) {
                        this.testPaperForm.courseId = val[0]
                        this.testPaperForm.chapterId = val[1]
                    } else {
                        this.testPaperForm.courseId = val[0]
                        this.testPaperForm.chapterId = val[1]
                        this.testPaperForm.subsection = val[2]
                    }
                }
            },
            handleTestType(row) {
                for(let item of this.testPaperOptions) {
                    if(item.value === row.testType) {
                        return item.label
                    }
                }
            },
            handleChapterSelectList(val) {
                return new Promise((resolve,reject) => {
                    const len = val.length
                    this.$store.dispatch("testPaper/chapterSelectListAct",{pidOrCourseId:val[len -1],type:len}).then(() => {
                        const chapterList = this.$store.state.testPaper.chapterSelectList
                        if(!chapterList || chapterList.length === 0) {
                            resolve()
                            return
                        }
                        if(len === 1) {

                            if(this.level3Array.includes(this.testPaperForm.testType)) {
                                for(let item of chapterList) {
                                    item.children = []
                                }
                            }

                            const temp = []
                            Object.assign(temp, this.ascriptions);
                            for(let cItem of temp) {
                                if(cItem.key === val[0]) {
                                    cItem.children = chapterList
                                }
                            }
                            this.ascriptions = temp

                        } else if (len === 2) {
                            const temp = []
                            Object.assign(temp, this.ascriptions);
                            for(let cItem of temp) {
                                if(cItem.key === val[0]) {
                                    for(let jItme of cItem.children) {
                                        if(jItme.key === val[1]) {
                                            jItme.children = chapterList
                                        }
                                    }
                                }
                            }
                            this.ascriptions = temp
                        }
                        resolve()
                    }).catch((err) => {
                        reject(err)
                    })
                })
            },
            handleSeeTest(row) {
                this.$store.dispatch("testPaper/seeTestListAct",row.id).then(() => {
                    this.dialogVisibleSeeTest = true
                    this.seeTestList = this.$store.getters.seeTestList
                }).catch(() => {

                })
            },
            handleDialogClose() {
                this.scoreIsReadOnly = false
                this.$refs["testPaperForm"].resetFields();
                this.testPaperOptions[this.testPaperOptions.length - 1].disabled = false
                this.scoreFlag = false
                this.score = 0
            },
            handleClose(done) {
                done()
            },
            initPages() {
                this.searchInfo.page = {current: 1,size: 10}
                this.pages.current = 1
            },
            indexNumber(current,size) {
                this.indexNum = (current - 1) * size + 1
            }
        },
        components:{
            deleteModel
        }
    }
</script>

<style>
   .mySwitch .el-switch__core{
        width: 36px !important;
        height: 17px !important;
    }
    .mySwitch .el-switch__core:after{
        width: 13px !important;
        height: 13px !important;
        left: 19px !important;
    }
    .mybtn:hover{
        color: #f38916 !important
    }
    .showCompreDia .el-dialog__headerbtn{
        display: none
    }
    .showCompreDia .el-dialog__header{
       border: none !important
    }
    .wq-form-inline {
        float: right;
    }
    .showCompreDia .el-dialog__body{
        padding: 0px 20px 30px
    }
    .test-paper .el-dialog__header{
        border-bottom: 2px solid #f38916;
    }
     .el-table th>.cell{
        color:#4c4b4b
    }
    .el-table td, .el-table th{
        text-align: center
    }
    .el-form--inline .el-form-item{
        margin-right: 0px
    }
    .search_right .el-input-group__append {
        background: #f38916;
        color: #ffffff;
    }
    .el-button {
        border-radius: 0;
    }
    .el-pagination {
        text-align: center;
        margin-top: 50px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #f38916;
    }
    .el-pagination.is-background .el-pager li ,.el-pagination.is-background .btn-prev,.el-pagination.is-background .btn-next{
        border: 1px solid #f38916;
        border-radius: 0;
        background: white;
    }
    .el-icon-more {
        margin-left: 15px;
    }
    .search .el-form-item {
        margin-bottom: 0;
    }
    
    .el-dialog__footer {
        text-align: center;
    }
    .el-button--primary ,.el-button--primary:hover {
        background: #f38916;
        border: none;
    }
    .el-button--default,.el-button--default:hover {
        color: black;
        border: 1px solid #DCDFE6;
        background: white;
    }
    .test-paper-table-expand .el-form-item .el-form-item__label {
        color: #b2b6bf;
        /*line-height: 15px;*/
    }
    .test-paper-table-expand .el-form-item .el-form-item__content {
        padding-left: 10px;
    }
    ._expend .el-form-item .el-form-item__content{
        margin-left: 0px !important;
        float:left
    }
     .search_right input{
          /* border-right: none; */
        height:32px
     }
     ._search{
        padding: 9px 20px;
        margin-left: -2px;
     }
      .el-button--medium {
        padding: 8px 20px;
    }
</style>