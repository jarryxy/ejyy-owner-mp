<template>
	<view :class="rootClass" :style="rootStyle"><slot /></view>
</template>
<script>
import computed from './index.js';
export default {
	mixins: [computed],
	props: {
		dashed: Boolean,
		// 开启后线更细
		hairline: {
			type: Boolean,
			default: false
		},
		// slot内容位置 center left right
		contentPosition: {
			type: String,
			default: 'center'
		},
		fontSize: String,
		borderColor: String,
		textColor: String,
		customStyle: String
	}
};
</script>
<style lang="scss" scoped>
@import '../../libs/css/common.scss';

.cw-divider {
	display: -webkit-flex;
	display: flex;
	-webkit-align-items: center;
	align-items: center;
	margin: 16px 0;
	color: #969799;
	font-size: 12px;
	line-height: 24px;
	border: 0 solid #ebedf0;
}

.cw-divider:after,
.cw-divider:before {
	display: block;
	-webkit-flex: 1;
	flex: 1;
	box-sizing: border-box;
	height: 1px;
	border-color: inherit;
	border-style: inherit;
	border-width: 1px 0 0;
}

.cw-divider:before {
	content: '';
}

.cw-divider--hairline:after,
.cw-divider--hairline:before {
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
}

.cw-divider--dashed {
	border-style: dashed;
}

.cw-divider--center:before,
.cw-divider--left:before,
.cw-divider--right:before {
	margin-right: 16px;
}

.cw-divider--center:after,
.cw-divider--left:after,
.cw-divider--right:after {
	content: '';
	margin-left: 16px;
}

.cw-divider--left:before {
	max-width: 10%;
}

.cw-divider--right:after {
	max-width: 10%;
}
</style>
