<template>
	<view :class="rootClass" :style="rootStyle">
		<slot />
	</view>
</template>
<script>
import computed from './index.js';
import mixin from '../../libs/mixin/mixin.js';

export default {
	mixins: [mixin, computed],
	props: {
		span: [Number,String],
		offset: [Number,String]
	},
	data() {
		return {
			gutter: 12,
			parentData: {
				gutter: 0
			}
		};
	},
	computed: {
		rootClass() {
			const { span, offset } = this;
			return 'custom-class ' + this.$o.utils.bem('col', [span]) + ' ' + (offset ? 'cw-col--offset-' + offset : '');
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init() {
			// 支付宝小程序不支持provide/inject，所以使用这个方法获取整个父组件，在created定义，避免循环引用
			this.updateParentData();
		},
		updateParentData() {
			this.getParentData('cw-row');
		}
	}
};
</script>
<style lang="scss" scoped>
@import '../../libs/css/common.scss';

.cw-col {
	float: left;
	box-sizing: border-box;
}

.cw-col--1 {
	width: 4.16666667%;
}

.cw-col--offset-1 {
	margin-left: 4.16666667%;
}

.cw-col--2 {
	width: 8.33333333%;
}

.cw-col--offset-2 {
	margin-left: 8.33333333%;
}

.cw-col--3 {
	width: 12.5%;
}

.cw-col--offset-3 {
	margin-left: 12.5%;
}

.cw-col--4 {
	width: 16.66666667%;
}

.cw-col--offset-4 {
	margin-left: 16.66666667%;
}

.cw-col--5 {
	width: 20.83333333%;
}

.cw-col--offset-5 {
	margin-left: 20.83333333%;
}

.cw-col--6 {
	width: 25%;
}

.cw-col--offset-6 {
	margin-left: 25%;
}

.cw-col--7 {
	width: 29.16666667%;
}

.cw-col--offset-7 {
	margin-left: 29.16666667%;
}

.cw-col--8 {
	width: 33.33333333%;
}

.cw-col--offset-8 {
	margin-left: 33.33333333%;
}

.cw-col--9 {
	width: 37.5%;
}

.cw-col--offset-9 {
	margin-left: 37.5%;
}

.cw-col--10 {
	width: 41.66666667%;
}

.cw-col--offset-10 {
	margin-left: 41.66666667%;
}

.cw-col--11 {
	width: 45.83333333%;
}

.cw-col--offset-11 {
	margin-left: 45.83333333%;
}

.cw-col--12 {
	width: 50%;
}

.cw-col--offset-12 {
	margin-left: 50%;
}

.cw-col--13 {
	width: 54.16666667%;
}

.cw-col--offset-13 {
	margin-left: 54.16666667%;
}

.cw-col--14 {
	width: 58.33333333%;
}

.cw-col--offset-14 {
	margin-left: 58.33333333%;
}

.cw-col--15 {
	width: 62.5%;
}

.cw-col--offset-15 {
	margin-left: 62.5%;
}

.cw-col--16 {
	width: 66.66666667%;
}

.cw-col--offset-16 {
	margin-left: 66.66666667%;
}

.cw-col--17 {
	width: 70.83333333%;
}

.cw-col--offset-17 {
	margin-left: 70.83333333%;
}

.cw-col--18 {
	width: 75%;
}

.cw-col--offset-18 {
	margin-left: 75%;
}

.cw-col--19 {
	width: 79.16666667%;
}

.cw-col--offset-19 {
	margin-left: 79.16666667%;
}

.cw-col--20 {
	width: 83.33333333%;
}

.cw-col--offset-20 {
	margin-left: 83.33333333%;
}

.cw-col--21 {
	width: 87.5%;
}

.cw-col--offset-21 {
	margin-left: 87.5%;
}

.cw-col--22 {
	width: 91.66666667%;
}

.cw-col--offset-22 {
	margin-left: 91.66666667%;
}

.cw-col--23 {
	width: 95.83333333%;
}

.cw-col--offset-23 {
	margin-left: 95.83333333%;
}

.cw-col--24 {
	width: 100%;
}

.cw-col--offset-24 {
	margin-left: 100%;
}
</style>
