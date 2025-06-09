<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast"></u-toast>
		<!-- 目的建筑 -->
		<view class="transport-rice-box" v-if="showStructure">
			<ScrollSelection v-model="showStructure" :columns="structureOption" title="目的建筑" @sure="structureSureEvent" @cancel="structureCancelEvent" @close="structureCloseEvent" />
		</view>
		<!-- 目的科室 -->
		<view class="transport-rice-box" v-if="showGoalDepartment">
			<ScrollSelection v-model="showGoalDepartment" :columns="goalDepartmentOption" title="目的科室" @sure="goalDepartmentSureEvent" @cancel="goalDepartmentCancelEvent" @close="goalDepartmentCloseEvent" :isShowSearch="true" />
		</view>
		<!-- 目的房间 -->
		<view class="transport-rice-box" v-if="showGoalSpaces">
			<BottomSelect v-model="showGoalSpaces" :columns="goalSpacesOption" title="目的房间" :currentSelectData="currentGoalSpaces" @sure="goalSpacesSureEvent" @cancel="goalSpacesCancelEvent" @close="goalSpacesCloseEvent" />
		</view>
		<!-- 任务类型 -->
		<view class="transport-rice-box" v-if="showTaskType">
			<ScrollSelection v-model="showTaskType" :isShowSearch="true" :columns="taskTypeOption" title="任务类型" @sure="taskTypeSureEvent" @cancel="taskTypeCancelEvent" @close="taskTypeCloseEvent" />
		</view>
		<!-- 维修员 -->
		<view class="transport-rice-box" v-if="showTransporter">
			<ScrollSelection v-model="showTransporter" :columns="transporterOption" title="维修员" @sure="transporterSureEvent" @cancel="transporterCancelEvent" @close="transporterCloseEvent" />
		</view>
		<!-- 使用工具 -->
		<view class="transport-rice-box" v-if="showUseTool">
			<BottomSelect :columns="useToolOption" title="工具" :currentSelectData="currentUseTool"  @sure="useToolSureEvent" @cancel="useToolCancelEvent" @close="useToolCloseEvent" />
		</view>
		<!-- 参与人 -->
		<view class="transport-rice-box" v-if="showParticipant">
			<BottomSelect :columns="participantOption" title="参与人" :currentSelectData="currentParticipant" @sure="participantSureEvent" @cancel="participantCancelEvent" @close="participantCloseEvent" />
		</view>
		<view class="nav">
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="创建订单" @backClick="backTo">
			</nav-bar>
		</view>
		<view class="content-box-inner">
			<view class="message-box">
				<view class="message-one">
					<view class="message-one-left">
						优先级
					</view>
					<view class="message-one-right">
						<u-radio-group v-model="priorityRadioValue" @change="radioGroupChange">
							<u-radio name="1" activeColor="#8af08a" labelColor="#8af08a" label="正常"></u-radio>
							<u-radio name="2" activeColor="#fcd388" labelColor="#fcd388" label="重要"></u-radio>
							<u-radio name="3" activeColor="#ea7171" labelColor="#ea7171" label="紧急"></u-radio>
							<u-radio name="4" activeColor="#b62b2b" labelColor="#b62b2b" label="紧急重要"></u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="select-box">
					<view class="select-box-left">
						<text>*</text>
						<text>任务类型</text>
					</view>
					<view class="select-box-right" @click="showTaskType = true">
						<text>{{ currentTaskType }}</text>
						<u-icon name="arrow-right" color="#989999" size="20" /></u-icon>
					</view>
				</view>
				<view class="select-box end-select-box">
					<view class="select-box-left">
						<text>目的建筑</text>
					</view>
					<view class="select-box-right" @click="showStructure = true">
						<text>{{ currentStructure }}</text>
						<u-icon name="arrow-right" color="#989999" size="20" /></u-icon>
					</view>
				</view>
				<view class="select-box end-select-box">
					<view class="select-box-left">
						<text>目的科室</text>
					</view>
					<view class="select-box-right" @click="goalDepartmentClickEvent">
						<text>{{ currentGoalDepartment }}</text>
						<u-icon name="arrow-right" color="#989999" size="20" /></u-icon>
					</view>
				</view>
				<view class="select-box end-select-box">
					<view class="select-box-left">
						<text>目的房间</text>
					</view>
					<view class="select-box-right" @click="goalSpacesClickEvent">
						<text>{{ disposeTaskPresent(currentGoalSpaces) }}</text>
						<u-icon name="arrow-right" color="#989999" size="20" /></u-icon>
					</view>
				</view>
				<view class="task-describe transport-type problem-overview">
					<view class="transport-type-left">
						<text>问题概述</text>
					</view>
					<view class="transport-type-right">
						<u--textarea v-model="problemOverview" placeholder="请输入问题简要概述" rows="1"
							autosiz :autoHeight="true" border="none"></u--textarea>
					</view>
				</view>
				<view class="select-box end-select-box">
					<view class="select-box-left">
						<text>维修员</text>
					</view>
					<view class="select-box-right" @click="showTransporter = true">
						<text>{{ currentTransporter }}</text>
						<u-icon name="arrow-right" color="#989999" size="20" /></u-icon>
					</view>
				</view>
				<view class="select-box end-select-box">
					<view class="select-box-left">
						<text>参与人</text>
					</view>
					<view class="select-box-right" @click="showParticipant = true">
						<text>{{ disposeTaskPresent(currentParticipant) }}</text>
						<u-icon name="arrow-right" color="#989999" size="20" /></u-icon>
					</view>
				</view>
				<view class="select-box end-select-box">
					<view class="select-box-left">
						<text>使用工具</text>
					</view>
					<view class="select-box-right" @click="showUseTool = true">
						<text>{{ disposeTaskPresent(currentUseTool) }}</text>
						<u-icon name="arrow-right" color="#989999" size="20" /></u-icon>
					</view>
				</view>
				 <view class="message-one is-me">
					<view class="message-one-left">
						我方解决
					</view>
					<view class="message-one-right">
						<u-radio-group v-model="isMeRadioValue" @change="isBackGroupChange">
							<u-radio name="0" activeColor="#fcd388" labelColor="#fcd388" label="否"></u-radio>
							<u-radio name="1" activeColor="#8af08a" labelColor="#8af08a" label="是"></u-radio>
						</u-radio-group>
					</view>
				</view>
				<view class="task-describe transport-type">
					<view class="transport-type-left">
						<text>任务描述</text>
					</view>
					<view class="transport-type-right">
						<u--textarea v-model="taskDescribe" placeholder="请输入任务描述" height="120" :autoHeight="true" border="none"></u--textarea>
					</view>
				</view>
				<view class="consumable-management-area">
					<view class="circulation-area-title">
						<text>耗材管理</text>
						<text @click="materialShowEvent">添加</text>
					</view>
					<view class="circulation-area">
						<view v-for="(item,index) in consumableMsgList" :key="item">
							<text>{{index+1}}</text>
							<text>
								{{item.mateName}}-{{item.model}}
							</text>
							<text>
								<u-number-box 
								@change="(value,detail) => {stepperEvent(value,detail,item,index)}" 
								@plus="stepperPlusEvent(item,index)"
								v-model.number="item.number" min="0" :max="item.quantity+1">
								</u-number-box>
							</text>
							<text>
								<u-icon name="trash" color="red" @click="deleteEvent(item,index)" /></u-icon>
							</text>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-box">
				<text class="operate-one" @click="sureEvent">确认</text>
				<!-- <text class="operate-two" @click="temporaryStorageEvent">暂存</text> -->
				<text class="operate-three" @click="cancelEvent">取消</text>
			</view>
		</view>
		<!-- 物料弹框  -->
		<view class="material-box">
			<u-modal :show="materialShow"  show-cancel-button width="700rpx"
					@confirm="materialSure" @cancel="materialCancel" confirmText="添加"
					cancelText="取消"
				>
					<view class="dialog-top">
						<view class="select-title">添加耗材</view>
						<u-icon name="close" size="24" @click="closeScreenDialogEvent" />
					</view>
					<view class="tool-name-list">
						<view class="tool-name-list-title-innner">
								<view class="search-input">
									<u--input
										v-model="searchValue"
										placeholder="物资"
										border="none"
									/>
									</u--input>
									<u-icon name="search" size="22" color="#B7B6B6"></u-icon>
								</view>
								<view class="search-btn" @click="searchEvent">搜索</view>
						</view>
						<view class="tool-name-list-content">
							<view class="static-row">
								<u-row>
									<view class="circulation-area-title-box">
										<text>物资名称</text>
										<text>单位</text>
										<text>型号</text>
										<text>规格</text>
									</view>
									<view class="circulation-area-content-box"> 
										<view v-for="(item,index) in inventoryMsgList" :key="item" class="circulation-area-content">
											<text @click="mateNameEvent(item,index)">
												{{item.mateName}}
											</text>
											<text>
												{{item.unit ? item.unit : '无'}}
											</text>
											<text>
												{{ item.model ?  item.model : '无'}}
											</text>
											<text>
												{{ item.norms ?  item.norms : '无' }}
											</text>
										</view>
										<u-empty description="暂无数据" v-if="inventoryMsgList.length == 0" />
									</view>
								</u-row>
							</view>
							<view class="absolute-row">
								<u-row>
									<view class="absolute-title">
										占位
									</view>
									<view class="absolute-operate">
										<view v-for="(item,index) in inventoryMsgList" :key="item.mateId">
											<view>
												<u-checkbox-group @change="checkboxChange">
													<u-checkbox :checked="item.checked" :name="item.mateName" shape="square" :key="item.mateId" :disabled="item.disabled"></u-checkbox>
												</u-checkbox-group>
											</view>
										</view>
									</view>
								</u-row>
							</view>	
							<view class="shadow-box"></view> 
						</view>
						<view class="page-area">
							<view class="page-left" @click="pageClickEvent('previous')" :class="{'pagetextStyle' : currentPage == 1}">上一页</view>
							<view class="page-center">
								<text>{{ totalPage == 0 ? 0 : currentPage }}</text>
								<text>/</text>
								<text>{{ totalPage }}</text>
							</view>
							<view class="page-right" @click="pageClickEvent('next')" :class="{'pagetextStyle' : currentPage == totalPage}">下一页</view>
						</view>
					</view>
			</u-modal>
		</view>
		<!-- 物料删除提示框   -->
		<view class="material-delete-box">
			 <u-modal :show="materialDeleteShow"  show-cancel-button width="90%"
					@confirm="materialDeleteSure" @cancel="materialDeleteCancel" confirm-button-text="确定"
					cancel-button-text="取消"
				>
					<view class="dialog-top">
						<image src="@/static/img/delete-info.png"></image>
					</view>
					<view class="dialog-center">
					 {{`是否删除:${deleteMaterial}?`}}
					</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import { createRepairsTask, getTransporter, querySpace, queryDepartment, queryRepairsTaskTool, queryStructure, queryRepairsTaskMaterial, getRepairsTaskType } from '@/api/project.js'
	import navBar from "@/components/zhouWei-navBar"
	import { setCache,removeAllLocalStorage } from '@/common/js/utils'
	import _ from 'lodash'
	import ScrollSelection from "@/components/scrollSelection/scrollSelection";
	import BottomSelect from "@/components/bottomSelect/bottomSelect";
	export default {
		components: {
			navBar,
			ScrollSelection,
			BottomSelect
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中',
				materialShow: false,
				deleteInfoPng: require('@/static/img/delete-info.png'),
				materialDeleteShow: false,
				deleteMaterialIndex: '',
				loadingShow: false,
				deleteMaterial: '',
				searchValue: '',
				problemOverview: '',
				taskDescribe: '',
				transportNumberValue: '',
				totalPage: '',
				pageSize: 6,
				currentPage: 1,
				inventoryMsgList: [],
				echoInventoryMsgList: [],
				temporaryInventoryMsgList: [],
				consumableMsgList: [],
				storeId: '',
				systemId: '',
	
				useToolOption: [],
				showUseTool: false,
				currentUseTool: [],
	
				participantOption: [],
				showParticipant: false,
				currentParticipant: [],
	
				goalDepartmentOption: [],
				showGoalDepartment: false,
				currentGoalDepartment: '请选择',
	
				goalSpacesOption: [],
				showGoalSpaces: false,
				currentGoalSpaces: [],
	
				taskTypeOption: [],
				showTaskType: false,
				currentTaskType: '请选择',
	
				structureOption: [],
				showStructure: false,
				currentStructure: '请选择',
	
				transporterOption: [],
				showTransporter: false,
				currentTransporter: '请选择',
				priorityRadioValue: '1',
				isMeRadioValue: '1',
				functionListIndex: 0
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				"templateType",
				"temporaryStorageCreateRepairsTaskMessage"
			]),
			proId () {
				return this.userInfo.extendData.proId
			},
			userName () {
				return this.userInfo.userName
			},
			proName () {
				return this.userInfo.extendData.proName
			},
			workerId () {
				return this.userInfo.extendData.userId
			}
		},
		onLoad() {
			this.parallelFunction();
			//判断是否回显暂存的数据
			// if (JSON.stringify(this.temporaryStorageCreateRepairsTaskMessage) != '{}' && this.temporaryStorageCreateRepairsTaskMessage['isTemporaryStorage']) {
			// 	this.echoTemporaryStorageMessage()
			// }
		},
		methods: {
			...mapMutations([
				'changeTemporaryStorageCreateRepairsTaskMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 回显暂存的信息
				async echoTemporaryStorageMessage () {
				let casuallyTemporaryStorageCreateRepairsTaskMessage = this.temporaryStorageCreateRepairsTaskMessage;
				this.priorityRadioValue = casuallyTemporaryStorageCreateRepairsTaskMessage['priorityRadioValue'];
				this.currentTaskType = casuallyTemporaryStorageCreateRepairsTaskMessage['currentTaskType'];
				this.currentStructure = casuallyTemporaryStorageCreateRepairsTaskMessage['currentStructure'];
				this.currentGoalDepartment = casuallyTemporaryStorageCreateRepairsTaskMessage['currentGoalDepartment'];
				this.currentGoalSpaces = casuallyTemporaryStorageCreateRepairsTaskMessage['currentGoalSpaces'];
				this.problemOverview = casuallyTemporaryStorageCreateRepairsTaskMessage['problemOverview'];
				this.currentTransporter = casuallyTemporaryStorageCreateRepairsTaskMessage['currentTransporter'];
				this.currentParticipant = casuallyTemporaryStorageCreateRepairsTaskMessage['currentParticipant'];
				this.currentUseTool = casuallyTemporaryStorageCreateRepairsTaskMessage['currentUseTool'];
				this.isMeRadioValue = casuallyTemporaryStorageCreateRepairsTaskMessage['isMeRadioValue'];
				this.taskDescribe = casuallyTemporaryStorageCreateRepairsTaskMessage['taskDescribe'];
				this.consumableMsgList = casuallyTemporaryStorageCreateRepairsTaskMessage['consumableMsgList']
				},

				// 公共修改是否暂存的方法
				commonIsTemporaryStorageMethods () {
				let casuallyTemporaryStorageCreateRepairsTaskMessage = this.temporaryStorageCreateRepairsTaskMessage;
				casuallyTemporaryStorageCreateRepairsTaskMessage['isTemporaryStorage'] = false;
				this.changeTemporaryStorageCreateRepairsTaskMessage(casuallyTemporaryStorageCreateRepairsTaskMessage)
				},

				// 处理维修任务参与者
				disposeTaskPresent (item) {
				if (!item) { return '请选择'};
				if (item.length == 0) { return '请选择'};
				let temporaryArray = [];
				for (let innerItem of item) {
					temporaryArray.push(innerItem.text)
				};
				return temporaryArray.join('、')
				},
				
				// 物料复选框变化事件
				checkboxChange (detail) {
					let mateIndex;
					mateIndex = this.inventoryMsgList.findIndex((item) => {return item.mateName == detail[0]});
					this.$nextTick(() => {
						this.$set(this.inventoryMsgList[mateIndex],'checked',!this.inventoryMsgList[mateIndex]['checked'])
					})
				},

				// 删除物料事件
				deleteEvent(item,index) {
				this.materialDeleteShow = true;
				this.deleteMaterial = `${item.mateName}-${item.model}`;
				this.deleteMaterialIndex = index
				},

				// 物料数量变化事件
				stepperEvent (value,detail,item,index) {
				if (item.number > item.quantity) {
					this.$nextTick(() => {
						this.$set(this.consumableMsgList[index],'number',item.quantity)
					});
					this.$refs.uToast.show({
						message: '已超出库存数量',
						position: 'center'
					})
				}
				},

				// 点击物料加事件
				stepperPlusEvent(item,index) {
				if (item.number  >= item.quantity) {
					this.$nextTick(() => {
						this.$set(this.consumableMsgList[index],'number',item.quantity)
					});
					this.$refs.uToast.show({
						message: '已超出库存数量',
						position: 'center'
					})
				}
				},

				// 格式化时间
				getNowFormatDate(currentDate) {
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hour + seperator2 + minutes
				return currentdate
				},

				// 根据建筑查询科室信息
				getDepartmentByStructureId (structureId,flag,isInitial) {
				this.loadingText = '查询中...';
				this.loadingShow = true;
				this.overlayShow = true;
				this.goalDepartmentOption = [];
				queryDepartment(this.proId,structureId)
				.then((res) => {
					this.loadingText = '';
					this.loadingShow = false;
					this.overlayShow = false;
					if (res && res.data.code == 200) {
						if (res.data.data.length > 0) {
							for (let i = 0, len = res.data.data.length; i < len; i++) {
								this.goalDepartmentOption.push({
									text: res.data.data[i].departmentName,
									value: res.data.data[i].id,
									id: i
								})
							};
							if (isInitial) {
								if (this.currentGoalDepartment != '请选择') {
									this.getSpacesByDepartmentId(this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'],false)
								}
							}  
						};
						if (flag) {
							this.showGoalDepartment = true
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

				// 根据科室查询空间间信息
				getSpacesByDepartmentId (depId,flag) {
				this.showLoadingHint = true;
				this.goalSpacesOption = [];
				querySpace(this.proId,depId)
				.then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						if (res.data.data.length > 0) {
							for (let i = 0, len = res.data.data.length; i < len; i++) {
								this.goalSpacesOption.push({
									text: res.data.data[i].spaceName,
									value: res.data.data[i].id,
									selected: false
								})
							}
						};
						if (flag) {this.showGoalSpaces = true}
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
						message: `${err}`,
						type: 'error'
					})
				})
				},

				// 并行查询任务类型、目的建筑、维修员、物料信息、维修工具
				parallelFunction (type) {
					this.showLoadingHint = true;
					Promise.all([this.getTaskType(), this.getStructure(), this.queryTransporter(), this.getRepairsTaskMaterial(), this.getRepairsTaskTool()])
					.then((res) => {
						this.showLoadingHint = false;
						if (res && res.length > 0) {
							this.structureOption = [];
							this.participantOption = [];
							this.taskTypeOption = [];
							this.transporterOption = [];
							this.useToolOption = [];
							let [item1,item2,item3,item4,item5] = res;
							if (item1) {
								// 任务类型
								for (let i = 0, len = item1.length; i < len; i++) {
									this.taskTypeOption.push({
										text: item1[i].typeName,
										value: item1[i].id,
										id: i
									})
								}
							};
							if (item2) {
								// 目的建筑
								for (let i = 0, len = item2.length; i < len; i++) {
									this.structureOption.push({
										text: item2[i].structName,
										value: item2[i].id,
										id: i
									})
								};
								if (this.currentStructure != '请选择') {
									this.getDepartmentByStructureId(this.structureOption.filter((item) => { return item['text'] == this.currentStructure})[0]['value'],false,true)
								}
							};
							if (item3) {
								// 运送员
								for (let i = 0, len = item3.length; i < len; i++) {
									this.transporterOption.push({
										text: item3[i].workerName,
										value: item3[i]['id'],
										id: i
									});
									this.participantOption.push({
										text: item3[i].workerName,
										value: item3[i]['id'],
										selected: false
									})
								}
							};
							// 物料信息
							if (item4) {
								console.log('物料信息',item4);
								this.inventoryMsgList = [];
								this.temporaryInventoryMsgList = [];
								this.echoInventoryMsgList = [];
								if (item4.length > 0) {
									for (let item of item4) {
										item['checked'] = false
									};
									this.inventoryMsgList = item4;
									this.temporaryInventoryMsgList = item4;
									this.echoInventoryMsgList = item4;
									this.totalPage =  Math.ceil(this.temporaryInventoryMsgList.length/this.pageSize);
									// 默认展示第一页的物料信息
									this.inventoryMsgList = this.temporaryInventoryMsgList.slice((this.currentPage - 1) * this.pageSize,(this.currentPage - 1) * this.pageSize + this.pageSize);
									this.storeId = this.inventoryMsgList[0]['storeId'];
									this.systemId = this.inventoryMsgList[0]['systemId']
								}  
							};
							// 维修工具
							if (item5) {
								for (let i = 0, len = item5.length; i < len; i++) {
									this.useToolOption.push({
										text: item5[i].toolName,
										value: item5[i].id,
										selected: false
									})
								}
							};
							// if (item4) {
							//   //任务类型
							//   // 有暂存的话,则回显该暂存信息
							//   if (this.temporaryStorageCreateRepairsTaskMessage['isTemporaryStorage']) {
							//   }
							// }
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

				// 查询维修工具
				getRepairsTaskTool () {
					return new Promise((resolve,reject) => {
						queryRepairsTaskTool(this.proId).then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							}
						})
						.catch((err) => {
							reject(err.message)
						})
					})
				},

				// 查询物料信息
				getRepairsTaskMaterial () {
					return new Promise((resolve,reject) => {
						queryRepairsTaskMaterial(this.proId).then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							} else {
								reject(res.data.msg)
							}
						})
						.catch((err) => {
							reject(err.message)
						})
					})
				},

				// 查询目的建筑
				getStructure () {
					return new Promise((resolve,reject) => {
						queryStructure(this.proId).then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							}
						})
						.catch((err) => {
							reject(err.message)
						})
					})
				},

				// 查询维修员
				queryTransporter () {
				return new Promise((resolve,reject) => {
					getTransporter(this.proId, this.workerId)
					.then((res) => {
						if (res && res.data.code == 200) {
							resolve(res.data.data)
						}
					})
					.catch((err) => {
						reject(err.message)
					})
				})
				},

				// 查询任务类型
				getTaskType () {
				return new Promise((resolve,reject) => {
					getRepairsTaskType(this.proId, this.workerId)
					.then((res) => {
						if (res && res.data.code == 200) {
							resolve(res.data.data)
						}
					})
					.catch((err) => {
						reject(err.message)
					})
				})
				},

				// 使用工具下拉选择框确认事件
				useToolSureEvent (val) {
				if (val.length > 0) {
					this.currentUseTool =  val
				} else {
					this.currentUseTool = []
				};
				this.showUseTool = false
				},

				// 使用工具下拉选择框取消事件
				useToolCancelEvent () {
				this.showUseTool = false
				},

				// 使用工具下拉选择框关闭事件
				useToolCloseEvent () {
				this.showUseTool = false
				},

				// 参与人下拉选择框确认事件
				participantSureEvent (val) {
				if (val.length > 0) {
					this.currentParticipant =  val
				} else {
					this.currentParticipant = []
				};
				this.showParticipant = false
				},

				// 参与人下拉选择框取消事件
				participantCancelEvent () {
				this.showParticipant = false
				},

				// 参与人下拉选择框关闭事件
				participantCloseEvent () {
				this.showParticipant = false
				},

				// 任务类型下拉选择框确认事件
				taskTypeSureEvent (val) {
				console.log(val);
				if (val) {
					this.currentTaskType =  val
				} else {
					this.currentTaskType = '请选择'
				};
				this.showTaskType = false
				},

				// 任务类型下拉选择框取消事件
				taskTypeCancelEvent () {
				this.showTaskType = false
				},

				// 任务类型下拉选择框关闭事件
				taskTypeCloseEvent () {
				this.showTaskType = false
				},

				// 目的建筑下拉选择框确认事件
				structureSureEvent (val) {
				if (val) {
					this.currentStructure =  val;
					this.currentGoalDepartment = '请选择';
					this.currentGoalSpaces = [];
					this.goalSpacesOption = [];
					this.getDepartmentByStructureId(this.structureOption.filter((item) => { return item['text'] == this.currentStructure})[0]['value'],false,false)
				} else {
					this.currentStructure = '请选择'
				};
				this.showStructure = false
				},

				// 目的建筑下拉选择框取消事件
				structureCancelEvent () {
				this.showStructure = false
				},

				// 目的建筑下拉选择框关闭事件
				structureCloseEvent () {
				this.showStructure = false
				},

				// 目的科室下拉选择框确认事件
				goalDepartmentSureEvent (val) {
				if (val) {
					this.currentGoalDepartment =  val;
					this.currentGoalSpaces = [];
					this.getSpacesByDepartmentId(this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'],false)
				} else {
					this.currentGoalDepartment = '请选择'
				};
				this.showGoalDepartment = false
				},

				// 目的科室列点击事件
				goalDepartmentClickEvent () {
				if (this.currentStructure == '请选择') {
					this.$refs.uToast.show({
						message: '请选择建筑',
						position: 'center'
					})
				} else {
					this.getDepartmentByStructureId(this.structureOption.filter((item) => { return item['text'] == this.currentStructure})[0]['value'],true,false)
				}
				},

				// 目的科室下拉选择框取消事件
				goalDepartmentCancelEvent () {
				this.showGoalDepartment = false
				},

				// 目的科室下拉选择框关闭事件
				goalDepartmentCloseEvent () {
				this.showGoalDepartment = false
				},

				// 目的房间下拉选择框关闭事件
				goalSpacesCloseEvent () {
				this.showGoalSpaces = false
				},

				// 目的房间列点击事件
				goalSpacesClickEvent () {
				if (this.currentGoalDepartment == '请选择') {
					this.$refs.uToast.show({
						message: '请选择科室',
						position: 'center'
					})
				} else {
					this.getSpacesByDepartmentId(this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'],true)
				}
				},

				// 目的房间下拉选择框确认事件
				goalSpacesSureEvent (val) {
				if (val.length > 0) {
					this.currentGoalSpaces =  val;
				} else {
					this.currentGoalSpaces = []
				};
				this.showGoalSpaces = false
				},

				// 目的房间下拉选择框取消事件
				goalSpacesCancelEvent () {
				this.showGoalSpaces = false
				},


				// 运送员下拉选择框确认事件
				transporterSureEvent (val) {
				if (val) {
					this.currentTransporter =  val
				} else {
					this.currentTransporter = '请选择'
				};
				this.showTransporter = false
				},

				// 运送员下拉选择框取消事件
				transporterCancelEvent () {
				this.showTransporter = false
				},

				// 运送员下拉选择框关闭事件
				transporterCloseEvent () {
				this.showTransporter = false
				},


				// 根据维修员名称获取运送员id
				getCurrentTransporterIdByName(text) {
					return this.transporterOption.filter((item) => {return item['text'] == text })[0]['value']
				},

				// 确认事件(创建维保任务)
				sureEvent () {
				// 任务类型不能为空
				if (this.currentTaskType == '请选择') {
					this.$refs.uToast.show({
						message: '任务类型不能为空',
						position: 'center'
					});
					return
				};
				// 创建维修任务
				let temporaryMessage = {
					typeId: this.taskTypeOption.filter((item) => { return item['text'] == this.currentTaskType})[0]['value'], // 任务类型
					taskDesc: this.problemOverview, // 问题描述
					destinationId: '', // 目的地id
					depId: this.currentGoalDepartment == '请选择' ? '' : this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'], // 目的科室id
					select: '',
					isMe: this.isMe, // 是否我方解决 0-否，1-是
					priority: this.priorityRadioValue,
					taskRemark: this.taskDescribe, //任务描述
					proId: this.proId,
					proName: this.proName,
					createId: this.workerId,
					createName: this.userName,
					createType: 0, // 创建类型 0-调度员 2-医务人员 3-巡检人员
					workerId: this.currentTransporter == '请选择' ? '' : this.getCurrentTransporterIdByName(this.currentTransporter),
					workerName: this.currentTransporter == '请选择' ? '' : this.currentTransporter,
					spaces: [], //空间信息
					present: [], //参与者
					tools: [],  //使用工具
					depName: `${this.currentStructure == '请选择' ? '' : this.currentStructure}/${this.currentGoalDepartment == '请选择' ? '' : this.currentGoalDepartment}`, //出发地名称
					typeName: this.currentTaskType, // 类型名称
					materials: []        // 需要的物料
				};
				// 拼接参与者数据
				if (this.currentParticipant.length > 0) {
					for (let item of this.currentParticipant) {
						temporaryMessage['present'].push({
							id: item.hasOwnProperty('value') ? item.value : item.id,
							name: item.hasOwnProperty('text') ? item.text : item.name
						})
					}
				};
				// 拼接使用工具数据
				if (this.currentUseTool.length > 0) {
					for (let item of this.currentUseTool) {
						temporaryMessage['tools'].push({
							id: item.hasOwnProperty('value') ? item.value : item.id,
							name: item.hasOwnProperty('text') ? item.text : item.name
						})
					}
				};
				// 拼接空间信息
				if (this.currentGoalSpaces.length > 0) {
					for (let item of this.currentGoalSpaces) {
						temporaryMessage['spaces'].push({
							id: item.hasOwnProperty('value') ? item.value : item.id,
							name: item.hasOwnProperty('text') ? item.text : item.name
						})
					}
				};
				// 拼接使用耗材数据
				if (this.consumableMsgList.length > 0) {
					for (let item of this.consumableMsgList) {
						if (item.number > 0) {
							temporaryMessage['materials'].push({
								mateNumber: item['mateNumber'],
								storeId: item['storeId'],
								number: item['number'],
								mateName: item['mateName'],
								mateId: item['mateId'],
								proId: this.proId,
								proName: this.proName,
								systemId: item['systemId'],
								unit: item['unit'],
								model: item['model']
							})
						}  
					}
				};
				this.postGenerateRepairsTask(temporaryMessage)
				},

				// 生成维修任务
				postGenerateRepairsTask (data) {
				this.showLoadingHint = true;
				createRepairsTask(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'success',
							position: 'center'
						});
						this.commonIsTemporaryStorageMethods();
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
						})
					};
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: `${err.message}`,
						type: 'error'
					})
				})
				},

				// 搜索物料事件
				searchEvent () {
				if (this.searchValue == '') {
					this.temporaryInventoryMsgList = this.echoInventoryMsgList;
					this.inventoryMsgList = this.echoInventoryMsgList;
					this.currentPage = 1;
					this.totalPage =  Math.ceil(this.temporaryInventoryMsgList.length/this.pageSize);
					// 根据页码分割展示对应的数据
					this.inventoryMsgList = this.temporaryInventoryMsgList.slice((this.currentPage - 1) * this.pageSize,(this.currentPage - 1) * this.pageSize + this.pageSize);
					return
				};
				this.inventoryMsgList = this.echoInventoryMsgList.filter((item) => {return item.mateName.indexOf(this.searchValue) != -1});
				this.temporaryInventoryMsgList = this.inventoryMsgList;
				this.currentPage = 1;
				this.totalPage =  Math.ceil(this.temporaryInventoryMsgList.length/this.pageSize);
				this.inventoryMsgList = this.temporaryInventoryMsgList.slice((this.currentPage - 1) * this.pageSize,(this.currentPage - 1) * this.pageSize + this.pageSize);
				},

				// 删除物料弹框确定事件
				materialDeleteSure () {
					this.materialDeleteShow = false;
					this.consumableMsgList.splice(this.deleteMaterialIndex,1)
				},

				// 删除物料弹框取消事件
				materialDeleteCancel () {
					this.materialDeleteShow = false;
				},

				// 耗材名称点击事件
				mateNameEvent (name,index) {
				this.inventoryMsgList[index]['checked'] = !this.inventoryMsgList[index]['checked'];
				},

				// 添加物料确认
				materialSure () {
				this.materialShow = false;
				let count = this.echoInventoryMsgList.some((item)=> {return item.checked == true && !item.disabled});
				if (!count) {
					this.$refs.uToast.show({
						message: '至少要选择一种耗材',
						position: 'center'
					})
				} else {
					this.materialShow = false;
					this.materialContentShow = true;
					let checkConsumableList = this.echoInventoryMsgList.filter((item) => {return item.checked == true && !item.disabled });
					for (let item of checkConsumableList) {
						this.consumableMsgList.push({
							number: 0,
							mateName: item.mateName,
							mateNumber: item.mateNumber,
							unit: item.unit,
							mateId: item.id,
							quantity: item.quantity,
							model: item.model,
							storeId: this.storeId,
							systemId: this.systemId
						})
					}
				}
				},

				// 添加物料取消
				materialCancel () {
					this.materialShow = false;
					this.currentPage = 1
				},


				// 打开耗材弹框事件
				materialShowEvent () {
				this.materialShow = true;
				this.searchValue = '';
				for (let item of this.echoInventoryMsgList) {
					// 添加过的物料不允许再次添加
					let isExist = this.consumableMsgList.filter((innerItem) => { return innerItem.mateId == item.id});
					if (isExist.length > 0) {
						item['disabled'] = true;
						item['checked'] = true
					} else {
						item['disabled'] = false
						item['checked'] = false
					}
				};
				// 打开物料弹框就显示全部物料信息
				this.temporaryInventoryMsgList = this.echoInventoryMsgList;
				this.totalPage = Math.ceil(this.temporaryInventoryMsgList.length/this.pageSize);
				this.inventoryMsgList = this.temporaryInventoryMsgList.slice((this.currentPage - 1) * this.pageSize,(this.currentPage - 1) * this.pageSize + this.pageSize)
				},

				// 关闭耗材弹框
				closeScreenDialogEvent () {
				this.materialShow = false;
				this.currentPage = 1
				},

				// 物料分页点击事件
				pageClickEvent (text) {
				if (this.totalPage == 0) { return };
				if (text == 'previous') {
					if ( this.currentPage == 1) { return };
					this.currentPage--;
				} else if (text == 'next') {
					if ( this.currentPage == this.totalPage ) { return }
					this.currentPage++
				};
				// 根据页码分割展示对应的数据
				this.inventoryMsgList = this.temporaryInventoryMsgList.slice((this.currentPage - 1) * this.pageSize,(this.currentPage - 1) * this.pageSize + this.pageSize);
				},

				// 暂存事件
				temporaryStorageEvent () {
				let casuallyTemporaryStorageCreateRepairsTaskMessage = this.temporaryStorageCreateRepairsTaskMessage;
				casuallyTemporaryStorageCreateRepairsTaskMessage['priorityRadioValue'] = this.priorityRadioValue;
				casuallyTemporaryStorageCreateRepairsTaskMessage['currentTaskType'] = this.currentTaskType;
				casuallyTemporaryStorageCreateRepairsTaskMessage['currentStructure'] = this.currentStructure;
				casuallyTemporaryStorageCreateRepairsTaskMessage['currentGoalDepartment'] = this.currentGoalDepartment;
				casuallyTemporaryStorageCreateRepairsTaskMessage['currentGoalSpaces'] = this.currentGoalSpaces;
				casuallyTemporaryStorageCreateRepairsTaskMessage['problemOverview'] = this.problemOverview;
				casuallyTemporaryStorageCreateRepairsTaskMessage['currentTransporter'] = this.currentTransporter;
				casuallyTemporaryStorageCreateRepairsTaskMessage['currentParticipant'] = this.currentParticipant;
				casuallyTemporaryStorageCreateRepairsTaskMessage['currentUseTool'] = this.currentUseTool;
				casuallyTemporaryStorageCreateRepairsTaskMessage['isMeRadioValue'] = this.isMeRadioValue;
				casuallyTemporaryStorageCreateRepairsTaskMessage['taskDescribe'] = this.taskDescribe;
				casuallyTemporaryStorageCreateRepairsTaskMessage['consumableMsgList'] = this.consumableMsgList;
				casuallyTemporaryStorageCreateRepairsTaskMessage['isTemporaryStorage'] = true;
				this.changeTemporaryStorageCreateRepairsTaskMessage(casuallyTemporaryStorageCreateRepairsTaskMessage);
				this.$refs.uToast.show({
					type: 'success',
					message: '暂存成功',
					position: 'center'
				})
				},

				// 取消事件
				cancelEvent () {
					this.backTo()
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
		.material-box {
				/deep/ .u-modal {
					top: auto !important;
					left: 0 !important;
					border-right: 1px solid #fff;
					bottom: 0 !important;
					border-top-left-radius: 20px !important;
					border-top-right-radius: 20px !important;
					border-bottom-left-radius: 0 !important;
					border-bottom-right-radius: 0 !important;
					transform: translate3d(0,0,0) !important;
					.u-modal__content {
							padding: 0 20px 0 20px !important;
							box-sizing: border-box;
							height: 60vh;
							display: flex;
							flex-direction: column;
							.dialog-top {
								height: 60px;
								position: relative;
								display: flex;
								align-items: center;
								justify-content: center;
								.select-title {
									font-size: 18px;
									color: #101010;
									text-align: center
								};
								.u-icon {
									position: absolute;
									top: 50%;
									transform: translateY(-50%);
									right: 0
								}
							};
							.tool-name-list {
								flex: 1;
								display: flex;
								height: 0;
								display: flex;
								position: relative;
								flex-direction: column;
								.tool-name-list-title-innner {
									display: flex;
									justify-content: space-between;
									align-items: center;
									height: 52px;
									.search-input {
										flex: 1;
										padding: 10px;
										position: relative;
										.u-input {
											padding: 4px 4px 4px 30px !important;
											background: #F7F7F9;
											box-sizing: border-box;
											border-radius: 10px;
										};
										.u-icon {
											position: absolute;
											top: 50%;
											transform: translateY(-50%);
											display: inline-block;
											left: 16px;
										}
									};
									.search-btn {
										font-size: 14px;
										color: #3B9DF9;
										margin-left: 6px;
									}
								};
								.tool-name-list-content {
									width: 100%;
									position: relative;
									flex: 1;
									padding: 20px 6px 10px 6px;
									display: flex;
									flex-direction: column;
									height: 0;
									box-sizing: border-box;
									border-top: 1px solid #b2b2b2;
									.u-empty {
										position: absolute;
										top: 50%;
										left: 50%;
										transform: translate(-50%,-50%)
									};
									.static-row {
										width: 90%;
										height: 100%;
										overflow-x: auto;
										white-space: nowrap;
										.u-row {
											height: 100%;
											display: flex;
											flex-direction: column;
											align-items: flex-start !important;
											&::-webkit-scrollbar {
												height: 0;
												display: none
											};
											.circulation-area-content-box {
												flex: 1;
												width: 100%;
												.circulation-area-content {
													padding: 10px 0;
													box-sizing: border-box;
													font-size: 0;
													background: #fff;
													> text {
														line-height: 20px;
														font-size: 15px;
														display: inline-block;
														@include no-wrap();
														&:first-child {
															width: 50%;
														};
														&:nth-child(2) {
															width: 20%;
															text-align: center
														};
														&:nth-child(3) {
															width: 25%;
															text-align: center
														};
														&:nth-child(4) {
															width: 30%;
															text-align: center
														}
													}
												}
											};  
											.circulation-area-title-box {
												width: 100%;
												font-size: 0;
												text {
													height: 40px;
													line-height: 40px;
													display: inline-block;
													width: 20%;
													font-size: 16px;
													font-weight: bold;
													&:first-child {
														width: 50%;
														text-align: center
													};
													&:nth-child(2) {
														width: 20%;
														text-align: center;
													};
													&:nth-child(3) {
														width: 25%;
														text-align: center;
													};
													&:nth-child(4) {
														width: 30%;
														text-align: center;
													}
												}
											}
										}
									};
									.absolute-row {
										height: 90%;
										width: 10%;
										z-index: 100;
										position: absolute;
										top: 20px;
										right: 0;
										background: #fff;
										.u-row {
											height: 100%;
											width: 100%;
											display: flex;
											flex-direction: column;
											.absolute-title {
												line-height: 20px;
												width: 100%;
												font-size: 0;
												padding: 10px 0;
												box-sizing: border-box;
											};
											.absolute-operate {
												width: 100%;
												flex: 1;
												overflow-y: auto;
												>view {
													padding: 10px 0;
													box-sizing: border-box;
													>view {
														line-height: 20px;
														display: flex;
														justify-content: center;
														align-items: center;
														.u-checkbox {
															.u-checkbox__icon {
																.u-icon {
																	border-radius: 4px
																}
															}
														}
													}
												}  
											}
										}
									};
									.shadow-box {
										position: absolute;
										background: #fff;
										right: 0;
										width: 10%;
										height: 90%;
										box-shadow: -3px 0 3px 0 #dddddd;
									}  
								};
								.page-area {
									height: 40px;
									width: 70%;
									margin: 0 auto;
									display: flex;
									align-items: center;
									justify-content: space-between;
									.page-left {
										font-size: 14px;
										padding: 4px 6px;
										border-radius: 2px;
										box-sizing: border-box;
										border: 1px solid #d0d0d0
	
									};
									.page-center {
										>text {
											font-size: 12px;
											color: #333;
											&:nth-child(1) {
												color: #3B9DF9
											};
											&:nth-child(2) {
												margin: 0 4px;
											}
										}
									};
									.page-right {
										font-size: 14px;
										border-radius: 2px;
										padding: 4px 6px;
										box-sizing: border-box;
										border: 1px solid #d0d0d0
									};
									.pageSpanStyle {
										color: #d0d0d0 !important
									}
								}
							}
					};
					.u-modal__button-group {
						padding: 10px 20px 20px 20px !important;
						box-sizing: border-box;
						justify-content: space-between;
						::after {
							content: none
						};
					.u-modal__button-group__wrapper--cancel {
							box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
							background: #fff;
							border-radius: 30px;
							margin-right: 20px;
							.u-modal__button-group__wrapper__text {
								color: #1864FF !important;
							}
					};
					.u-modal__button-group__wrapper--confirm {
							background: linear-gradient(to right, #6cd2f8, #2390fe);
							box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
							color: #fff !important;
							border-radius: 30px;
							.u-modal__button-group__wrapper__text {
									color: #fff !important;
							}
					}
					};
					.van-hairline--top::after {
						border-top-width: 0 !important
					}
				}
		};
		.material-delete-box {
			/deep/ .u-modal {
				.u-modal__content {
						padding: 20px 20px 0 20px !important;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						.dialog-top {
							text-align: center;
							>image {
								width: 30px;
								height: 30px;
								vertical-align: middle;
							}
						};
						.dialog-center {
							text-align: center;
							line-height: 20px;
							padding: 20px 0;
							box-sizing: border-box;
							font-weight: bold;
							color: #101010;
							font-size: 16px
						}
					};
					.u-modal__button-group {
						padding: 10px 40px 20px 40px !important;
						box-sizing: border-box;
						justify-content: space-between;
						::after {
							content: none
						};
					.u-modal__button-group__wrapper--cancel {
							height: 40px;
							color: #3B9DF9;
							border: 1px solid #3B9DF9;
							border-radius: 8px;
							margin-right: 20px
					};
					.u-modal__button-group__wrapper--confirm {
							height: 40px;
							background: #3B9DF9;
							color: #fff !important;
							border-radius: 8px;
					}
					};
					.van-hairline--top::after {
						border-top-width: 0 !important
					}
			}
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
		.content-box-inner {
				width: 100%;
				height: 0;
				background: #f7f7f7;
				z-index: 10;
				flex: 1;
				overflow: auto;
				padding: 0 0 10px 0;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				::v-deep .u-empty {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%)
				};
				.message-box {
					flex: 1;
					width: 100%;
					overflow: scroll;
					.message-one {
						width: 100%;
						padding: 10px 6px 10px 16px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 14px;
						margin-top: 6px;
						.message-one-left {
							width: 20%;
							color: #101010
						};
						.message-one-right {
							flex: 1;
							/deep/ .u-radio-group {
								display: flex;
								justify-content: space-between;
								.u-radio {
									flex: 1 0 auto !important;
									.u-radio__label {
										margin-right: 9px;
									}
								}
							}
						}
					};
					.is-me {
						.message-one-left {
							color: #9E9E9A !important
						};
						.message-one-right {
							/deep/ .u-radio-group {
								justify-content: flex-end;
								.u-radio {
									flex: none !important;
									&:last-child {
										margin-left: 20px;
									}
								}
							}
						}
					};
					.select-box {
						width: 100%;
						padding: 8px 6px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 14px;
						margin-top: 6px;
						.select-box-left {
							padding-right: 10px;
							box-sizing: border-box;
							>text {
								&:nth-child(1) {
									color: red
								};
								&:nth-child(2) {
									color: #9E9E9A;
									padding-right: 6px;
									box-sizing: border-box
								};
							}
						};
						.select-box-right {
							flex: 1;
							justify-content: flex-end;
							align-items: center;
							display: flex;
							width: 0;
							>text {
								color: #101010;
								text-align: right;
								flex: 1;
								@include no-wrap();
							}
						}
					};
					.end-select-box {
						.select-box-left {
							padding: 0 10px;
							box-sizing: border-box;
							>text {
								&:nth-child(1) {
									color: #9E9E9A;
									padding-right: 6px;
									box-sizing: border-box
								};
							}
						};
					};
					.problem-overview {
						align-items: center
					};
					.transport-type {
						width: 100%;
						padding: 10px 6px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						justify-content: space-between;
						font-size: 14px;
						margin-top: 6px;
						.transport-type-left {
							padding: 0 10px;
							box-sizing: border-box;
							>text {
								&:nth-child(1) {
									color: #9E9E9A
								}
							}
						};
						.transport-type-right {
							flex: 1;
							width: 0;
							display: flex;
							flex-wrap: wrap;
							/deep/ .u-textarea {
								flex: 1;
								padding:10px 0 10px 4px;
								color: $color-text-left;
								background: #f9f9f9;
							}
						}
					};
					.transport-type {
						border-top: 12px solid #f6f6f6;
					};
					.consumable-management-area {
						width: 100%;
						padding: 8px 20px;
						box-sizing: border-box;
						background: #fff;
						font-size: 14px;
						margin-top: 6px;
						.circulation-area {
						> view {
							height: 50px;
							border-radius: 4px;
							display: flex;
							align-items: center;
							background: #F8F8F8;
							margin-bottom: 4px;
							&:last-child {
								margin-bottom:0
							};
							> text {
								height: 50px;
								line-height: 50px;
								font-size: 16px;
								display: inline-block;
								text-align: center;
								&:first-child {
									width: 10%
								};
								&:nth-child(2) {
									text-align: left;
									flex: 1;
									@include no-wrap();
									/deep/ .van-cell {
										.van-cell__value--alone {
											.van-field__control {
												text-align: center
											}
										}
									}
								};
								&:nth-child(3) {
									margin-right: 4px;
									/deep/ .van-stepper {
										.van-stepper__minus {
											color: #3B9DF9;
											border-left: 1px solid #b5b5b5;
											border-top: 1px solid #b5b5b5;
											border-bottom: 1px solid #b5b5b5;
											&:before {
												height: 3px
											}
										};
										.van-stepper__input {
											border: 1px solid #b5b5b5;
											width: 45px;
											margin: 0 !important
										};
										.van-stepper__plus {
											color: #3B9DF9;
											border-right: 1px solid #b5b5b5;
											border-top: 1px solid #b5b5b5;
											border-bottom: 1px solid #b5b5b5;
											&:before {
												height: 3px
											};
											&:after {
												width: 3px
											}
										}
									}
								};
								&:last-child {
									display: inline-block;
									font-size: 22px;
									// color: @color-theme;
									/deep/ .u-icon {
										top: 2px
									}
								}
							}
						}
					};
					.circulation-area-title {
						display: flex;
						justify-content: space-between;
						align-items: center;
						line-height: 30px;
						margin-bottom: 8px;
						>text {
							font-size: 14px;
							display: inline-block;
							&:first-child {
								color: #101010
							};
							&:last-child {
								width: 55px;
								height: 23px;
								border-radius: 4px;
								text-align: center;
								line-height: 23px;
								background: #3B9DF9;
								color: #fff;
							}
						}
					}
					}
				};
				.btn-box {
					width: 90%;
					margin: 0 auto;
					height: 60px;
					display: flex;
					align-items: center;
					justify-content: center;
					>text {
						width: 40%;
						display: inline-block;
						height: 45px;
						font-size: 18px;
						line-height: 45px;
						background: #fff;
						text-align: center;
						border-radius: 30px;
						&:nth-child(1) {
							color: #fff;
							background: linear-gradient(to right, #6cd2f8, #2390fe);
							box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
							margin-right: 30px
						};
						&:nth-child(2) {
							color: #1864FF;
							box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
							// margin-right: 30px
						};
						&:last-child {
							color: #1864FF;
							box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1)
						}
					}
				}
		}
	}
</style>
