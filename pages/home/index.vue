<template>
	<view class="container">
		<cw-nav-bar
			title="e家宜业"
			fixed
			:border="false"
			:custom-class="navBarClass"
			title-class="nav-bar-title"
			z-index="100"
			:custom-style="'background-color: transparent;height:' + (systemInfo.navBarHeight + systemInfo.statusBarHeight) + 'px;padding-top:' + systemInfo.statusBarHeight + 'px'"
		/>
		<view class="recommand-desktop" v-if="showRecommand" :style="'top: ' + (systemInfo.navBarHeight + systemInfo.statusBarHeight) + 'px;'">
			<view class="close" @tap="hideRecommand"><cw-icon name="cross" /></view>
			<view class="text">
				<view class="num">1</view>
				点击上方
				<view class="btn-mock"><view class="big-circle" /></view>
				按钮
			</view>
			<view class="text">
				<view class="num">2</view>
				点击「添加到桌面」
			</view>
			<image src="/static/src/assets/recommand.jpg" class="recommand-img" mode="widthFix" />
			<view class="text">
				<view class="num">3</view>
				桌面打开「e家宜业」，服务更贴心
			</view>
		</view>
		<!-- 头部 -->
		<view class="banner">
			<view class="placeholder" :style="'height:' + (systemInfo.navBarHeight + systemInfo.statusBarHeight) + 'px'"></view>
			<image class="bg-pic" v-if="communityInfo.current" :src="ASSETS_HOST + communityInfo.current.banner" mode="scaleToFill" />

			<view class="operate">
				<view class="quick">
					<navigator url="/pages/community/index"><cw-icon name="menu" /></navigator>
					<navigator url="/pages/notification/index"><cw-icon name="notice" :info="unread_amount === 0 ? '' : unread_amount" /></navigator>
					<navigator url="/pages/home/convenient"><cw-icon name="convenient" /></navigator>
				</view>

				<view class="user-info">
					<view class="avatar"><image :src="ASSETS_HOST + userInfo.avatar_url" v-if="userInfo.avatar_url" :lazy-load="true" mode="scaleToFill" /></view>

					<view>
						<view class="name">
							<text>{{ userInfo.nick_name }}</text>
							<cw-icon name="identity" custom-class="identity" v-if="userInfo.phone" />
						</view>
						<view class="signature">{{ userInfo.signature }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 工具栏 -->
		<view class="tools-wrapper">
			<view class="tools">
				<view class="house">
					<cw-icon name="home" custom-class="home"></cw-icon>
					<cw-icon name="approve" custom-class="approve" v-if="community.approve(communityInfo)"></cw-icon>
					<text>{{ community.title(communityInfo) }}</text>
				</view>

				<view class="tools-list">
					<cw-row>
						<cw-col span="6">
							<view class="tool-item" @tap="connectService">
								<cw-icon name="phone" custom-class="phone"></cw-icon>
								<view>联系客服</view>
							</view>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/access/index">
								<cw-icon name="access" custom-class="access"></cw-icon>
								<view>门禁出入</view>
							</navigator>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/repair/create">
								<cw-icon name="maintain" custom-class="maintain"></cw-icon>
								<view>维修上报</view>
							</navigator>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/complain/create">
								<cw-icon name="report" custom-class="report"></cw-icon>
								<view>投诉建议</view>
							</navigator>
						</cw-col>
					</cw-row>
					<cw-row>
						<cw-col span="6">
							<navigator class="tool-item" url="/pages/payment/order">
								<cw-icon name="pay" custom-class="pay"></cw-icon>
								<view>物业缴费</view>
							</navigator>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/car/index">
								<cw-icon name="park" custom-class="park"></cw-icon>
								<view>车位车辆</view>
							</navigator>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/pet/create">
								<cw-icon name="pet" custom-class="pet"></cw-icon>
								<view>宠物登记</view>
							</navigator>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/fitment/create">
								<cw-icon name="fitment" custom-class="fitment"></cw-icon>
								<view>装修报备</view>
							</navigator>
						</cw-col>
					</cw-row>

					<cw-row>
						<cw-col span="6">
							<navigator class="tool-item" url="/pages/move_car/create">
								<cw-icon name="movecar" custom-class="movecar"></cw-icon>
								<view>小区挪车</view>
							</navigator>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/vistor/create">
								<cw-icon name="footprint" custom-class="footprint"></cw-icon>
								<view>访客登记</view>
							</navigator>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/vistor/self">
								<cw-icon name="vistor" custom-class="vistor"></cw-icon>
								<view>访客通行</view>
							</navigator>
						</cw-col>

						<cw-col span="6">
							<navigator class="tool-item" url="/pages/questionnaire/index">
								<cw-icon name="question" custom-class="question"></cw-icon>
								<view>问卷调查</view>
							</navigator>
						</cw-col>
					</cw-row>
				</view>
			</view>
		</view>

		<view v-if="!userInfo.subscribed && showOaComponent" class="section official-account">
			<view class="recommand">关注官方公众号第一时间接收物业消息</view>
			<view>
				<!-- #ifdef MP-WEIXIN -->
				<!-- [miniprogram-to-uniapp] 公众号关注组件 仅微信小程序支持 -->
				<official-account @error="onOALoadFail"></official-account>
				<!-- #endif -->

				<!-- #ifndef MP-WEIXIN -->
				<view class="tip">当前为非微信小程序环境，不支持公众号关注组件，请自行调整当前节点内容！</view>
				<!-- #endif -->
			</view>
		</view>

		<!-- 小区通知 -->
		<cw-panel title="小区通知" custom-class="section">
			<view class="notice-wrapper">
				<block v-if="fetching">
					<view class="notice-item" v-for="(item, index) in 3" :key="index"><cw-skeleton custom-class="notice-loading" title row="1" /></view>
				</block>
				<block v-else>
					<view class="notice-empty" v-if="notice.length === 0">暂无通知消息</view>
					<block v-else>
						<navigator class="notice-item" :url="'/pages/notification/detail?id=' + item.id + '&unread=0'" v-for="(item, index) in notice" :key="index">
							<view class="notice-title">{{ item.title }}</view>

							<view class="notice-overview">{{ item.overview }}</view>

							<view class="notice-time">{{ common.date(item.created_at) }}</view>
						</navigator>
					</block>
				</block>
			</view>
		</cw-panel>

		<!-- 肺炎 -->
		<cw-panel title="全国疫情数据（含港澳台）" custom-class="section">
			<cw-row>
				<cw-col span="8">
					<view class="virus-item">
						<view class="type">境外输入</view>
						<cw-skeleton :row="1" row-class="virus-loading" :loading="fetching" />
						<view class="amount virus-input" v-if="!fetching">{{ virus.total.input }}</view>
						<view class="increase">
							较昨日
							<view v-if="!virus.today.input && virus.today.input !== 0">待公布</view>
							<view class="virus-input" v-else>{{ virus.today.input >= 0 ? '+' : '' }}{{ virus.today.input }}</view>
						</view>
					</view>
				</cw-col>

				<cw-col span="8">
					<view class="virus-item">
						<view class="type">无症状感染者</view>
						<cw-skeleton :row="1" row-class="virus-loading" :loading="fetching" />
						<view class="amount virus-confirm" v-if="!fetching">{{ virus.extData.noSymptom }}</view>
						<view class="increase">
							较昨日
							<view v-if="!virus.extData.incrNoSymptom && virus.extData.incrNoSymptom !== 0">待公布</view>
							<view class="virus-confirm" v-else>{{ virus.extData.incrNoSymptom >= 0 ? '+' : '' }}{{ virus.extData.incrNoSymptom }}</view>
						</view>
					</view>
				</cw-col>

				<cw-col span="8">
					<view class="virus-item">
						<view class="type">现有确诊</view>
						<cw-skeleton :row="1" row-class="virus-loading" :loading="fetching" />
						<view class="amount virus-today-confirm" v-if="!fetching">{{ virus.total.confirm - virus.total.dead - virus.total.heal }}</view>
						<view class="increase">
							较昨日
							<view v-if="!virus.today.storeConfirm && virus.today.storeConfirm !== 0">待公布</view>
							<view class="virus-today-confirm" v-else>{{ virus.today.storeConfirm >= 0 ? '+' : '' }}{{ virus.today.storeConfirm }}</view>
						</view>
					</view>
				</cw-col>
			</cw-row>
			<cw-row>
				<cw-col span="8">
					<view class="virus-item">
						<view class="type">累计确诊</view>
						<cw-skeleton :row="1" row-class="virus-loading" :loading="fetching" />
						<view class="amount virus-confirm" v-if="!fetching">{{ virus.total.confirm }}</view>
						<view class="increase">
							较昨日
							<view v-if="!virus.today.confirm && virus.today.confirm !== 0">待公布</view>
							<view class="virus-confirm" v-else>{{ virus.today.confirm >= 0 ? '+' : '' }}{{ virus.today.confirm }}</view>
						</view>
					</view>
				</cw-col>

				<cw-col span="8">
					<view class="virus-item">
						<view class="type">累计死亡</view>
						<cw-skeleton :row="1" row-class="virus-loading" :loading="fetching" />
						<view class="amount" v-if="!fetching">{{ virus.total.dead }}</view>
						<view class="increase">
							较昨日
							<view v-if="!virus.today.dead && virus.today.dead !== 0">待公布</view>
							<view v-else>{{ virus.today.dead >= 0 ? '+' : '' }}{{ virus.today.dead }}</view>
						</view>
					</view>
				</cw-col>

				<cw-col span="8">
					<view class="virus-item">
						<view class="type">累计治愈</view>
						<cw-skeleton :row="1" row-class="virus-loading" :loading="fetching" />
						<view class="amount virus-heal" v-if="!fetching">{{ virus.total.heal }}</view>
						<view class="increase">
							较昨日
							<view v-if="!virus.today.heal && virus.today.heal !== 0">待公布</view>
							<view class="virus-heal" v-else>{{ virus.today.heal >= 0 ? '+' : '' }}{{ virus.today.heal }}</view>
						</view>
					</view>
				</cw-col>
			</cw-row>

			<view class="last-update-time">截至 {{ fetching ? '数据获取中……' : virus.lastUpdateTime }} 数据源自网易新闻</view>
		</cw-panel>

		<!-- 广告 -->
		<!-- 		<swiper
			class="swiper"
			:indicator-dots="true"
			:autoplay="true"
			indicator-color="rgba(25, 137, 250, 0.4)"
			indicator-active-color="rgba(25, 137, 250, 0.8)"
			:interval="5000"
			:style="'height: ' + windowWidth / 3 + 'px'"
			:duration="300"
		>
			<swiper-item v-for="(item, index) in topic" :key="index">
				<navigator :url="'/pages/topic/detail?id=' + item.id"><image :src="ASSETS_HOST + item.banner_img" lazy-load mode="widthFix" /></navigator>
			</swiper-item>
		</swiper> -->

		<!-- 热聊 -->
		<!-- <cw-panel title="小区热议" custom-class="section">
        <block wx:for="{{[1,2,3]}}" wx:key="item">
            <view class="bbs-item">
                <view class="bbs-inner">
                    <view class="title">小区绿化越来越差劲了，满地的树叶{{item}}</view>
                    <view class="tags">
                        <cw-tag type="primary">环境</cw-tag>
                        <cw-tag type="success">绿化</cw-tag>
                    </view>
                    <view class="paragraph">
                        小区绿化越来越差劲了，满地的树叶小区绿化越来越差劲了，满地的树叶小区绿化越来越差劲了，满地的树叶小区绿化越来越差劲了，满地的树叶
                    </view>
                    <view class="statistic">
                        <view class="publish">
                            <view class="avatar">
                                <image
                                    class="bg-pic"
                                    src="../../assets/home/avatar.jpg"
                                    lazy-load
                                    mode="scaleToFill"
                                ></image>
                            </view>
                            <text>2020-08-08</text>
                        </view>
                        <view class="interact">
                            <view>
                                <cw-icon name="view"></cw-icon>
                                <text>100</text>
                            </view>
                            <view>
                                <cw-icon name="comment"></cw-icon>
                                <text>66</text>
                            </view>
                            <view>
                                <cw-icon name="like"></cw-icon>
                                <text>3</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </block>
    </cw-panel> -->

		<cw-divider contentPosition="center">更多内容敬请期待</cw-divider>

		<!-- 全局提示 -->
		<cw-toast id="cw-toast"></cw-toast>
		<tab-bar path="/pages/home/index"></tab-bar>
	</view>
</template>
<script module="community" lang="wxs" src="./index.wxs"></script>
<script module="common" lang="wxs" src="../common/common.wxs"></script>
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
import utils from '../../utils/index';
import { ASSETS_HOST } from '../../config';
import page from '@/pages/common/page.js';
export default {
	mixins: [page],
	data() {
		return {
			ASSETS_HOST,
			navBarClass: 'nav-bar',
			unread_amount: 0,
			virus: {
				today: {},
				extData: {}
			},
			fetching: true,
			topic: [],
			notice: [],
			showOaComponent: true,
			showRecommand: false
		};
	},
	onLoad() {
		if (!uni.getStorageSync('RECOMMAND_DESKTOP')) {
			this.showRecommand = true;
		}
		// uni.showShareMenu({
		// 	withShareTicket: true,
		// 	menus: ['shareAppMessage', 'shareTimeline']
		// });
	},

	onShow() {
		// if (typeof this.getTabBar === 'function') {
		// 	this.getTabBar().setData({
		// 		activeTab: 0
		// 	});
		// }
		this.loadData();
	},
	methods: {
		loadData() {
			if (!this.communityInfo.current) {
				return Promise.reject();
			}

			return utils
				.request({
					url: `/home/main/${this.communityInfo.current.community_id}`,
					method: 'get'
				})
				.then(res => {
					this.unread_amount = res.data.unread_amount;
					this.virus = res.data.virus;
					this.topic = res.data.topic;
					this.notice = res.data.notice;
					this.fetching = false;
				});
		},
		connectService() {
			const { communityInfo } = this;
			uni.makePhoneCall({
				phoneNumber: communityInfo.current ? communityInfo.current.phone : '',
				fail: () => {}
			});
		},

		onOALoadFail() {
			this.showOaComponent = false;
		},

		hideRecommand() {
			uni.setStorageSync('RECOMMAND_DESKTOP', 1);
			this.showRecommand = false;
		}
	},

	onPageScroll(e) {
		const { scrollTop } = e;
		const navBarClass = ['nav-bar'];

		if (scrollTop > 0 && scrollTop < 270) {
			navBarClass.push('half-opacity');
		} else if (scrollTop >= 270) {
			navBarClass.push('full-opacity');
		}

		this.navBarClass = navBarClass.join(' ');
	},

	onPullDownRefresh() {
		this.loadData().then(() => {
			uni.stopPullDownRefresh();
		});
	}
};
</script>
<style lang="scss" scoped>
.container {
	padding-bottom: calc(constant(safe-area-inset-bottom) + 50px);
	padding-bottom: calc(env(safe-area-inset-bottom) + 50px);
}
::v-deep {
	.nav-bar-title {
		color: #fff !important;
	}
}
.nav-bar {
	background-color: transparent !important;
	transform: background-color 0.2s ease-in-out;
	&.half-opacity {
		background-color: rgba(55, 122, 227, 0.75) !important;
	}
	&.full-opacity {
		background-color: rgba(55, 122, 227, 1) !important;
	}
}
.nav-bar-title {
	color: #fff !important;
}
.banner {
	height: 270px;
	overflow: hidden;
	background: linear-gradient(-45deg, #377ae3, #6d64e1);
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	z-index: 5;
	.bg-pic {
		position: absolute;
		top: 0;
		left: 0;
	}
	.placeholder {
		background: transparent;
	}
	.operate {
		flex: auto;
		position: relative;
		width: 100%;
		.quick {
			font-size: 22px;
			color: #fff;
			position: absolute;
			top: 10px;
			right: 30px;
			display: flex;
			flex-direction: row;
			width: 90px;
			align-items: center;
			justify-content: space-between;
		}
		.notice {
			font-size: 22px;
			color: #fff;
			position: absolute;
			top: 10px;
			right: 70px;
		}
	}
	.user-info {
		position: absolute;
		left: 30px;
		top: 36px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		z-index: 1;
		.avatar {
			width: 58px;
			height: 58px;
			border-radius: 50%;
			margin-right: 12px;
			flex: none;
			background-color: rgba(255, 255, 255, 0.4);
			display: flex;
			align-items: center;
			justify-content: center;
			image {
				width: 52px;
				height: 52px;
				border-radius: 50%;
			}
		}
		.name {
			font-size: 16px;
			color: #fff;
			line-height: 26px;
			text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
			::v-deep .identity {
				color: #19be6b;
				margin-left: 8px;
				font-size: 14px;
				text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
			}
		}
		.signature {
			font-size: 14px;
			padding-right: 22px;
			color: #eee;
			line-height: 18px;
			text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
		}
	}
}
.tools-wrapper {
	padding: 0 18px;
	z-index: 10;
	position: relative;
}
.tools {
	width: 100%;
	border-radius: 14px;
	margin-top: -60px;
	::v-deep .house {
		background-color: rgba(0, 0, 0, 0.34);
		height: 60px;
		padding: 0 14px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
		.home {
			font-size: 18px;
			margin-right: 6px;
			color: #2bbe8f;
		}
		.approve {
			font-size: 18px;
			margin-right: 6px;
			color: #ff9900;
		}
		text {
			font-size: 14px;
			color: #fff;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
	.tools-list {
		padding-bottom: 8px;
		background: #fff;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		::v-deep .tool-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 12px;
			color: #434345;
			padding: 12px 0;
			.cw-icon {
				font-size: 28px;
				margin-bottom: 6px;
			}
			.pay {
				color: #ff9933;
			}
			.maintain {
				color: #66cccc;
			}
			.fitment {
				color: #0066cc;
			}
			.report {
				color: #ff6666;
			}
			.movecar {
				color: #339933;
			}
			.footprint {
				color: #99ccff;
			}
			.park {
				color: #cc3399;
			}
			.question {
				color: #9933cc;
			}
			.phone {
				color: #32a4a7;
			}
			.access {
				color: #c386f1;
			}
			.pet {
				color: #1e7069;
			}
			.vistor {
				color: #3e9cbf;
			}
		}
	}
}

.official-account {
	padding: 0 20px;
	.recommand {
		font-size: 12px;
		line-height: 16px;
		color: #888;
		margin-bottom: 8px;
	}
	.tip {
		color: #2d3436;
		font-size: 14px;
	}
}
.virus-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 16px;
	position: relative;
	&:before {
		content: '';
		position: absolute;
		top: 28px;
		bottom: 28px;
		right: 0;
		border-left: 1px solid #eee;
	}
	.type {
		font-size: 14px;
		line-height: 18px;
		color: #333;
		margin-bottom: 6px;
		white-space: nowrap;
	}
	.amount {
		font-size: 22px;
		line-height: 26px;
		height: 26px;
		margin-bottom: 6px;
		color: #232323;
	}
	.increase {
		font-size: 12px;
		line-height: 14px;
		color: #999;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.virus-input {
		color: #ffa352;
	}
	.virus-confirm {
		color: #791618;
	}
	.virus-today-confirm {
		color: #e44a3d;
	}
	.virus-heal {
		color: #34aa70;
	}
}
.virus-loading {
	height: 26px !important;
	width: 34px !important;
	margin-bottom: 6px;
}
.last-update-time {
	font-size: 12px;
	color: #999;
	line-height: 20px;
	padding-bottom: 12px;
	padding-right: 20px;
	text-align: right;
}
.swiper {
	width: 100%;
	height: 150px;
	margin-top: 20px;
}
.notice-empty {
	height: 60px;
	line-height: 60px;
	font-size: 12px;
	text-align: center;
	color: #999;
}
.notice-wrapper {
	padding: 0 18px;
}
.notice-item {
	padding: 8px 0;
	position: relative;
	& + .notice-item {
		border-top: 1px solid #f9f9f9;
	}
}
.notice-loading {
	padding: 4px !important;
}
.notice-title {
	font-size: 13px;
	color: #343434;
	line-height: 20px;
	margin-bottom: 6px;
}
.notice-overview {
	font-size: 12px;
	color: #666;
	line-height: 18px;
}
.notice-time {
	font-size: 12px;
	color: #888;
	line-height: 14px;
	margin-top: 4px;
	text-align: right;
}
.recommand-desktop {
	position: fixed;
	right: 18px;
	background: #fff;
	z-index: 999;
	border-radius: 4px;
	width: 260px;
	padding: 14px;
	box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
	.close {
		position: absolute;
		font-size: 16px;
		color: #777;
		top: 8px;
		right: 12px;
	}
	&:before {
		position: absolute;
		content: '';
		border: 5px solid transparent;
		border-bottom-color: #fff;
		right: 47px;
		top: -10px;
	}
	.text {
		height: 28px;
		font-size: 12px;
		color: #333;
		display: flex;
		align-items: center;
		.num {
			display: inline-block;
			width: 20px;
			height: 20px;
			line-height: 20px;
			text-align: center;
			border-radius: 50%;
			color: #fff;
			background-color: #1890ff;
			margin-right: 6px;
		}
	}
	.btn-mock {
		display: inline-flex;
		margin: 0 4px;
		position: relative;
		width: 20px;
		height: 6px;
		text-align: center;
		line-height: 6px;
		align-items: center;
		justify-content: space-between;
		.big-circle {
			width: 6px;
			height: 6px;
			display: inline-block;
			border-radius: 50%;
			background-color: #464646;
		}
		&:before {
			content: '';
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background-color: #464646;
		}
		&:after {
			content: '';
			width: 4px;
			height: 4px;
			border-radius: 50%;
			background-color: #464646;
		}
	}
}
.recommand-img {
	border-radius: 6px;
	margin: 6px 0;
}
</style>
