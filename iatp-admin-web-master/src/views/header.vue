<template>
    <div style="height:60px" class="header-content">
        <div class="open-aside" v-if="seitch_state == false">
            <img src="@/assets/images/mainLogo.png" alt="时代新威" class="mainLogo"/>
        </div>
        <div class="close-aside" v-else>
            <img src="@/assets/images/pt.png" alt="时代新威" class="close_mainLogo"/>
        </div>
        <div class="main-switch">
            <i class="el-icon-s-fold" title="折叠菜单" v-if="seitch_state == false" @click="aside_switch()"></i>
            <i class="el-icon-s-unfold" title="展开菜单" v-else @click="aside_switch()"></i>
        </div>
        <span class="platform">智能审计管理平台</span>

        <div class="user-info">
            <span>{{dateInfo}}</span>
            <img src="@/assets/images/avatar.png" class="user-icon"/>
            <img :src="avatarUrl" v-if="avatarUrl !== ''" class="user-icon"/>
            <el-dropdown @command="handleCommand">
			  <span class="el-dropdown-link">
				  <label style="cursor: pointer;">{{userInfo.username || userInfo.nickname}}</label><i
                      class="el-icon-arrow-down el-icon--right"></i>
			  </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">帐号设置</el-dropdown-item>
                    <el-dropdown-item command="2">修改密码</el-dropdown-item>
                    <el-dropdown-item command="3" divided>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>


        <el-dialog
                title="帐号设置"
                :visible.sync="accountDialogVisible"
                width="40%"
                :close-on-click-modal="false"
                :before-close="handleClose">
            <el-form :model="accountForm" ref="accountForm" label-width="80px" :rules="accountModifyRules"
                     style="padding-right:10px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="" style="text-align: center;">
                            <el-upload
                                    class="avatar-uploader"
                                    :headers="headers"
                                    name="file"
                                    :action="uploadUrl"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :on-error="handleAvatarError">
                                <el-tooltip class="item" effect="dark" content="上传头像" placement="top">
                                    <div class="upload-div">
                                        <img v-if="imageUrl === ''" src="@/assets/images/avatar.png"
                                             class="upload-user-icon"/>
                                        <img v-if="imageUrl !== ''" :src="imageUrl" class="upload-user-icon"/>
                                        <div v-if="imageUrl === ''" class="upload-avatar-bg"></div>
                                        <div v-if="imageUrl === ''" class="upload-avatar-label">上传头像</div>
                                    </div>
                                </el-tooltip>

                            </el-upload>

                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="帐号" prop="acount">
                            <el-input placeholder="请输入帐号" v-model="accountForm.acount">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="昵称" prop="nickname">
                            <el-input placeholder="请输入昵称" v-model="accountForm.nickname">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="姓名" prop="username">
                            <el-input placeholder="请输入姓名" v-model="accountForm.username">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="accountForm.sex">
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="手机号" prop="phone">
                            <el-input placeholder="请输入手机号" v-model="accountForm.phone">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="邮箱" prop="email">
                            <el-input placeholder="请输入邮箱" v-model="accountForm.email">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>


            <span slot="footer" class="dialog-footer">
		    <el-button @click="accountDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="handleModifyAccount">确 定</el-button>
		  </span>
        </el-dialog>

        <el-dialog
                title="密码修改"
                :visible.sync="modifyPwdDialogVisible"
                width="40%"
                :close-on-click-modal="false"
                :before-close="handleClose">

            <el-form :model="modifyPwdForm" ref="modifyPwdForm" label-width="80px" :rules="modifyPwdRules"
                     style="padding-right:10px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="原密码" prop="oldPassword">
                            <el-input placeholder="请输入原始密码" show-password v-model="modifyPwdForm.oldPassword">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input placeholder="请输入新密码" show-password v-model="modifyPwdForm.newPassword">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="确认密码" prop="repPassword">
                            <el-input placeholder="请再次输入密码" show-password v-model="modifyPwdForm.repPassword">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
		    <el-button @click="modifyPwdDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="handleModifyPwd">确 定</el-button>
		  </span>
        </el-dialog>

        <delete-model :deleteObj="deleteObj"></delete-model>

    </div>

</template>

