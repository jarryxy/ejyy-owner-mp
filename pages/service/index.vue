<template>
	<view class="container">
		<cw-dropdown-menu>
			<cw-dropdown-item @change="onCategoryChange" v-model="category" :options="categoryOptions" />
			<cw-dropdown-item @change="onRadiuChange" v-model="radius" :options="radiusOptions" />
		</cw-dropdown-menu>
		<cw-list :fetching="fetching" :current="page_num" :total="page_amount" :list="list" empty="未检索到所需的服务" icon="service" withFilter inTabPage>
			<cw-list-item :title="item.title" :status="communityInfo.current.name + '小区'" useFooterSlot v-for="(item, index) in list" :key="index">
				<cw-list-item-info label="详细地址">{{ item.address }}</cw-list-item-info>

				<cw-list-item-info label="距离小区">{{ item._distance }}米</cw-list-item-info>

				<cw-list-item-info label="联系电话" v-if="item.tel">{{ item.tel }}</cw-list-item-info>

				<view slot="footer">
					<cw-button
						size="small"
						round
						type="default"
						:data-title="item.title"
						:data-location="item.location"
						@click="openMap($event, { title: item.title, location: item.location })"
					>
						打开地图
					</cw-button>
					<cw-button size="small" round type="info" :data-tel="item.tel" custom-class="btn-ml" v-if="item.tel" @click="makeCall($event, { tel: item.tel })">
						拨打电话
					</cw-button>
				</view>
			</cw-list-item>
		</cw-list>

		<!-- 全局提示 -->
		<cw-notify ref="cw-notify" />
		<tab-bar path="/pages/service/index"></tab-bar>
	</view>
</template>
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
import utils from '@/utils/index';
import page from '@/pages/common/page.js';
export default {
	mixins: [page],
	data() {
		return {
			categoryOptions: [
				{
					text: '全部服务',
					value: '家政'
				},
				{
					text: '保洁钟点工',
					value: '保洁钟点工'
				},
				{
					text: '开锁',
					value: '开锁'
				},
				{
					text: '送水',
					value: '送水'
				},
				{
					text: '家电维修',
					value: '家电维修'
				},
				{
					text: '管道疏通打孔',
					value: '管道疏通打孔'
				},
				{
					text: '搬家',
					value: '搬家'
				},
				{
					text: '月嫂保姆',
					value: '月嫂保姆'
				},
				{
					text: '其它家政',
					value: '其它家政'
				}
			],
			category: '家政',
			radiusOptions: [
				{
					text: '2公里内',
					value: 2000
				},
				{
					text: '5公里内',
					value: 5000
				},
				{
					text: '10公里内',
					value: 10000
				},
				{
					text: '15公里内',
					value: 15000
				}
			],
			radius: 5000,
			fetching: true,
			page_size: 5,
			page_num: 1,
			page_amount: 1,
			list: []
		};
	},

	onLoad() {
		this.page_size = Math.ceil(this.systemInfo.windowHeight / 186);
	},

	onShow() {
		// if (typeof this.getTabBar === 'function') {
		// 	this.getTabBar().setData({
		// 		activeTab: 1
		// 	});
		// }
		this.loadData(1);
	},

	// onGlobalDataUpdate() {
	// 	this.loadData(1);
	// },
	methods: {
		openMap(e) {
			const { location, title } = e.currentTarget.dataset;
			uni.openLocation({
				latitude: location.lat,
				longitude: location.lng,
				scale: 18,
				title
			});
		},

		makeCall(e) {
			const { tel } = e.currentTarget.dataset;
			uni.makePhoneCall({
				phoneNumber: tel,
				fail: () => {}
			});
		},
		onCategoryChange(e) {
			// this.category = e;
			this.loadData(1);
		},

		onRadiuChange(e) {
			// this.radius = e;
			this.loadData(1);
		},

		loadData(page_num) {
			if ((this.fetching && page_num > 1) || !this.communityInfo.current) {
				return Promise.reject();
			}
			
			this.fetching = true;
			this.list = page_num === 1 ? [] : this.list;
			return utils.request({
					url: '/service/list',
					method: 'post',
					data: {
						page_num,
						page_size: this.page_size,
						community_id: this.communityInfo.current.community_id,
						category: this.category,
						radius: this.radius
					}
				})
				.then(
					res => {
						this.fetching = false;
						(this.page_num = res.data.page_num),
							(this.page_amount = res.data.page_amount),
							(this.list = page_num === 1 ? res.data.list : [].concat(this.list, res.data.list));
					},
					res => {
						this.fetching = false;
						this.list = [];
						this.$refs.notify.show({
							type: 'danger',
							message: res.message
						});
					}
				);
		}
	},

	onReachBottom() {
		const { page_num, page_amount } = this;
		if (page_num < page_amount) {
			this.loadData(page_num + 1);
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.loadData(1).then(() => {
			uni.stopPullDownRefresh();
		});
	}
};
</script>
<style scoped>
.container {
	padding-bottom: calc(constant(safe-area-inset-bottom) + 50px);
	padding-bottom: calc(env(safe-area-inset-bottom) + 50px);
}
</style>
