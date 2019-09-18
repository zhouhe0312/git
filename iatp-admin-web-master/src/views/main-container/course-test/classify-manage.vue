<template>
    <div class="wrapper">
        <el-row type="flex" justify="space-between">
            <el-col :span="4">
                <div class="left_btn">
                    <el-button  v-if="handleButtonHash('course_experiment:classify:add')"  size="medium" type="warning" style='background: #f38916;' @click='handleSaveDialog("classifyForm")'>新增</el-button>
                    <el-button  v-if="handleButtonHash('course_experiment:classify:delete')"  size="medium" style='border:1px solid #f38916;color: #f38916;' @click='deleteWQ'>删除</el-button>
                </div>
            </el-col>
            <el-col :span="20" class="search">
                <div class="wq-form-inline">
                    <div  class="search_right">
                        <el-input @keyup.enter.native="dataSearch" placeholder="请输入分类" clearable v-model="searchInfo.params.name">
                            <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                        </el-input>
                    </div>
                </div>
                <!-- <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="" class="search_right">
                        <el-input @keyup.enter.native="dataSearch" placeholder="请输入分类" clearable v-model="searchInfo.params.name">
                            <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                        </el-input>
                    </el-form-item>
                </el-form> -->
            </el-col>
        </el-row>
        <el-row style='margin-top: 22px;'>
            <el-col :span="3">
                <GeminiScrollbar :autoshow="true" :forceGemini="true" class="myScroll" style="height:685px;">  
                    <el-tree
                            class="classTree"
                            :data="classifyTree"
                            :expand-on-click-node="false"
                            highlight-current
                            accordion
                            @node-click="handleNodeClick"
                            >
                    </el-tree>
                </GeminiScrollbar>
            </el-col>
            <el-col :span="21">
                <el-table
                class="classTable"
                        ref="multipleTable"
                        :data="tableData"
                        :header-cell-style="{background:'#e9ecf3'}"
                        tooltip-effect="dark"
                        style="width: 98%;float:right"
                        show-header
                        stripe
                        v-loading="loading"
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
                            label="分类名称">
                    </el-table-column>

                    <el-table-column
                            prop="pname"
                            label="所属分类"
                            :formatter="(row) => { return row.pname === ''?'无':row.pname}">
                    </el-table-column>

                    <el-table-column
                            prop="type"
                            label="类型"
                            :formatter="(row) => { return row.type === 1 ? '课程':'实验' }">
                    </el-table-column>
                    <el-table-column
                            prop="des"
                            label="描述"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="操作对象"
                            >
                        <template slot-scope="scope">
                            <i @click="handleEditDialog(scope.row,'classifyForm')" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" v-if="handleButtonHash('course_experiment:classify:edit')"></i>
                            <i @click="deleteWQ(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer" v-if="handleButtonHash('course_experiment:classify:delete')" ></i>
                        </template>
                    </el-table-column>
                </el-table>
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
            </el-col>
        </el-row>
        
        <!-- 新增/编辑分类 -->
        <el-dialog width="50%" :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose" :close-on-click-modal="false">
            <el-form :model="classifyForm" :rules="rules" ref="classifyForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="所属分类">
                    <label style="color: #a2a2a2;">{{ pname === '' ? '无' : pname }}</label>
                </el-form-item>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="classifyForm.name"></el-input>
                </el-form-item>
                <el-form-item label="分类类型" prop="type">
                    <el-radio-group v-model="classifyForm.type">
                        <el-radio :label="1">课程</el-radio>
                        <el-radio :label="2">实验</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" prop="des">
                    <el-input type="textarea" v-model="classifyForm.des"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="handleClassifySave">确 定</el-button>
		  </span>
        </el-dialog>
        <delete-model :deleteObj="deleteObj"></delete-model>
    </div>
</template>

