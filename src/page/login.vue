<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>金地管理平台</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="phone">
						<div class="row">
							<el-input v-model="loginForm.phone" placeholder="手机号"><span></span></el-input>
						<el-button  type="primary" size="mini" @click="sendCode('loginForm')" class="send_code_btn">发送验证码</el-button>
						</div>
					</el-form-item>
					<el-form-item prop="code">
						<el-input  placeholder="验证码" v-model="loginForm.code"></el-input>
					</el-form-item>
					<el-form-item>
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
				  	</el-form-item>
				</el-form>
	  		</section>
	  	</transition>
  	</div>
</template>

<script>
	import {login,smssend, getAdminInfo} from '@/api/getData'
	import {mapActions, mapState} from 'vuex'

	export default {
	    data(){
			return {
				loginForm: {
					phone: '18610824157',
					code: '828054',
				},
				rules: {
					phone: [
			            { required: true, message: '请输入手机号', trigger: 'blur' },
			        ],
					code: [
						{ required: true, message: '请输入验证码', trigger: 'blur' }
					],
				},
				showLogin: false,
			}
		},
		mounted(){
			this.showLogin = true;
			if (!this.adminInfo.id) {
    			this.getAdminData()
    		}
		},
		computed: {
			...mapState(['adminInfo']),
		},
		methods: {
			...mapActions(['getAdminData']),
			async sendCode(){
				const res = await smssend({
					phone:this.loginForm.phone
				});
				if (res.status == 1) {
							this.$message({
		                        type: 'success',
		                        message: '发送成功'
		                    });
						}else{
							this.$message({
		                        type: 'error',
		                        message: res.message
		                    });
						}
			},
			async submitForm(formName) {
			    // this.$router.push('manage')
				// return;
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const res = await login({phone: this.loginForm.phone, code: this.loginForm.code,role:1})
						if (res.status == 1) {
							this.$message({
		                        type: 'success',
		                        message: '登录成功'
		                    });
							this.$router.push('manage')
						}else{
							this.$message({
		                        type: 'error',
		                        message: res.message
		                    });
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请输入正确的用户名密码',
							offset: 100
						});
						return false;
					}
				});
			},
		},
		watch: {
			adminInfo: function (newValue){
				if (newValue.id) {
					this.$message({
                        type: 'success',
                        message: '检测到您之前登录过，将自动登录'
                    });
					this.$router.push('manage')
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.login_page{
		background-color: #324057;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
		p{
			font-size: 34px;
			color: #fff;
		}
	}
	.form_contianer{
		.wh(320px, 210px);
		.ctp(320px, 210px);
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		.send_code_btn{
			width: 120px;
		}
		.submit_btn{
			width: 100%;
			font-size: 16px;
		}
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}

	.row{
		display: flex;
		flex-direction: row;
	}
</style>
