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
		<!-- 图片放大弹框  -->
		<view class="image-dislog-box">
				 <u-modal :show="imageBoxShow" :closeOnClickOverlay="true" showConfirmButton="关闭" @close="imageBoxShow = false">
				     <image :src="currentimageUrl" />
				 </u-modal> 
		</view>
    <view class="content">
      <view class="forthwith-task-number">
        <text>即时保洁编号{{environmentTaskMessage.taskNumber}}</text>
        <text :class="{
            'underwayStyle' : environmentTaskMessage.state == 3, 
            'completeStyle' : environmentTaskMessage.state == 5,
            'reviewStyle' : environmentTaskMessage.state == 4 || environmentTaskMessage.state == 8,
            'haveReviewStyle' : environmentTaskMessage.state == 6
          }">
            {{stausTransfer(environmentTaskMessage.state)}}
        </text>
      </view>
      <view class="location">
        <text>位置</text>
        <text>{{ `${environmentTaskMessage.structureName}${environmentTaskMessage.depName}${environmentTaskMessage.areaImmediateName}${extractSpaceMessage(environmentTaskMessage.spaces)}` }}</text>
      </view>
      <view class="location">
        <text>创建时间</text>
        <text>{{environmentTaskMessage.createTime }}</text>
      </view>
      <view class="location">
        <text>检查主管</text>
        <text>{{ environmentTaskMessage.managerName }}</text>
      </view>
      <view class="location-other">
        <view class="location-other-left">
          <text v-show="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 8" class="sign">*</text>
          <text class="cleaner">保洁员</text>
        </view>
				<view class="location-other-right" v-if="environmentTaskMessage.state == 2 || environmentTaskMessage.state == 3 || environmentTaskMessage.state == 8">
					{{ !environmentTaskMessage.workerName ? '未选择' : environmentTaskMessage.workerName }}
				</view>
				<view class="location-other-right-other" v-if="environmentTaskMessage.state != 2 && environmentTaskMessage.state != 3 && environmentTaskMessage.state != 8">
					{{ !environmentTaskMessage.workerName ? '未选择' : environmentTaskMessage.workerName }}
				</view>
      </view>
      <view class="location" v-show="environmentTaskMessage.state != 5 && environmentTaskMessage.state != 6">
        <text>预计耗时</text>
        <text>{{ environmentTaskMessage.planUseTime ? `${environmentTaskMessage.planUseTime}分钟` : '无'}}</text>
      </view>
      <view class="issue-picture">
        <view>问题图片</view>
        <view class="image-list">
          <image :src="item.path" alt="" v-for="(item,index) in problemPicturesEchoList" :key="index">
        </view>
      </view>
      <view class="location problem-description">
        <text>问题描述</text>
        <text>{{ environmentTaskMessage.taskRemark}}</text>
      </view>
    </view>
		<view class="btn-box">
			<text class="operate-one" @click="editEvent">修改</text>
			<text class="operate-two" @click="cancelTaskEvent">取消订单</text>
		</view> 
    <!-- 环境订单取消原因弹框 -->
    <view class="trans-box">
      <u-modal :show="environmentCancelReasonShow" show-cancel-button 
        confirm-button-color="#2390fe"
        @confirm="environmentCancelReasonDialogSure"
        @cancel="environmentCancelReasonDialogCancel"
    		@close="environmentCancelReasonShow = false"
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
          <SelectSearch :itemData="environmentCancelReasonOption" ref="environmentCancelOption" :isNeedSearch="false" :curData="environmentCancelReasonValue" @change="environmentCancelReasonOptionChange" />
        </view>
      </u-modal>
    </view>
  </view>