<script>
    import deleteModel from "@/components/deleteModel"
    import {classifyRules} from '@/util/rules'
    import {getValue} from "../../../util/localStorage";

    export default {
        data() {
            return {
                loading:false,
                dialogVisible: false, //新增字典
                tableData: [],
                multipleSelection: [],
                indexNum: 1,
                classifyTree: [],
                isSave: true,
                dialogTitle: '',
                classifyForm: {
                    id:"",
                    pid: 0,
                    name: "",
                    type: 1,
                    des: ""
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
                        name: '',
                        pid: 0
                    }
                },
                pid: 0,
                pname: '',
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                },
                rules: classifyRules,
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    key: 'id'
                }
            }
        },
        mounted() {
            this.getData(this.searchInfo)
            this.classifyTreeRemoteMethod()
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
                value.params.pid = this.pid
                this.loading = true
                this.$store.dispatch('classifyManage/classifyListAct',value)
                    .then(() => {
                        this.tableData  = this.$store.state.classifyManage.classifyList
                        this.pages = this.$store.state.classifyManage.classifyPage
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
                        that.$store.dispatch('classifyManage/deleteClassifyAct',ids.join())
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
                                that.classifyTreeRemoteMethod()
                                that.loading = false
                            })
                            .catch(() => {
                                that.loading = false
                               // that.deleteObj.deleteModel = false;
                                // that.$message.error('删除失败！');
                            })
                    }
                }

            },
            //新增
            handleSaveDialog(formName) {
                this.classifyForm = {
                    id:"",
                    pid: this.pid,
                    name: "",
                    type: 1,
                    des: ""
                }
                this.dialogTitle = "新增分类"
                this.isSave = true
                this.dialogVisible = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                },10)
            },
            handleClassifySave() {
                let that = this
                this.$refs['classifyForm'].validate((valid) => {
                    if (valid) {
                        const loading = that.$loading({target:document.querySelector(".wrapper"),fullscreen:false})
                        let action = "classifyManage/addClassifyAct";
                        if(!that.isSave) {
                            action = "classifyManage/editClassifyAct";
                        }
                        that.$store.dispatch(action,that.classifyForm).then(() => {
                            loading.close()
                            this.$message({
                                message: '保存成功。',
                                type: "success",
                                center:'true',
                                duration: 5 * 1000
                            })
                            that.initPages();
                            that.getData(that.searchInfo)
                            this.classifyTreeRemoteMethod()
                            that.dialogVisible = false
                        }).catch(() => {
                            loading.close()
                        })
                    } else {
                        that.$message.warning(
                            {
                                message: "请检查填写内容",
                                type: "warning",
                                center:'true',
                            }
                            )
                    }
                });
            },
            handleEditDialog(row,formName) {
                this.dialogVisible = true
                this.isSave = false
                this.dialogTitle = "编辑分类"
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                    Object.assign(this.classifyForm, row);
                },10)
            },
            handleNodeClick(data) {
                this.pid = data.id
                this.pname = data.label
                this.getData(this.searchInfo)
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
            classifyTreeRemoteMethod() {
                this.$store.dispatch("classifyManage/classifyTreeAct").then(() => {
                    this.classifyTree = this.$store.state.classifyManage.classifyTreeList
                }).catch(() => {

                })
            },
            handleStatus(row,column,celValue,index) {
                if(row.status === 1) {
                    return "启用"
                } else if(row.status === 0) {
                    return "禁用"
                } else {
                    return "未知"
                }
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
    /*.el-form-item{
		margin-bottom:22px !important
    }*/
    .mybtn:hover{
        color: #f38916 !important
    }
    .el-form--inline .el-form-item{
         margin-right: 0px
     }
    .classTree{
        border: 1px #ebebed solid
     }
    .classTree .el-tree-node__content{
        padding:3px 0px
    }
    .classTree .el-tree-node__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .el-table th>.cell{
        color:#4c4b4b
    }
    .wq-form-inline {
        float: right;
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
          max-width: 320px
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
    .myScroll{
        position: static !important;
    }
    .myScroll .-vertical,.menuScroll .-vertical {
        display: none !important;
    }
    .myScroll .-horizontal,.menuScroll .-horizontal {
        display: none !important;
    }
</style>