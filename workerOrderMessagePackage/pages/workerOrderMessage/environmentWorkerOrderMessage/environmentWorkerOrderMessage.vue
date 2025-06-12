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
		    <u-modal v-model="imageBoxShow" width="98%" :close-on-click-overlay="true" confirm-button-text="关闭">
		        <image :src="currentimageUrl" />
		    </u-modal> 
		</view>
    <view class="content">
      <view class="forthwith-task-number">
        <text>即时保洁编号{{cleanTaskDetails.num}}</text>
        <text :class="{
            'underwayStyle' : cleanTaskDetails.state == 3, 
            'completeStyle' : cleanTaskDetails.state == 5,
            'reviewStyle' : cleanTaskDetails.state == 4 || cleanTaskDetails.state == 8,
            'haveReviewStyle' : cleanTaskDetails.state == 6
          }">
            {{stausTransfer(cleanTaskDetails.state)}}
        </text>
      </view>
      <view class="location">
        <text>位置</text>
        <text>{{ `${cleanTaskDetails.structureName}${cleanTaskDetails.depName}${cleanTaskDetails.areaImmediateName}${extractSpaceMessage(cleanTaskDetails.spaces)}` }}</text>
      </view>
      <view class="location">
        <text>创建时间</text>
        <text>{{cleanTaskDetails.createTime }}</text>
      </view>
      <view class="location">
        <text>检查主管</text>
        <text>{{ cleanTaskDetails.managerName }}</text>
      </view>
      <view class="location-other">
        <view class="location-other-left">
          <text v-show="cleanTaskDetails.state == 3 || cleanTaskDetails.state == 8" class="sign">*</text>
          <text class="cleaner">保洁员</text>
        </view>
				<view class="location-other-right" v-if="cleanTaskDetails.state == 2 || cleanTaskDetails.state == 3 || cleanTaskDetails.state == 8">
						
				</view>
				<view class="location-other-right-other" v-if="cleanTaskDetails.state != 2 && cleanTaskDetails.state != 3 && cleanTaskDetails.state != 8">
					{{ !this.cleanTaskDetails.workerName ? '未选择' : this.cleanTaskDetails.workerName }}
				</view>
      </view>
      <view class="location" v-show="cleanTaskDetails.state != 5 && cleanTaskDetails.state != 6">
        <text>预计耗时</text>
        <text>{{ cleanTaskDetails.planUseTime ? `${cleanTaskDetails.planUseTime}分钟` : '无'}}</text>
      </view>
      <view class="issue-picture">
        <view>问题图片</view>
        <view class="image-list">
          <image :src="item.path" alt="" v-for="(item,index) in problemPicturesEchoList" :key="index">
        </view>
      </view>
      <view class="location problem-description">
        <text>问题描述</text>
        <text>{{ cleanTaskDetails.taskRemark}}</text>
      </view>
    </view>
		<view class="btn-box">
			<text class="operate-one" @click="editEvent">修改</text>
			<text class="operate-two" @click="backTaskEvent">取消订单</text>
		</view> 
    <!-- 退回任务框-->
    <view class="back-box">
       <u-modal :show="backShow"  show-cancel-button width="85%"
          :beforeClose="beforeClose"
          @confirm="backSure" confirm-button-text="取消"
          cancel-button-text="确认"
        >
          <view class="dialog-title">
            退回理由
          </view>
          <view class="dialog-center">
						<u--textarea v-model="backReason" count placeholder="请输入退回理由" rows="3"
								autosiz :autoHeight="true" maxlength="50"
								>
						</u--textarea>
          </view>
      </u-modal>
    </view>  
  </view>
</template>
<script>
import { returnTask} from "@/api/environment.js";
import { mapGetters, mapMutations } from "vuex";
import navBar from "@/components/zhouWei-navBar"
import { setCache, removeAllLocalStorage } from "@/common/js/utils";
import _ from 'lodash'
export default {
  components: {
    navBar
  },
  data() {
    return {
			infoText: '加载中···',
      backShow: false,
      backReason: '',
			problemPicturesEchoList: []
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","cleanTaskDetails",'statusBarHeight','navigationBarHeight']),
  },

  methods: {
    ...mapMutations([]),

    // 回显图片
    echoImage () {
      this.problemPicturesEchoList = this.cleanTaskDetails.images.filter((item) => { return item.imageType == 0});
    },

		// 顶部导航返回事件
		backTo () {
			uni.navigateBack()
		},
	
    // 退回框关闭前事件
    beforeClose(action, done) {
      if (action == 'cancel') {
        if (!this.backReason) {
          this.$toast({
            message: '退回原因不能为空',
            type: 'success'
          });
          done(false)
        } else {
          done();
          this.backCancel()
        }
      } else {
        done()
      }
    },

    // 退回任务确定事件
    backSure () {
    },

    // 退回任务取消事件
    backCancel () {
      this.overlayShow = true;
      this.loadingShow = true;
      this.loadText = '退回中...';
      returnTask({
        id: this.cleanTaskDetails.id,
        returnReasonByApp: this.backReason,
        workerName: this.userInfo.name
      }).then((res) => {
        this.overlayShow = false;
        this.loadingShow = false;
        this.loadText = '';
        if (res && res.data.code == 200) {
          this.$toast({
            message: '退回成功',
            type: 'success'
          });
          this.$router.push({
            path: "/cleaningTask"
          })
        } else {
          this.$toast({
            message: `${res.data.msg}`,
            type: 'fail'
          })
        }
      })
      .catch((err) => {
        this.overlayShow = false;
        this.loadingShow = false;
        this.loadText = '';
        this.$toast({
          message: `${err}`,
          type: 'fail'
        })
      })
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

    // 退回订单事件
    backTaskEvent () {
      this.backShow = true
    },
		
		// 编辑订单事件
		editEvent () {},

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
.back-box {
    /deep/ .van-dialog {
      .van-dialog__content {
          padding: 10px 16px 0 16px !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .dialog-title {
            padding: 10px 0;
            box-sizing: border-box;
            text-align: center;
            color: #101010;
            font-size: 16px;
          };
          .dialog-center {
            padding: 10px 0;
            box-sizing: border-box;
            color: #101010;
            font-size: 12px;
            .van-cell {
              border: 1px solid #dcdcdc
            }
          }
        };
        .van-dialog__footer {
          padding: 10px 40px 20px 40px !important;
          box-sizing: border-box;
          justify-content: space-between;
          ::after {
            content: none
          };
        .van-dialog__cancel {
          height: 40px;
          background: #3B9DF9;
          color: #fff !important;
          border-radius: 8px;
          margin-right: 20px
        };
        .van-dialog__confirm {
           height: 40px;
            color: #3B9DF9;
            border: 1px solid #3B9DF9;
            border-radius: 8px
        }
        };
        .van-hairline--top::after {
          border-top-width: 0 !important
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