<script>
import utils from '@/utils/index';
export default {
	onLaunch() {
		console.log('App Launch');
		// 隐藏默认tabbar
		uni.hideTabBar();
		// 检查更新
		this.checkUpdate();
		// 适配
		this.adaptive();
		// 检查网络
		this.checkNetwork();
	},
	data() {
		return {
			hello: 'sss'
		};
	},
	onShow(opts) {
		console.log('App Show');
		if (utils.storage.isLogin()) {
			this.getUserInfo();
		} else {
			const query = [];
			for (let key in opts.query) {
				query.push(`${key}=${opts.query[key]}`);
			}
			const redirect = encodeURIComponent(`/${opts.path}${query.length ? '?' : ''}${query.join('&')}`);

			return uni.redirectTo({
				url: `/pages/login/index?redirect=${redirect}`
			});
		}
	},
	onHide: function() {
		console.log('App Hide');
	},
	onPageNotFound() {
		uni.redirectTo({
			url: '/pages/error/general'
		});
	},
	methods: {
		checkUpdate() {
			const updateManager = uni.getUpdateManager();
			updateManager.onCheckForUpdate(res => {
				if (!res.hasUpdate) {
					return;
				}
				uni.showLoading({
					title: '版本更新中…',
					mask: true
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
			});
		},

		adaptive() {
			const systemInfo = uni.getSystemInfoSync();
			this.globalData.data.systemInfo = systemInfo;

			this.globalData.data.systemInfo.navBarHeight = 0;
			// #ifndef H5
			const { top, height } = uni.getMenuButtonBoundingClientRect();
			this.globalData.data.systemInfo.navBarHeight = (top - systemInfo.statusBarHeight) * 2 + height;
			// #endif
			// #ifdef H5
			this.globalData.data.systemInfo.navBarHeight = 44;
			// #endif
		},

		checkNetwork() {
			uni.getNetworkType({
				success: res => {
					// 未连接网络
					if (res.networkType === 'none') {
						uni.redirectTo({ url: '/pages/error/network' });
					}
				}
			});
		},
		// onDataFuns: [],

		// on(event, fn) {
		//     if (event === 'data') {
		//         this.onDataFuns.push(fn);
		//         this.dataEmitter();
		//     }
		// },
		// off(event, fn) {
		//     if (event === 'data') {
		//         this.onDataFuns.splice(
		//             this.onDataFuns.findIndex(rfn => fn === rfn),
		//             1
		//         );
		//     }
		// },
		// dataEmitter() {
		//     this.onDataFuns.forEach(fn => {
		//         fn(this.data);
		//     });
		// },
		getUserInfo() {
			return utils
				.request({
					url: '/user/info',
					method: 'get'
				})
				.then(res => {
					this.updateData({
						userInfo: res.data.userInfo,
						communityInfo: res.data.communityInfo,
						globalFetching: false
					});
					var pages = getCurrentPages(); //获取加载的页面
					var currentPage = pages[pages.length - 1].route; //获取当前页面的对象 修改数量可以获取之前跳转页面的地址
					if (currentPage !== 'pages/zone/avatar') {
						if (!res.data.userInfo.intact) {
							uni.redirectTo({
								url: '/pages/zone/supplement'
							});
						} else if (res.data.communityInfo.list.length === 0) {
							uni.redirectTo({
								url: '/pages/community/binding'
							});
						}
					}
				});
		},
		updateData(data) {
			this.globalData.data = {
				...this.globalData.data,
				...data
			};

			// this.dataEmitter();
		}
	},
	globalData: {
		data: {
			globalFetching: true,
			userInfo: {},
			communityInfo: {
				list: [],
				current: null
			},
			systemInfo: {},
			navBarHeight: 'auto',
			activeTab: 0
		},
		activeTab:0,
		methods: {
			test() {
				console.log('hello test');
			}
		}
	}
};
</script>

<style>
/*每个页面公共css */
@import url('@/static/iconfont/index.css');

view,
image,
page,
input,
textarea,
swiper {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

video,
image {
	display: block;
}

.placeholder {
	color: #c8c9cc;
}

.section {
	margin-top: 20px;
}

.btn-ml {
	margin-left: 10px;
}

.container {
	min-height: 100vh;
	background: #f7f8fc;
	position: relative;
	overflow: hidden;
	-webkit-font-smoothing: antialiased;
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

image {
	width: 100%;
	height: 100%;
}

.text-color-light {
	color: #888da8;
}

.text-color-gray {
	color: #616a6e;
}

.text-color-base {
	color: #414a63;
}

.link {
	font-size: 14px;
	color: #2d8cf0;
}

.load-more {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 16px 0;
}

.cw-dialog {
	top: 45% !important;
	overflow: hidden;
	width: 320px;
	font-size: 16px;
	border-radius: 16px;
	background-color: #fff;
}

.cw-popup {
	position: fixed;
	box-sizing: border-box;
	max-height: 100%;
	overflow-y: auto;
	transition-timing-function: ease;
	-webkit-animation: ease both;
	animation: ease both;
	-webkit-overflow-scrolling: touch;
	background-color: #fff;
}

.cw-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
}
</style>
