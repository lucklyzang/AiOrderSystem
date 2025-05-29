<template>
	<view class="content-box">
		<view class="top-area">
			首页
		</view>
	</view>
</template>

<script>
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100%;
	};
	.content-box {
		@include content-wrapper;
		background: #FAFAFA !important;
		padding-bottom: 0;
		::v-deep .u-popup {
			flex: none !important
		};
		.top-area {
			height: 50px;
			padding: 10px;
			box-sizing: border-box;
			width: 100%;
			margin: 80px 0 10px 0;
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
		}
	}
</style>
