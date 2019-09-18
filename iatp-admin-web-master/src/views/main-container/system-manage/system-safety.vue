<template>
    <div class="wrapper-safety">
        <el-form label-position="left" label-width="150px" :rules="rules" :model="safetyForm" ref="safetyForm" class="safe">
            <el-form-item label="密码强度" prop="pwdIntensity">
                <el-select v-model="safetyForm.pwdIntensity" placeholder="密码强度" class="input-width">
                    <el-option label="非常安全" :value="90"></el-option>
                    <el-option label="安全" :value="80"></el-option>
                    <el-option label="非常强" :value="70"></el-option>
                    <el-option label="强" :value="60"></el-option>
                    <el-option label="一般" :value="50"></el-option>
                    <el-option label="弱" :value="25"></el-option>
                    <el-option label="非常弱" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="允许登陆失败次数" prop="loginFailTime">
                <el-input v-model="safetyForm.loginFailTime" class="input-width"></el-input>
            </el-form-item>
            <el-form-item label="锁定用户登陆时间" prop="lockLoginTime">
                <el-input v-model="safetyForm.lockLoginTime" class="input-width"></el-input>
                <label  class="label-dw">单位：秒</label>
            </el-form-item>
            <el-form-item label="密码有效时间" prop="pwdValidTime">
                <el-input v-model="safetyForm.pwdValidTime" class="input-width"></el-input>
                <label class="label-dw">单位：天</label>
            </el-form-item>
            <el-form-item label="页面失效时间" prop="pwdValidTime">
                <el-input v-model="safetyForm.webFailureTime" class="input-width"></el-input>
                <label class="label-dw">单位：秒</label>
            </el-form-item>
            <el-form-item label="日志保留最短时间" prop="logRetentionTime">
                <el-input v-model="safetyForm.logRetentionTime" class="input-width"></el-input>
                <label class="label-dw">单位：天</label>
            </el-form-item>
            <el-form-item label="密码最小长度" prop="minPwdLength">
                <el-input v-model="safetyForm.minPwdLength" class="input-width"></el-input>
            </el-form-item>
            <el-form-item class="mysave">
                <el-button type="primary"  @click="handleSave">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {safetyRules} from '@/util/rules'

    export default {
        data(){
            return {
                safetyForm:{
                    id:"",
                    pwdIntensity:0,
                    loginFailTime: 0,
                    lockLoginTime: 0,
                    pwdValidTime: 0,
                    webFailureTime: 0,
                    logRetentionTime: 0,
                    minPwdLength: 0
                },
                rules: safetyRules
            }
        },
        mounted() {
            let loading = this.$loading({target:document.querySelector(".wrapper-safety"),fullscreen:false})
            this.$store.dispatch("systemSafety/obtainSafetyInfo").then(() => {
                this.safetyForm = this.$store.state.systemSafety.safetyInfo
                loading.close()
            }).catch(() => {
                loading.close()
            })
        },
        methods:{
            handleSave(){
                this.$refs['safetyForm'].validate((valid) => {
                    if (valid) {
                        let loading = this.$loading({target:document.querySelector(".wrapper-safety"),fullscreen:false})
                        this.$store.dispatch("systemSafety/saveSafetyInfoAct",this.safetyForm).then(() => {
                            loading.close()
                            this.$message({
                                message: '保存成功。',
                                type: "success",
                                center:'true',
                                duration: 5 * 1000
                            })
                        }).catch(() => {
                            loading.close()
                        })
                    } else {
                        this.$message({
                                message: '请检查填写内容',
                                type: "warning",
                                center:'true',
                            })
                    }
                });

            }
        }
    }
</script>

<style>
    .mysave{
        text-align: center;
        margin-left:0px !important
    }
    .mysave .el-form-item__content{
        margin-left: 0px !important
    }
    .mysave .el-form-item__content button{
        width: 16%;
        margin-top: 20px;
    }
    .el-form--inline .el-form-item{
         margin-right: 0px
     }
    .safe .el-form-item{
        margin-bottom: 22px
    }
    .wrapper-safety {
        margin-top:22px;
        padding: 0 100px 0 100px;
    }
    .input-width {
        width: 90%;
    }
    .label-dw {
        margin-left: 20px;
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
     .el-button--medium {
        padding: 8px 20px;
    }
</style>