<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="运送类型" @backClick="backTo">
			</nav-bar> 
		</view>
		<view class="transport-type-content">
			<u-empty text="暂无运送类型" mode="list" v-if="isShowNoData"></u-empty>
			<view class="transport-type-list" v-for="(item,index) in transportTypeList" @click="transportTypeClickEvent(item,index)" :key="index">
				<text>{{ item.value }}</text>
				<u-icon name="arrow-right" color="#474747" size="20"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { queryTransportTypeClass } from '@/api/transport.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				isShowNoData: false,
				infoText: '加载中',
				transportTypeList: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
			]),
			userName() {
			},
			proId() {
				return this.userInfo.extendData.proId
			}
		},
		onLoad() {
			this.getTransportsType();
		},
		methods: {
			...mapMutations([
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 查询运送类型分类
			getTransportsType () {
				this.showLoadingHint = true;
				this.transportTypeList = [];
				let that = this;
				queryTransportTypeClass({proId: this.proId, state: 0}).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						if (res.data.data.length > 0) {
							this.isShowNoData = false;
							for (let item of res.data.data) {
								this.transportTypeList.push({
									id: item.id,
									value: item.typeName
								})
							}
						} else {
							this.isShowNoData = true;
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
			
			// 运送类型点击事件
			transportTypeClickEvent (item,index) {
				// 传递选择的运送类型
				let mynavData = JSON.stringify({
					id: item.id,
					value: item.value
				});
				uni.navigateTo({
					url: '/createWorkerOrderPackage/pages/createWorkerOrder/index/index?transmitData='+mynavData
				})
			}
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
		box-sizing: border-box;
		background: #fff;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 200000;
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
		};
		.top-background-area {
			width: 100%;
			background: #4873C0;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10
		};
		.nav {
			width: 100%;
		};
		.transport-type-content {
			flex: 1;
			overflow: auto;
			padding: 0 0 10px 0;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			};
			.transport-type-list {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #d2d2d2;
				padding: 10px 4px;
				box-sizing: border-box;
				>text {
					font-size: 18px;
					color: #474747;
					flex: 1;
					@include no-wrap();
				}
			}
		}
	}
</style>
