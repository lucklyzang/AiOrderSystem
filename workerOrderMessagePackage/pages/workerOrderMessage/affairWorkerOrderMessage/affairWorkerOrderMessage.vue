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
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="订单详情" @backClick="backTo">
			</nav-bar> 
		</view>
    <!-- 事务订单取消原因弹框 -->
    <view class="trans-box">
      <u-modal :show="affairCancelReasonShow" show-cancel-button 
        confirm-button-color="#2390fe"
        @confirm="affairCancelReasonDialogSure"
        @cancel="affairCancelReasonDialogCancel"
    		@close="affairCancelReasonShow = false"
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
          <SelectSearch :itemData="affairCancelReasonOption" ref="affairCancelOption" :isNeedSearch="false" :curData="affairCancelReasonValue" @change="affairCancelReasonOptionChange" />
        </view>
      </u-modal>
    </view>
    <!-- 图片放大弹框  -->
    <view class="image-dislog-box">
        <u-modal v-model="imageBoxShow" width="98%" :close-on-click-overlay="true" confirm-button-text="关闭">
            <image :src="currentimageUrl" />
        </u-modal> 
    </view>
    <view class="content">
			<view class="message-box">
					<view class="message-one">
							<view class="message-one-left">
									<text>编号:</text>
									<text>{{ affairTaskMessage.taskNumber }}</text>
							</view>
							<view class="message-one-right" :class="{'noAllocationStyle':affairTaskMessage.state == 0,'noLookupStyle':affairTaskMessage.state == 1,'noStartStyle': affairTaskMessage.state == 2,'underwayStyle':affairTaskMessage.state == 3,'tobeSigned':affairTaskMessage.state == 4}">
									{{ taskStatusTransition(affairTaskMessage.state) }}
							</view>
					</view>
					<view class="message-one message-two message-six">
							<view class="message-two-left">
									<text>优先级</text>
							</view>
							<view class="message-two-right" 
							:class="{
									'priorityNormalStyle' : affairTaskMessage.priority == 1,
									'priorityUrgencyStyle' : affairTaskMessage.priority == 2,
									'priorityImportanceStyle' : affairTaskMessage.priority == 3,
									'priorityUrgentImportanceStyle' : affairTaskMessage.priority == 4,
							 
							 }">
									{{ taskPriotityTransition(affairTaskMessage.priority) }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>具体事项</text>
							</view>
							<view class="message-two-right">
									{{ affairTaskMessage.depName == '/' ? '' : affairTaskMessage.depName }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>目的建筑</text>
							</view>
							<view class="message-two-right">
								 {{ disposeCheckType(affairTaskMessage.spaces) }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>目的科室</text>
							</view>
							<view class="message-two-right">
									{{ affairTaskMessage.workerName }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>负责人</text>
							</view>
							<view class="message-two-right">
									{{ disposeTaskPresent(affairTaskMessage.present) }}
							</view>
					</view>
					<view class="issue-image">
							<view class="issue-image-left">
									<text>图片</text>
							</view>
							<view class="issue-image-list" v-if="affairTaskMessage.images && affairTaskMessage.images.length > 0">
									<text v-for="(innerItem,innerIndex) in affairTaskMessage.images" :key="innerIndex" >
											<image alt="" :src="innerItem.path" @click="enlareEvent(innerItem.path)"
											>
									</text>
							</view>
					</view>   
			</view>
    </view>
		<div class="btn-box">
			<text class="operate-one" @click="editEvent">修改</text>
			<text class="operate-two" @click="cancelReasonEvent">取消订单</text>
		</div> 
  </view>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { cancelAffairTask } from "@/api/affair.js";
import { setCache, removeAllLocalStorage } from '@/common/js/utils'
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
			taskId: '',
			showLoadingHint: false,
      currentimageUrl: '',
      imageBoxShow: false,
      affairSelectCancelReason: {},
      affairCancelReasonShow: false,
      affairCancelReasonValue: null,
      affairCancelReasonOption: [{text: "请选择取消原因",value: null}]
    }
  },

  onShow() {
    this.taskId = this.affairTaskMessage.id;
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","affairTaskMessage",'statusBarHeight','navigationBarHeight']),
    proId () {
      return this.userInfo.extendData.proId
    }
  },

  methods: {
    ...mapMutations([]),

     // 顶部导航返回事件
     backTo () {
     	uni.navigateBack()
     },

    // 处理维修任务空间信息
    disposeCheckType (item) {
      if (!item) { return };
      if (item.length == 0) { return };
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
	
	// 处理维修任务参与者
	disposeTaskPresent (item) {
		if (!item) { return };
		if (item.length == 0) { return };
		let temporaryArray = [];
		for (let innerItem of item) {
			temporaryArray.push(innerItem.name)
		};
		return temporaryArray.join('、')
	},

    // 图片放大事件
    enlareEvent (item) {
      this.currentimageUrl = item;
      this.imageBoxShow = true
    },

    // 优先级转换
    taskPriotityTransition (state) {
      switch(state) {
        case 1 :
          return '正常'
          break;
        case 2 :
          return '紧急'
          break;
        case 3 :
          return '重要'
          break;
        case 4 :
          return '紧急重要'
          break
      }
    },
		
		// 修改点击事件
		editEvent () {
			uni.navigateTo({
				url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationAffairWorkerOrder/modificationAffairWorkerOrder'
			})
		},

    // 取消点击事件
    cancelReasonEvent() {
     this.affairSelectCancelReason = this.storeAllOrderCancelReason['affairCancelReason'];
     this.projectCancelReasonShow = true;
    },

   // 事务订单的取消
   cancelAffairWorkerOrderMessageTask (data) {
   	this.showLoadingHint = true;
   	this.infoText = '取消中···'
     cancelAffairTask(data)
     .then((res) => {
   		this.showLoadingHint = false;
   		this.$refs['affairCancelOption'].clearSelectValue()
   		if (res && res.data.code == 200) {
   			this.$refs.uToast.show({
   				message: `${res.data.msg}`,
   				type: 'success'
   			});
   			this.backTo()
   		} else {
   		 this.$refs.uToast.show({
   			message: `${res.data.msg}`,
   			type: 'error'
   		 })
   		}
     })
     .catch((err) => {
   		this.showLoadingHint = false;
   		this.$refs['affairCancelOption'].clearSelectValue();
   		this.$refs.uToast.show({
   			message: `${err.message}`,
   			type: 'error'
   		})
     })
   },
   
   // 事务订单取消原因弹框下拉框选值变化事件
   affairCancelReasonOptionChange (item) {
     this.affairCancelReasonValue = item.value;	
     this.affairSelectCancelReason = item;
   },
   
   // 事务订单取消原因弹框确定事件
   affairCancelReasonDialogSure () {
   	this.affairCancelReasonShow = false;
     if (this.affairSelectCancelReason.value == null) {
   		this.$refs.uToast.show({
   			message: '请选择取消原因'
   		});
   		return 
   	};
    // 事务订单取消
   	this.cancelAffairWorkerOrderMessageTask({
   		taskId: this.taskId, //任务id
   		state: 6,
   		proId: this.proId, // 医院id
   		reason: this.affairSelectCancelReason['text'] //取消原因
   	})
   },
   
   // 事务订单取消原因弹框取消事件
   affairCancelReasonDialogCancel () {
   	this.affairCancelReasonShow = false;
     this.$refs['affairCancelOption'].clearSelectValue()
   },
		
    // 任务状态转换
    taskStatusTransition (state) {
      switch(state) {
        case 0 :
          return '未分配'
          break;
        case 1 :
          return '未查阅'
          break;
        case 2 :
          return '未开始'
          break;
        case 3 :
          return '进行中'
          break;
        case 4 :
          return '待签字'
          break;
    		case 5 :
    			return '已完成'
    			break
      }
    },

    // 取消点击事件
    cancelReasonEvent () {
			this.cancelReasonShow = true;
			this.cancelReasonOption = this.repairsCancelReasonOption
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
 /* 订单取消原因弹框 */
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
 					}
 				  };
 				  .u-hairline--top::after {
 					border-top-width: 0 !important
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
						.noAllocationStyle {
							background: #E86F50 !important
						};
						.noLookupStyle {
							background: #E8CB51 !important
						};
						.noStartStyle {
							background: #174E97 !important
						};
						.underwayStyle {
							background: #289E8E !important
						};
						.tobeSigned {
							background: #40f9e0 !important
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