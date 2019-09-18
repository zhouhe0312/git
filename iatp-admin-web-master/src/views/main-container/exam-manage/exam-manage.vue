<template>
    <div class="wrapper">
        <el-row justify="space-between" type="flex">
            <el-col :span="4">
                <div class="left_btn">
                    <el-button @click='handleSaveDialog("examForm")' size="medium" style='background: #f38916; float: left' type="warning" v-if="handleButtonHash('exam_manage:exam:add')">新增</el-button>
                    <el-button @click='handleExamImportDialog' size="medium" style='border:1px solid #f38916;color: #f38916;' v-if="handleButtonHash('exam_manage:exam:import')">导入</el-button>
                </div>
            </el-col>
            <el-col :span="20" class="search">
                <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="题干">
                        <el-input clearable placeholder="请输入试题题干"  @keyup.enter.native="dataSearch" class="search_right" v-model="searchInfo.params.topicStem"></el-input>
                    </el-form-item>
                    <el-form-item label="所属题库" style="margin-left:10px;">
                        <el-select placeholder="所属题库" style="margin-right:-10px" class="search_right"
                                   v-model="searchInfo.params.typeId">
                            <el-option :value="0" label="全部"></el-option>
                            <el-option
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"
                                    v-for="item in itemBankOptions">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="dataSearch" class="_search" icon="el-icon-search" type="primary">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row style='margin-top: 22px;'>
            <el-col>
                <el-table
                        :data="tableData"
                        :header-cell-style="{background:'#e9ecf3'}"
                        @selection-change="handleSelectionChange"
                        highlight-current-row
                        ref="multipleTable"
                        show-header
                        stripe
                        style="width: 100%"
                        tooltip-effect="dark"
                        v-loading="loading">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-form class="demo-table-expand" label-position="top" label-width="80px">
                                <el-form-item class="expandTitle" label="选项">
                                    <div>A. {{ props.row.optionA }}</div>
                                    <div>B. {{ props.row.optionB }}</div>
                                    <div>C. {{ props.row.optionC }}</div>
                                    <div>D. {{ props.row.optionD }}</div>
                                </el-form-item>
                                <el-form-item class="expandTitle" label="解析">
                                    <span>{{ props.row.topicAnalysis }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                   
                    <el-table-column
                         width="60"
                            :index="indexNum"
                            label="序号"
                            type='index'>
                    </el-table-column>
                    <el-table-column
                            label="题干"
                            prop="topicStem"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            label="答案"
                            prop="topicAnswer"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            label="所属题库"
                            prop="pname"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            label="状态"
                            prop="status">
                        <template  slot-scope="scope">
                             <el-switch
                              class="mySwitch"
                                :active-value="scope.row.status == 0 && 'exam_manage:exam:enable'"
                                :inactive-value="scope.row.status == 1 && 'exam_manage:exam:disable'"
                                @change = "handleStatus(scope.row.id)"
                                active-color="#f38916"
                                inactive-color="#bfbfbf" :title="scope.row.status == 1?'启用':'禁用'">
							</el-switch>

                            <!-- <el-link :underline="false" @click="handleStatus(scope.row.id)" style="color:#f38916" v-if="scope.row.status === 1 && 'exam_manage:exam:enable'">启用</el-link> -->
                            <!-- <el-link :underline="false" @click="handleStatus(scope.row.id)" style="color:#999" v-if="scope.row.status === 0 && 'exam_manage:exam:disable'">禁用</el-link> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="创建时间"
                            prop="createTime"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            label="操作对象"
                            prop="address"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                                <i @click="handleEditDialog(scope.row,'examForm')" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" v-if="handleButtonHash('exam_manage:exam:edit')"></i>
                                <i @click="deleteWQ(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer" v-if="handleButtonHash('exam_manage:exam:delete')" ></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-pagination
                        :current-page="Number(pages.current)"
                        :size="Number(pages.size)"
                        :total="Number(pages.total)"
                        @current-change = "currentChange"
                        background
                        layout="prev, pager, next"
                >
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 新增/编辑试题 -->
        <el-dialog :before-close="handleClose" :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" style="margin-top:-75px" width="50%">
            <el-form :model="examForm" :rules="rules" class="demo-ruleForm" label-width="100px" ref="examForm">
                <el-form-item label="题干" prop="topicStem">
                    <el-input type="textarea" v-model="examForm.topicStem"></el-input>
                </el-form-item>
                <el-form-item label="选项" prop="optionA">
                    <el-input v-model="examForm.optionA">
                        <template slot="prepend">A.</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="optionB">
                    <el-input v-model="examForm.optionB">
                        <template slot="prepend">B.</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="optionC">
                    <el-input v-model="examForm.optionC">
                        <template slot="prepend">C.</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="optionD">
                    <el-input v-model="examForm.optionD">
                        <template slot="prepend">D.</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="所属题库" prop="typeId">
                    <el-select placeholder="所属题库" style="width: 100%;" v-model="examForm.typeId">
                        <el-option
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                                v-for="item in itemBankOptions">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分值" prop="scoreValue">
                    <el-input v-model="examForm.scoreValue" maxlength="3"></el-input>
                </el-form-item>
                <el-form-item label="答案" prop="topicAnswer">
                    <el-select placeholder="所属题库" style="width: 100%;" v-model="examForm.topicAnswer">
                        <el-option label="A" value="A"></el-option>
                        <el-option label="B" value="B"></el-option>
                        <el-option label="C" value="C"></el-option>
                        <el-option label="D" value="D"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="解析" prop="topicAnalysis">
                    <el-input type="textarea" v-model="examForm.topicAnalysis"></el-input>
                </el-form-item>
            </el-form>
            <span class="dialog-footer" slot="footer">
		    <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
		    <el-button @click="handleExamSave" size="medium" type="primary">确 定</el-button>
		  </span>
        </el-dialog>

        <!-- 导入 -->
        <el-dialog :before-close="handleClose" :close-on-click-modal="false" :visible.sync="dialogImportVisible" title="导入试题" width="50%">
            <el-form :model="examImportForm" :rules="examImportFormRules" class="demo-ruleForm" label-width="100px" ref="examImportForm">
                <el-form-item label="所属题库" prop="typeId">
                    <el-select placeholder="所属题库" style="width: 100%;" v-model="examImportForm.typeId" @change="handleSelectChange">
                        <el-option
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                                v-for="item in itemBankOptions">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传试题" prop="optionA" style="margin-bottom: 0">
                    <el-upload
                            :action="importUrl"
                            :auto-upload="false"
                            :before-remove="beforeRemove"
                            :data="uploadData"
                            :file-list="fileList"
                            :headers="headers"
                            :limit="1"
                            :multiple="false"
                            :on-error="handleImportError"
                            :on-exceed="handleExceed"
                            :on-remove="handleRemove"
                            :on-success="handleImportSuccess"
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            class="_upload"
                            name="file"
                            ref="upload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
                    </el-upload>
                </el-form-item>
                <el-form-item style="margin-bottom: 0">
                    <el-button @click="handleDownloadTemplate" type="text">下载模板</el-button>
                </el-form-item>
            </el-form>
            <span class="dialog-footer" slot="footer">
		    <el-button @click="dialogImportVisible = false" size="medium">取 消</el-button>
		    <el-button @click="handleExamImportSave" size="medium" type="primary">确 定</el-button>
		  </span>
        </el-dialog>
        <delete-model :deleteObj="deleteObj"></delete-model>
    </div>
</template>

<script>
    import deleteModel from "@/components/deleteModel"
    import { examRules,examImportFormRules } from '@/util/rules'
    import {getValue} from "@/util/localStorage";

    export default {
        data() {
            return {
                loading:false,
                dialogVisible: false, //新增编辑
                dialogImportVisible: false,
                tableData: [],
                multipleSelection: [],
                indexNum: 1,
                itemBankOptions: [],
                isSave: true,
                dialogTitle:'',
                examForm: {
                    id:"",
                    topicStem:'',
                    optionA: '',
                    optionB: '',
                    optionC: '',
                    optionD: '',
                    typeId: "",
                    scoreValue: 0,
                    topicAnswer: "A",
                    topicAnalysis: ""
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
                        topicStem: '',
                        typeId: 0
                    }
                },
                importUrl: process.env.VUE_APP_BASE_API + "/admin/base-topic/import",
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                },
                rules: examRules,
                headers:{},
                examImportForm: {
                    typeId: ''
                },
                fileList: [],
                uploadData: {},
                examImportFormRules: examImportFormRules
            }
        },
        mounted() {
            this.headers = {"Authorization":getValue("token")}
            this.getData(this.searchInfo)
            this.itemBankRemoteMethod()
        },
        methods:{
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
//		    获取表格数据
            getData(value) {
                this.loading = true
                this.$store.dispatch('examManage/examList',value)
                    .then(() => {
                        this.tableData  = this.$store.state.examManage.examList
                        this.pages = this.$store.state.examManage.examPage;
                        this.loading = false
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
//		    删除
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
                        that.$store.dispatch('examManage/deleteExamAct',ids.join())
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
                            })
                            .catch((error) => {
                                that.loading = false
                            })
                    }
                }

            },
            //新增
            handleSaveDialog(formName) {
                this.examForm = {
                    id:"",
                    topicStem:'',
                    optionA: '',
                    optionB: '',
                    optionC: '',
                    optionD: '',
                    typeId: "",
                    scoreValue: 0,
                    topicAnswer: "A",
                    topicAnalysis: ""
                }
                this.dialogTitle = "新增试题"
                this.isSave = true
                this.dialogVisible = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                },10)
            },
            handleExamSave() {
                let that = this
                this.$refs['examForm'].validate((valid) => {
                    if (valid) {
                        const loading = that.$loading({target:document.querySelector(".wrapper"),fullscreen:false})
                        let action = "examManage/saveExamAct";
                        if(!that.isSave) {
                            action = "examManage/editExamAct";
                        }
                        that.$store.dispatch(action,that.examForm).then(() => {
                            loading.close()
                            this.$message({
                                message: '保存成功。',
                                type: "success",
                                center:'true',
                                duration: 5 * 1000
                            })
                            that.initPages();
                            that.getData(that.searchInfo)
                            that.dialogVisible = false
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
            handleEditDialog(row,formName) {
                this.dialogTitle = "编辑试题"
                this.dialogVisible = true
                this.isSave = false
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                    Object.assign(this.examForm, row);
                },10)
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
            //字典类型的拉取
            itemBankRemoteMethod() {
                this.$store.dispatch("itemBank/itemBankSelectList").then(() => {
                    this.itemBankOptions = this.$store.state.itemBank.itemBankSelectList
                }).catch(() => {

                })
            },
            //状态切换
            handleStatus(id) {
                const that = this
                this.$store.dispatch("examManage/enableDisabledExamAct",id).then(() => {
                    that.loading = true
                    that.initPages();
                    that.getData(that.searchInfo)
                }).catch(() => {
                })
            },
            handleExamImportDialog() {
                this.examImportForm = {
                    typeId: ''
                }
                this.fileList = []
                this.dialogImportVisible = true
            },
            handleSelectChange(val) {
                this.uploadData = {typeId: val}
            },
            handleExamImportSave() {
                const that = this
                if(that.$refs.upload.uploadFiles.length === 0) {
                    that.$message.warning("请选择要导入的文件")
                    return
                }
                that.$refs['examImportForm'].validate((valid) => {
                    if (valid) {
                        that.$refs.upload.submit();
                    } else {
                        that.$message({
                                message: '请检查填写内容',
                                type: "warning",
                                center:'true',
                            })
                    }
                });
            },

            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },

            handleExceed(files, fileList) {
                this.$message({
                                message: '当前限制选择 1 个文件！',
                                type: "warning",
                                center:'true',
                            })
            },
            handleImportSuccess(response, file, fileList) {
                this.dialogImportVisible = false
                this.getData(this.searchInfo) 
            },
            handleImportError(err, file, fileList) {
                const msg = JSON.parse(err.message).message || "导入失败！"
                this.$message({
                    message: msg,
                    type: "error",
                    center:'true',
                })
            },
            handleDownloadTemplate() {
                this.$store.dispatch("common/templateDownloadAct",2).then(() => {

                }).catch(() => {

                })
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
    
    .wq-form-inline {
        float: right;
    }
     .el-table th>.cell{
        color:#4c4b4b
    }
    .search_right .el-input-group__append {
        background: #f38916;
        color: #ffffff;
    }
    .el-table td, .el-table th{
		text-align: center
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
    .el-dialog__header {
        border-bottom: 2px solid #f38916;
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
    .demo-table-expand{
        float: left;
        margin-left: 10px;
    }
    .demo-table-expand .el-form-item .el-form-item__label {
        color: #b2b6bf;
        line-height: 15px;
        padding-left:7px
    }
    .demo-table-expand .el-form-item .el-form-item__content {
        padding-left: 10px;
        text-align: left
    }
    .demo-table-expand .el-form-item__label{
        text-align: left;
        width:100%
    }
     .mybtn:hover{
        color: #f38916 !important
    }
    .search_right input{
         /* border-right: none; */
        height:32px
     }
    .el-button--medium {
        padding: 8px 20px;
    }
    ._upload .el-upload__tip{
        display: inline-block;
        margin-left: 10px;
    }
    ._search{
        padding: 9px 20px;
        margin-left: -2px;
     }
</style>