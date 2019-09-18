<template>
    <div class="item-bank-wrapper">
        <el-row type="flex" justify="space-between">
            <el-col :span="4">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('exam_manage:item:add')" size="medium" type="warning" style='background: #f38916;' @click='handleSaveDialog("itemBankForm")'>新增</el-button>
                    <el-button v-if="handleButtonHash('exam_manage:item:delete')" size="medium" style='border:1px solid #f38916;color: #f38916;' @click='deleteWQ'>删除</el-button>
                </div>
            </el-col>
            <el-col :span="20" class="search-form">
                 <div class="wq-form-inline">
                    <div  class="search_right">
                        <el-input @keyup.enter.native="dataSearch" placeholder="请输入题库" clearable v-model="searchInfo.params.title">
                            <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                        </el-input>
                    </div>
                </div>
                <!-- <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="" class="search_right">
                        <el-input placeholder="请输入题库" v-model="searchInfo.params.title">
                            <el-button slot="append" icon="el-icon-search" clearable   @click='dataSearch'>搜索</el-button>
                        </el-input>
                    </el-form-item>
                </el-form> -->
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
                            width="60"
                            type='index'
                            :index="indexNum"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="题库名称">
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
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i @click="handleEditDialog(scope.row,'itemBankForm')" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" v-if="handleButtonHash('exam_manage:item:edit')"></i>
                            <i @click="deleteWQ(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer" v-if="handleButtonHash('exam_manage:item:delete')" ></i>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="pagination">
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
        <!-- 新增/编辑题库 -->
        <el-dialog :close-on-click-modal="false" width="50%" :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleClose">
            <el-form :model="itemBankForm" :rules="rules" ref="itemBankForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="题库名称" prop="title">
                    <el-input v-model="itemBankForm.title"></el-input>
                </el-form-item>
                <el-form-item label="题库描述" prop="des">
                    <el-input type="textarea" v-model="itemBankForm.des"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="handleItemBankSave">确 定</el-button>
		  </span>
        </el-dialog>
        <delete-model :deleteObj="deleteObj"></delete-model>
    </div>
</template>

<script>
    import deleteModel from "@/components/deleteModel"
    import { itemBankRules } from "@/util/rules"

    export default {
        data() {
            return {
                loading:false,
                tableData: [],
                multipleSelection: [],
                indexNum: 1,
                dialogVisible: false,
                dialogTitle: '新增题库',
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
                        title: ""
                    }
                },
                itemBankForm: {
                    id: "",
                    title: "",
                    des: ""
                },
                rules: itemBankRules,
                isSave: true,
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                }
            }
        },
        mounted() {
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
                this.$store.dispatch('itemBank/itemBankList',value)
                    .then(() => {
                        this.tableData  = this.$store.state.itemBank.itemBankList
                        this.pages = this.$store.state.itemBank.itemBankPage
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

                        that.$store.dispatch('itemBank/deleteItemBankAct',ids.join())
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
                            .catch(() => {
                                that.loading = false
                               // that.deleteObj.deleteModel = false;
                                // that.$message({
                                //     message: '删除失败！',
                                //     type: "error",
                                //     center:'true',
                                // })
                            })
                    }
                }

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
            handleSaveDialog(formName) {
                this.itemBankForm = {
                    id: "",
                    title: "",
                    des: ""
                }
                this.isSave = true
                this.dialogVisible = true
                this.dialogTitle = "新增题库"
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                },10)
            },
            handleItemBankSave() {
                const that = this
                this.$refs['itemBankForm'].validate((valid) => {
                    if (valid) {
                        let loading = this.$loading({target:document.querySelector(".item-bank-wrapper"),fullscreen:false})
                        let action = "itemBank/saveItemBankAct";
                        if(!that.isSave) {
                            action = "itemBank/editItemBankAct";
                        }
                        this.$store.dispatch(action,that.itemBankForm).then(() => {
                            loading.close()
                            that.$message({
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
                this.dialogTitle = "编辑题库"
                this.dialogVisible = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                    Object.assign(this.itemBankForm, row);
                },10)
                this.isSave = false
                

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
    .mybtn:hover{
        color: #f38916 !important
    }
    .el-button--medium {
        padding: 8px 20px;
    }
    .wq-form-inline {
        float: right;
    }
     .el-table th>.cell{
        color:#4c4b4b
    }
     .el-form--inline .el-form-item{
         margin-right: 0px
     }
    .el-table td, .el-table th{
		text-align: center
	}
    .search_right .el-input-group__append {
        background: #f38916;
        color: #ffffff;
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
    .el-icon-more {
        margin-left: 15px;
    }
    .search-form .el-form-item {
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
</style>