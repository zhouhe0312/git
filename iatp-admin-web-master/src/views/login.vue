<template>
    <div>
    	<el-container>
		  <el-header>
		  	<img src="../assets/images/logo.png" alt="时代新威"/>
		  	<span>智能审计管理平台</span>
		  </el-header>
		  <el-main>
		  	<el-row>
			  <el-col :span="6">
			  	<div class="login-form">
			  		<label style="margin-left:40%">用户登录</label>
			  	    <div class="login-form-item">
			  	    	<div style="display:inline-block">
			  	    		<img src="../assets/images/user.png" alt=""/>
			  	    	</div>
			  	    	<div>
			  	    		<input v-model="loginForm.name" @keyup.enter="submitForm" placeholder="请输入用户名"/>
			  	    	</div>
			  	    </div>
			  	    <div class="login-form-item">
			  	    	<div>
			  	    		<img src="../assets/images/password.png" alt=""/>
			  	    	</div>
			  	    	<div>
			  	    		<input type="password" v-model="loginForm.password" @keyup.enter="submitForm" placeholder="请输入密码"/>
			  	    	</div>
			  	    </div>
			  	    <div class="login-form-yan">
			  	    	<div>
			  	    		<img src="../assets/images/yanzheng.png" alt=""/>
			  	    	</div>
			  	    	<div>
			  	    		<input minlength="4" maxlength="4" v-model="loginForm.keywords" @keyup.enter="submitForm" placeholder="请输入验证码"/>
			  	    	</div>
			  	    </div>
			  	    <div class="login-form-yan1">
			  	    	<img :src="yzImg" @click="changeImg" style="cursor:pointer" title="点击刷新验证码" alt="点击刷新验证码"/>
			  	    </div>
					<div class="error">
						<p>{{error}}</p>
					</div>
			  	    <div>
			  	    	<el-button @click="submitForm(loginForm)" @keyup.native="submitForm(loginForm)">登录</el-button>
			  	    </div>
			    </div>
			  </el-col>
			</el-row>
		  </el-main>
		  <el-footer>
        	copyright2019-2025  北京时代新威信息技术有限公司  京ICP备206102549号
		  </el-footer>
		</el-container>
    </div>
</template>
<script>

    export default {
        name: 'login',
        data() {
        	return {
        		loginForm: {
					//name: 'iatpadmin',
					//password:'iatpadmin123#',
					name: '',
		            password:'',
		            keywords:''
		        },
		        yzImg:'',
		        yzCode:'',
				error: ''
        	}
        },
        mounted() {
        	this.getCode()
        },
        methods: {
			//切换验证码图片
			changeImg(){
				this.getCode()
			},
			//获取验证码
			getCode(){
				this.$store.dispatch('user/VerificationCode', {})
                .then(() => {
                	let yanzheng = this.$store.state.user.VfCode;
                	for(var k in yanzheng) {
                		this.yzImg = yanzheng[k]
                		this.yzCode = k;
                	}
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
			},
            submitForm() {
             	if(this.loginForm.name.trim() === ''){
             		this.error = "请输入用户名"
					return;
				}
             	if(this.loginForm.password.trim() === '') {
					this.error = "请输入密码"
					return;
				}
             	if(this.loginForm.keywords.trim() === '') {
             		this.error = "请输入验证码"
					return;
				}

				this.loginForm['vCode'] = this.yzCode;
				this.$store.dispatch('user/obtainLogin', this.loginForm)
				.then(() => {
					this.$router.push({path: '/index/home'})
					this.loading = false
				})
				.catch(() => {
					this.loading = false
				})
            }
        }
    }
</script>
<style scoped>

	.el-button--default, .el-button--default:hover{
		background-color:#ffb351
	}
	.el-header {
		height: 110px !important;
		line-height: 110px;
	
	}
	.el-header img {
		vertical-align: middle;
		margin-left: 60px;
	}
	.el-header span {
		font-size: 24px;
		margin-left: 30px;
		color: #323232;
		font-weight: bold;
	}
	.el-main {
		padding: 0;
		background: url(../assets/images/bg.jpg) no-repeat;
		background-size: 100% 100%;
		border-left: 0 solid #e9ecf3;
		display: flex;
		align-items: center;
	}
	.el-footer {
		text-align: center;
		line-height: 70px;
		height: 70px !important;
		color: #999;
		font-size:12px;
		font-family:'宋体'
	}
	.el-row {
		margin-left: 65%;
	}
	.login-form {
		background: #ffffff;
		padding: 35%;
		overflow: hidden;
		border-radius: 5px;
		width: 350px
	}
    .login-form>label {
    	font-size: 16px;
    }
    .login-form-item {
    	height: 45px;
    	border: 1px solid #ddd;
    	margin-top: 5%;
    	position: relative;
    }
    .login-form-item input {
		background: transparent;
	}
	.login-form-yan input {
		background: transparent;
	}
    .login-form-item >div {
    	float: left;
    }
    .login-form-item >div:nth-child(1) {
    	line-height: 45px;
    	width: 45px;
    } 
    .login-form-item >div:nth-child(1) img {
    	margin-left: 10px;
		margin-top:12px
    }
    .login-form-item >div:nth-child(1) span {
    	margin-left: 10px;
    }
    .login-form-item >div:nth-child(2) {
    	width: 280px;
    }
    .login-form-item input{
    	height: 45px;
    	border: none;
    	width: 100%;
    	outline: none;
    }
    .el-button {
    	width: 100%;
    	color: #ffffff;
    	background: #fd9829;
    	height: 45px;
    	/*margin-top: 8%;*/
		border:none
    }
    .login-form-yan {
    	position: relative;
    	width:210px;
    	height: 45px;
    	border: 1px solid #ddd;
    	margin-top: 5%;
    	line-height: 45px;
    }
    .login-form-yan>p {
    	position: absolute;
    	top: 35px;
    	font-size: 12px;
    	color: red;
    	height: 20px;
    }
    .login-form-yan>div:nth-child(2) {
    	width: 75%;
    }
    .login-form-yan input {
    	height: 43px;
    	border: none;
    	outline: none;
    	width: 145px;
    	margin-left: 5px;
    }
    .login-form-yan img {
    	margin-left: 10px;
		margin-top: 15px;
    }
    .login-form-yan span {
    	margin-left: 10px;
    }
    .login-form-yan>div {
    	float: left;
		width: 45px
    }
    .login-form-yan1 {
    	float: right;
    	height: 45px;
    	border: 1px solid #ddd;
    	margin-top:-47px;
    	width: 110px;
    	margin-left: 10px;
    }
    .login-form-yan1 img{
    	width: 100%;
    	height: 100%;
    }
	.error {
		padding: 0;
		line-height: 30px;
		height: 35px;
		position: relative;
	}
	.error p {
		color: #ff0000;
		font-size: 14px;
		position: absolute;
	}
</style>