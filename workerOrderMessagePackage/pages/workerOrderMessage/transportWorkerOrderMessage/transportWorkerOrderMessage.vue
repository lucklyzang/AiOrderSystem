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
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="订单详情" @backClick="backTo">
			</nav-bar> 
		</view>
		<view class="content">
			<view class="basic-message" ref="basicMessage">
			<view class="basic-mesage-state">
				<image :src="stateTransferimage(dispatchTaskMessage.state)" alt="">
			</view>
			<view class="basic-message-title">
				<text>
					<image :src="taskInfoPng" alt="">
				</text>
				基本信息
			</view>
			 <view class="wait-handle-message">
				 <view class="wait-handle-message-top">
					<view class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
						<view>
							<text class="message-tit">任务类型 :&nbsp;</text>
							<text class="message-tit-real">{{dispatchTaskMessage.taskTypeName}}</text>
						</view>
					</view>
					 <view class="handle-message-line-wrapper">
						 <view>
							 <text class="message-tit" :class="{'priorityTwoStyle' : dispatchTaskMessage.priority != 1}">优&nbsp;&nbsp;先&nbsp;级 :&nbsp;</text>
							 <text class="message-tit-real" :class="[dispatchTaskMessage.priority==1 ? 'priorityOneStyle' : 'priorityTwoStyle']">{{priorityTransfer(dispatchTaskMessage.priority)}}</text>
						 </view>
					 </view>
					<view class="handle-message-line-wrapper handle-message-line-wrapper-other">
						<view>
							<text class="message-tit">任务起点 :&nbsp;</text>
							<text class="message-tit-real">{{dispatchTaskMessage.setOutPlaceName}}</text>
						</view>
					</view>
					<view class="handle-message-line-wrapper handle-message-line-wrapper-other" v-if="templateType === 'template_one'">
						<view>
							<text class="message-tit">任务终点 :&nbsp;</text>
							<text class="message-tit-real">{{dispatchTaskMessage.destinationName}}</text>
						</view>
					</view>
				 <view class="handle-message-line-wrapper-other-two" v-else-if="templateType === 'template_two'">
					 <view>
						 <text class="message-tit">任务终点 :&nbsp;</text>
					 </view>
					 <view>
						 <text class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in dispatchTaskMessage.destinations" :key="innerindex">{{innerItem.destinationName}}</text>
					 </view>
				 </view>
					<view class="handle-message-line-wrapper handle-message-line-wrapper-other">
						<view>
							<text class="message-tit">任务时间 :&nbsp;</text>
							<text class="message-tit-real">{{dispatchTaskMessage.planStartTime}}</text>
						</view>
					</view>
				 </view>
				 <view class="wait-handle-message-middle">
						<view class="handle-message-line-wrapper message-name" v-if="templateType === 'template_one'">
							<view>
								<text class="message-tit" :class="{'textStyle' : dispatchTaskMessage.quarantine == 1}">病人姓名 :&nbsp;</text>
								<text class="message-tit-real" :class="{'textStyle' : dispatchTaskMessage.quarantine == 1}">{{dispatchTaskMessage.patientName == "" ? '无' : dispatchTaskMessage.patientName}}</text>
								<image :src="contactIsolationPng" v-if="dispatchTaskMessage.quarantine == 1">
							</view>
						</view>
					 <view class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
						 <view>
							 <text class="message-tit" :class="{'textStyle' : dispatchTaskMessage.quarantine == 1}">床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 :&nbsp;</text>
							 <text class="message-tit-real" :class="{'textStyle' : dispatchTaskMessage.quarantine == 1}">{{dispatchTaskMessage.bedNumber == "" ? '无' : dispatchTaskMessage.bedNumber}}</text>
						 </view>
					 </view>
					 <view class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
						 <view>
							 <text class="message-tit">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄 :&nbsp;</text>
							 <text class="message-tit-real">{{dispatchTaskMessage.age == "" ? '无' : dispatchTaskMessage.age}}</text>
						 </view>
					 </view>
					<view class="handle-message-line-wrapper">
							<view>
								<text class="message-tit">数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量 :&nbsp;</text>
								<text class="message-tit-real">{{dispatchTaskMessage.actualCount == "" ? "无" : dispatchTaskMessage.actualCount}}</text>
							</view>
						</view>
					 <view class="handle-message-line-wrapper">
						 <view>
							 <text class="message-tit">转运工具 :&nbsp;</text>
							 <text class="message-tit-real">{{dispatchTaskMessage.toolName == "" ? '无' : dispatchTaskMessage.toolName}}</text>
						 </view>
					 </view>
						<view class="handle-message-line-wrapper">
							<view class="describe-line-wrapper">
								<text class="message-tit">语音备注 :&nbsp;</text>
								<text class="message-tit-real-audio" v-if="showChildrenComponent">
									<MyAudio v-if="!dispatchTaskMessage.recordTime != true" :src="`http://show.blinktech.cn/trans/${dispatchTaskMessage.taskNumber}.mp3`"></MyAudio>
								</text>
								<text class="message-tit-real" v-show="!dispatchTaskMessage.recordTime">
									无语音信息
								</text>
							</view>
						</view>
				 </view>
				 <view class="wait-handle-message-content">
					 <view class="transport-type-wrapper" v-if="templateType === 'template_two'">
						 <view class="transport-type-title">
							 运送类型 :&nbsp;
						 </view>
						 <view class="transport-type-content">
							 <view class="transport-type-list-wrapper" v-for="(item,index) in transportList" :key="index">
									<view class="transport-type-list">
										<view class="transport-type-list-title">{{item.parentTypeName == '' ? '无': item.parentTypeName}}</view>
										<view class="transport-type-list-content" v-for="(itemInner,indexInner) in item.typeList" :key="indexInner">
											<text class="serial"  style="vertical-align: middle;">{{indexInner+1}}、</text>
											<text :class="{'textStyle' : itemInner.quarantine == 1}"  style="vertical-align: middle;">
												床号 : {{itemInner.bedNumber}},{{itemInner.patientName}},{{genderTransfer(itemInner.sex)}};
											</text>
											<text v-for="(targetItem, targetIndex) in itemInner.typeChildList" :key="targetIndex" style="vertical-align: middle;">
												{{targetItem.taskTypeName}}×{{targetItem.quantity}};
											</text>
											<image :src="contactIsolationPng" v-if="itemInner.quarantine == 1">
										</view>
									</view>
								</view>
						 </view>
						</view>
				 </view>
				 <view class="wait-handle-message-bottom">
						<view class="handle-message-line-wrapper">
						 <view class="describe-line-wrapper">
							 <text class="message-tit">任务描述 :&nbsp;</text>
							 <text class="message-tit-real">{{dispatchTaskMessage.taskRemark ? dispatchTaskMessage.taskRemark : '无'}}</text>
						 </view>
						</view>
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
		removeAllLocalStorage,
		mergeMethods
	} from '@/common/js/utils'
	import { queryTransportTypeClass, getDispatchTaskMessageById } from '@/api/transport.js'
	import navBar from "@/components/zhouWei-navBar"
	// import MyAudio from '@/components/myAudio'
	export default {
		components: {
			navBar,
			// MyAudio
		},
		data() {
			return {
				showLoadingHint: false,
				isShowNoData: false,
				infoText: '加载中',
				transportList: [],
				dispatchTaskMessage: {}
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
			
			// 获取任务详情
			getTaskMessage () {
				this.showLoadingHint = true;
				getDispatchTaskMessageById(this.dispatchTaskId,this.dispatchTaskMessage.tempFlag)
				.then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.changeDispatchTaskMessage({DtMsg: res.data.data});
						this.transportList = mergeMethods(this.dispatchTaskMessage['patientInfoList']);
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: `${err.message}`,
						type: 'error',
						position: 'bottom'
					})
				})
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
		.content {
			flex: 1;
			overflow: auto;
			padding: 0 0 10px 0;
			box-sizing: border-box;
		};
		.basic-message {
			width: 93%;
			margin: 0 auto;
			margin-top: 14px;
			position: relative;
			background: #fff;
			padding: 10px;
			box-sizing: border-box;
			.basic-mesage-state {
				width: 80px;
				height: 30px;
				position: absolute;
				text-align: center;
				line-height: 30px;
				top: 8px;
				right: -12px;
				image {
					width: 100%;
					height: 100%
				}
			};
			.basic-message-title {
				font-size: 18px;
				color: #1a89fd;
				height: 40px;
				line-height: 40px;
				text {
					display: inline-block;
					height: 15px;
					width: 15px;
					vertical-align: top;
					margin-top: 1px;
					image {
						width: 100%;
						height: 100%
					}
				}
			}
			.wait-handle-message {
				width: 100%;
				margin-top: 5px;
				.wait-handle-message-middle {
					margin: 10px 0
				};
				.wait-handle-message-bottom {
					margin-top: 10px
				};
				.handle-message-line-wrapper {
					p {
						display: flex;
						overflow: auto;
						height: 30px;
						line-height: 30px;
						flex-flow: row nowrap;
						color: #a0a0a0;
						.textStyle {
							color: #E8CB51 !important;
							font-weight: bold
						};
						.priorityOneStyle {
							color: #b1d676 !important
						};
						.priorityTwoStyle {
							color: red !important;
							font-weight: bold
						};
						text {
							display: inline-block;
						};
						text:first-child {
							width: 25%
						};
						.message-tit-real-style {
							color: #2895ea;
						}
						text:last-child {
							flex: 1;
							color: black
						}
					};
					.describe-line-wrapper {
						width: 100%;
						.message-tit-real-audio {
							margin-left: 4px
						}
					}
				};
				.message-name {
					p {
						display: flex;
						>text {
							&:nth-child(2) {
								padding: 0 5px 0 0;
								box-sizing: border-box;
								flex: 1;
								color: black;
								word-break: break-all
							}
						};
						image {
							width: 27px;
							height: 27px;
							vertical-align: bottom
						}
					}
				};
				.transport-type-wrapper {
					display: flex;
					flex-flow: row nowrap;
					.transport-type-title {
						color: #a0a0a0;
						width: 25%
					};
					.transport-type-content {
						color: black;
						flex: 1;
						> view:not(:first-child) {
							.transport-type-list-title {
								margin-top: 6px
							}
						};
						.transport-type-list-wrapper {
							.transport-type-list {
								> p {
								};
								.transport-type-list-title {
									font-weight: bold;
									color: black
								};
								.transport-type-list-content {
									line-height: 30px;
									image {
										width: 24px;
										height: 24px;
										vertical-align: middle;
										margin-left: 2px
									};
									.textStyle {
										color: #E8CB51 !important;
										font-weight: bold
									}
								}
							}
						}
					}
				};
				.handle-message-line-wrapper-other {
					p {
						width: 100%;
					}
				};
				.handle-message-line-wrapper-other-two {
					display: flex;
					flex-flow: row now;
					line-height: 35px;
					>p:first-child {
						width: 25%;
						text {
							color: #a0a0a0;
						}
					};
					> p:last-child {
						flex: 1;
						text {
							color: black
						};
						.message-tit-real-destinationList {
							margin-right: 4px
						}
					}
				}
			}
		}
}
</style>
