<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast" />
		<!-- 运送订单取消原因弹框 -->
		<view class="trans-box">
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
		<!-- 工程订单取消原因弹框 -->
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
		<view class="nav">
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="订单" @backClick="backTo">
			</nav-bar> 
		</view>
		 <u-tabs
			:list="transportTypeList"
			@change="tabsChange"
			lineWidth="30"
			:current="current"
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
						<image :src="item.createType == 1 ? '/static/img/ai-create-order-icon.png' : '/static/img/manual-create-icon.png'"></image>
						<text>{{ item.createType == 1 ? 'Ai下单' : '手动下单' }}</text>
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
					<view class="modification-btn" @click.stop="modificationOrderEvent(item,'trans')">
						修改
					</view>
					<view class="cancel-btn" @click.stop="cancelOrderEvent(item,'trans')" v-if="item.state < 5">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="order-commom environment-order-content" v-if="environmentOrderShow">
			<u-empty text="暂无环境订单" mode="list" v-if="isShowEnvironmentNoData"></u-empty>
			<view class="transport-order-list" @click="enterOrderDetailsEvent(item,'environment')" v-for="(item,index) in environmentOrderList" :key="index">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image :src="item.createType == 1 ? '/static/img/ai-create-order-icon.png' : '/static/img/manual-create-icon.png'"></image>
						<text>{{ item.createType == 1 ? 'Ai下单' : '手动下单' }}</text>
						<text>{{ item.createTime }}</text>
					</view>
					<view class="list-content-top-right" :class="{
						'underwayStyle' : item.state == 3, 
						'completeStyle' : item.state == 5,
						'reviewStyle' : item.state == 4 || item.state == 8,
						'haveReviewStyle' : item.state == 6
						}">
						<text>{{ environmentStausTransfer(item.state) }}</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>地点:</text>
							<text>{{ `${item.structureName}${item.depName}${item.areaImmediateName}${extractSpaceMessage(item.spaces)}` }}</text>
						</view>
					</view>
					<view class="list-content-center-top list-content-center-bottom">
						<view>
							<text>问题描述:</text>
							<text></text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view class="modification-btn" @click.stop="modificationOrderEvent(item,'environment')">
						修改
					</view>
					<view class="cancel-btn" @click.stop="cancelOrderEvent(item,'environment')" v-if="item.state < 5">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="order-commom project-order-content" v-if="projectOrderShow">
			<u-empty text="暂无工程订单" mode="list" v-if="isShowProjectNoData"></u-empty>
			<view class="transport-order-list" @click="enterOrderDetailsEvent(item,'project')" v-for="(item,index) in projectOrderList" :key="index">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image :src="item.createType == 1 ? '/static/img/ai-create-order-icon.png' : '/static/img/manual-create-icon.png'"></image>
						<text>{{ item.createType == 1 ? 'Ai下单' : '手动下单' }}</text>
						<text>{{ item.createTime }}</text>
					</view>
					<view class="list-content-top-right" :class="{'noAllocationStyle':item.state == 0,'noLookupStyle':item.state == 1,'noStartStyle': item.state == 2,
					'underwayStyle':item.state == 3,'tobeSigned':item.state == 4,'waitCheck':item.state == 8
					}"
					>
						<text>{{ projectTaskStatusTransition(item.state) }}</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>地点:</text>
							<text>{{ item.depName == '/' ? '' : item.depName }}</text>
						</view>
					</view>
					<view class="list-content-center-top list-content-center-bottom">
						<view>
							<text>事项:</text>
							<text>{{ item.taskDesc }}</text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view class="modification-btn" @click.stop="modificationOrderEvent(item,'project')">
						修改
					</view>
					<view class="cancel-btn" @click.stop="cancelOrderEvent(item,'project')" v-if="item.state < 5">
						取消订单
					</view>
				</view>
			</view>
		</view>
		<view class="order-commom affair-order-content" v-if="affairOrderShow">
			<u-empty text="暂无事务订单" mode="list" v-if="isShowAffairNoData"></u-empty>
			<view class="transport-order-list" @click="enterOrderDetailsEvent(item,'affair')" v-for="(item,index) in affairOrderList" :key="index">
				<view class="list-content-top">
					<view class="list-content-top-left">
						<image :src="item.createType == 1 ? '/static/img/ai-create-order-icon.png' : '/static/img/manual-create-icon.png'"></image>
						<text>{{ item.createType == 1 ? 'Ai下单' : '手动下单' }}</text>
						<text>{{ item.createTime }}</text>
					</view>
					<view class="list-content-top-right">
						<text>{{ affairTaskStatusTransition(item.state) }}</text>
					</view>
				</view>
				<view class="list-content-center">
					<view class="list-content-center-top">
						<view>
							<text>事项:</text>
							<text>{{ item.taskDesc }}</text>
						</view>
					</view>
				</view>
				<view class="list-content-bottom">
					<view class="modification-btn" @click.stop="modificationOrderEvent(item,'affair')">
						修改
					</view>
					<view class="cancel-btn" @click.stop="cancelOrderEvent(item,'affair')" v-if="item.state < 5">
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
	import { getDispatchTaskComplete, queryDispatchTaskCancelReason, updateDispatchTask, queryTransportTypeClass} from '@/api/transport.js'
	import { queryCleaningManageTaskList, cancelTask, cancelTaskReason } from "@/api/environment.js";
	import { repairsList, cancelRepairsTask, queryRepairsTaskCancelReason } from "@/api/project.js";
	import { affairList, cancelAffairTask, queryAffairTaskCancelReason } from "@/api/affair.js";
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
				environmentSelectCancelReason: {},
				environmentCancelReasonShow: false,
				environmentCancelReasonValue: null,
				environmentCancelReasonOption: [{text: "请选择取消原因",value: null}],
				
				projectOrderList: [],
				projectOrderShow: false,
				isShowProjectNoData: false,
				projectSelectCancelReason: {},
				projectCancelReasonShow: false,
				projectCancelReasonValue: null,
				projectCancelReasonOption: [{text: "请选择取消原因",value: null}],
				
				affairOrderList: [],
				affairOrderShow: false,
				isShowAffairNoData: false,
				affairSelectCancelReason: {},
				affairCancelReasonShow: false,
				affairCancelReasonValue: null,
				affairCancelReasonOption: [{text: "请选择取消原因",value: null}],
				taskId: '',
				current: 0,
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
				'templateType',
				'allOrderCancelReason',
				'currentIndex'
			]),
			userName() {
				return this.userInfo.userName
			},
			proId() {
				return this.userInfo.extendData.proId
			},
			workerId() {
				return this.userInfo.extendData.userId
			}
		},
		onShow() {
			this.parallelQueryCancelReasonFunction();
			this.current = this.currentIndex;
			if (this.currentIndex == 0) {
				this.transportOrderShow = true;
				this.environmentOrderShow = false;
				this.projectOrderShow = false;
				this.affairOrderShow = false;
				this.getTransTaskList({
					proId:this.proId, 
					workerId: '',
					state: -1,
					departmentId: this.userInfo.depId
				});
			} else if (this.currentIndex == 1) {
				this.transportOrderShow = false;
				this.environmentOrderShow = true;
				this.projectOrderShow = false;
				this.affairOrderShow = false;
				this.getEnvironmentTaskList({
					proId : this.proId, // 所属项目id
					queryDate: '', // 查询时间
					managerId: this.userInfo.depId,// 保洁主管id    
					taskType: 0 // 0-即时，1-专项
				});
			} else if (this.currentIndex == 2) {
				this.transportOrderShow = false;
				this.environmentOrderShow = false;
				this.projectOrderShow = true;
				this.affairOrderShow = false;
				this.getProjectTaskList();
			} else if (this.currentIndex == 3) {
				this.transportOrderShow = false;
				this.environmentOrderShow = false;
				this.projectOrderShow = false;
				this.affairOrderShow = true;
				this.getAffairTaskList()
			}
		},
		methods: {
			...mapMutations([
				'changeAffairTaskMessage',
				'changeEnvironmentTaskMessage',
				'changeProjectTaskMessage',
				'changeTransTaskMessage',
				'storeAllOrderCancelReason',
				'storeCurrentIndex'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 标签索引改变事件
			tabsChange (item) {
				this.storeCurrentIndex(item.index);
				if (item.name === '运送订单') {
					this.transportOrderShow = true;
					this.environmentOrderShow = false;
					this.projectOrderShow = false;
					this.affairOrderShow = false;
					this.getTransTaskList({
						proId:this.proId, 
						workerId:this.workerId,
						state: -1,
						departmentId: this.userInfo.depId
					});
				} else if (item.name === '环境订单') {
					this.transportOrderShow = false;
					this.environmentOrderShow = true;
					this.projectOrderShow = false;
					this.affairOrderShow = false;
					this.getEnvironmentTaskList({
						proId : this.proId, // 所属项目id
						queryDate: '', // 查询时间
						managerId: this.userInfo.depId,// 保洁主管id    
						taskType: 0 // 0-即时，1-专项
					});
				} else if (item.name === '工程订单') {
					this.transportOrderShow = false;
					this.environmentOrderShow = false;
					this.projectOrderShow = true;
					this.affairOrderShow = false;
					this.getProjectTaskList();
				} else if (item.name === '事务订单') {
					this.transportOrderShow = false;
					this.environmentOrderShow = false;
					this.projectOrderShow = false;
					this.affairOrderShow = true;
					this.getAffairTaskList()
				}
			},
			
			// 查询运送订单取消原因
			getTransOrderCancelReason () {
				return new Promise((resolve,reject) => {
					queryDispatchTaskCancelReason({proId: this.proId, state: 0})
					.then((res) => {
						if (res && res.data.code == 200) {
							resolve(res.data.data)
						} else {
								reject({message:res.data.msg});
								this.showLoadingHint = false;
								this.$refs.uToast.show({
									message: res.data.msg,
									type: 'error',
								})
							}
					})
					.catch((err) => {
						reject({message:err.message})
					})
				})
			},
			
			// 查询环境订单取消原因
			getEnvironmentOrderCancelReason () {
				return new Promise((resolve,reject) => {
					cancelTaskReason({proId: this.proId})
					.then((res) => {
						if (res && res.data.code == 200) {
							resolve(res.data.data)
						} else {
								reject({message:res.data.msg});
								this.showLoadingHint = false;
								this.$refs.uToast.show({
									message: res.data.msg,
									type: 'error',
								})
							}
					})
					.catch((err) => {
						reject({message:err.message})
					})
				})
			},
			
			// 查询工程订单取消原因
			getProjectOrderCancelReason () {
				return new Promise((resolve,reject) => {
					queryRepairsTaskCancelReason(this.proId)
					.then((res) => {
						if (res && res.data.code == 200) {
							resolve(res.data.data)
						} else {
								reject({message:res.data.msg});
								this.showLoadingHint = false;
								this.$refs.uToast.show({
									message: res.data.msg,
									type: 'error',
								})
							}
					})
					.catch((err) => {
						reject({message:err.message})
					})
				})
			},
			
			// 查询事务订单取消原因
			getAffairOrderCancelReason () {
				return new Promise((resolve,reject) => {
					queryAffairTaskCancelReason(this.proId)
					.then((res) => {
						if (res && res.data.code == 200) {
							resolve(res.data.data)
						} else {
								reject({message:res.data.msg});
								this.showLoadingHint = false;
								this.$refs.uToast.show({
									message: res.data.msg,
									type: 'error',
								})
							}
					})
					.catch((err) => {
						reject({message:err.message})
					})
				})
			},
			
			// 并行查询各种类型订单的取消原因
			parallelQueryCancelReasonFunction () {
				this.showLoadingHint = true;
				Promise.all([this.getTransOrderCancelReason(), this.getEnvironmentOrderCancelReason(), this.getProjectOrderCancelReason(), this.getAffairOrderCancelReason()])
				.then((res) => {
					this.showLoadingHint = false;
					if (res && res.length > 0) {
						this.cancelReasonOption = [{text: "请选择取消原因",value: null}];
						this.environmentCancelReasonOption = [{text: "请选择取消原因",value: null}];
						this.projectCancelReasonOption = [{text: "请选择取消原因",value: null}];
						this.affairCancelReasonOption = [{text: "请选择取消原因",value: null}];
						let [item1,item2,item3,item4] = res;
						if (item1) {
							for (let item of item1) {
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
							};
							// 保存任务取消原因列表信息
							let temporaryMessage = this.allOrderCancelReason;
							temporaryMessage['cancelReason'] = this.cancelReasonOption;
							this.storeAllOrderCancelReason(temporaryMessage)
						};
						if (item2) {
							for (let i = 0, len = item3.length; i < len; i++) {
								this.environmentCancelReasonOption.push({
									text: item3[i]['cancelName'],
									value: item3[i]['id']
								})
							};
							// 保存任务取消原因列表信息
							let temporaryMessage = this.allOrderCancelReason;
							temporaryMessage['environmentCancelReason'] = this.environmentCancelReasonOption;
							this.storeAllOrderCancelReason(temporaryMessage)
						};
						if (item3) {
						 for (let i = 0, len = item3.length; i < len; i++) {
								this.projectCancelReasonOption.push({
									text: item3[i]['cancelName'],
									value: item3[i]['id']
								})
							};
							// 保存任务取消原因列表信息
							let temporaryMessage = this.allOrderCancelReason;
							temporaryMessage['projectCancelReason'] = this.projectCancelReasonOption;
							this.storeAllOrderCancelReason(temporaryMessage)
						};
						if (item4) {
						 for (let i = 0, len = item3.length; i < len; i++) {
								this.affairCancelReasonOption.push({
									text: item3[i]['cancelName'],
									value: item3[i]['id']
								})
							};
							// 保存任务取消原因列表信息
							let temporaryMessage = this.allOrderCancelReason;
							temporaryMessage['affairCancelReason'] = this.affairCancelReasonOption;
							this.storeAllOrderCancelReason(temporaryMessage)
						}
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
			
			// 运送任务状态转换
			stateTransfer (index) {
				switch(index) {
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
						break;
					case 5 :
						return '已延迟'
						break;
					case 6 :
						return '已取消'
						break;
					case 7 :
						return '已完成'
						break;
				}
			},
			
			//环境订单状态转换
			environmentStausTransfer (num) {
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
								break
						case 8:
								return '复核中'
								break
				} 
			},
			
			// 工程任务状态转换
			projectTaskStatusTransition (state) {
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
			},
			
			// 事务任务状态转换
			affairTaskStatusTransition (state) {
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
			
			// 运送订单的取消
			cancelDispatchTask (data) {
				this.showLoadingHint = true;
				this.infoText = '取消中···';
			  updateDispatchTask(data)
			  .then((res) => {
					this.showLoadingHint = false;
					this.$refs['cancelOption'].clearSelectValue()
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'success'
						});
						this.getTransTaskList(
						{
						 proId:this.proId, workerId:this.workerId,state: -1,
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
			
			// 环境订单的取消
			cancelEnvironmentWorkerOrderMessageTask (data) {
				this.showLoadingHint = true;
				this.infoText = '取消中···';
			  cancelTask(data)
			  .then((res) => {
					this.showLoadingHint = false;
					this.$refs['environmentCancelOption'].clearSelectValue()
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'success'
						});
						this.getEnvironmentTaskList({
							proId : this.proId, // 所属项目id
							queryDate: '', // 查询时间
							managerId: this.userInfo.depId,// 保洁主管id    
							taskType: 0 // 0-即时，1-专项
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
			
			// 工程订单的取消
			cancelProjectWorkerOrderMessageTask (data) {
				this.showLoadingHint = true;
				this.infoText = '取消中···';
			  cancelRepairsTask(data)
			  .then((res) => {
					this.showLoadingHint = false;
					this.$refs['projectCancelOption'].clearSelectValue()
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'success'
						});
						this.getProjectTaskList()
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
				this.projectCancelReasonShow = false;
			  if (this.projectSelectCancelReason.value == null) {
					this.$refs.uToast.show({
						message: '请选择取消原因'
					});
					return 
				};
			  // 工程订单取消
				this.cancelProjectWorkerOrderMessageTask({
					taskId: this.taskId, //任务id
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
						this.getAffairTaskList()
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
			
			// 查询运送订单列表
			getTransTaskList (data) {
				this.infoText = '加载中···';
			  this.isShowTransportNoData = false;
			  this.showLoadingHint = true;
			  getDispatchTaskComplete(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.transOrderList = res.data.data;
						if (res.data.data.length == 0) {
							this.isShowTransportNoData = true;
							this.transOrderList = [];
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
			
				// 查询环境订单列表列表
				getEnvironmentTaskList (data) {
					this.infoText = '加载中···';
					this.showLoadingHint = true;
					this.isShowEnvironmentNoData = false;
					queryCleaningManageTaskList(data).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							this.environmentOrderList = res.data.data.filter((item) => { return item.state != 7 && item.state != 0});
							if (this.environmentOrderList.length == 0) {
								this.isShowEnvironmentNoData = true;
								this.environmentOrderList = [];
							}
						} else {
							this.$refs.uToast.show({
								message: `${res.data.msg}`,
								type: 'error'
							})
						}
        }).catch((err) => {
            this.$refs.uToast.show({
            	message: `${err}`,
            	type: 'error'
            });
            this.showLoadingHint = false;
        })
    },
		
		//查询工程订单列表
		getProjectTaskList () {
			this.infoText = '加载中···';
			this.showLoadingHint = true;
			this.isShowProjectNoData = false;
			repairsList(-3,this.proId,1,this.workerId)
			.then((res) => {
				this.showLoadingHint = false;
				if (res && res.data.code == 200) {
					this.projectOrderList = res.data.data;
					// 显示未完成(不包括已取消)的任务状态(0-未分配，1-未查阅,2-未开始，3-进行中，4-待签字，5-已完成，6-已取消)
					this.projectOrderList = this.projectOrderList.filter(( item ) => { return item.state != 6});
					if (this.projectOrderList.length == 0) {
						this.isShowProjectNoData = true;
						this.projectOrderList = [];
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
		
		//查询事务订单列表
		getAffairTaskList () {
			this.infoText = '加载中···';
			this.showLoadingHint = true;
			this.isShowAffairNoData = false;
			affairList(-3,this.proId,1)
			.then((res) => {
				this.showLoadingHint = false;
				if (res && res.data.code == 200) {
					this.affairOrderList = res.data.data;
					// 显示未完成(不包括已取消)的任务状态(0-未分配，1-未查阅,2-未开始，3-进行中，4-待签字，5-已完成，6-已取消)
					this.affairOrderList = this.affairOrderList.filter(( item ) => { return item.state != 5 && item.state != 6});
					if (this.affairOrderList.length == 0) {
						this.isShowAffairNoData = true;
						this.affairOrderList = [];
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
		
		// 提取环境订单地点信息
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

		
			// 进入订单详情事件
			enterOrderDetailsEvent (item, text) {
				if (text == 'trans') {
					this.changeTransTaskMessage(item);
					uni.navigateTo({
						url: '/workerOrderMessagePackage/pages/workerOrderMessage/transportWorkerOrderMessage/transportWorkerOrderMessage'
					})
				} else if (text == 'environment') {
					this.changeEnvironmentTaskMessage(item);
					uni.navigateTo({
						url: '/workerOrderMessagePackage/pages/workerOrderMessage/environmentWorkerOrderMessage/environmentWorkerOrderMessage'
					})
				} else if (text == 'project') {
					this.changeProjectTaskMessage(item);
					uni.navigateTo({
						url: '/workerOrderMessagePackage/pages/workerOrderMessage/projectWorkerOrderMessage/projectWorkerOrderMessage'
					});
				} else if (text == 'affair') {
					this.changeAffairTaskMessage(item);
					uni.navigateTo({
						url: '/workerOrderMessagePackage/pages/workerOrderMessage/affairWorkerOrderMessage/affairWorkerOrderMessage'
					})
				}
			},
			
			// 修改订单事件
			modificationOrderEvent (item,text) {
				if (text == 'trans') {
					this.changeTransTaskMessage(item);
					uni.navigateTo({
						url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/index/index'
					})
				} else if (text == 'environment') {
					this.changeEnvironmentTaskMessage(item);
					uni.navigateTo({
						url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationEnvironmentWorkerOrder/modificationEnvironmentWorkerOrder'
					})
				} else if (text == 'project') {
					this.changeProjectTaskMessage(item);
					uni.navigateTo({
						url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationProjectWorkerOrder/modificationProjectWorkerOrder'
					})
				} else if (text == 'affair') {
					this.changeAffairTaskMessage(item);
					uni.navigateTo({
						url: '/modificationWorkerOrderPackage/pages/modificationWorkerOrder/modificationAffairWorkerOrder/modificationAffairWorkerOrder'
					})
				}
			},
			
			// 取消订单事件
			cancelOrderEvent (item,text) {
				this.taskId = item.id
				if (text == 'trans') {
					this.cancelReasonShow = true;
				} else if (text == 'environment') {
					this.environmentCancelReasonShow = true;
				} else if (text == 'project') {
					this.projectCancelReasonShow = true;
				} else if (text == 'affair') {
					this.affairCancelReasonShow = true;
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
		height: 100vh !important;
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
			};
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
					};
					.modification-btn {
						background: #E8CB51;
						color: #fff;
						margin-right: 10px;
					}
					.cancel-btn {
						border: 1px solid #E86F50;
						color: #E86F50;
					}
				}
			}	
		};
		.transport-order-content {
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
		.environment-order-content {
			.underwayStyle {
				background: #289E8E !important
			};
			.completeStyle {
				background: #242424 !important
			};
			.reviewStyle {
				background: #F2A15F !important
			};
			.haveReviewStyle {
				background: #9B7D31 !important
			}
		};
		.project-order-content {
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
			};
			.waitCheck {
				background: orange !important
			}
		};
		.affair-order-content {
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
			};
			.waitCheck {
				background: orange !important
			}
		};
	}
</style>
