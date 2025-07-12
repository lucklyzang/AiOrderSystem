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
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="订单详情" @backClick="backTo">
			</nav-bar> 
		</view>
    <!-- 取消原因弹框 -->
    <view class="trans-box">
     <u-modal :show="projectCancelReasonShow" show-cancel-button
       confirm-button-color="#2390fe"
       @confirm="projectCancelReasonDialogSure"
       @cancel="projectCancelReasonDialogCancel"
     	@close="projectCancelReasonShow = false"
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
         <SelectSearch :itemData="projectCancelReasonOption" ref="projectCancelOption" :isNeedSearch="false" :curData="projectCancelReasonValue" @change="projectCancelReasonOptionChange" />
       </view>
     </u-modal>
    </view>
    <!-- 图片放大弹框  -->
    <view class="image-dislog-box">
				 <u-modal :show="imageBoxShow" :closeOnClickOverlay="true" showConfirmButton="关闭" @close="imageBoxShow = false">
				     <image :src="currentimageUrl" />
				 </u-modal> 
    </view>
    <view class="content">
			<view class="message-box">
					<view class="message-one">
							<view class="message-one-left">
									<text>编号:</text>
									<text>{{ projectTaskMessage.taskNumber }}</text>
							</view>
							<view class="message-one-right"
								:class="{
									'noAllocation':projectTaskMessage.state == 0,
									'waitSureStyle':projectTaskMessage.state == 1,
									'waitFinishStyle': projectTaskMessage.state == 2,
									'underwayStyle':projectTaskMessage.state == 3,
									'waitSignatureStyle':projectTaskMessage.state == 4,
									'completeStyle':projectTaskMessage.state == 5,
									'cancelStyle':projectTaskMessage.state == 6,
									'delayStyle':projectTaskMessage.state == 7,
									'waitCheckStyle':projectTaskMessage.state == 8
								}"
							>
									{{ projectTaskStatusTransition(projectTaskMessage.state) }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>创建时间</text>
							</view>
							<view class="message-two-right">
									{{ projectTaskMessage.createTime }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>已经历时间</text>
							</view>
							<view class="message-two-right">
									{{ elapsedTime(projectTaskMessage.planStartTime) }}
							</view>
					</view>
					 <view class="message-one message-two">
							<view class="message-two-left">
									<text>响应时间</text>
							</view>
							<view class="message-two-right">
									{{ projectTaskMessage.responseTime == null ? '无' : projectTaskMessage.responseTime }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>开始时间</text>
							</view>
							<view class="message-two-right">
									{{ projectTaskMessage.planStartTime }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>位置</text>
							</view>
							<view class="message-two-right">
									{{ projectTaskMessage.depName == '/' ? '' : projectTaskMessage.depName }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>房间</text>
							</view>
							<view class="message-two-right">
								 {{ disposeCheckType(projectTaskMessage.spaces) }}
							</view>
					</view>
					<view class="message-one message-two message-six">
							<view class="message-two-left">
									<text>优先级</text>
							</view>
							<view class="message-two-right" 
							:class="{
									'priorityNormalStyle' : projectTaskMessage.priority == 1,
									'priorityUrgencyStyle' : projectTaskMessage.priority == 2,
									'priorityImportanceStyle' : projectTaskMessage.priority == 3,
									'priorityUrgentImportanceStyle' : projectTaskMessage.priority == 4,
							 
							 }">
									{{ taskPriotityTransition(projectTaskMessage.priority) }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>维修员</text>
							</view>
							<view class="message-two-right">
									{{ projectTaskMessage.workerName }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>参与人</text>
							</view>
							<view class="message-two-right">
									{{ disposeTaskPresent(projectTaskMessage.present) }}
							</view>
					</view>
					<view class="issue-image">
							<view class="issue-image-left">
									<text>问题图片</text>
							</view>
							<view class="issue-image-list" v-if="projectTaskMessage.images && projectTaskMessage.images.length > 0">
									<text v-for="(innerItem,innerIndex) in projectTaskMessage.images" :key="innerIndex" >
											<image alt="" :src="innerItem.path" @click="enlareEvent(innerItem.path)"
											>
									</text>
							</view>
					</view>   
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>问题描述</text>
							</view>
							<view class="message-two-right task-remark">
									{{ projectTaskMessage.taskDesc }}
							</view>
					</view>
			</view>
    </view>
		<view class="btn-box">
			<text class="operate-one" @click="editEvent" v-if="projectTaskMessage.state != 3 && projectTaskMessage.state != 4 && projectTaskMessage.state != 5 && projectTaskMessage.state != 6 && projectTaskMessage.state != 8">修改</text>
			<text class="operate-two" @click="cancelReasonEvent" v-if="projectTaskMessage.state != 5 && projectTaskMessage.state != 6">取消订单</text>
		</view> 
  </view>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { cancelRepairsTask, repairsDetails } from "@/api/project.js";
import { setCache, removeAllLocalStorage, } from '@/common/js/utils'
import SelectSearch from "@/components/selectSearch/selectSearch";
import navBar from "@/components/zhouWei-navBar"
export default {
  components: {
		navBar,
    SelectSearch
  },
  data() {
    return {
			infoText: '加载中···',
			showLoadingHint: false,
      currentimageUrl: '',
      imageBoxShow: false,
			tierNum: 0,
			projectSelectCancelReason: {},
			projectCancelReasonShow: false,
			projectCancelReasonValue: null,
			projectCancelReasonOption: [{text: "请选择取消原因",value: null}],
    }
  },
	
	onShow () {
		const pages = getCurrentPages(); //获取当前页面栈的实例数组
		if (pages.length == 1) {
			this.tierNum = 1
		} else {
			this.tierNum = pages.length;
		};
		this.getRepairsDetails(this.projectTaskMessage['id']);
	},
	
  watch: {},

  computed: {
    ...mapGetters(["userInfo","projectTaskMessage",'statusBarHeight','navigationBarHeight','allOrderCancelReason']),
    userName() {
		return this.userInfo.userName
	},
	proName () {
	  return this.userInfo.worker['hospitalList'][0]['hospitalName']
	},
	proId() {
		return this.userInfo.worker['hospitalList'][0]['hospitalId']
	},
	workerId() {
		return this.userInfo.worker.id
	},
	depId() {
		return this.userInfo.worker['departments'][0]['id']
	}
  },

  methods: {
    ...mapMutations([
			'storeCurrentIndex',
			'changeProjectTaskMessage'
		]),

     // 顶部导航返回事件
     backTo () {
     	uni.navigateBack()
     },
		 
		 // 查询工程任务详情
		getRepairsDetails (id) {
			this.showLoadingHint = true;
			this.infoText = '加载中···';
			repairsDetails(id).then((res) => {
				this.showLoadingHint = false;
				if (res && res.data.code == 200) {
					this.changeProjectTaskMessage(res.data.data)
				} else {
					this.$refs.uToast.show({
						message: res.data.msg,
						type: 'error',
					})
				}
			})
			.catch((err) => {
				this.showLoadingHint = false;
				this.$refs.uToast.show({
					message: `${err.message}`,
					type: 'error'
				})
			})
		 },

    // 处理维修任务空间信息
    disposeCheckType (item) {
      if (!item) { return };
      if (item.length == 0) { return '无' };
      let temporaryArray = [];
      for (let innerItem of item) {
        temporaryArray.push(innerItem.name)
      };
      return temporaryArray.join('、')
    },
		
    // 计算已经历时间
    elapsedTime (planStartTme) {
      let currentTime = new Date().getTime();
      let transferPlanStartTme = new Date(planStartTme).getTime();
      if (transferPlanStartTme > currentTime) {
        return ''
      } else {
        return `${this.$moment(currentTime).diff(transferPlanStartTme, 'minutes')}分钟`
      }
    },

    // 图片放大事件
    enlareEvent (item) {
      this.currentimageUrl = item;
      this.imageBoxShow = true
    },
		
	// 处理维修任务参与者
	disposeTaskPresent (item) {
		if (!item) { return };
		if (item.length == 0) { return '无' };
		let temporaryArray = [];
		for (let innerItem of item) {
			temporaryArray.push(innerItem.name)
		};
		return temporaryArray.join('、')
	},


    // 优先级转换
    taskPriotityTransition (state) {
      switch(state) {
        case 1 :
          return '正常'
          break;
        case 2 :
          return '重要'
          break;
        case 3 :
          return '紧急'
          break;
        case 4 :
          return '紧急重要'
          break
      }
    },
		
		// 修改点击事件
		editEvent () {
			if (this.tierNum == 10) {
				uni.redirectTo({
					url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationProjectWorkerOrder/modificationProjectWorkerOrder'
				})
			} else {
				uni.navigateTo({
					url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationProjectWorkerOrder/modificationProjectWorkerOrder'
				})
			}
		},
		
		// 工程订单的取消
		cancelProjectWorkerOrderMessageTask (data) {
			this.showLoadingHint = true;
			this.infoText = '取消中···'
		  cancelRepairsTask(data)
		  .then((res) => {
				this.showLoadingHint = false;
				this.$refs['projectCancelOption'].clearSelectValue()
				if (res && res.data.code == 200) {
					this.$refs.uToast.show({
						message: `${res.data.msg}`,
						type: 'success'
					});
					this.storeCurrentIndex(2);
					this.backTo();
				} else {
				 this.$refs.uToast.show({
					message: `${res.data.msg}`,
					type: 'error'
				 })
				}
		  })
		  .catch((err) => {
				this.showLoadingHint = false;
				this.$refs['projectCancelOption'].clearSelectValue();
				this.$refs.uToast.show({
					message: `${err.message}`,
					type: 'error'
				})
		  })
		},
		
		// 工程订单取消原因弹框下拉框选值变化事件
		projectCancelReasonOptionChange (item) {
		  this.projectCancelReasonValue = item.value;	
		  this.projectSelectCancelReason = item;
		},
		
		// 工程订单取消原因弹框确定事件
		projectCancelReasonDialogSure () {
		  if (this.projectSelectCancelReason.value == null) {
				this.$refs.uToast.show({
					message: '请选择取消原因',
					position: 'bottom'
				});
				return 
			} else {
				this.projectCancelReasonShow = false;
			};
			this.cancelProjectWorkerOrderMessageTask({
				taskId: this.projectTaskMessage['id'], //任务id
				state: 6,
				proId: this.proId, // 医院id
				reason: this.projectSelectCancelReason['text'] //取消原因
			})
		},
		
		// 工程订单取消原因弹框取消事件
		projectCancelReasonDialogCancel () {
			this.projectCancelReasonShow = false;
		  this.$refs['projectCancelOption'].clearSelectValue()
		},
		

    // 取消点击事件
    cancelReasonEvent() {
			this.projectCancelReasonOption = this.allOrderCancelReason['projectCancelReason'];
      this.projectCancelReasonShow = true;
    },
		
    // 任务状态转换
    projectTaskStatusTransition (state) {
    	switch(index) {
				case 0 :
					return '未分配'
					break;
				case 1 :
					return '待确认'
					break;
				case 2 :
					return '待完成'
					break;
				case 3 :
					return '进行中'
					break;
				case 4 :
					return '待签字'
					break;
				case 5 :
					return '已完成'
					break;
				case 6 :
					return '已取消'
					break;
				case 7 :
					return '已延迟'
					break;
				 case 8 :
					return '待审核'
					break;
			}	
		}
  }
};
</script>
<style lang='scss' scoped>
@import "~@/common/stylus/variable.scss";
page {
	width: 100%;
	height: 100%;
};
.content-box {
  @include content-wrapper;
	height: 100vh !important;
  box-sizing: border-box;
  background: #f6f6f6;
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
  /deep/ .van-popup--right {
    padding: 20px 0 80px 0;
    box-sizing: border-box;
    .top-icon {
        padding-left: 10px;
        box-sizing: border-box
    };
    .center-content {
        margin-top: 20px;
        .function-list {
            width: 153px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            margin: 0 auto;
            border: 1px solid #3B9DF9;
            box-sizing: border-box;
            font-size: 16px;
            color: #3B9DF9;
            border-radius: 8px;
            margin-bottom: 20px
        };
        .functionListStyle {
            color: #fff !important;
            border: none !important;
            background: #3B9DF9 !important
        }
    }
  };
	/* 运送订单取消原因弹框 */
	.trans-box {
		/deep/ .u-popup__content {
			border-radius: 10px !important;
			.u-modal {
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
				};
				.u-line {
					display: none;
				}
			  }
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
		.message-box {
				.message-one {
						width: 100%;
						padding: 4px 6px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 14px;
						margin-top: 6px;
						.message-one-left {
								color: #289E8E
						};
						.message-one-right {
							width: 61px;
							height: 27px;
							text-align: center;
							line-height: 27px;
							color: #fff;
							background: #E86F50;
							border-radius: 4px
						};
						.noAllocation {
							background: #E86F50 !important;
						};
						.waitSureStyle {
							background: #FF0000 !important;
						};
						.underwayStyle {
							background: #289E8E !important;
						};
						.waitFinishStyle {
							background: #298CF8 !important;
						};
						.waitSignatureStyle {
							background: #06e606 !important;
						};
						.waitCheckStyle {
							background: #F2A15F !important;
						};
						.delayStyle {
							background: #be4330 !important;
						};
						.cancelStyle {
							background: #E8CB51 !important;
						};
						.completeStyle {
							background: #101010 !important
						}
				};
				.message-two {
						align-items: flex-start !important;
						padding: 11px 6px;
						.message-two-left {
								color: #9E9E9A
						};
						.message-two-right {
								flex: 1;
								color: #101010;
								line-height: 20px;
								word-break: break-all;
								padding-left: 10px;
								box-align: border-box;
								text-align: right
						};
						.task-remark {
								text-align: left !important
						}
				};
				.message-six {
						align-items: flex-start !important;
						.priorityNormalStyle { 
								color: #289E8E !important
						};
						.priorityUrgencyStyle { 
								color: #E8CB51 !important
						};
						.priorityImportanceStyle { 
								color: #F2A15F !important
						};
						.priorityUrgentImportanceStyle { 
								color: #E86F50 !important
						}
				};
				.issue-image {
						width: 100%;
						padding: 4px 6px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						font-size: 14px;
						margin-top: 6px;
						align-items: center;
						.issue-image-left {
								color: #9E9E9A
						};
						.issue-image-list {
								flex: 1;
								display: flex;
								margin-left: 6px;
								flex-flow: row wrap;
								> text {
								display: inline-block;
								width: 22%;
								margin-right: 4%;
								margin-bottom: 10px;
								&:nth-child(4n) {
										margin-right: 0
								}
								>image {
										width: 100%;
								}
								}
						}
				}
		}
  };
	.btn-box {
			height: 80px;
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
				margin-right: 20px;
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