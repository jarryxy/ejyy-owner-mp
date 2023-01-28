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

		<view :style="'height:' + (systemInfo.navBarHeight + systemInfo.statusBarHeight) + 'px'" />

		<view class="logo-wrapper">
			<view class="logo"><image src="@/static/assets/common/logo.png" mode="scaleToFill"></image></view>

			<view class="txt">助力物业服务升级</view>
			<view class="txt">用心服务万千业主</view>
		</view>

		<cw-button type="info" :disabled="loading" custom-class="btn" block @click="login">
			<cw-loading type="spinner" size="32rpx" custom-class="loading" v-if="loading" />
			<text>{{ loading ? '登录中' : '登录' }}</text>
		</cw-button>

		<view class="agreement">
			<cw-checkbox-group :value="[agree]"><cw-checkbox shape="square" icon-size="16px" :name="true" @change="onAgreeChange" /></cw-checkbox-group>
			<view class="agree">我已阅读并同意</view>
			<navigator url="/pages/about/agreement">《e家宜业微信小程序用户协议》</navigator>
		</view>

		<view class="notice">
			<view class="title">卓瓦科技友情提示：</view>
			<view class="item">
				<cw-icon name="success" class="icon" />
				注意账号安全，请勿将账号转借他人使用
			</view>
			<view class="item">
				<cw-icon name="success" class="icon" />
				互联网不是法外之地，请对您的网络言行负责
			</view>
			<view class="item">
				<cw-icon name="success" class="icon" />
				合理合法沟通，减少小区矛盾
			</view>
		</view>

		<view class="who-can-use">
			<cw-divider textColor="#fff">返回</cw-divider>
			<view class="oauth2">
				<cw-icon size="50" name="cancel" @click="cancel" />
			</view>
			<view>仅供e家宜业小区业主使用</view>
			<view>内蒙古卓瓦科技有限公司版权所有</view>
		</view>
		
		<view class="welcome"><image src="@/static/assets/login/welcome.jpg" mode="heightFix"></image></view>

		<cw-notify ref="notify" />
	</view>
</template>

<script>
/**
 * +----------------------------------------------------------------------
 * | 「e家宜业」 —— 助力物业服务升级，用心服务万千业主
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020-2022 https://www.chowa.cn All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉「e家宜业」和「卓瓦科技」相关版权
 * +----------------------------------------------------------------------
 * | Author: contact@chowa.cn
 * +----------------------------------------------------------------------
 */
import utils from '@/utils/index.js';
import page from '@/pages/common/page.js';
export default {
	mixins: [page],
	data() {
		return {
			loading: false,
			agree: true,
			redirect: null
		};
	},
	onLoad(opts) {
		this.redirect = opts.redirect ? decodeURIComponent(opts.redirect) : null;
	},

	onShow() {
		if (uni.canIUse('hideHomeButton')) {
			uni.hideHomeButton();
		}
	},

	methods: {
		onAgreeChange(e) {
			if (this.loading) {
				return;
			}

			this.agree = e;
		},

		login() {
			const { agree, loading } = this;

			if (loading) {
				return;
			}
			
			if (!agree) {
				return this.$refs.notify.show({
					customNavBar: true,
					type: 'danger',
					message: '请阅读并同意用户协议'
				});
			}
			// #ifndef MP-WEIXIN
			return uni.showToast({
				title: '请在微信小程序中登录',
				icon: 'none'
			})
			// #endif
			this.loading = true;
			uni.login({
				success: ({ code }) => {
					const { brand, model, system, platform } = this.systemInfo;
					utils
						.request({
							url: '/user/login',
							method: 'post',
							data: {
								code,
								brand,
								model,
								system,
								platform
							}
						})
						.then(
							res => {
								this.loading = false;
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
								} else if (this.redirect !== null) {
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
								this.loading = false;
								return this.$refs.notify.show({
									customNavBar: true,
									type: 'danger',
									message: res.message
								});
							}
						);
				},
				fail: () => {
					return this.$refs.notify.show({
						customNavBar: true,
						type: 'danger',
						message: '登录失败，请重试'
					});
				}
			});
		},
		cancel(){
			uni.redirectTo({
				url: '/pages/login/index'
			})
		}
	}
};
</script>
<style lang="scss" scoped>
@import url('./index.css');

.container {
	height: 100vh;
	padding: 0 30rpx;
}
.nav-bar {
	background-color: transparent !important;
}
.nav-bar-title {
	color: #fff !important;
}
.logo-wrapper {
	height: 40%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 5;
	position: relative;
	.txt {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #fff;
	}
}
.logo {
	width: 240rpx;
	height: 240rpx;
	background: #fff;
	border-radius: 5px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 32rpx;
	image {
		width: 100%;
		height: 100%;
	}
}
::v-deep .btn {
	z-index: 5;
	position: relative;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
.agreement {
	display: flex;
	flex-direction: row;
	margin-top: 12px;
	font-size: 12px;
	height: 16px;
	color: #fff;
	z-index: 5;
	position: relative;
	.agree {
		margin-left: 10px;
	}
	navigator {
		text-decoration: underline;
	}
}
.loading {
	margin-right: 12rpx;
	vertical-align: middle;
	margin-top: -12px;
}
.notice {
	position: relative;
	z-index: 5;
	margin-top: 30px;
	.title {
		font-size: 13px;
		color: #fff;
		line-height: 22px;
		margin-bottom: 8px;
	}
	.item {
		font-size: 13px;
		line-height: 22px;
		color: #eee;
		.icon {
			font-size: 26rpx;
			margin-right: 16rpx;
			width: 32rpx;
			height: 32rpx;
			background-color: rgba(255, 255, 255, 0.3);
			text-align: center;
			border-radius: 50%;
			display: inline-block;
			line-height: 32rpx;
			color: #fff;
		}
	}
}
.who-can-use {
	position: fixed;
	left: 0;
	right: 0;
	bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
}
</style>
