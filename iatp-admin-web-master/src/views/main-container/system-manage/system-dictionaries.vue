<template>
    <div class="wrapper">
        <el-row type="flex" justify="space-between">
            <el-col :span="4">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('system_manage:dict:add')" size="medium" type="warning" style='background: #f38916;' @click='handleSaveDialog("dictForm")'>新增</el-button>
                    <el-button v-if="handleButtonHash('system_manage:dict:delete')" size="medium" style='border:1px solid #f38916;color: #f38916;' @click='deleteWQ'>删除</el-button>
                </div>
            </el-col>
            <el-col :span="20" class="search">
                <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="字典名称">
                        <el-input v-model="searchInfo.params.name" @keyup.enter.native="dataSearch"   class="search_right" clearable placeholder="请输入字典名称"></el-input>
                    </el-form-item>
                    <el-form-item label="字典类型" style="margin-left:10px;">
                        <el-select v-model="searchInfo.params.typeId"
                         class="search_right"
                                   placeholder="字典类型">
                            <el-option label="全部" :value="0"></el-option>
                            <el-option
                                    v-for="item in dictTypeOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
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
                        stripe
                        v-loading="loading"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            width="70"
                            type='index'
                            :index="indexNum"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="字典名称">
                    </el-table-column>
                    <el-table-column
                            prop="typeName"
                            label="字典类型"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="des"
                            label="描述"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态"
                            :formatter="handleStatus">
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
                            <i @click="handleEditDialog(scope.row,'dictForm')" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px"  v-if="handleButtonHash('system_manage:dict:edit')"></i>
                            <i @click="deleteWQ(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer" v-if="handleButtonHash('system_manage:dict:delete')" ></i>
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
        <!-- 新增/编辑 -->
        <el-dialog  :close-on-click-modal="false" width="50%" :title="mytitle" :visible.sync="dialogVisible" :before-close="handleClose">
            <el-form :model="dictForm" :rules="rules" ref="dictForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="字典类型" prop="typeId">
                    <el-select v-model="dictForm.typeId" placeholder="请选择字典类型">
                        <el-option
                                v-for="item in dictTypeOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字典名称" prop="name">
                    <el-input v-model="dictForm.name"></el-input>
                </el-form-item>

                <el-form-item label="字典值" prop="value">
                    <el-input v-model="dictForm.value"></el-input>
                </el-form-item>
                <el-form-item label="字典状态" prop="status">
                    <el-radio-group v-model="dictForm.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" prop="des">
                    <el-input type="textarea" v-model="dictForm.des"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="handleDictSave">确 定</el-button>
		  </span>
        </el-dialog>
        <delete-model :deleteObj="deleteObj"></delete-model>
    </div>
</template>

<script>
    import deleteModel from "@/components/deleteModel"
    import {dictRules} from '@/util/rules'
    import {checkNameAndValueOnly} from "@/api/system-dict"

    export default {
        data() {
            return {
                loading:false,
                dialogVisible: false, //新增字典
                tableData: [],
                multipleSelection: [],
                indexNum: 1,
                dictTypeOptions: [],
                isSave: true,
                mytitle:"",
                dictForm: {
                    id:"",
                    typeId: "",
                    name: "",
                    value: "",
                    status: 1,
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
                        typeId: 0
                    }
                },
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                },
                rules: dictRules
            }
        },
        mounted() {
            this.getData(this.searchInfo)
            this.dictTypeRemoteMethod()
            this.rules.name.push({ validator: this.checkNameOnly , trigger:'blur'})
            this.rules.value.push({ validator: this.checkValueOnly , trigger:'blur'})
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
                this.$store.dispatch('systemDict/obtainDictList',value)
                    .then(() => {
                        this.tableData  = this.$store.state.systemDict.dictList
                        this.pages = this.$store.state.systemDict.dictPage;
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
                            center:"true",
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

                        that.$store.dispatch('systemDict/deleteDictAct',ids.join())
                            .then(() => {
                                that.deleteObj.deleteModel = false;
                                // 消息提示
                                that.$message({
                                    message: '删除成功。',
                                    type: "success",
                                    center:"true",
                                    duration: 3 * 1000
                                })
                                that.initPages();
                                that.getData(that.searchInfo)
                                that.loading = false
                            })
                            .catch(() => {
                                that.loading = false
                               // that.deleteObj.deleteModel = false;
                            })
                    }
                }

            },
            //新增
            handleSaveDialog(formName) {
                this.dictForm = {
                    id:"",
                    typeId: "",
                    name: "",
                    value: "",
                    status: 1,
                    des: ""
                }
                this.mytitle = '新增字典'
                this.isSave = true
                this.dialogVisible = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                },10)
            },
            handleDictSave() {
                let that = this
                this.$refs['dictForm'].validate((valid) => {
                    if (valid) {
                        const loading = that.$loading({target:document.querySelector(".wrapper"),fullscreen:false})
                        let action = "systemDict/dictSaveAct";
                        if(!that.isSave) {
                            action = "systemDict/dictEditAct";
                        }
                        that.$store.dispatch(action,that.dictForm).then(() => {
                            that.dialogVisible = false
                            loading.close()
                            this.$message({
                                message: '保存成功。',
                                type: "success",
                                center:"true",
                                duration: 5 * 1000
                            })
                            that.initPages();
                            that.getData(that.searchInfo)
                            that.indexNumber(that.searchInfo.page.current,that.searchInfo.page.size)
                        }).catch(() => {
                            loading.close()
                        })
                    } else {
                        that.$message({
                                message: '请检查填写内容',
                                type: "warning",
                                center:"true",
                            })
                    }
                });
            },
            handleEditDialog(row,formName) {
                this.mytitle = '编辑字典'
                this.dialogVisible = true
                this.isSave = false
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                    Object.assign(this.dictForm, row);
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
            dictTypeRemoteMethod() {
                this.$store.dispatch("systemDict/obtainDictTypeList").then(() => {
                    this.dictTypeOptions = this.$store.state.systemDict.dictTypeList
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
            checkNameOnly(rule, value, callback){
                const nameAndId = {type:1,value: this.dictForm.name,typeId:this.dictForm.typeId,id:this.dictForm.id}
                checkNameAndValueOnly(nameAndId).then(response => {
                    callback();
                }).catch(error => {
                    callback(new Error(error));
                })
            },
            checkValueOnly(rule, value, callback){
                const valueAndId = {type:2,value: this.dictForm.value,typeId:this.dictForm.typeId,id:this.dictForm.id}
                checkNameAndValueOnly(valueAndId).then(response => {
                    callback();
                }).catch(error => {
                    callback(new Error(error));
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

<style >
    .mybtn:hover{
        color: #f38916 !important
    }
    .el-form--inline .el-form-item{
         margin-right: 0px
     }
    .wq-form-inline {
        float: right;
    }
     .el-table th>.cell{
        color:#4c4b4b
    }
    .el-table td, .el-table th{
		text-align: center 
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