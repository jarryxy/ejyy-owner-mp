<template>
	<view>
		<cw-tabbar :active="activeTab" :fixed="true" @change="onTabChange">
			<cw-tabbar-item icon="logo">首页</cw-tabbar-item>
			<cw-tabbar-item icon="service">家政</cw-tabbar-item>
			<cw-tabbar-item icon="zone">我的</cw-tabbar-item>
		</cw-tabbar>
	</view>
</template>

<script>
const tabMap = [
	'/pages/home/index', // 'pages/neighbor/index',
	'/pages/service/index',
	'/pages/zone/index'
];
export default {
	props: {
		path: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			activeTab: 0
		};
	},
	methods: {
		onTabChange(e) {
			uni.switchTab({
				url: tabMap[e]
			});
		}
	},
	watch: {
		path: {
			immediate: true,
			handler(val) {
				if (val === '/') {
					val = '/pages/home/index';
				}
				this.activeTab = tabMap.indexOf(val);
			}
		}
		// $route仅支持H5端
		// $route: {
		// 	immediate: true,
		// 	handler(newRoute) {
		// 		console.log(newRoute);
		// 		let path = newRoute.path;
		// 		if (path === '/') {
		// 			path = '/pages/home/index';
		// 		}
		// 		this.activeTab = tabMap.indexOf(path);
		// 	}
		// }
	}
};
</script>
<style></style>
