<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast" />
		<!-- 取消原因弹框 -->
		<view class="allocation-box">
		  <u-modal :show="cancelReasonShow" show-cancel-button 
		    confirm-button-color="#2390fe"
		    @confirm="cancelReasonDialogSure"
		    @cancel="cancelReasonDialogCancel"
			@close="cancelReasonShow = false"
			:closeOnClickOverlay="true"
			confirmColor="#fff"
			cancelColor="#3B9DF9"
		    confirmText="确定"
		    cancelText="取消"
		  >
		    <view class="dialog-top">
		      请选择取消原因
		    </view>
		    <view class="dialog-center">
		      <SelectSearch :itemData="cancelReasonOption" ref="cancelOption" :isNeedSearch="false" :curData="cancelReasonValue" @change="cancelReasonOptionChange" />
		    </view>
		  </u-modal>
		</view>
		<view class="nav">
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="订单详情" @backClick="backTo">
			</nav-bar> 
		</view>
		<view class="content">
			<view class="basic-message" ref="basicMessage">
			<view class="basic-mesage-state">
				<image :src="stateTransferimage(dispatchTaskMessage.state)" />
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
	<view class="btn-box">
		<text class="operate-one" @click="editEvent">修改</text>
		<text class="operate-two" @click="cancelReasonEvent">取消订单</text>
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
	import {getDispatchTaskComplete, queryDispatchTaskCancelReason, updateDispatchTask, getDispatchTaskMessageById} from '@/api/transport.js'
	import navBar from "@/components/zhouWei-navBar"
	import SelectSearch from "@/components/selectSearch/selectSearch";
	// import MyAudio from '@/components/myAudio'
	export default {
		components: {
			navBar,
			SelectSearch
			// MyAudio
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				transportList: [],
				dispatchTaskId: '',
				selectCancelReason: {},
				cancelReasonShow: false,
				cancelReasonValue: null,
				cancelReasonOption: [{text: "请选择取消原因",value: null}],
				taskInfoPng: require('@/static/img/basic-message.png'),
				noEndPng: require('@/static/img/no-end.png'),
				noReferPng: require('@/static/img/no-refer.png'),
				noStartPng: require('@/static/img/no-start.png'),
				taskFinshedPng: require('@/static/img/task-finshed.png'),
				taskGoingPng: require('@/static/img/task-going.png'),
				taskCancelPng: require('@/static/img/task-cancel.png'),
				contactIsolationPng: require("@/static/img/contact-isolation.png")
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				'dispatchTaskMessage'
			]),
			userName() {
			},
			proId() {
				return this.userInfo.extendData.proId
			}
		},
		onLoad(options) {
			this.dispatchTaskId = '';
		},
		methods: {
			...mapMutations([
				'changeDispatchTaskMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 修改点击事件
			editEvent () {
				uni.navigateTo({
					url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/index/index'
				})
			},
			
			// 获取运送订单取消原因列表
			getDispatchTaskCancelReason (data) {
				this.showLoadingHint = true;
				this.infoText = '查询中···'
				queryDispatchTaskCancelReason(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.cancelReasonShow = true;
						this.cancelReasonOption = [{text: "请选择取消原因",value: null}];
						for (let item of res.data.data) {
							let temporaryWorkerMessageArray = [];
							for (let innerItem in item) {
								if (innerItem == 'id') {
									temporaryWorkerMessageArray.push(item[innerItem])
								};
								if (innerItem == 'cancelName') {
									temporaryWorkerMessageArray.push(item[innerItem])
								}
							};
							this.cancelReasonOption.push({text: temporaryWorkerMessageArray[1], value: temporaryWorkerMessageArray[1]})
						}
					} else {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'error'
						})
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: `${err}`,
						type: 'error'
					})
				})
			},
			
			// 运送订单的取消
			cancelDispatchTask (data) {
				this.showLoadingHint = true;
				this.infoText = '取消中···'
			  updateDispatchTask(data)
			  .then((res) => {
					this.showLoadingHint = false;
					this.$refs['cancelOption'].clearSelectValue()
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'success'
						});
						this.queryCompleteDispatchTask(
						{
						 proId:this.proId, workerId:'',state: -1,
						 departmentId: this.userInfo.depId
						})
					} else {
					 this.$refs.uToast.show({
						message: `${res.data.msg}`,
						type: 'error'
					 })
					}
			  })
			  .catch((err) => {
					this.showLoadingHint = false;
					this.$refs['cancelOption'].clearSelectValue();
					this.$refs.uToast.show({
						message: `${err.message}`,
						type: 'error'
					})
			  })
			},
			
			// 运送订单取消原因弹框下拉框选值变化事件
			cancelReasonOptionChange (item) {
			  this.cancelReasonValue = item.value;	
			  this.selectCancelReason = item;
			},
			
			// 运送订单取消原因弹框确定事件
			cancelReasonDialogSure () {
				this.cancelReasonShow = false;
			  if (this.selectCancelReason.value == null) {
					this.$refs.uToast.show({
						message: '请选择取消原因'
					});
					return 
				};
				
			  // 运送订单取消
				this.cancelDispatchTask({
					proId: this.proId,	//当前项目ID
					id: this.taskId, //当前任务ID
					state: 6, //取消后的状态
					cancelReason: this.selectCancelReason['text'] //取消原因
				})
			},
			
			// 运送订单取消原因弹框取消事件
			cancelReasonDialogCancel () {
				this.cancelReasonShow = false;
			  this.$refs['cancelOption'].clearSelectValue()
			},
			
			// 取消点击事件
			cancelReasonEvent(item,index,text) {
			  this.cancelReasonShow = true;
			  this.taskId = item.id;
			  if (this.activeName == 'repairsTask') {
			    this.cancelReasonOption = this.repairsCancelReasonOption
			  }
			},
			
			// 任务状态转换图片
			stateTransferimage (index) {
				switch(index) {
					case 1 :
						return this.noReferPng
						break;
					case 2 :
						return  this.noStartPng
						break;
					case 3 :
						return  this.taskGoingPng
						break;
					case 4 :
						return  this.noEndPng
						break;
					case 6 :
						return this.taskCancelPng
						break;
					case 7 :
						return  this.taskFinshedPng
						break;
				}
			},
			
			// 获取任务详情
			getTaskMessage () {
				this.showLoadingHint = true;
				getDispatchTaskMessageById(this.dispatchTaskId,this.dispatchTaskMessage.tempFlag)
				.then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.changeDispatchTaskMessage(res.data.data);
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
		background: #f6f6f6;
		box-sizing: border-box;
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
		/* 取消原因弹框 */
		.allocation-box {
		    /deep/ .u-modal {
		      border-radius: 10px !important;
		      overflow: inherit !important;
		      .u-modal__content {
		          padding: 0 !important;
		          box-sizing: border-box;
							display: flex;
							flex-direction: column;
		          .dialog-top {
		            border-top-left-radius: 10px !important;
		            border-top-right-radius: 10px !important;
		            height: 40px;
		            padding-left: 10px;
		            position: relative;
		            display: flex;
		            align-items: center;
		            font-size: 14px;
		            color: #fff;
		            background: #3B9DF9;
		            text-align: left
		          };
		          .dialog-center {
		            width: 80%;
		            height: 20vh;
		            margin: 0 auto;
		            margin-top: 20px
		          }
		      };
		      .u-modal__button-group {
		          padding: 20px !important;
		          box-sizing: border-box;
		          justify-content: center;
		          ::after {
		            content: none
		          };
		        .u-modal__button-group__wrapper--cancel {
		            width: 40%;
		            height: 40px;
		            line-height: 40px;
		            background: #fff;
		            flex: none !important;
		            border-radius: 10px;
		            border: 1px solid #3B9DF9;
		            margin-right: 30px
		        };
		        .u-modal__button-group__wrapper--confirm {
		            height: 40px;
		            line-height: 40px;
		            flex: none !important;
		            width: 40%;
		            background: #3B9DF9;
		            border-radius: 10px;
		        }
		      };
		      .u-hairline--top::after {
		        border-top-width: 0 !important
		      }
		    }  
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
					>view {
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
					>view {
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
					>view {
						width: 100%;
					}
				};
				.handle-message-line-wrapper-other-two {
					display: flex;
					flex-flow: row now;
					line-height: 35px;
					>view:first-child {
						width: 25%;
						text {
							color: #a0a0a0;
						}
					};
					>view:last-child {
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
		};
		.btn-box {
				height: 50px;
				display: flex;
				align-items: center;
				justify-content: center;
				padding-bottom: 20px;
				box-sizing: border-box;
				>text {
					font-weight: bold;
					display: inline-block;
					font-size: 14px;
					width: 108px;
					height: 40px;
					text-align: center;
					line-height: 40px;
					box-sizing: border-box;
					border-radius: 4px;
					color: #fff;
				};
				.operate-one {
					margin-right: 10px;
					background: #E8CB51
				};
				.operate-two {
					background: #ffffff;
					color: #101010 !important;
					border: 1px solid #BBBBBB;
				}
		}
}
</style>
