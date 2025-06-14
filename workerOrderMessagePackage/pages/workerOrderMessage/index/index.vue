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
			<view class="transport-order-list" @click="enterOrderDetailsEvent(item,'trans')" v-for="(item,index) in transOrderList" :key="index">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image src="@/static/img/ai-create-order-icon.png"></image>
						<text>Ai下单</text>
						<text>{{ item.createTime }}</text>
					</view>
					<view class="list-content-top-right" :class="{'noLookupStyle':item.state == 1,'noStartStyle':item.state == 2,'underwayStyle':item.state == 3,'noEndStyle':item.state == 4}">
						<text>{{stateTransfer(item.state)}}</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>出发地:</text>
							<text>{{item.setOutPlaceName}}</text>
						</view>
						<view class="bed-number" v-if="templateType === 'template_one'">
							<text>目的地: </text>
							<text class="destina-list">{{ !item.destinationName  ? '无' : item.destinationName }}</text>
						</view>
						<view class="bed-number" v-if="templateType === 'template_two'">
							<text>目的地: </text>
							<text class="destina-list" v-for="(innerItem,innerIndex) in item.destinations" :key="innerIndex">{{ item.destinations.length > 0 ? innerItem.destinationName : '无' }}</text>
						</view>
						<view class="destination-point" v-if="templateType == 'template_one'">
							<text>运送类型 :</text>
							<text>{{item.taskTypeName}}</text>
						</view>
						<view class="destination-point" v-else-if="templateType === 'template_two'">
							<text>运送类型 :</text>
							<text>{{item.patientInfoList[0].typeList.length > 0 ? item.patientInfoList[0].typeList[0].parentTypeName : '无'}}</text>
						</view>
					</view>
					<view class="list-content-center-top list-content-center-bottom">
						<view>
							<text>运送员:</text>
							<text>{{!item.workerName ? '无' : item.workerName}}</text>
						</view>
						<view class="bed-number" v-if="templateType === 'template_one'">
							<text>床号 :</text>
							<text>{{item.bedNumber}}</text>
						</view>
						<view class="bed-number" v-else-if="templateType === 'template_two'">
							<text>床号 :</text>
							<text>{{ extractBedNumber(item.patientInfoList) }}</text>
						</view>
						<view class="bed-number" v-if="templateType === 'template_one'">
							<text>病人 :</text>
							<text>{{item.patientName}}</text>
						</view>
						<view class="bed-number" v-else-if="templateType === 'template_two'">
							<text>病人 :</text>
							<text>{{ extractPatientName(item.patientInfoList) }}</text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view @click.stop="modificationOrderEvent(item,'trans')">
						修改
					</view>
					<view @click.stop="cancelOrderEvent(item,'trans')">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="transport-order-content environment-order-content" v-if="environmentOrderShow">
			<u-empty text="暂无环境订单" mode="list" v-if="isShowEnvironmentNoData"></u-empty>
			<view class="transport-order-list" @click="enterOrderDetailsEvent(item,'environment')">
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
					<view @click.stop="modificationOrderEvent(item,'environment')">
						修改
					</view>
					<view @click.stop="cancelOrderEvent(item,'environment')">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="transport-order-content project-order-content" v-if="projectOrderShow">
			<u-empty text="暂无工程订单" mode="list" v-if="isShowProjectNoData"></u-empty>
			<view class="transport-order-list" @click="enterOrderDetailsEvent(item,'project')">
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
					<view @click.stop="modificationOrderEvent(item,'project')">
						修改
					</view>
					<view @click.stop="cancelOrderEvent(item,'project')">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="transport-order-content affair-order-content" v-if="affairOrderShow">
			<u-empty text="暂无事务订单" mode="list" v-if="isShowAffairNoData"></u-empty>
			<view class="transport-order-list" @click="enterOrderDetailsEvent(item,'affair')">
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
					<view @click.stop="modificationOrderEvent(item,'affair')">
						修改
					</view>
					<view @click.stop="cancelOrderEvent(item,'affair')">
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
	import {getDispatchTaskComplete, queryDispatchTaskCancelReason, updateDispatchTask} from '@/api/transport.js'
	import { queryTransportTypeClass } from '@/api/transport.js'
	import navBar from "@/components/zhouWei-navBar"
	import SelectSearch from "@/components/selectSearch/selectSearch";
	export default {
		components: {
			navBar,
			SelectSearch
		},
		data() {
			return {
				showLoadingHint: false,
				isShowNoData: false,
				infoText: '加载中···',
				transOrderList: [],
				transportOrderShow: true,
				isShowTransportNoData: false,
				selectCancelReason: {},
				cancelReasonShow: false,
				cancelReasonValue: null,
				cancelReasonOption: [{text: "请选择取消原因",value: null}],
				
				environmentOrderList: [],
				environmentOrderShow: false,
				isShowEnvironmentNoData: false,
				
				projectOrderList: [],
				projectOrderShow: false,
				isShowProjectNoData: false,
				
				affairOrderList: [],
				affairOrderShow: false,
				isShowAffairNoData: false,
				taskId: '',
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
				'templateType'
			]),
			userName() {
				return this.userInfo.userName
			},
			proId() {
				return this.userInfo.extendData.proId
			}
		},
		onShow() {
			this.queryCompleteDispatchTask({
				proId:this.proId, workerId:'',state: -1,
				departmentId: this.userInfo.depId
			})
		},
		methods: {
			...mapMutations([
				'changeAffairTaskMessage',
				'changeCleanTaskDetails',
				'changeSchedulingTaskDetails',
				'changeDispatchTaskMessage'
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
					this.queryCompleteDispatchTask({
						proId:this.proId, workerId:'',state: -1,
						departmentId: this.userInfo.depId
					})
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
			
			// 任务优先级转换
			priorityTransfer (index) {
				switch(index) {
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
					break;
				}
			},
			
			// 任务状态转换
			stateTransfer (state) {
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
					 return '未结束'
					 break
				}
			},
			
			// 提取床号
			extractBedNumber (patientInfoList) {
				if (patientInfoList.length == 0) { return "无"};
				let temporaryArr = [];
				for (let item of patientInfoList) {
					temporaryArr.push(item.bedNumber)
				};
				return temporaryArr.join("、")
			},
			
			// 提取病人姓名
			extractPatientName (patientInfoList) {
				if (patientInfoList.length == 0) { return "无"};
				let temporaryArr = [];
				for (let item of patientInfoList) {
					temporaryArr.push(item.patientName)
				};
				return temporaryArr.join("、")
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
					tempFlag: this.templateType === 'template_one' ? 1 : 2, //模板(1:旧模板,2:新模板)
					endType: 2, //终止类型(0-web,1-安卓APP，2-微信小程序)
					endUser: this.userName, // 取消者(当前登录用户名)
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
			
			// 查询运送订单
			queryCompleteDispatchTask (data) {
			  this.isShowTransportNoData = false;
			  this.showLoadingHint = true;
			  getDispatchTaskComplete(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.transOrderList = [];
						let temporaryDataList = [];
						if (res.data.data.length > 0) {
							temporaryDataList = res.data.data;
							if (temporaryDataList.length > 0) {
								this.isShowTransportNoData = false;
							} else {
								this.isShowTransportNoData = true;
							};
							for (let item of temporaryDataList) {
								this.transOrderList.push({
									createTime: item.createTime,
									planUseTime: item.planUseTime,
									planStartTime: item.planStartTime,
									patientInfoList: item.patientInfoList,
									state: item.state,
									setOutPlaceName: item.setOutPlaceName,
									destinationName: item.destinationName,
									taskTypeName: item.taskTypeName,
									toolName: item.toolName,
									priority: item.priority,
									number: item.taskNumber,
									id: item.id,
									quarantine: item.quarantine,
									distName: item.distName,
									destinations: item.destinations,
									patientName: item.patientName,
									bedNumber: item.bedNumber,
									startPhoto: item.startPhoto,
									endPhoto: item.endPhoto,
									isBack: item.isBack,
									isSign: item.isSign,
									workerName: item.workerName
								})
							}
						} else {
							this.isShowTransportNoData = true
						}
					} else {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'error'
						})
					}
			  })
			  .catch((err) => {
					this.$refs.uToast.show({
						message: `${err}`,
						type: 'error'
					});
					this.showLoadingHint = false;
					this.isShowTransportNoData = true;
			  })
			},
			
			// 进入订单详情事件
			enterOrderDetailsEvent (item, text) {
				if (text == 'trans') {
					this.changeDispatchTaskMessage(item);
					uni.navigateTo({
						url: '/workerOrderMessagePackage/pages/workerOrderMessage/transportWorkerOrderMessage/transportWorkerOrderMessage'
					})
				} else if (text == 'environment') {
					// this.changeCleanTaskDetails(item);
					uni.navigateTo({
						url: '/workerOrderMessagePackage/pages/workerOrderMessage/environmentWorkerOrderMessage/environmentWorkerOrderMessage'
					})
				} else if (text == 'project') {
					// this.changeSchedulingTaskDetails(item);
					uni.navigateTo({
						url: '/workerOrderMessagePackage/pages/workerOrderMessage/projectWorkerOrderMessage/projectWorkerOrderMessage'
					});
				} else if (text == 'affair') {
					// this.changeAffairTaskMessage(item);
					uni.navigateTo({
						url: '/workerOrderMessagePackage/pages/workerOrderMessage/affairWorkerOrderMessage/affairWorkerOrderMessage'
					})
				}
			},
			
			// 修改订单事件
			modificationOrderEvent (item,text) {
				if (text == 'trans') {
					uni.navigateTo({
						url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/index/index'
					})
				} else if (text == 'environment') {
					uni.navigateTo({
						url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationEnvironmentWorkerOrder/modificationEnvironmentWorkerOrder'
					})
				} else if (text == 'project') {
					uni.navigateTo({
						url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationProjectWorkerOrder/modificationProjectWorkerOrder'
					})
				} else if (text == 'affair') {
					uni.navigateTo({
						url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationAffairWorkerOrder/modificationAffairWorkerOrder'
					})
				}
			},
			
			// 取消订单事件
			cancelOrderEvent (item,text) {
				this.taskId = item.id
				if (text == 'trans') {
					this.getDispatchTaskCancelReason({proId: this.proId, state: 0});
				} else if (text == 'environment') {
					
				} else if (text == 'project') {
					
				} else if (text == 'affair') {
					
				}
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
		/* 取消原因弹框 */
		.allocation-box {
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
						border-radius: 3px;
						font-size: 12px;
						background: #E86F50;
						color: #fff;
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
					.noEndStyle {
						background: #F2A15F !important
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
