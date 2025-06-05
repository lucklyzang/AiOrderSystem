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
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="创建订单" @backClick="backTo">
			</nav-bar>
		</view>
		<view v-if="showStructure">
		  <ScrollSelection :columns="structureOption" title="目的建筑" @sure="structureSureEvent" @cancel="structureCancelEvent" @close="structureCloseEvent" />
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
	import ScrollSelection from "@/components/scrollSelection/scrollSelection"
	export default {
		components: {
			navBar,
			ScrollSelection
		},
		data() {
			return {
				showLoadingHint: false,
				showStructure: true,
				infoText: '加载中',
				structureOption: [
					{
						id: 1,
						text: '萨哒哒'
					},
					{
						id: 2,
						text: '规范化'
					},
					{
						id: 3,
						text: '大苏打'
					}
				]
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
			// this.getTransportsType();
		},
		methods: {
			...mapMutations([
			]),
			
			// 目的建筑下拉选择框确认事件
			    structureSureEvent (val) {
			      // if (val) {
			      //   this.currentStructure =  val;
			      //   this.currentGoalDepartment = '请选择';
			      //   this.currentGoalSpaces = [];
			      //   this.goalSpacesOption = [];
			      //   this.getDepartmentByStructureId(this.structureOption.filter((item) => { return item['text'] == this.currentStructure})[0]['value'],false,false)
			      // } else {
			      //   this.currentStructure = '请选择'
			      // };
			      this.showStructure = false
			    },
			
			    // 目的建筑下拉选择框取消事件
			    structureCancelEvent () {
			      this.showStructure = false
			    },
			
			    // 目的建筑下拉选择框关闭事件
			    structureCloseEvent () {
			      this.showStructure = false
			    },
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
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
		}
	}
</style>
