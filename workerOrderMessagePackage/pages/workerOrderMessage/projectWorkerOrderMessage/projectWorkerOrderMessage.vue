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
    <view class="allocation-box">
      <u-modal :show="cancelReasonShow" show-cancel-button 
        confirm-button-color="#2390fe"
        @confirm="cancelReasonDialogSure"
        @cancel="cancelReasonDialogCancel"
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
									<text>{{ schedulingTaskDetails.taskNumber }}</text>
							</view>
							<view class="message-one-right" :class="{'noAllocationStyle':schedulingTaskDetails.state == 0,'noLookupStyle':schedulingTaskDetails.state == 1,'noStartStyle': schedulingTaskDetails.state == 2,'underwayStyle':schedulingTaskDetails.state == 3,'tobeSigned':schedulingTaskDetails.state == 4}">
									{{ taskStatusTransition(schedulingTaskDetails.state) }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>创建时间</text>
							</view>
							<view class="message-two-right">
									{{ schedulingTaskDetails.createTime }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>已经历时间</text>
							</view>
							<view class="message-two-right">
									{{ elapsedTime(schedulingTaskDetails.planStartTime) }}
							</view>
					</view>
					 <view class="message-one message-two">
							<view class="message-two-left">
									<text>响应时间</text>
							</view>
							<view class="message-two-right">
									{{ schedulingTaskDetails.responseTime }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>开始时间</text>
							</view>
							<view class="message-two-right">
									{{ schedulingTaskDetails.planStartTime }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>位置</text>
							</view>
							<view class="message-two-right">
									{{ schedulingTaskDetails.depName == '/' ? '' : schedulingTaskDetails.depName }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>房间</text>
							</view>
							<view class="message-two-right">
								 {{ disposeCheckType(schedulingTaskDetails.spaces) }}
							</view>
					</view>
					<view class="message-one message-two message-six">
							<view class="message-two-left">
									<text>优先级</text>
							</view>
							<view class="message-two-right" 
							:class="{
									'priorityNormalStyle' : schedulingTaskDetails.priority == 1,
									'priorityUrgencyStyle' : schedulingTaskDetails.priority == 2,
									'priorityImportanceStyle' : schedulingTaskDetails.priority == 3,
									'priorityUrgentImportanceStyle' : schedulingTaskDetails.priority == 4,
							 
							 }">
									{{ taskPriotityTransition(schedulingTaskDetails.priority) }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>维修员</text>
							</view>
							<view class="message-two-right">
									{{ schedulingTaskDetails.workerName }}
							</view>
					</view>
					<view class="message-one message-two">
							<view class="message-two-left">
									<text>参与人</text>
							</view>
							<view class="message-two-right">
									{{ disposeTaskPresent(schedulingTaskDetails.present) }}
							</view>
					</view>
					<view class="issue-image">
							<view class="issue-image-left">
									<text>问题图片</text>
							</view>
							<view class="issue-image-list" v-if="schedulingTaskDetails.images && schedulingTaskDetails.images.length > 0">
									<text v-for="(innerItem,innerIndex) in schedulingTaskDetails.images" :key="innerIndex" >
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
									{{ schedulingTaskDetails.taskDesc }}
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
import { cancelRepairsTask } from '@/api/project.js'
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
      transporterValue: null,
      transporterOption: [],
      selectCancelReason: {},
			cancelReasonShow: false,
      cancelReasonValue: null,
      cancelReasonOption: [{text: "请选择取消原因",value: null},{value:1,text:'萨哒哒'},{value:2,text:'郭德纲'},{value:3,text:'个大概'}],
      repairsCancelReasonOption: [],
    }
  },

  onLoad() {
    // 回显取消原因列表
    // this.repairsCancelReasonOption = this.schedulingTaskAboutMessage['repairsCancelReasonOption'];
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","schedulingTaskDetails",'statusBarHeight','navigationBarHeight',]),
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

    // 图片放大事件
    enlareEvent (item) {
      this.currentimageUrl = item;
      this.imageBoxShow = true
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
				url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationProjectWorkerOrder/modificationProjectWorkerOrder'
			})
		},

    // 取消点击事件
    cancelReasonEvent(item,index,text) {
      this.cancelReasonShow = true;
      // this.cancelReasonValue = null;
      // this.cancelReasonOption = [{text: "请选择取消原因",value: null},{value:1,text:'萨哒哒'},{value:2,text:'郭德纲'},{value:3,text:'个大概'}];
			// this.cancelReasonOption = this.repairsCancelReasonOption
      // this.taskId = item.id;
      // if (this.activeName == 'repairsTask') {
      //   this.cancelReasonOption = this.repairsCancelReasonOption
      // }
    },

    // 取消原因弹框下拉框选值变化事件
    cancelReasonOptionChange (item) {
      this.selectCancelReason = item;
    },

    // 取消原因弹框确定事件
    cancelReasonDialogSure () {
			this.cancelReasonShow = false;
      if (this.selectCancelReason.value == null) {
				this.$refs.uToast.show({
					message: '请选择取消原因'
				});
				return 
			};
      this.showLoadingHint = true;
			this.infoText = '取消中···'
      // 维修任务取消
        cancelRepairsTask({
          taskId: this.schedulingTaskDetails['id'], //任务id
          state: 6,
          proId: this.proId, // 医院id
          reason: this.selectCancelReason['text'] //取消原因
        })
        .then((res) => {
          this.showLoadingHint = false;
					this.$refs['cancelOption'].clearSelectValue();
          if (res && res.data.code == 200) {
            this.$refs.uToast.show({
            	message: '取消成功',
            	type: 'success',
            });
            // 返回任务调度页
            this.backTo()
          } else {
            this.$refs.uToast.show({
            	message: res.data.msg,
            	type: 'error',
            })
          }
        })
        .catch((err) => {
					this.$refs.childComponent['cancelOption'].clearSelectValue();
          this.showLoadingHint = false;
          this.$refs.uToast.show({
          	message: `${err}`,
          	type: 'error',
          });
      })
    },

    // 取消原因弹框取消事件
    cancelReasonDialogCancel () {
			this.cancelReasonShow = false;
      this.$refs['cancelOption'].clearSelectValue()
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
          break
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