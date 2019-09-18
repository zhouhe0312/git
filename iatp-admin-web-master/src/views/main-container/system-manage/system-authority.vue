<template>
    <div class="mainPart">
        <el-row>
            <el-col :span="12">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('system_manage:auth:add')" size="medium" type="warning"
                               style='background: #f38916;' @click='showAdd("addTableData")'>新增
                    </el-button>
                    <el-button v-if="handleButtonHash('system_manage:auth:delete')" size="medium"
                               style='border:1px solid #f38916;color: #f38916;' @click='getDelete'>删除
                    </el-button>
                </div>
            </el-col>
            <el-col :span="6" :offset='6'>
                <div class="search_right">
                    <el-input placeholder="请输入权限" @keyup.enter.native="dataSearch"   clearable  v-model="searchInput">
                        <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row style='margin-top: 22px;'>
            <el-col :span="4">
                <GeminiScrollbar :autoshow="true" :forceGemini="true" class="myScroll" style="height: 685px;">  
                    <el-tree
                            :data="getTreeList"
                            class="authTree"
                            @node-click="handleNodeClick"
                            :expand-on-click-node="false"
                            accordion
                            ref="tree"
                            highlight-current
                            :props="defaultProps">
                    </el-tree>
                </GeminiScrollbar>
            </el-col>
            <el-col :span="20">
                <el-table
                        highlight-current-row
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
                            label="序号">
                        <template slot-scope="scope">{{(allInfo.current - 1) * allInfo.size + scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="名称">
                    </el-table-column>
                    <el-table-column
                            prop="permission"
                            label="编码"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="icon1"
                            label="图标">
                        <template slot-scope="scope">
                            <i :class="scope.row.icon1?scope.row.icon1:''"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="pname"
                            label="所属模块"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="类型" :formatter="function(row) {return row.type == 1 ? '菜单':'按钮'}"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="status" label="状态"
                                     :formatter="function(row) {return row.status == 1 ? '启用':'禁用'}"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="操作"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i @click="editTable(scope.row,'addTableData')" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" v-if="handleButtonHash('system_manage:auth:edit')"></i>
                            <i @click="delTable(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer" v-if="handleButtonHash('system_manage:auth:delete')"  ></i>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row>
                <el-col>
                    <el-pagination
                            background
                            layout="prev, pager, next"
                            :total="Number(allInfo.total)"
                            :size="Number(allInfo.size)"
                            @current-change="currentChange"
                    >
                    </el-pagination>
                </el-col>
            </el-row>
            </el-col>
            
        </el-row>

        

        <!-- 新增/修改权限 -->
        <el-dialog :close-on-click-modal="false" width="40%" :title="diaTitle" :visible.sync="dialogVisible"
                   :before-close="handleClose">
            <el-form :model="addTableData" ref="addTableData" class="" label-width="90px" :rules="addFormRules">

                <div style="margin-left:-40px;padding-left:22px;">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="所属模块" style="margin-bottom: 5px !important">
                                <label style="color: #a2a2a2;">{{ pname === '' ? '无' : pname }}</label>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="权限名称" prop="name">
                                <el-input placeholder="请输入名称" v-model="addTableData.name">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="权限编码" prop="permission">
                                <el-input placeholder="请输入编码" v-model="addTableData.permission">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="图标" prop="icon1">
                                <el-input placeholder="请输入图标代码" v-model="addTableData.icon1">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="权限类型" prop="type">
                                <el-select style="width: 100%;" placeholder="请选择类型" v-model="addTableData.type">
                                    <el-option label="菜单" :value="1"></el-option>
                                    <el-option label="按钮" :value="2"></el-option>
                                </el-select>
                            </el-form-item>

                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="序号" prop="sortNum">
                                <el-input placeholder="请输入数值序号" v-model="addTableData.sortNum"
                                          nkeyup="value=value.replace(/[^\d]/g,'')"
                                          onblur="value=value.replace(/[^\d]/g,'')">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="状态" prop="status">
                                <el-radio-group v-model="addTableData.status">
                                    <el-radio :label="1">启用</el-radio>
                                    <el-radio :label="0">禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="描述" prop="des"> <!--:autosize="{ minRows: 1, maxRows: 4}" -->
                                <el-input type="textarea" placeholder="" v-model="addTableData.des">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="getAdd('addTableData')">确 定</el-button>
		  </span>
        </el-dialog>

        <!-- 删除弹层 -->
        <deleteModel :deleteObj="deleteObj"></deleteModel>

    </div>
</template>

<script>

    import deleteModel from "@/components/deleteModel";
    import {authRules} from '@/util/rules'
    import {memberAuthChecking} from '@/api/system-auth'//验证唯一性
    export default {
        data() {
            return {
                diaTitle: '新增权限',
                loading: false,
                treeId: "0",//获取表格所需父级菜单id
                pname: "",
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                addTableData: {
                    attach: 1,
                    url: "",
                    name: "",
                    sortNum: "",//序号
                    status: 1,
                    permission: "",//编码
                    icon1: "",
                    type: 1,//1菜单 2按钮
                    des: ""
                },
                multipleSelection: [],
                tableData: [],
                dialogVisible: false, //新增权限
                searchInput: '', //搜索条件
                allInfo: {},
                msg: {
                    name: '',
                    current: 1,
                    size: 10,
                    pid: 0
                },
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                },
                currDeptId: '',//操作一栏选中的单条用户id
                getTreeList: [],//权限树列表
                addFormRules: {},
            }
        },
        mounted() {
            authRules.permission.push({validator: this.codeChecking, trigger: 'blur'})
            authRules.name.push({validator: this.nameChecking, trigger: 'blur'})
            this.addFormRules = authRules
            this.getTree()
            this.getData(this.msg)
        },
        methods: {
            nameChecking(rule, value, callback) {
                const nameCodeAndId = {type: 1, value: value, id: this.currDeptId}
                memberAuthChecking(nameCodeAndId).then(response => {
                    callback();
                }).catch(error => {
                    callback(new Error(error));
                })
            },
            codeChecking(rule, value, callback) {
                const nameCodeAndId = {type: 2, value: value, id: this.currDeptId}
                memberAuthChecking(nameCodeAndId).then(response => {
                    callback();
                }).catch(error => {
                    callback(new Error(error));
                })
            },
            handleButtonHash(btnKey) {
                const btns = this.$store.getters.buttons
                for (let key in btns) {
                    if (key === btnKey) {
                        return btns[key]
                    }
                }
                return null
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 获取表格数据
            getData(val) {
                console.log(val, '############')
                this.loading = true;
                this.$store.dispatch('systemAuth/getAuthTableData', val)
                    .then(() => {
                        this.tableData = this.$store.state.systemAuth.authTableData;
                        this.allInfo = this.$store.state.systemAuth.allInfo;
                        this.loading = false
                        console.log(this.tableData, '权限list')
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
            //获取权限树
            getTree() {
                this.$store.dispatch('systemAuth/getAllAuthTree')
                    .then(() => {
                        this.getTreeList = this.$store.state.systemAuth.authData;
                        console.log(this.getTreeList, '--')
                    })
                    .catch(() => {

                    })

            },

            //点击新增弹框
            showAdd(formName) {
                this.addTableData = {
                    attach: 1,
                    url: "",
                    name: "",
                    sortNum: "",//序号
                    status: 1,
                    permission: "",//编码
                    icon1: "",
                    type: 1,//1菜单 2按钮
                    des: ""
                }
                this.diaTitle = "新增权限"
                this.dialogVisible = true
                setTimeout(()=>{
                     this.$refs[formName].resetFields();
                },10)
                this.currDeptId = ""
            },

            //点击编辑弹框
            editTable(row,formName) {
              //  console.log(row, '^^^^^')
                // console.log(this.addTableData,'***')
                this.diaTitle = "编辑权限"
                this.dialogVisible = true
                this.currDeptId = row.id
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                    this.addTableData = {
                        attach: 1,
                        url: "",
                        name: row.name ? row.name : '',
                        sortNum: row.sortNum ? row.sortNum : "",
                        permission: row.permission ? row.permission : "",
                        icon1: row.icon1 ? row.icon1 : "",
                        des: row.des ? row.des : "",
                        type: row.type ? row.type : 1,
                        status: row.status ? row.status : 0,
                    }

                },10)
            },
            // 新增/修改提交
            getAdd(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var param = ''
                        if (this.diaTitle === "新增权限") {
                            var val = {
                                ...this.addTableData,
                                pid: this.treeId
                            }
                            param = 'systemAuth/tableDataAdd'
                        } else {
                            var val = {
                                ...this.addTableData,
                                id: this.currDeptId,
                                pid: this.treeId
                            }
                            param = 'systemAuth/editDataOne'
                        }
                        console.log(val, '~#~#~')

                        this.$store.dispatch(param, val)
                            .then((response) => {
                                this.dialogVisible = false
                                var msg = {
                                    name: '',
                                    current: 1,
                                    size: 10,
                                    pid: this.treeId
                                }
                                this.getData(msg)
                                this.getTree()
                                this.loading = false
                                this.$message({
                                    message: response.message,
                                    type: "success",
                                    center: "true",
                                    duration: 3 * 1000
                                })

                            })
                            .catch((error) => {
                               // this.dialogVisible = false
                                //this.$message({
                                //       message: error,
                                //       type: "error",
                                //       center:"true",
                                //       duration: 3 * 1000
                                //});
                                this.loading = false
                            })
                    } else {
                        this.$message({
                            message: '请检查填写内容',
                            type: "warning",
                            center: "true",
                        });
                    }
                });
            },
            handleNodeClick(data) {
                console.log(data, '!!!')
                this.treeId = data.id
                this.pname = data.label
                this.msg = {
                    name: '',
                    current: 1,
                    size: 10,
                    pid: this.treeId
                }
                this.getData(this.msg)
            },
            //删除单条
            delTable(row) {
                let that = this
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        var id = row.id
                        console.log(that.treeId)
                        await that.$store.dispatch('systemAuth/tableDataDelOne', id)
                            .then((response) => {
                                var msg = {
                                    name: '',
                                    current: 1,
                                    size: 10,
                                    pid: that.treeId
                                }
                                that.deleteObj.deleteModel = false;
                                that.$message({
                                    message: response.message,
                                    type: "success",
                                    center: "true",
                                    duration: 3 * 1000
                                })
                                that.getData(msg)
                                that.getTree()
                                that.loading = false
                            })
                            .catch((response) => {
                                that.deleteObj.deleteModel = false;
                                // that.$message({
                                //        message: response.message,
                                //        type: "error",
                                //         center:"true",
                                //        duration: 3 * 1000
                                //});
                                that.loading = false
                            })
                    }
                }
            },
            // 批量删除
            getDelete() {
                let that = this
                if (that.multipleSelection.length === 0) {
                    that.$message({
                        message: '请选择要删除的项！',
                        type: 'warning',
                        center: "true",
                    });
                    return
                } else {
                    that.deleteObj.deleteModel = true;
                }
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        var dataId = ''
                        that.multipleSelection.map(val => {
                            dataId += (val.id + ',');
                        })
                        dataId = dataId.substr(0, dataId.length - 1)
                        await that.$store.dispatch('systemAuth/tableDataDel', dataId)
                            .then(() => {
                                var msg = {
                                    name: '',
                                    current: 1,
                                    size: 10,
                                    pid: that.treeId
                                }
                                that.deleteObj.deleteModel = false;
                                that.$message({
                                    message: '删除成功！',
                                    type: "success",
                                    center: "true",
                                    duration: 3 * 1000
                                })
                                that.getData(msg)
                                that.getTree()
                                that.loading = false
                            })
                            .catch(() => {
                              //  that.deleteObj.deleteModel = false;
                                //that.$message({
                                //		message: '删除失败！',
                                //        type: "error",
                                //         center:"true",
                                //		duration: 3 * 1000
                                //});
                                that.loading = false
                            })

                    }
                }
            },