</template>
<script>
import { cancelTask, getForthwithCleanTaskDetails } from "@/api/environment.js";
import { mapGetters, mapMutations } from "vuex";
import navBar from "@/components/zhouWei-navBar"
import SelectSearch from "@/components/selectSearch/selectSearch";
import { setCache, removeAllLocalStorage } from "@/common/js/utils";
import _ from 'lodash'
export default {
  components: {
    navBar,
		SelectSearch
  },
  data() {
    return {
			showLoadingHint: false,
			infoText: '加载中···',
			taskId: '',
			tierNum: 0,
      environmentSelectCancelReason: {},
      environmentCancelReasonShow: false,
      environmentCancelReasonValue: null,
      environmentCancelReasonOption: [{text: "请选择取消原因",value: null}],
			problemPicturesEchoList: []
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","environmentTaskMessage",'statusBarHeight','navigationBarHeight','allOrderCancelReason']),
  },
	onShow() {
		const pages = getCurrentPages(); //获取当前页面栈的实例数组
		if (pages.length == 1) {
			this.tierNum = 1
		} else {
			this.tierNum = pages.length;
		};
		this.taskId = this.environmentTaskMessage.id;
		this.getForthwithCleanTaskDetailsEvent(this.taskId);
	},
  methods: {
    ...mapMutations([
			'storeCurrentIndex',
			'changeEnvironmentTaskMessage'
		]),
		
		// 提取图片事件
		getResultimageList () {
			this.problemPicturesEchoList = [];
			if (this.environmentTaskMessage.hasOwnProperty('images')) {
				if (this.environmentTaskMessage['images'].length > 0) {
					this.problemPicturesEchoList = this.environmentTaskMessage['images'].filter((item) => { return item.imgType == 0});
				}
			}	
		},

		// 顶部导航返回事件
		backTo () {
			uni.navigateBack()
		},
		
		// 查询环境管理任务详情
		getForthwithCleanTaskDetailsEvent (id) {
			this.showLoadingHint = true;
			this.infoText = '加载中···'
			getForthwithCleanTaskDetails(id)
			.then((res) => {
				this.showLoadingHint = false;
				if (res && res.data.code == 200) {
					this.changeEnvironmentTaskMessage(res.data.data);
					this.getResultimageList();
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
					message: `${err.message}`,
					type: 'error'
				})
			})
		},
	
    // 环境订单的取消
    cancelEnvironmentWorkerOrderMessageTask (data) {
    	this.showLoadingHint = true;
    	this.infoText = '取消中···'
      cancelTask(data)
      .then((res) => {
    		this.showLoadingHint = false;
    		this.$refs['environmentCancelOption'].clearSelectValue()
    		if (res && res.data.code == 200) {
    			this.$refs.uToast.show({
    				message: `${res.data.msg}`,
    				type: 'success'
    			});
					this.storeCurrentIndex(1);
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
    		this.$refs['environmentCancelOption'].clearSelectValue();
    		this.$refs.uToast.show({
    			message: `${err.message}`,
    			type: 'error'
    		})
      })
    },
    
    // 环境订单取消原因弹框下拉框选值变化事件
    environmentCancelReasonOptionChange (item) {
      this.environmentCancelReasonValue = item.value;	
      this.environmentSelectCancelReason = item;
    },
    
    // 环境订单取消原因弹框确定事件
    environmentCancelReasonDialogSure () {
    	this.environmentCancelReasonShow = false;
      if (this.environmentSelectCancelReason.value == null) {
    		this.$refs.uToast.show({
    			message: '请选择取消原因'
    		});
    		return 
    	};
      // 环境订单取消
    	this.cancelEnvironmentWorkerOrderMessageTask({
    		id: this.taskId, //当前任务ID
    		state: 7, //取消后的状态
    		cancelReason: this.environmentSelectCancelReason['text'] //取消原因
    	})
    },
    
    // 环境订单取消原因弹框取消事件
    environmentCancelReasonDialogCancel () {
    	this.environmentCancelReasonShow = false;
      this.$refs['environmentCancelOption'].clearSelectValue()
    },

    // 提取即时保洁功能区信息
    extractSpaceMessage (spaces) {
      if (spaces.length == 0) {
          return ''
      };
      let temporaryArray = [];
      for (let item of spaces) {
          temporaryArray.push(item.name);
      };
      return temporaryArray.join("、")
    },

    // 任务状态转换
    stausTransfer (num) {
      switch(num) {
        case 1:
            return '未开始'
            break;
        case 2:
            return '未开始'
            break;
        case 3:
            return '进行中'
            break;
        case 4:
            return '待复核'
            break;
        case 5:
            return '已完成'
            break;
        case 6:
            return '已复核'
            break;
        case 8:
            return '复核中'
            break
      } 
    },

    // 取消订单点击事件
    cancelTaskEvent () {
			this.environmentCancelReasonOption = this.allOrderCancelReason['environmentCancelReason'];
			this.environmentCancelReasonShow = true
    },
		
		// 修改订单事件
		editEvent () {
			if (this.tierNum == 10) {
				uni.redirectTo({
					url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationEnvironmentWorkerOrder/modificationEnvironmentWorkerOrder'
				})
			} else {
				uni.navigateTo({
					url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationEnvironmentWorkerOrder/modificationEnvironmentWorkerOrder'
				})
			}
		},

    // 格式化时间
    getNowFormatDate(currentDate) {   
      let seperator1 = "-";
      let seperator2 = ":";
      let month = currentDate.getMonth() + 1;
      let strDate = currentDate.getDate();
      let hours = currentDate.getHours();
      let strMinutes = currentDate.getMinutes();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      if (strMinutes >= 0 && strMinutes <= 9) {
          strMinutes = "0" + strMinutes;
      }
      if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
      }
      let currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
              + " " + hours + seperator2 + strMinutes
      return currentdate;
    },

    // 提取保洁员姓名
    extractCleanerName (val) {
      return this.cleanerOption.filter((item) => { return item.value == val})[0]['text']
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
 .nav {
 	width: 100%;
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
  .content {
    flex: 1;
    overflow: auto;
    padding: 0 0 10px 0;
    box-sizing: border-box;
    .forthwith-task-number {
      padding: 0 8px;
      margin-bottom: 6px;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
      >text {
        font-size: 14px;
        display: inline-block;
        &:first-child {
          flex: 1;
          color: #289E8E;
          padding-right: 4px;
          box-sizing: border-box;
          @include no-wrap();
        };
        &:last-child {
          color: #a1a0a0;
          width: 60px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          justify-content: center;
          border-radius: 4px;
          background: #f3f3f3;
          border: 1px solid #c4c4c4
        }
      };
       .underwayStyle {
          background: #289E8E !important;
          color: #fff !important;
          border: 1px solid #289E8E !important
        };
        .completeStyle {
          background: #242424 !important;
          color: #fff !important;
          border: 1px solid #242424 !important
        };
        .reviewStyle {
          background: #F2A15F !important;
          color: #fff !important;
          border: 1px solid #F2A15F !important
        };
        .haveReviewStyle {
          background: #9B7D31 !important;
          color: #fff !important;
          border: 1px solid #9B7D31 !important
        }
    };
    .location {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
       >text {
        font-size: 14px;
        display: inline-block;
        &:first-child {
          color: #a1a0a0
        };
        &:last-child {
          color: #101010;
          flex: 1;
          text-align: right;
          line-height: 24px;
          padding-left: 8px;
          box-sizing: border-box;
          word-break: break-all
        }
      }
    };
    .location-other {
      padding: 10px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
      .location-other-left {
        >text {
          font-size: 14px;
          display: inline-block
        };
        .sign {
          color: red
        };
        .cleaner {
          color: #a1a0a0
        }
      };
      .location-other-right {
        color: #101010;
        flex: 1;
        text-align: right;
        line-height: 24px;
        padding-left: 8px;
        box-sizing: border-box;
        word-break: break-all;
        /deep/ .vue-dropdown {
          border: none !important;
          .cur-name {
            >text {
              font-size: 14px;
              padding-right: 10px;
              box-sizing: border-box;
              color: #101010 !important
            };
            .van-icon {
              font-size: 18px !important;
              color: #101010 !important
            }
          };
          .list-and-search {
            font-size: 14px;
            border: none !important
          }
        }
      }
    };
    .problem-description {
      >text {
        &:last-child {
        text-align: left !important
        }
      }
    };
    .issue-picture {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      >view {
        font-size: 14px;
        color: #a1a0a0;
        &:first-child {

        };
        &:last-child {
          flex: 1;
          margin-left: 8px;
          >image {
            width: 31%;
            height: 80px;
            margin-right: 2%;
            margin-bottom: 6px;
            &:nth-child(3n+3) {
              margin-right: 0
            }
          }
        }
      }
    };
    .remark {
      padding: 12px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      >view {
        font-size: 14px;
        color: #a1a0a0;
        line-height: 20px;
        &:first-child {

        };
        &:last-child {
          flex: 1;
          margin-left: 8px;
          color: #101010
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