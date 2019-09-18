<template>
    <el-dialog
            title="密码修改"
            :visible.sync="modifyPwdDialogVisible"
            width="40%"
            :show-close="false"
            :close-on-click-modal="false">

        <el-form :model="modifyPwdForm" ref="modifyPwdForm" label-width="80px" :rules="modifyPwdRules" style="padding-right:10px">
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
		    <el-button type="primary" @click="handleModifyPwd">确 定</el-button>
		  </span>
    </el-dialog>
</template>

<script>
    import {modifyPwdRules} from '@/util/rules'
    import {removeValue} from "@/util/localStorage";

    export default {
        name: "resetPwd",
        data() {
            return {
                modifyPwdDialogVisible: false,
                modifyPwdForm: {
                    id:"",
                    oldPassword:"",
                    newPassword:"",
                    repPassword:""
                },
                modifyPwdRules:modifyPwdRules,
            }
        },
        mounted() {
            this.modifyPwdDialogVisible = true
            this.modifyPwdForm.id = this.$store.getters.userId
        },
        methods: {
            handleModifyPwd() {
                const that = this
                this.$refs['modifyPwdForm'].validate((valid) => {
                    if (valid) {
                        let loading = this.$loading({target: document.querySelector(".wrapper"), fullscreen: false})
                        this.$store.dispatch("user/memberModifyPwd", that.modifyPwdForm).then((response) => {
                            loading.close()
                            that.$message({
                                message: "密码修改成功，请重新登录。",
                                type: "success",
                                center:"true",
                                duration: 3 * 1000,
                                onClose() {
                                    that.handleRemoveTokenToLogin();
                                }
                            })
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
                })
            },
            handleRemoveTokenToLogin() {
                removeValue("token")
                removeValue("TAGSLIST")
                this.$router.push({path: '/login'})
            }
        }
    }
</script>

<style scoped>

</style>