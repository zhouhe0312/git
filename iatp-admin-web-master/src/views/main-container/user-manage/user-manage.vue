<template>
    <div class="wrapper">
        <el-row type="flex" justify="space-between">
            <el-col :span="4">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('user_management:user:add')" size="medium" type="warning"
                               style='background: #f38916;' @click='handleSaveDialog("memberForm")'>新增
                    </el-button>
                    <el-button v-if="handleButtonHash('user_management:user:delete')" size="medium"
                               style='border:1px solid #f38916;color: #f38916;' @click='deleteWQ'>删除
                    </el-button>
                </div>
            </el-col>
            <el-col :span="20" class="search">
                <div class="wq-form-inline">
                    <div  class="search_right">
                        <el-input @keyup.enter.native="dataSearch" placeholder="请输入用户" clearable v-model="searchInfo.params.acount">
                            <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                        </el-input>
                    </div>
                </div>
                <!-- <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="" class="search_right">
                        <el-input placeholder="请输入用户" clearable   @keyup.enter.native="dataSearch"  v-model="searchInfo.params.acount">
                            <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
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
                            prop="acount"
                            label="账号">
                    </el-table-column>
                    <el-table-column
                            prop="nickname"
                            label="昵称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="姓名"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="sex"
                            label="性别"
                            :formatter="function(row) {
                              return row.sex === 1 ? '男':'女'
                            }">
                    </el-table-column>
                    <el-table-column
                            prop="deptName"
                            label="所属部门"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="手机号"
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
                            label="操作"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-link v-if="handleButtonHash('user_management:user:edit')" type="info" :underline="false"
                                     @click="handleEditDialog(scope.row,'memberForm')">编辑
                            </el-link>
                            <el-dropdown
                                    :hide-on-click="false"
                                    @command="handlePwdAndDel"
                                    v-if="handleButtonHash('user_management:user:delete') || handleButtonHash('user_management:user:password')">
                                  <span class="el-dropdown-link">
                                    <i class="el-icon-more"></i>
                                  </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="handleButtonHash('user_management:user:password')"
                                                      :command="{type:1,data:scope.row.id,form:'resetPwdForm'}">重置密码
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="handleButtonHash('user_management:user:delete')" divided
                                                      :command="{type:2,data:scope.row}">删除
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
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
                        @current-change="currentChange"
                >
                </el-pagination>
            </el-col>
        </el-row>
        <!-- 新增人员 -->
        <el-dialog :close-on-click-modal="false" width="50%" :title="dialogTitle" :visible.sync="dialogVisible"
                   :before-close="handleClose">
            <el-form :model="memberForm" ref="memberForm" class="" label-width="90px" :rules="memberFormRules">
                <div class="avater-wrapper">
                    <p style="margin:0px 10px">头像</p>
                    <img v-if="showUserImg == true && previewPic == true"
                         style="position: absolute;top: 73px;left: 80px;width:42px;height:42px;border-radius:50%" :src="previewUrl"
                         alt="">
                    <img v-if="showUserImg == true && previewPic == false"
                         style="position: absolute;top: 73px;left: 80px;" src="@/assets/images/up_uesr.png" alt="">

                    <el-upload :action='avatarUrl' :file-list="picList" class="addUserUpload" :on-success="handlerSuccess" :on-remove="handleRemove"
                               :before-upload="beforeAvatarUpload" :limit='1' list-type='picture-card'
                               :headers="headers" name="file">
                        <p style="color:#F38A17;position:absolute;left:145px;top:24px;width:70px;height:0px">添加头像</p>
                    </el-upload>
                </div>

                <div style="margin-left:-40px;padding-right:15px;margin-top:-13px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="username">
                                <el-input placeholder="请输入姓名" v-model="memberForm.username">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <el-select style="width: 100%;" placeholder="请选择性别" v-model="memberForm.sex">
                                    <el-option label="女" :value="0"></el-option>
                                    <el-option label="男" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="昵称" prop="nickname">
                                <el-input placeholder="请输入昵称" v-model="memberForm.nickname">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号" prop="phone">
                                <el-input placeholder="请输入手机号" onkeyup="value=value.replace(/[^\d]/g,'')"   
       onblur="value=value.replace(/[^\d]/g,'')" :maxlength="11" v-model="memberForm.phone">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="账号" prop="acount">
                                <el-input placeholder="请输入账号" v-model="memberForm.acount">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="帐号状态" prop="status">
                                <el-select style="width: 100%;" placeholder="请选择帐号状态" v-model="memberForm.status">
                                    <el-option label="启用" :value="1"></el-option>
                                    <el-option label="禁用" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="isSave">
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password">
                                <el-input placeholder="请输入密码" show-password v-model="memberForm.password">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="确认密码" prop="repeatPassword">
                                <el-input placeholder="请再次输入密码" show-password v-model="memberForm.repeatPassword">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="邮箱" prop="email">
                                <el-input placeholder="请输入邮箱" v-model="memberForm.email">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属部门" prop="unitId">
                                <select-tree
                                        style="width: 100%;" placeholder="请选择所属部门"
                                        :props="props"
                                        :options="treeData"
                                        :clearable="isClearable"
                                        :accordion="isAccordion"
                                        :value="memberForm.unitId"
                                        @getValue="getValue($event)"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>


            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="handleSave">确 定</el-button>
		  </span>
        </el-dialog>
        <el-dialog
                :close-on-click-modal="false"
                title="重置密码"
                :visible.sync="resetPwdDialogVisible"
                width="40%"
                :before-close="handleClose">

            <el-form :model="resetPwdForm" ref="resetPwdForm" class="" label-width="80px" :rules="resetPwdRules"
                     style="padding-right:10px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input placeholder="请输入新密码" show-password v-model="resetPwdForm.newPassword">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="确认密码" prop="repPassword">
                            <el-input placeholder="请再次输入密码" show-password v-model="resetPwdForm.repPassword">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
		    <el-button @click="resetPwdDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="handleResetPwd">确 定</el-button>
		  </span>
        </el-dialog>
        <delete-model :deleteObj="deleteObj"></delete-model>
    </div>
