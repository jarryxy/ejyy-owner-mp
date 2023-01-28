<template>
	<view class="container">
		<view v-if="fetching">
			<view class="item" v-for="(item, index) in 3" :key="index">
				<view class="info"><cw-skeleton :row="2" title /></view>

				<view class="phone" :data-phone="item.phone" @tap="makeCell"><cw-icon name="phone" /></view>
			</view>
		</view>
		<view v-else>
			<view class="item" v-for="(item, index) in list" :key="index">
				<view class="info">
					<view class="title">{{ item.title }}</view>
					<view class="txt">{{ item.location }}</view>
					<view class="txt">{{ item.phone }}</view>
				</view>

				<view class="phone" :data-phone="item.phone" @tap="makeCell"><cw-icon name="phone" /></view>
			</view>
			<cw-empty v-if="list.length === 0" with-copyright :description="communityInfo.current.name + '小区暂未发布便民信息'" />
		</view>

		<cw-copyright :fixed="!fetching && list.length === 0" />
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
import { CwPage } from '../common/page';
import utils from '../../utils/index';
CwPage({
	data: {
		fetching: true,
		list: []
	},

	onGlobalDataUpdate() {
		this.loadData();
	},

	loadData() {
		utils
			.request({
				url: `/convenient/detail/${this.data.communityInfo.current.community_id}`,
				method: 'get'
			})
			.then(res => {
				this.setData({
					fetching: false,
					list: res.data.list
				});
				uni.stopPullDownRefresh();
			});
	},

	onPullDownRefresh() {
		this.loadData();
	},

	makeCell(e) {
		const { phone } = e.currentTarget.dataset;
		uni.makePhoneCall({
			phoneNumber: phone,
			fail: () => {}
		});
	}
});
</script>
<style>
.item {
	background-color: #fff;
	padding: 12px 20px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	position: relative;
}

.item .info {
	flex: auto;
	overflow: hidden;
	padding-right: 12px;
}

.item .phone {
	flex: none;
	font-size: 18px;
	color: #1989fa;
}

.item .info .title {
	font-size: 14px;
	color: #323232;
	line-height: 20px;
	margin-bottom: 8px;
}

.item .info .txt {
	font-size: 14px;
	color: #676767;
	line-height: 16px;
}

.item + .item:before {
	position: absolute;
	top: 0;
	left: 20px;
	right: 20px;
	content: '';
	border-top: 1px solid #ebedf0;
}
</style>
