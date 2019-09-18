<template>
    <div class="wrapper">
        <el-row type="flex" justify="space-between">
            <el-col :span="4">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('knowledge_manage:info:add')" size="medium" type="warning" style='background: #f38916;' @click='handleSaveDialog("knowledgeCatalogForm")'>新增</el-button>
                    <el-button v-if="handleButtonHash('knowledge_manage:info:delete')" size="medium" style='border:1px solid #f38916;color: #f38916;' @click='deleteWQ'>删除</el-button>
                </div>
            </el-col>
            <el-col :span="20" class="search">
                 <div class="wq-form-inline">
                    <div  class="search_right">
                        <el-input @keyup.enter.native="dataSearch" placeholder="请输入知识库名称" clearable v-model="searchInfo.params.name">
                            <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                        </el-input>
                    </div>
                </div>
                <!-- <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="" class="search_right">
                        <el-input placeholder="请输入知识库名称"  @keyup.enter.native="dataSearch"  clearable  v-model="searchInfo.params.name">
                            <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                        </el-input>
                    </el-form-item>
                </el-form> -->
            </el-col>
        </el-row>
        <el-row style="margin-top:22px">
            <el-col>
                <el-table
                        class="myTable"
                        highlight-current-row
                        ref="multipleTable"
                        :data="tableData"
                        :header-cell-style="{background:'#e9ecf3'}"
                        tooltip-effect="dark"
                        style="width: 100%"
                        show-header
                        stripe
                        v-loading="loading"
                        @row-click="handleRowClick"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            width="60"
                            type='index'
                            :index="indexNum"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="名称"
                            min-width="180"
                            show-overflow-tooltip>
                    </el-table-column>
                    
                    <el-table-column
                            prop="issued"
                            label="发布单位"
                            min-width="180"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="version"
                            label="文号"
                            min-width="100"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="releaseDate"
                            width="100"
                            label="发布日期">
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态"
                             width="100"
                            :formatter="handleStatus">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="操作对象"
                            width="140">
                        <template slot-scope="scope">
                            <i @click.stop="handleEditDialog(scope.row,'knowledgeCatalogForm')" title="编辑" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:6px"  v-if="handleButtonHash('knowledge_manage:info:edit')"></i>
                            <i @click.stop="deleteWQ(scope.row)"  title="删除" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:6px" v-if="handleButtonHash('knowledge_manage:info:delete')" ></i>
                            <div @click.stop="handleKnowledgeCatalogId(scope.row)" style="display: inline-block;">
                                <el-upload
                                        v-if="handleButtonHash('knowledge_manage:info:upload')"
                                        style=""
                                        :headers="headers"
                                        :action="uploadUrl"
                                        :show-file-list="false"
                                        :on-success="handleUploadSuccess"
                                        :on-error="handleUploadError"
                                        name="file">
                                        <i class="el-icon-newshangchuan mybtn" style="font-size:15px;cursor:pointer;margin-right:6px"  title="上传"></i>
                                    <!-- <el-link type="info" :underline="false" style="margin-right: 15px;">上传</el-link> -->
                                </el-upload>
                            </div>
                            <i @click.stop="handleDownloadFile(scope.row)" title="下载" class="el-icon-download mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:6px"  v-if="handleButtonHash('knowledge_manage:info:download')"></i>
                            <i v-show="scope.row.filename !== null" @click.stop="handleFilePreview(scope.row)"  title="预览" class="el-icon-view mybtn" style="color:#999;font-size:17px;cursor:pointer" v-if="handleButtonHash('knowledge_manage:info:download')" ></i>
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
        <!-- 新增 -->
        <el-dialog  :close-on-click-modal="false" width="50%" :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose">
            <el-form :model="knowledgeCatalogForm" :rules="rules" ref="knowledgeCatalogForm" label-width="100px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="knowledgeCatalogForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="关键字" prop="keyword">
                            <el-input v-model="knowledgeCatalogForm.keyword"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="摘要" prop="summary">
                            <el-input type="textarea" v-model="knowledgeCatalogForm.summary"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="文号" prop="version">
                            <el-input v-model="knowledgeCatalogForm.version"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态" prop="status">
                            <el-select v-model="knowledgeCatalogForm.status" placeholder="状态" style="width: 100%">
                                <el-option label="现行" :value="1"></el-option>
                                <el-option label="废止" :value="2"></el-option>
                                <el-option label="试行" :value="3"></el-option>
                                <el-option label="禁用" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="类别" prop="category">
                            <el-select v-model="knowledgeCatalogForm.category" placeholder="类别" style="width: 100%">
                                <el-option
                                        v-for="item in categoryList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="小类" prop="classes">
                            <el-select v-model="knowledgeCatalogForm.classes" placeholder="小类" style="width: 100%">
                                <el-option
                                        v-for="item in classesList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="发布单位" prop="issued">
                            <el-input v-model="knowledgeCatalogForm.issued"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发布日期" prop="releaseDate">
                            <el-date-picker
                                    v-model="knowledgeCatalogForm.releaseDate"
                                    type="date"
                                    :picker-options="startTime"
                                    placeholder="选择日期"
                                    style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="废止日期" prop="discardDate">
                            <el-date-picker
                                    v-model="knowledgeCatalogForm.discardDate"
                                    :picker-options="endTime"
                                    type="date"
                                    placeholder="选择日期"
                                    style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="handleSave">确 定</el-button>
		  </span>
        </el-dialog>

        <!-- 预览文件 -->
        <!-- <div v-if="dialogPreviewVisible"  class="preview-dialog"></div> -->
        <el-dialog width="75%" title="预览" :close-on-click-modal="false" class="mydialog" :visible.sync="dialogPreviewVisible" :before-close="handleClose">
            <div class="preview-img" :style="contontHeight">
                <div v-for="(img, index) in imgIds" :key="index" style="width: 100%;">
                    <img v-lazy="previewUrl + img" :key="index" width="100%" />
                </div>
            </div>
        </el-dialog>

        <!-- 右侧折叠边栏 -->
        <el-dialog width="550px" title="详细信息" :visible.sync="dialogViewVisible" custom-class="custom-dialog" top="0" :before-close="handleClose">
            <el-row class="details-row" :gutter="15">
                <el-col :span="4"><b>名称</b></el-col>
                <el-col :span="20">{{knowledgeCatalogForm.name}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>关键词</b></el-col>
                <el-col :span="20">{{knowledgeCatalogForm.keyword}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>摘要</b></el-col>
                <el-col :span="20">{{knowledgeCatalogForm.summary}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>文号</b></el-col>
                <el-col :span="20">{{knowledgeCatalogForm.version}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>状态</b></el-col>
                <el-col :span="20">{{handleStatus(knowledgeCatalogForm)}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>发布单位</b></el-col>
                <el-col :span="20">{{knowledgeCatalogForm.issued}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>类别</b></el-col>
                <el-col :span="20">{{handleCategory(knowledgeCatalogForm.category)}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>小类</b></el-col>
                <el-col :span="20">{{handleClasses(knowledgeCatalogForm.classes)}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>发布日期</b></el-col>
                <el-col :span="20">{{knowledgeCatalogForm.releaseDate}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>
            </el-row>
        </el-dialog>

        <delete-model :deleteObj="deleteObj"></delete-model>
    </div>
</template>

<script>
    import deleteModel from "@/components/deleteModel"
    import {getValue} from "@/util/localStorage";
    import { constants } from '@/util/common'
    import {knowledgeCatalogFormRules} from '@/util/rules'
import { setTimeout } from 'timers';

    export default {
        data() {
            return {
                loading:false,
                dialogVisible: false, //新增知识库目录
                dialogPreviewVisible: false,
                dialogViewVisible: false,
                dialogTitle:'',
                tableData: [],
                multipleSelection: [],
                indexNum: 1,
                isSave: true,
                headers:{},
                uploadUrl: constants.uploadUrl,
                contontHeight:'height:'+(window.innerHeight-220)+'px',
                knowledgeCatalogForm: {
                    id:"",
                    name: "",
                    keyword: "",
                    summary: '',
                    version: '',
                    status: 1,
                    category: "",
                    classes: "",
                    issued: '',
                    releaseDate: null,
                    discardDate: null,
                    filename: ''
                },
                startTime: {
                    disabledDate: time => {
                        if (this.knowledgeCatalogForm.discardDate) {
                            return time.getTime() > new Date(this.knowledgeCatalogForm.discardDate).getTime()
                        }
                    }
                },
                endTime: {
                    disabledDate: time => {
                        if (this.knowledgeCatalogForm.releaseDate) {
                            return time.getTime() < new Date(this.knowledgeCatalogForm.releaseDate).getTime()
                        }
                    }
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
                        name: ''
                    }
                },
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                },
                rules: knowledgeCatalogFormRules,
                knowledgeCatalogId: "",
                categoryList:[
                    {label:'法律法规',value:1},
                    {label:'标准',value:2},
                    {label:'中国行业监管政策',value:3},
                    {label:'组织规章制度',value:4}
                    ],
                classesList:[
                    {label:"国际法", value:11},
                    {label:"区域组织法", value:12},
                    {label:"国家和地区法", value:13},
                    {label:"国际标准", value:21},
                    {label:"国际组织标准", value:22},
                    {label:"区域组织标准", value:23},
                    {label:"国家和地区标准", value:24},
                    {label:"国家行业标准", value:25},
                    {label:"企业标准", value:26},
                    {label:"银保监会监管指引", value:31},
                    {label:"证监会管理办法", value:32},
                    {label:"信息科技管理制度", value:41},
                    {label:"风险管理制度", value:42},
                    {label:"其他", value:99}
                ],
                previewUrl:constants.downloadUrl,
                imgIds:[]
            }
        },
        mounted() {
            this.headers = {Authorization:getValue("token")}
            this.getData(this.searchInfo)
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
                this.$store.dispatch('knowledge/knowledgeCatalogList',value)
                    .then(() => {
                        this.tableData  = this.$store.state.knowledge.knowledgeCatalogList
                        console.log(this.tableData)
                        this.pages = this.$store.state.knowledge.knowledgeCatalogPage;
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

                        that.$store.dispatch('knowledge/deleteKnowledgeCatalogAct',ids.join())
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
                                that.indexNumber(1,that.pages.size)
                            })
                            .catch(() => {
                                that.loading = false
                              //  that.deleteObj.deleteModel = false;
                                //that.$message.error('删除失败！');
                            })
                    }
                }
                console.log(123)
            },
            //新增
            handleSaveDialog(formName) {
                this.knowledgeCatalogForm = {
                    id:"",
                    name: "",
                    keyword: "",
                    summary: '',
                    version: '',
                    status: 1,
                    category: "",
                    classes: "",
                    issued: '',
                    releaseDate: null,
                    discardDate: null
                }
                this.dialogTitle='新增目录'
                this.isSave = true
                this.dialogVisible = true
                setTimeout(()=>{
                     this.$refs[formName].resetFields();
                },10)

            },
            handleSave() {
                let that = this
                if(that.knowledgeCatalogForm.status == 2 && !that.knowledgeCatalogForm.discardDate){
                    that.$message({
                        message: '废止日期不能为空哦！',
                        type: "warning",
                        center:'true',
                        duration: 3 * 1000
                    })
                    return
                }
                this.$refs['knowledgeCatalogForm'].validate((valid) => {
                    if (valid) {
                        const loading = that.$loading({target:document.querySelector(".wrapper"),fullscreen:false})
                        let action = "knowledge/saveKnowledgeCatalogAct";
                        if(!that.isSave) {
                            action = "knowledge/editKnowledgeCatalogAct";
                        }
                        that.$store.dispatch(action,that.knowledgeCatalogForm).then(() => {
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
                            that.indexNumber(1,that.pages.size)
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
                this.$store.dispatch("knowledge/knowledgeCatalogInfoAct",row.id).then(() => {
                    this.dialogVisible = true
                    this.isSave = false
                    this.dialogTitle='修改目录'
                    setTimeout(()=>{
                        this.$refs[formName].resetFields();
                        this.knowledgeCatalogForm = this.$store.state.knowledge.knowledgeCatalogInfo
                    },10)
                }).catch(() => {

                })

            },
//		    搜索
            dataSearch() {
                this.initPages();
                this.getData(this.searchInfo)
            },
//		    分页
            currentChange(current) {
                this.getData(this.searchInfo)
                this.indexNumber(current,this.pages.size)
                this.searchInfo.page.size = this.pages.size
                this.searchInfo.page.current = current
            },
            //1 现行，2 废止，3 试行，0 禁用
            handleStatus(row,column,celValue,index) {
                if(row.status === 1) {
                    return "现行"
                } else if(row.status === 0) {
                    return "禁用"
                } else if(row.status === 2) {
                    return "废止"
                } else if(row.status === 3) {
                    return "试行"
                } else if(row.status === -1) {
                    return "删除"
                } else {
                    return "未知"
                }
            },
            handleCategory(category) {
                for(let c in this.categoryList) {
                    if(this.categoryList[c].value === Number(category)) {
                        return this.categoryList[c].label
                    }
                }
            },
            handleClasses(classess) {
                for(let c in this.classesList) {
                    if(this.classesList[c].value === Number(classess)) {
                        return this.classesList[c].label
                    }
                }
            },
            handleDownloadFile(row) {
                if(!row.filename) {
                    this.$message({
                        message: '未上传文件！',
                        type: "warning",
                         center:'true',
                    })
                    return
                }
                let loading = this.$loading({target:document.querySelector(".wrapper"),fullscreen:false})
                this.$store.dispatch('knowledge/downloadKnowledgeCatalogAct',row.filename)
                    .then(() => {
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    })
            },
            handleKnowledgeCatalogId(row) {
                this.knowledgeCatalogId = row.id
            },
            handleUploadSuccess(response, file, fileList) {
                const that = this
                const filename = response.data.id + "." + response.data.type
                that.$store.dispatch("knowledge/updateFileNameAct",{id:that.knowledgeCatalogId,filename:filename}).then(() => {
                    that.$message({
                        message: '上传成功！',
                        type: "success",
                         center:'true',
                        duration: 5 * 1000
                    })
                    that.initPages();
                    that.getData(that.searchInfo)
                }).catch(() => {
                })
            },
            handleUploadError(err, file, fileList) {
                console.log("失败")
            },
            handleFilePreview(row) {
                if(!row.filename) {
                    this.$message({
                        message: '未上传文件！',
                        type: "warning",
                        center:'true',
                    })
                    return
                }
                const loading = this.$loading({target:document.querySelector(".wrapper"),fullscreen:true})
                this.$store.dispatch("knowledge/officePdfToPicAct",row.filename).then(() => {
                    loading.close()
                    this.dialogPreviewVisible = true
                    this.imgIds = this.$store.getters.imgIds
                   // console.log( this.imgIds)
                }).catch(() => {
                    loading.close()
                })
                
            },
            handleRowClick(row) {
                this.$store.dispatch("knowledge/knowledgeCatalogInfoAct",row.id).then(() => {
                    this.dialogViewVisible = true
                    this.knowledgeCatalogForm = this.$store.state.knowledge.knowledgeCatalogInfo
                }).catch(() => {
                    console.log(12)
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
            deleteModel,
        }
    }
</script>

<style>
    .custom-dialog {
        position: fixed;
        margin: 0 auto 0px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        box-sizing: border-box;
        width: 50%;
        right: 0;
        top: 0;
        height: 100%;
    }
    .mybtn:hover{
        color: #f38916 !important
    }
    .wq-form-inline {
        float: right;
    }
     .el-table th>.cell{
        color:#4c4b4b
    }
    .myTable td:nth-child(4),.myTable td:nth-child(3){
        text-align: left !important
    }
    .el-table td, .el-table th{
        text-align: center
    }
    .search_right .el-input-group__append {
        background: #f38916;
        color: #ffffff;
    }
     .el-button--medium {
        padding: 8px 20px;
    }
    .search_right input{
         /* border-right: none; */
         height:32px
     }
      .search_right{
          max-width: 320px;
          float:right
     }
     .el-form--inline .el-form-item{
         margin-right: 0
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
        margin-bottom:0;
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
   
    .details-row .el-col-4 {
        text-align: left;
    }
    img[lazy=loading] {
        width: 230px;
        height: 240px;
        vertical-align: middle;
        text-align: center;
    }
    .preview-img {
        overflow: auto;
        /* height: 100%; */
        /* width: 70%; */
        /* margin-left: 15%; */
    }
    .mydialog .el-dialog__body {
        padding: 30px 2px;
    }
    .mydialog .el-dialog{
        margin: 0 auto 0px !important;
        margin-top: 6vh !important
    }
</style>