</template>

<script>
    import deleteModel from "@/components/deleteModel"
    import {constants} from '@/util/common'
    import {getValue} from "@/util/localStorage";
    import SelectTree from '@/components/SelectTree'
    import {memberRules, resetPwdRules} from '@/util/rules'
    import {memberAcountChecking} from '@/api/user'


    export default {
        data() {
            return {
                previewUrl: "",//预览回显
                previewPic: false,
                loading: false,
                tableData: [],
                multipleSelection: [],
                indexNum: 1,
                dialogVisible: false,
                resetPwdDialogVisible: false,
                dialogTitle: '新增用户',
                showUserImg: true,//头像初始图
                avatarUrl: constants.uploadUrl,
                headers: {},
                picList:[],
                pages: {
                    total: 0,
                    size: 10,
                    current: 1
                },
                searchInfo: {
                    page: {
                        current: 1,
                        size: 10
                    },
                    params: {
                        acount: "",
                        type: 2
                    }
                },
                memberForm: {
                    id: '',
                    avatar: "",//头像上传接口成功后返回的id ，可为空
                    username: "",
                    sex: 1,
                    nickname: "",
                    phone: "",
                    acount: "",//账户
                    status: 1,//账户状态
                    password: "",
                    repeatPassword: "",
                    email: "",
                    unitId: '',//所属部门
                    type: "2", //1为管理员，2为c端用户
                },
                tmpStatus:1,
                isSave: true,
                memberFormRules: {},
                /** select tree **/
                props: {               // 配置项（必选）
                    value: 'id',
                    label: 'label',
                    children: 'children'
                },
                isClearable: true,     // 可清空（可选）
                isAccordion: true,     // 可收起（可选）
                treeData: [],
                resetPwdForm: {
                    id: "",
                    newPassword: "",
                    repPassword: ""
                },
                resetPwdRules: resetPwdRules,
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                }
            }
        },
        mounted() {
            this.headers = {"Authorization": getValue("token")}
            this.getData(this.searchInfo)
            memberRules.acount.push({validator: this.acountChecking, trigger: 'blur'})
            this.memberFormRules = memberRules
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
//		    获取表格数据
            getData(value) {
                this.loading = true
                this.$store.dispatch('user/obtainMemberInfoList', value)
                    .then(() => {
                        this.tableData = this.$store.state.user.memberInfoList
                        this.pages = this.$store.state.user.memberInfoPage;
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
                if (row.id) {
                    ids.push(row.id)
                } else {
                    if (that.multipleSelection.length === 0) {
                        that.$message({
                            message: '请选择要删除的项！',
                            type: 'warning',
                            center: "true",
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

                        that.$store.dispatch('user/deleteMemberInfoAct', ids.join())
                            .then(() => {
                                that.deleteObj.deleteModel = false;
                                // 消息提示
                                that.$message({
                                    message: '删除成功。',
                                    type: "success",
                                    center: "true",
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
             handleStatus(row,column,celValue,index) {
                if(row.status === 1) {
                    return "启用"
                } else if(row.status === 0) {
                    return "禁用"
                } else if(row.status === 2){
                    return "锁定"
                }else if(row.status === 3){
                    return "密码被重置 "
                }else if(row.status === 4){
                    return "密码已过期"
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
                this.indexNumber(current, this.pages.size)
            },
            handleSaveDialog(formName) {
                this.memberForm = {
                    id: '',
                    avatar: "",//头像上传接口成功后返回的id ，可为空
                    username: "",
                    sex: 1,
                    nickname: "",
                    phone: "",
                    acount: "",//账户
                    status: 1,//账户状态
                    password: "",
                    repeatPassword: "",
                    email: "",
                    unitId: '',//所属部门
                    type: "2", //1为管理员，2为c端用户
                }
                this.$store.dispatch("user/obtainDepTreeData").then(() => {
                    this.dialogVisible = true
                    setTimeout(()=>{
                        this.$refs[formName].resetFields();
                    },10)
                    this.isSave = true
                    this.dialogTitle = "新增用户";
                    this.treeData = this.$store.state.user.depTreeData[0].children
                }).catch(() => {

                })
            },
            handleSave() {
                const that = this
                this.$refs['memberForm'].validate((valid) => {
                    if (valid) {
                        let loading = this.$loading({target: document.querySelector(".wrapper"), fullscreen: false})
                        let action = "user/memberInfoSave";
                        if (!that.isSave) {
                            if(that.memberForm.status !== 0) {
                                that.memberForm.status = this.tmpStatus
                            }
                            action = "user/memberInfoEdit";
                        }
                        this.$store.dispatch(action, that.memberForm).then(() => {
                            that.picList = []
                            that.showUserImg = true
                            loading.close()
                            that.$message({
                                message: '保存成功。',
                                type: "success",
                                center: "true",
                                duration: 5 * 1000
                            })
                            that.initPages();
                            that.getData(that.searchInfo)
                            that.dialogVisible = false
                        }).catch(() => {
                            if(that.memberForm.status !==0) {
                                that.tmpStatus = that.memberForm.status
                                that.memberForm.status = 1
                            }
                            loading.close()
                        })
                    } else {
                        that.$message({
                            message: '请检查填写内容',
                            type: "warning",
                            center: "true",
                        })
                    }
                });
            },
            //编辑
            handleEditDialog(row,formName) {
                this.$store.dispatch("user/obtainDepTreeData").then(() => {
                    if (row.avatar) {
                        this.previewPic = true
                        this.previewUrl = constants.downloadUrl + row.avatar
                    } else {
                        this.previewPic = false
                    }
                    this.dialogVisible = true
                    this.isSave = false
                    this.treeData = this.$store.state.user.depTreeData[0].children
                    this.dialogTitle = "修改用户";
                    setTimeout(()=>{
                        this.$refs[formName].resetFields();
                        Object.assign(this.memberForm, row);
                        if(this.memberForm.status !==0) {
                            this.tmpStatus = this.memberForm.status
                            this.memberForm.status = 1
                        }
                    },10)
                }).catch(() => {

                })
            },
            handlePwdAndDel(command) {
                const type = command.type
                if (type === 1) {
                    this.resetPwdForm = {
                        id: "",
                        newPassword: "",
                        repPassword: ""
                    }
                    this.resetPwdForm.id = command.data
                    this.resetPwdDialogVisible = true
                    setTimeout(()=>{
                        this.$refs[command.form].resetFields();
                    },10)
                } else {
                    this.deleteWQ(command.data)
                }
            },
            handleResetPwd() {
                const that = this
                this.$refs['resetPwdForm'].validate((valid) => {
                    if (valid) {
                        let loading = this.$loading({target: document.querySelector(".wrapper"), fullscreen: false})
                        this.$store.dispatch('sysmanager/resetPassword', that.resetPwdForm).then((response) => {
                            loading.close()
                            that.$message({
                                message: response.message,
                                type: "success",
                                center: "true",
                                duration: 5 * 1000
                            })
                            that.resetPwdDialogVisible = false
                        }).catch(() => {
                            loading.close()
                        })
                    } else {
                        that.$message({
                            message: '请检查填写内容',
                            type: "warning",
                            center: "true",
                        })
                    }
                })
            },
            acountChecking(rule, value, callback) {
                const acountAndId = {acount: value, id: this.memberForm.id}
                memberAcountChecking(acountAndId).then(response => {
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
            handleClose(done) {
                done();
            },

            /** 上传处理方法 **/
            handlerSuccess(res) {
                this.memberForm.avatar = res.data.id
            },
            handleRemove() {
                this.showUserImg = true
            },
            beforeAvatarUpload() {
                this.showUserImg = false
            },
            getValue(value) {
                this.memberForm.unitId = value
            },
            initPages() {
                this.searchInfo.page = {current: 1, size: 10}
                this.pages.current = 1
                this.indexNumber(1,10)
            },
            indexNumber(current, size) {
                this.indexNum = (current - 1) * size + 1
            }
        },
        components: {
            deleteModel, SelectTree
        }
    }
</script>

<style>
    .wq-form-inline {
        float: right;
    }

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

    .search_right {
        max-width: 320px
    }
 .el-button--medium {
        padding: 8px 20px;
    }
    .el-button {
        border-radius: 0;
    }

    .el-icon-more {
        margin-left: 15px;
    }

    /*.wq-form-inline .el-form-item {
        margin-bottom: 0;
    }*/
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

    .search .el-form-item {
        margin-bottom: 0;
    }
     .el-form--inline .el-form-item{
         margin-right: 0px
     }
    .el-button--default, .el-button--default:hover {
        color: black;
        border: 1px solid #DCDFE6;
        background: white;
    }
    /* 头像 */
    .el-upload--picture-card {
        width: 0;
        height: 0;
        border: 0;
    }
    .addUserUpload .el-upload-list--picture-card .el-upload-list__item {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        top: -40px;
        left: 60px;
        margin: 0 8px -37px 0;
    }
    .avater-wrapper > div {
        height: 35px;
    }
</style>