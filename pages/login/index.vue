<template>
	<view class="container">
		<cw-nav-bar
			title="授权登录"
			fixed
			:border="false"
			custom-class="nav-bar"
			title-class="nav-bar-title"
			z-index="100"
			:custom-style="'height:' + (systemInfo.navBarHeight + systemInfo.statusBarHeight) + 'px;padding-top:' + systemInfo.statusBarHeight + 'px'"
		/>
		<view :style="'height:' + (systemInfo.navBarHeight + systemInfo.statusBarHeight) + 'px'"></view>
		<view class="login-wrapper">
			<view v-if="tabsCurrent == 0">
				<view class="box">
					<cw-tabs :active="tabsCurrent" @change="tabsCurrent = $event.index" color="#3498db">
						<cw-tab v-for="(item, index) in tabsList" :index="index" :title="item.name" :key="index"></cw-tab>
					</cw-tabs>
					<view class="form">
						<cw-field v-model="form.account" titleWidth="2.8em" label="账号"></cw-field>
						<cw-field v-model="form.password" type="password" titleWidth="2.8em" label="密码"></cw-field>
					</view>
				</view>
				<cw-button customClass="button" type="info" @click="submit()" :loading="btnLoading">登录</cw-button>
			</view>

			<view v-if="tabsCurrent == 1">
				<view class="box">
					<cw-tabs :active="tabsCurrent" @change="tabsCurrent = $event.index" color="#3498db">
						<cw-tab v-for="(item, index) in tabsList" :index="index" :title="item.name" :key="index"></cw-tab>
					</cw-tabs>
					<view class="form"><cw-field v-model="phoneNum" titleWidth="3.8em" label="手机号"></cw-field></view>
				</view>
				<cw-button customClass="button" type="info">获取验证码</cw-button>
			</view>
		</view>
		<view class="login-bottom-box">
			<cw-divider textColor="#fff">更多登录方式</cw-divider>
			<view class="oauth2"><cw-icon size="50" color="#36c956" name="weixin" customStyle="background:#fff;border-radius:100px;" @click="wxLogin" /></view>
			<view class="copyright">
				<view>登录即代表您已阅读并同意</view>
				<navigator url="/pages/about/agreement"><view class="agreement">《e家宜业微信小程序用户协议》</view></navigator>
			</view>

			<view class="who-can-use">
				<view>仅供e家宜业小区业主使用</view>
				<view>内蒙古卓瓦科技有限公司版权所有</view>
			</view>
		</view>
		<view class="welcome"><image src="@/static/assets/login/welcome.jpg" mode="heightFix"></image></view>
		<cw-notify ref="notify"></cw-notify>
	</view>
</template>
<script>
import page from '@/pages/common/page.js';
import utils from '@/utils/index.js';

export default {
	mixins: [page],
	data() {
		return {
			tabsList: [
				{
					name: '密码登录'
				},
				{
					name: '手机号'
				}
			],
			tabsCurrent: 0,
			form: {
				account: '',
				password: ''
			},
			phoneNum: '',
			rules: {
				account: {
					type: 'string',
					required: true,
					// max: 11,
					message: '请输入账号',
					trigger: ['blur', 'change']
				},
				password: {
					type: 'string',
					required: true,
					message: '请输入密码',
					trigger: ['blur', 'change']
				}
			},
			btnLoading: false
		};
	},
	onLoad(opts) {
		let { redirect } = opts;
		this.redirect = redirect;
	},
	onReady() {},
	methods: {
		tabsChange({ index }) {
			this.tabsCurrent = index;
		},
		submit() {
			this.$validator(this.rules, this.form).then(res => {
				this.btnLoading = true;
				const { brand, model, system, platform } = this.systemInfo;
				utils
					.request({
						url: '/user/login_username',
						data: {
							...this.form,
							brand,
							model,
							system,
							platform
						},
						method: 'post'
					})
					.then(
						res => {
							this.btnLoading = false;
							// debugger;
							this.bridge.updateData({
								userInfo: res.data.userInfo,
								communityInfo: res.data.communityInfo,
								globalFetching: false
							});
							utils.storage.login(res.data.token);
							utils.storage.setUserId(res.data.userInfo.id);

							if (!res.data.userInfo.intact) {
								uni.redirectTo({
									url: '/pages/zone/supplement'
								});
							} else if (res.data.communityInfo.list.length === 0) {
								uni.redirectTo({
									url: '/pages/community/binding'
								});
							} else if (this.redirect !== null && this.redirect !== undefined) {
								const tbasRoute = ['/pages/home/index', '/pages/service/index', '/pages/zone/index'];

								if (tbasRoute.includes(this.redirect)) {
									uni.switchTab({
										url: this.redirect
									});
								} else {
									uni.redirectTo({
										url: this.redirect,
										fail() {
											uni.switchTab({
												url: '/pages/home/index'
											});
										}
									});
								}
							} else {
								uni.switchTab({
									url: '/pages/home/index'
								});
							}
						},
						res => {
							this.btnLoading = false;
							return this.$refs.notify.show({
								customNavBar: true,
								type: 'danger',
								message: res.message
							});
						}
					);
			});
		},
		wxLogin() {
			uni.redirectTo({
				url: `/pages/login/mp?redirect=${this.redirect}`
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import url('./index.css');

.container {
	padding: 0 40rpx;
}
.login-wrapper {
	z-index: 5;
	position: relative;
	margin-top: 20px;
	border-radius: 20px;
	.box {
		padding: 5px;
		border-radius: 12px;
		background-color: #fff;
	}
}

.form {
	padding: 20rpx 0 40rpx 0;
	background-color: #fff;
}

::v-deep .button {
	margin-top: 160rpx;
	width: 100%;
}

.login-bottom-box {
	color: #fff;
	position: fixed;
	left: 0;
	right: 0;
	bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
	z-index: 5;
}

.copyright {
	display: flex;
	text-align: center;
	justify-content: center;
	// color: #939393;
	color: #fff;
	font-size: 24rpx;
	text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	.agreement {
		text-decoration-line: underline;
	}
	.u-link {
		margin: 0 10rpx;
		display: inline-block !important;
		font-size: 24rpx !important;
	}
}

.oauth2 {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	margin: 0rpx 100rpx 30rpx;

	image {
		height: 80rpx;
		width: 80rpx;
	}
}
</style>