//		    搜索
            dataSearch() {
                this.msg.name = this.searchInput
                this.getData(this.msg)
            },
//		    分页
            currentChange(current) {
                this.msg.size = this.allInfo.size
                this.msg.current = current
                this.getData(this.msg)
            },


            handleClose(done) {
                done();
            },
        },
        computed: {},
        components: {
            deleteModel
        },
    }
</script>

<style>
    .mybtn:hover{
        color: #f38916 !important
    }
    .authTree .el-tree-node__content {
        padding: 3px 0px
    }
    .authTree{
        border:1px solid #ebebed;
    }
    .el-textarea__inner {
        min-height: 90px !important
    }

    /* .el-form-item{
        margin-bottom:22px !important
    } */
    .el-table th > .cell {
        color: #4c4b4b
    }

    .el-table td, .el-table th {
        text-align: center
    }

    .search_right .el-input-group__append {
        background: #f38916;
        color: #ffffff;
    }

    .search_right input {
        /* border-right: none; */
         height:32px
    }
     .el-button--medium {
        padding: 8px 20px;
    }

    .el-button {
        border-radius: 0;
    }

    .search_right {
        max-width: 320px;
        float: right
    }

    .el-pagination {
        text-align: center;
        margin-top: 50px;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #f38916;
    }

    .el-pagination.is-background .el-pager li, .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next {
        border: 1px solid #f38916;
        border-radius: 0;
        background: white;
    }

    .el-icon-more {
        margin-left: 15px;
    }

    .el-dialog__header {
        border-bottom: 2px solid #f38916;
    }

    .el-dialog__footer {
        text-align: center;
    }

    .el-button--primary, .el-button--primary:hover {
        background: #f38916;
        border: none;
    }

    .el-button--default, .el-button--default:hover {
        color: black;
        border: 1px solid #DCDFE6;
        background: white;
    }

    .res-tree .el-tree {
        z-index: 999;
    }

    /* 头像 */
    .el-upload--picture-card {
        width: 0px;
        height: 0PX;
        border: 0px
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