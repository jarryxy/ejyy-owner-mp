<template>
	<view :class="[$o.utils.bem('loading', { vertical }),customClass]">
		<view :class="'cw-loading__spinner cw-loading__spinner--' + type" :style="spinnerStyle">
			<view v-if="type === 'spinner'" class="cw-loading__dot" v-for="(item, index) in array12" :key="index"></view>
		</view>
		<view class="cw-loading__text" :style="textStyle"><slot /></view>
	</view>
</template>
<script>
import style from '../../libs/function/style.js';
import addUnit from '../../libs/function/add-unit.js';
export default {
	name: 'cw-loading',
	props: {
		color: String,
		vertical: Boolean,
		type: {
			type: String,
			default: 'circular'
		},
		customClass: {
			type:String,
			default:''
		},
		size: String,
		textSize: String
	},
	data() {
		return {
			array12: Array.from({
				length: 12
			})
		};
	},
	computed: {
		spinnerStyle() {
			const { color, size } = this;
			return style({
				color: color,
				width: addUnit(size),
				height: addUnit(size)
			});
		},
		textStyle() {
			const { textSize } = this;
			return style({
				'font-size': addUnit(textSize)
			});
		}
	}
};
</script>
<style lang="scss" scoped>
@import '../../libs/css/common.scss';

:host {
	font-size: 0;
	line-height: 1;
}

.cw-loading {
	display: -webkit-inline-flex;
	display: inline-flex;
	-webkit-align-items: center;
	align-items: center;
	-webkit-justify-content: center;
	justify-content: center;
	color: #c8c9cc;
}

.cw-loading__spinner {
	position: relative;
	box-sizing: border-box;
	width: 30px;
	max-width: 100%;
	max-height: 100%;
	height: 30px;
	animation: cw-rotate 0.8s linear infinite;
}

.cw-loading__spinner--spinner {
	-webkit-animation-timing-function: steps(12);
	animation-timing-function: steps(12);
}

.cw-loading__spinner--circular {
	border: 1px solid transparent;
	border-top-color: initial;
	border-radius: 100%;
}

.cw-loading__text {
	margin-left: 8px;
	color: #969799;
	font-size: 14px;
	line-height: 20px;
}

.cw-loading__text:empty {
	display: none;
}

.cw-loading--vertical {
	-webkit-flex-direction: column;
	flex-direction: column;
}

.cw-loading--vertical .cw-loading__text {
	margin: 8px 0 0;
}

.cw-loading__dot {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.cw-loading__dot:before {
	display: block;
	width: 2px;
	height: 25%;
	margin: 0 auto;
	background-color: currentColor;
	border-radius: 40%;
	content: ' ';
}

.cw-loading__dot:first-of-type {
	transform: rotate(30deg);
	opacity: 1;
}

.cw-loading__dot:nth-of-type(2) {
	transform: rotate(60deg);
	opacity: 0.9375;
}

.cw-loading__dot:nth-of-type(3) {
	transform: rotate(90deg);
	opacity: 0.875;
}

.cw-loading__dot:nth-of-type(4) {
	transform: rotate(120deg);
	opacity: 0.8125;
}

.cw-loading__dot:nth-of-type(5) {
	transform: rotate(150deg);
	opacity: 0.75;
}

.cw-loading__dot:nth-of-type(6) {
	transform: rotate(180deg);
	opacity: 0.6875;
}

.cw-loading__dot:nth-of-type(7) {
	transform: rotate(210deg);
	opacity: 0.625;
}

.cw-loading__dot:nth-of-type(8) {
	transform: rotate(240deg);
	opacity: 0.5625;
}

.cw-loading__dot:nth-of-type(9) {
	transform: rotate(270deg);
	opacity: 0.5;
}

.cw-loading__dot:nth-of-type(10) {
	transform: rotate(300deg);
	opacity: 0.4375;
}

.cw-loading__dot:nth-of-type(11) {
	transform: rotate(330deg);
	opacity: 0.375;
}

.cw-loading__dot:nth-of-type(12) {
	transform: rotate(1turn);
	opacity: 0.3125;
}

@keyframes cw-rotate {
	0% {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(1turn);
	}
}
</style>