<script>
    import bus from '@/util/event';
    import deleteModel from "@/components/deleteModel"
    import {removeValue} from "@/util/localStorage";
    import {modifyPwdRules, accountModifyRules} from '@/util/rules'
    import {constants} from "../util/common";
    import {getValue} from "@/util/localStorage";
    import {memberAcountChecking} from '@/api/user'

    export default {
        name: 'headerPage',
        data() {
            return {
                seitch_state: false,
                accountDialogVisible: false,
                modifyPwdDialogVisible: false,
                dateInfo: '',
                userInfo: {},
                modifyPwdRules: modifyPwdRules,
                accountModifyRules: {},
                avatarUrl: "",
                uploadUrl: constants.uploadUrl,
                imageUrl: '',
                headers: {},
                accountForm: {
                    id: '',
                    acount: '',
                    avatar: '',
                    email: '',
                    nickname: '',
                    username: '',
                    phone: '',
                    sex: 1,
                    type: 1
                },
                modifyPwdForm: {
                    id: "",
                    oldPassword: "",
                    newPassword: "",
                    repPassword: ""
                },
                deleteObj: {
                    deleteModel: false,
                    prompt: "您确定要退出登录？",
                    btnTxt: '确定',
                    del: {}
                }
            }
        },
        mounted() {
            this.handleUserInfo()
            this.dateInfo = this.$moment().locale('zh-cn').format("YYYY年MM月DD日 dddd")
            this.headers = {"Authorization": getValue("token")}
            accountModifyRules.acount.push({validator: this.acountChecking, trigger: 'blur'})
            this.accountModifyRules = accountModifyRules
        },
        methods: {
            aside_switch() {
                if (this.seitch_state) {
                    this.seitch_state = false
                } else {
                    this.seitch_state = true
                }
                bus.$emit("RUNSWITCH", this.seitch_state);
            },
            handleUserInfo() {
                this.$store.dispatch("user/obtainUserInfo").then(() => {
                    this.userInfo = this.$store.state.user.userInfo
                    if (this.userInfo.avatar) {
                        this.avatarUrl = constants.downloadUrl + this.userInfo.avatar
                        this.imageUrl = constants.downloadUrl + this.userInfo.avatar
                    }
                }).catch(() => {

                })
            },
            handleCommand(command) {
                if ("3" === command) {
                    this.handleLogout()
                } else if ("2" === command) {
                    this.modifyPwdDialogVisible = true
                    this.modifyPwdForm.id = this.$store.state.user.userInfo.id
                } else if ("1" === command) {
                    this.accountDialogVisible = true
                    this.accountForm = this.$store.state.user.userInfo
                    console.log(this.accountForm)
                }
            },
            handleLogout() {
                const that = this
                this.deleteObj.deleteModel = true;
                this.deleteObj.del = {
                    async del() {
                        that.handleRemoveTokenToLogin();
                    }
                }
            },
            handleModifyPwd() {
                const that = this
                this.$refs['modifyPwdForm'].validate((valid) => {
                    if (valid) {
                        let loading = this.$loading({target: document.querySelector(".wrapper"), fullscreen: false})
                        this.$store.dispatch("user/memberModifyPwd", that.modifyPwdForm).then(() => {
                            loading.close()
                            that.$message({
                                message: '保存成功。',
                                type: "success",
                                center: "true",
                                duration: 3 * 1000,
                                onClose() {
                                    that.handleRemoveTokenToLogin();
                                }
                            })
                            that.modifyPwdDialogVisible = false
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
            //退出
            handleRemoveTokenToLogin() {
                removeValue("token")
                removeValue("TAGSLIST")
                this.$router.push({path: '/login'})
            },

            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                if (res.code === 200) {
                    this.accountForm.avatar = res.data.id
                }
            },
            handleAvatarError(err, file, fileList) {
                this.$message({
                    message: '上传头像失败！',
                    type: "error",
                    center: "true",
                })
            },
            handleModifyAccount() {
                const that = this
                this.$refs['accountForm'].validate((valid) => {
                    if (valid) {
                        let loading = this.$loading({target: document.querySelector(".wrapper"), fullscreen: false})
                        this.$store.dispatch("user/accountInfoUpdateAct", that.accountForm).then(() => {
                            loading.close()
                            that.$message({
                                message: '保存成功。',
                                type: "success",
                                center: "true",
                                duration: 3 * 1000
                            })
                            that.accountDialogVisible = false
                            that.handleUserInfo()
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
                const id = this.$store.state.user.userInfo.id
                const acountAndId = {acount: value, id: id}
                memberAcountChecking(acountAndId).then(response => {
                    callback();
                }).catch(error => {
                    callback(new Error(error));
                })
            },
            handleClose(done) {
                done();
            }
        },
        components: {
            deleteModel
        }
    }
</script>

<style scoped>
    .open-aside {
        float: left;
        display: inline-block;
        height: 60px;
        width: 201px;
        background-color: #F38A17;
        margin-left: -201px
    }

    .close-aside {
        float: left;
        display: inline-block;
        height: 60px;
        width: 200px;
        background-color: #F38A17;
        margin-left: -200px
    }

    .main-switch {
        float: left;
        display: inline-block;
        width: 50px;
        padding: 0px !important;
    }

    .mainLogo {
        height: 46px;
        width: 138px;
        margin-left: -6px;
        padding-top: 9px
    }

    .close_mainLogo {
        height: 34px;
        width: 38px;
        padding-top: 13px;
        float: right;
        padding-right: 14px;
    }

    .platform {
        margin-left: 6px;
        line-height: 60px;
        float: left;
    }

    .el-icon-s-fold {
        font-size: 28px;
        line-height: 60px;
        color: #999;
    }

    .el-icon-s-unfold {
        font-size: 28px;
        line-height: 60px;
        color: #999;
    }

    .header-content .el-dialog__wrapper {
        text-align: left;
        font-weight: normal;
    }

    .el-dropdown-link {
        color: #6e6e6e;
        font-size: 12px;
        height: 40px;
    }

    .user-info {
        float: right;
        margin-right: 5px;
        line-height: 60px;
        position: relative;
        font-weight: normal;
    }

    .user-info .el-dropdown {
        margin-left: 35px;
    }

    .user-info span {
        color: #888888;
        font-size: 12px;
        margin-right: 20px;
    }

    .user-icon {
        position: absolute;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: auto;
        top: 15px;
    }

    .upload-div {
        width: 100px;
        height: 65px;
        margin: auto;
        position: relative;
    }

    .upload-user-icon {
        width: 65px;
        height: 65px;
        border-radius: 50%;
    }

    .upload-avatar-bg {
        position: absolute;
        display: block;
        width: 65px;
        height: 65px;
        border-radius: 50%;
        background-color: #000000;
        opacity: 0.5;
        color: #fff;
        top: 0;
        left: 18px;
    }

    .upload-avatar-label {
        position: absolute;
        top: 14px;
        left: 22px;
        color: #ffffff;
        font-size: 13px;
    }
</style>