<template>
	<view class="container">
		<view class="header-placeholder"></view>
		<view class="header-wrapper">
			<view class="header">
				<view class="avatar"><image :src="ASSETS_HOST + userInfo.avatar_url" v-if="userInfo.avatar_url" :lazy-load="true" mode="scaleToFill" /></view>
				<view class="is-identity">
					<view :class="'txt ' + (userInfo.phone ? '' : 'unable')">{{ userInfo.phone ? '已认证' : '未认证' }}</view>
					<view class="icon"><cw-icon name="identity" :custom-class="'identity ' + (userInfo.phone ? '' : 'unable')"></cw-icon></view>
				</view>

				<view class="is-approve">
					<view class="icon"><cw-icon name="approve" custom-class="approve"></cw-icon></view>
					<view class="txt">{{ communityInfo.current ? communityInfo.current.name : '' }}小区</view>
				</view>

				<view class="info">
					<view class="name">{{ userInfo.nick_name }}</view>
					<view class="signature">{{ userInfo.signature }}</view>
				</view>

				<view class="self">
					<cw-row>
						<cw-col span="6">
							<navigator url="/pages/payment/index" class="self-item">
								<view class="fill-icon pay"><cw-icon name="pay"></cw-icon></view>
								<view>我的缴费</view>
							</navigator>
						</cw-col>
						<cw-col span="6">
							<navigator url="/pages/repair/index" class="self-item">
								<view class="fill-icon maintain"><cw-icon name="maintain"></cw-icon></view>
								<view>我的维修</view>
							</navigator>
						</cw-col>
						<cw-col span="6">
							<navigator url="/pages/complain/index" class="self-item">
								<view class="fill-icon report"><cw-icon name="report"></cw-icon></view>
								<view>我的投诉</view>
							</navigator>
						</cw-col>
						<cw-col span="6">
							<navigator url="/pages/pet/index" class="self-item">
								<view class="fill-icon pet"><cw-icon name="pet"></cw-icon></view>
								<view>我的宠物</view>
							</navigator>
						</cw-col>
					</cw-row>
					<cw-row>
						<cw-col span="6">
							<navigator url="/pages/fitment/index" class="self-item">
								<view class="fill-icon fitment"><cw-icon name="fitment"></cw-icon></view>
								<view>我的装修</view>
							</navigator>
						</cw-col>
						<cw-col span="6">
							<navigator url="/pages/move_car/index" class="self-item">
								<view class="fill-icon movecar"><cw-icon name="movecar"></cw-icon></view>
								<view>我的挪车</view>
							</navigator>
						</cw-col>
						<cw-col span="6">
							<navigator url="/pages/vistor/index" class="self-item">
								<view class="fill-icon vistor"><cw-icon name="vistor"></cw-icon></view>
								<view>我的访客</view>
							</navigator>
						</cw-col>
						<cw-col span="6">
							<navigator url="/pages/questionnaire/self" class="self-item">
								<view class="fill-icon question"><cw-icon name="question"></cw-icon></view>
								<view>我的问卷</view>
							</navigator>
						</cw-col>
					</cw-row>
				</view>
			</view>
		</view>

		<cw-cell-group title="账号信息">
			<cw-cell is-link link-type="navigateTo" title="个人资料" url="/pages/zone/profile" />
			<cw-cell is-link link-type="navigateTo" title="手机认证" url="/pages/zone/phone" />
			<cw-cell is-link link-type="navigateTo" title="业主名片" url="/pages/zone/card" :border="false" />
		</cw-cell-group>

		<cw-cell-group title="小区设置">
			<cw-cell is-link link-type="navigateTo" title="住宅管理" url="/pages/community/index" />
			<cw-cell is-link link-type="navigateTo" title="家人管理" url="/pages/family/index" :border="false" />
		</cw-cell-group>

		<cw-cell-group title="联系我们">
			<cw-cell is-link link-type="navigateTo" title="问题反馈" url="/pages/feedback/index" />
			<cw-cell is-link link-type="navigateTo" title="功能建议" url="/pages/feedback/feature" />
			<cw-cell is-link link-type="navigateTo" title="物业入驻" url="/pages/feedback/join" />
			<cw-cell is-link link-type="navigateTo" title="关于我们" url="/pages/about/index" />
			<cw-cell is-link link-type="navigateTo" title="用户协议" url="/pages/about/agreement" :border="false" />
		</cw-cell-group>

		<cw-cell-group title="关于e家宜业"><cw-cell is-link title="检查新版本" :value="'当前版本：' + VERSION" clickable @tap.native="checkUpdate" /></cw-cell-group>

		<cw-cell-group><cw-cell title="退出登录" clickable customStyle="margin-top:20px" titleStyle="text-align:center;" @tap.native="logout" /></cw-cell-group>

		<cw-copyright></cw-copyright>

		<cw-dialog ref="dialog" @close="onClose"></cw-dialog>
		<tab-bar path="/pages/zone/index"></tab-bar>
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
import { ASSETS_HOST, VERSION } from '../../config';
import page from '@/pages/common/page.js';
import utils from '../../utils';
export default {
	mixins: [page],
	data() {
		return {
			ASSETS_HOST,
			VERSION
		};
	},

	onShow() {
		if (typeof this.getTabBar === 'function') {
			this.getTabBar().setData({
				activeTab: 2
			});
		}
	},
	methods: {
		checkUpdate() {
			// #ifdef H5
			uni.showToast({
				title: 'h5 端无需更新',
				icon: 'none'
			});
			return;
			// #endif
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(res => {
				if (res.hasUpdate) {
					uni.showLoading({
						title: '版本更新中…',
						mask: true
					});
				} else {
					uni.showToast({
						title: '已是最新版本',
						icon: 'success',
						mask: true
					});
				}
			});
			updateManager.onUpdateReady(() => {
				uni.hideLoading();
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',

					success(res) {
						if (res.confirm) {
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(() => {
				uni.hideLoading();
				uni.showToast({
					title: '更新失败',
					icon: 'error'
				});
			});
		},
		logout() {
			console.log(this.$refs);
			this.$refs.dialog.show({
				message: '确定要退出登录？',
				showCancelButton: true
			});
		},
		onClose(action) {
			if (action == 'confirm') {
				utils.storage.logout();
				uni.redirectTo({
					url: '/pages/login/index',
					fail(err) {
						console.log(err);
					}
				});
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.container {
	padding-bottom: calc(constant(safe-area-inset-bottom) + 50px);
	padding-bottom: calc(env(safe-area-inset-bottom) + 50px);
}

.header-placeholder {
	background: #1989fa;
	// #ifdef H5
	height: 114px;
	// #endif
	// #ifndef H5
	height: 70px;
	// #endif
}
.header-wrapper {
	position: relative;
	padding: 0 20px;
	margin-top: -35px;
}
.header {
	border-radius: 8px;
	background: #fff;
	.avatar {
		position: absolute;
		top: -33px;
		left: 50%;
		margin-left: -33px;
		width: 66px;
		height: 66px;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width: 60px;
			height: 60px;
			border-radius: 50%;
		}
	}
	.info {
		padding-top: 45px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		.name {
			font-size: 14px;
			color: #323333;
			line-height: 26px;
			margin-bottom: 6px;
		}
		.signature {
			font-size: 12px;
			color: #676765;
			line-height: 22px;
			padding: 0 30px;
		}
	}
	.is-identity {
		position: absolute;
		height: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		top: -8px;
		right: 50%;
		margin-right: 60px;
		background: #fff;
		border: 1px solid #116bc5;
		padding: 0 18px 0 8px;
		border-radius: 8px;
		.icon {
			width: 24px;
			height: 24px;
			background: #fff;
			border-radius: 12px;
			border: 1px solid #116bc5;
			position: absolute;
			top: -4px;
			right: -8px;
			font-size: 14px;
			line-height: 22px;
			text-align: center;
		}
		::v-deep .identity {
			color: #009966;
		}
	}
	.is-approve {
		position: absolute;
		height: 16px;
		line-height: 16px;
		font-size: 12px;
		top: -8px;
		left: 50%;
		margin-left: 60px;
		background: #fff;
		border: 1px solid #116bc5;
		padding: 0 8px 0 18px;
		border-radius: 8px;
		.icon {
			width: 24px;
			height: 24px;
			background: #fff;
			border-radius: 12px;
			border: 1px solid #116bc5;
			position: absolute;
			top: -4px;
			left: -8px;
			font-size: 14px;
			line-height: 22px;
			text-align: center;
		}
		::v-deep .approve {
			color: #ff9900;
		}
	}
	.self {
		margin-top: 12px;
		border-top: 1px solid #f5f5f5;
	}
	.self-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		color: #676765;
		padding: 12px 0;
		.fill-icon {
			width: 38px;
			height: 38px;
			line-height: 38px;
			border-radius: 19px;
			color: #fff;
			font-size: 18px;
			margin-bottom: 8px;
			text-align: center;
		}
		.pay {
			background: #ff9933;
		}
		.maintain {
			background: #66cccc;
		}
		.report {
			background: #ff6666;
		}
		.pet {
			background: #1e7069;
			font-size: 22px;
		}
		.fitment {
			background-color: #0066cc;
		}
		.movecar {
			background-color: #339933;
		}
		.vistor {
			background-color: #99ccff;
		}
		.question {
			background-color: #9933cc;
		}
	}
}
.header .is-approve .txt,
.header .is-identity .txt {
	color: #116bc5;
}
.header .is-approve .unable,
.header .is-identity .unable {
	color: #999;
}
</style>
