<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="订单" @backClick="backTo">
			</nav-bar> 
		</view>
		 <u-tabs
			:list="transportTypeList"
			@change="tabsChange"
			lineWidth="30"
			lineColor="#1864FF"
			:activeStyle="{
				color: '#1864FF',
				fontWeight: 'bold',
				fontSize: '14px'
			}"
			:inactiveStyle="{
				color: '#150202',
				fontSize: '14px'
			}"
			itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
		  >
		</u-tabs>
		<view class="order-commom transport-order-content" v-if="transportOrderShow">
			<u-empty text="暂无运送订单" mode="list" v-if="isShowTransportNoData"></u-empty>
			<view class="transport-order-list" @click="enterOrderDetailsEvent">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image src="@/static/img/ai-create-order-icon.png"></image>
						<text>Ai下单</text>
						<text>2025-05-15 22:11</text>
					</view>
					<view class="list-content-top-right">
						<text>未分配</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>出发地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>目的地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>运送类型:</text>
							<text>急诊</text>
						</view>
					</view>
					<view class="list-content-center-top list-content-center-bottom">
						<view>
							<text>运送员:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>床号:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>病人:</text>
							<text>急诊</text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view @click.stop="modificationOrderEvent">
						修改
					</view>
					<view @click.stop="cancelOrderEvent">
						取消订单
					</view>
				</view>
			</view>
			<view class="transport-order-list">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image src="@/static/img/manual-create-icon.png"></image>
						<text>手动下单</text>
						<text>2025-05-15 22:11</text>
					</view>
					<view class="list-content-top-right">
						<text>未分配</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>地点:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>目的地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>运送类型:</text>
							<text>急诊</text>
						</view>
					</view>
					<view class="list-content-center-top list-content-center-bottom">
						<view>
							<text>问题描述:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>床号:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>病人:</text>
							<text>急诊</text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view @click.stop="modificationOrderEvent">
						修改
					</view>
					<view @click.stop="cancelOrderEvent">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="transport-order-content environment-order-content" v-if="environmentOrderShow">
			<u-empty text="暂无环境订单" mode="list" v-if="isShowEnvironmentNoData"></u-empty>
			<view class="transport-order-list">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image src="@/static/img/send-icon.png"></image>
						<text>Ai下单</text>
						<text>2025-05-15 22:11</text>
					</view>
					<view class="list-content-top-right">
						<text>未分配</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>出发地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>目的地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>运送类型:</text>
							<text>急诊</text>
						</view>
					</view>
					<view class="list-content-center-top list-content-center-bottom">
						<view>
							<text>运送员:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>床号:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>病人:</text>
							<text>急诊</text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view @click.stop="modificationOrderEvent">
						修改
					</view>
					<view @click.stop="cancelOrderEvent">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="transport-order-content project-order-content" v-if="projectOrderShow">
			<u-empty text="暂无工程订单" mode="list" v-if="isShowProjectNoData"></u-empty>
			<view class="transport-order-list">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image src="@/static/img/send-icon.png"></image>
						<text>Ai下单</text>
						<text>2025-05-15 22:11</text>
					</view>
					<view class="list-content-top-right">
						<text>未分配</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>出发地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>目的地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>运送类型:</text>
							<text>急诊</text>
						</view>
					</view>
					<view class="list-content-center-top list-content-center-bottom">
						<view>
							<text>运送员:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>床号:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>病人:</text>
							<text>急诊</text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view @click.stop="modificationOrderEvent">
						修改
					</view>
					<view @click.stop="cancelOrderEvent">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="transport-order-content affair-order-content" v-if="affairOrderShow">
			<u-empty text="暂无事务订单" mode="list" v-if="isShowAffairNoData"></u-empty>
			<view class="transport-order-list">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image src="@/static/img/send-icon.png"></image>
						<text>Ai下单</text>
						<text>2025-05-15 22:11</text>
					</view>
					<view class="list-content-top-right">
						<text>未分配</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>出发地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>目的地:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>运送类型:</text>
							<text>急诊</text>
						</view>
					</view>
					<view class="list-content-center-top list-content-center-bottom">
						<view>
							<text>运送员:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>床号:</text>
							<text>急诊</text>
						</view>
						<view>
							<text>病人:</text>
							<text>急诊</text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view @click.stop="modificationOrderEvent">
						修改
					</view>
					<view @click.stop="cancelOrderEvent">
						取消订单
					</view>
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
				infoText: '加载中···',
				transportOrderShow: true,
				environmentOrderShow: false,
				projectOrderShow: false,
				affairOrderShow: false,
				isShowTransportNoData: false,
				isShowEnvironmentNoData: false,
				isShowProjectNoData: false,
				isShowAffairNoData: false,
				transportTypeList: [
					{
						name: '运送订单'
					},
					{
						name: '环境订单'
					},
					{
						name: '工程订单'
					},
					{
						name: '事务订单'
					},
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
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 标签索引改变事件
			tabsChange (item) {
				if (item.name === '运送订单') {
					this.transportOrderShow = true;
					this.environmentOrderShow = false;
					this.projectOrderShow = false;
					this.affairOrderShow = false;
				} else if (item.name === '环境订单') {
					this.transportOrderShow = false;
					this.environmentOrderShow = true;
					this.projectOrderShow = false;
					this.affairOrderShow = false;
				} else if (item.name === '工程订单') {
					this.transportOrderShow = false;
					this.environmentOrderShow = false;
					this.projectOrderShow = true;
					this.affairOrderShow = false;
				} else if (item.name === '事务订单') {
					this.transportOrderShow = false;
					this.environmentOrderShow = false;
					this.projectOrderShow = false;
					this.affairOrderShow = true
				}
			},
			
			// 进入订单详情事件
			enterOrderDetailsEvent () {
				uni.navigateTo({
					url: '/workerOrderMessagePackage/pages/workerOrderMessage/transportWorkerOrderMessage/transportWorkerOrderMessage'
				})
				// uni.navigateTo({
				// 	url: '/workerOrderMessagePackage/pages/workerOrderMessage/projectWorkerOrderMessage/projectWorkerOrderMessage'
				// });
				// uni.navigateTo({
				// 	url: '/workerOrderMessagePackage/pages/workerOrderMessage/affairWorkerOrderMessage/affairWorkerOrderMessage'
				// })
				// uni.navigateTo({
				// 	url: '/workerOrderMessagePackage/pages/workerOrderMessage/environmentWorkerOrderMessage/environmentWorkerOrderMessage'
				// })
			},
			
			// 修改订单事件
			modificationOrderEvent () {
				uni.navigateTo({
					url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/index/index'
				})
			},
			
			// 取消订单事件
			cancelOrderEvent () {
				
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
		::v-deep .u-tabs {
			height: 39px;
			box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
			.u-tabs__wrapper {
				.u-tabs__wrapper__scroll-view-wrapper {
					.u-tabs__wrapper__nav {
						.u-tabs__wrapper__nav__item {
							flex: 1 !important
						}
					}
				}
			}
		};
		.order-commom {
			flex: 1;
			overflow: auto;
			padding: 10px 0 14px 0;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			background: #f5f5f5;
			::v-deep .u-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%)
			}
		};
		.transport-order-content {
			.transport-order-list {
				padding: 0 4px;
				box-sizing: border-box;
				background: #fff;
				margin-bottom: 10px;
				.list-content-top {
					height: 40px;
					display: flex;
					align-items: center;
					@include bottom-border-1px(#BBBBBB);
					.list-content-top-left {
						flex: 1;
						padding-right: 6px;
						box-sizing: border-box;
						@include no-wrap();
						>image {
							width: 20px;
							height: 20px;
							vertical-align: top;
						};
						>text {
							font-size: 14px;
							color: #101010;
							&:nth-child(2) {
								margin: 0 4px;
							};
							&:last-child {
								font-size: 12px;
								color: #ACADAF;
							}
						}
					};
					.list-content-top-right {
						width: 50px;
						height: 20px;
						display: flex;
						align-items: center;
						justify-content: center;
						background: #E86F50;
						border-radius: 3px;
						font-size: 12px;
						color: #fff;
					}
				};
				.list-content-center {
					padding: 10px 0 4px 0;
					box-sizing: border-box;
					.list-content-center-top {
						display: flex;
						>view {
							padding-right: 4px;
							box-sizing: border-box;
							flex: 1;
							&:last-child {
								padding: 0 !important;
							};
							>text {
								font-size: 14px;
								color: #101010;
								&:first-child {
									margin-right: 6px;
								}
							}
						}
					};
					.list-content-center-bottom {
						margin-top: 6px;
					}
				};
				.list-content-bottom {
					height: 50px;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					>view {
						width: 80px;
						height: 30px;
						border-radius: 4px;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 12px;
						&:first-child {
							background: #E8CB51;
							color: #fff;
							margin-right: 10px;
						};
						&:last-child {
							border: 1px solid #E86F50;
							color: #E86F50;
						}
					}
				}
			}
		};
		.environment-order-content {};
		.project-order-content {};
		.affair-order-content {};
	}
</style>
