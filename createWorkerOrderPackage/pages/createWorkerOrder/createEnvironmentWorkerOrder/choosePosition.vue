<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast"></u-toast>
		<view class="nav">
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="选择位置" @backClick="backTo">
			</nav-bar> 
		</view>
	 <view class="content">
			<u-empty description="暂无数据" v-if="emptyShow" />
			<!-- 建筑 -->
			<view class="departments-name-list" v-for="(item) in architectureList" :key="item.id" v-if="architectureShow"
				@click="architectureClickEvent(item)"
			>
					<view class="departments-name-left">
						<text>建筑</text>
						<text>
							{{ item.structName }}
						</text>
					</view>
					<view class="departments-name-right">
						<u-icon name="arrow-right" color="#174E97" size="24"></u-icon>
					</view>
			</view>
			<!-- 科室 -->
			<view class="departments-name-list" v-for="(item) in departmentList" :key="item.id" v-if="departmentShow"
				@click="departmentClickEvent(item)"
			>
					<view class="departments-name-left">
						<text>科室</text>
						<text>
							{{ item.departmentName }}
						</text>
					</view>
					<view class="departments-name-right">
						<u-icon name="arrow-right" color="#174E97" size="24"></u-icon>
					</view>
			</view>
			<!-- 目的区域 -->
			<view class="departments-name-list" v-for="(item) in goalAreaList" :key="item.id" v-if="goalAreaShow"
				@click="goalAreaClickEvent(item)"
			>
					<view class="departments-name-left">
						<text>区域</text>
						<text>
							{{ item.itemName }}
						</text>
					</view>
					<view class="departments-name-right">
						<u-icon name="arrow-right" color="#174E97" size="24"></u-icon>
					</view>
			</view>
			<!-- 功能区 -->
			<view class="departments-name-list" v-for="(item) in functionAreaList" :key="item.id" v-if="functionAreaShow"
				@click="functionAreaClickEvent(item)"
			>
					<view class="departments-name-left">
						<text>功能区</text>
						<text>
							{{ item.name }}
						</text>
					</view>
					<view class="departments-name-right">
						<u-icon name="arrow-right" color="#174E97" size="24"></u-icon>
					</view>
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
	import { getArchitectureMessage, getGoalAreaMessage, getFunctionAreaMessage, getDepartmentMessage } from '@/api/environment.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				showLoadingHint: false,
				isShowNoData: false,
				infoText: '加载中···',
				emptyShow: false,
				architectureShow: false,
				architectureList: [],
				selectArchitectureValue: [],
				departmentShow: false,
				departmentList: [],
				selectDepartmentValue: [],
				goalAreaShow: false,
				goalAreaList: [],
				selectgoalAreaValue: [],
				functionAreaShow: false,
				functionAreaList: [],
				selectFunctionAreaValue: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				'locationMessage'
			]),
			userName() {
			},
			proId() {
				return this.userInfo.extendData.proId
			}
		},
		onLoad() {
			this.getArchitecture()
		},
		methods: {
			...mapMutations([
				'storeLocationMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 获取建筑
			getArchitecture () {
				this.showLoadingHint = true;
				getArchitectureMessage({proId: this.userInfo.proId}).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							this.architectureList = [];
							if (res.data.data.length > 0) {
								this.architectureShow = true;
								this.architectureList = res.data.data;
							} else {
								this.emptyShow = true
							}
						} else {
							this.$refs.uToast.show({
								message: res.data.msg,
								type: 'error',
							})
						}
					}).
					catch((err) => {
						this.$refs.uToast.show({
							message: `${err}`,
							type: 'error'
						});
						this.showLoadingHint = false
				})
			},
	
			// 获取科室
			getDepartment () {
				this.emptyShow = false;
				this.showLoadingHint = true;
				this.architectureShow = false;
				getDepartmentMessage({proId: this.userInfo.proId,structId: this.selectArchitectureValue[0]['id']}).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							this.departmentList = [];
							if (res.data.data.length > 0) {
								this.departmentShow = true;
								this.departmentList = res.data.data
							} else {
								this.emptyShow = true
							}
						} else {
							this.$refs.uToast.show({
								message: res.data.msg,
								type: 'error',
							})
						}
					}).
					catch((err) => {
						this.$refs.uToast.show({
							message: `${err}`,
							type: 'error'
						});
						this.showLoadingHint = false;
				})
			},
	
			// 获取目的区域
			getGoalArea () {
				this.emptyShow = false;
				this.showLoadingHint = true;
				this.departmentShow = false;
				getGoalAreaMessage({proId: this.userInfo.proId,status: 1}).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							this.goalAreaList = [];
							if (res.data.data.length > 0) {
								this.goalAreaShow = true;
								this.goalAreaList = res.data.data
							} else {
								this.emptyShow = true
							}
						} else {
							this.$refs.uToast.show({
								message: res.data.msg,
								type: 'error',
							})
						}
					}).
					catch((err) => {
						this.$refs.uToast.show({
							message: `${err}`,
							type: 'error'
						});
						this.showLoadingHint = false;
				})
			},
	
			// 获取功能区
			getFunctionArea () {
				this.emptyShow = false;
				this.showLoadingHint = true;
				this.goalAreaShow = false;
				getFunctionAreaMessage({hospitalId: this.userInfo.proId}).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							this.functionAreaList = [];
							if (res.data.data.length > 0) {
								this.functionAreaShow = true,
								this.functionAreaList = res.data.data
							} else {
								this.emptyShow = true
							}
						} else {
							this.$refs.uToast.show({
								message: res.data.msg,
								type: 'error',
							})
						}
					}).
					catch((err) => {
						this.$refs.uToast.show({
							message: `${err}`,
							type: 'error'
						});
						this.showLoadingHint = false;
				})
			},
	
			// 建筑点击事件
			architectureClickEvent (item) {
				this.selectArchitectureValue = [];
				this.selectArchitectureValue.push(item);
				this.getDepartment()
			},
	
			// 科室点击事件
			departmentClickEvent (item) {
				this.selectDepartmentValue = [];
				this.selectDepartmentValue.push(item);
				this.getGoalArea()
			},
	
			// 目的区域点击事件
			goalAreaClickEvent (item) {
				this.selectgoalAreaValue = [];
				this.selectgoalAreaValue.push(item);
				this.getFunctionArea()
			},
	
			// 功能区点击事件
			functionAreaClickEvent(item) {
				this.selectFunctionAreaValue = [];
				this.selectFunctionAreaValue.push(item);
				this.$router.push({ path: "/addTask"});
				let temporary = [];
				let temporaryMessage = temporary.concat(this.selectArchitectureValue,this.selectDepartmentValue,this.selectgoalAreaValue,this.selectFunctionAreaValue);
				this.storeLocationMessage(temporaryMessage)
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
		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding-top: 6px;
			box-sizing: border-box;
			position: relative;
			/deep/ .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%)
			};
			.departments-name-list {
					width: 100%;
					padding: 10px 8px;
					box-sizing: border-box;
					background: #fff;
					border-top: 1px solid #BBBBBB;
					border-bottom: 1px solid #BBBBBB;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10px;
					.departments-name-left {
							flex: 1;
							font-size: 16px;
							color: #101010;
							padding-right: 8px;
							box-sizing: border-box;
							word-break: break-all;
							>text {
								&:nth-child(1) {
									margin-right: 8px
								}
								&:nth-child(2) {
									color: #174E97
								}
							}
					};
					.departments-name-right {
							font-size: 14px;
							/deep/ .u-icon {
								vertical-align: middle
							}
					}
			}
		}
	}
</style>
