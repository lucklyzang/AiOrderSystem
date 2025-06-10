<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<u-modal :show="sureCancelShow" :content="content" title="确定删除此图片?" :showCancelButton="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
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
		<!-- 负责人 -->
		<view class="transport-rice-box" v-if="showParticipant">
			<BottomSelect :columns="participantOption" title="参与人" :currentSelectData="currentParticipant" @sure="participantSureEvent" @cancel="participantCancelEvent" @close="participantCloseEvent" />
		</view>
		<view class="nav">
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="修改订单" @backClick="backTo">
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
				<view class="task-describe transport-type">
					<view class="transport-type-left">
						<text>*</text>
						<text>具体事项</text>
					</view>
					<view class="transport-type-right">
						<u--textarea v-model="specificAffairDescribe" placeholder="请输入具体事项描述" height="120" :autoHeight="true" border="none"></u--textarea>
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
						<text>负责人</text>
					</view>
					<view class="select-box-right" @click="showParticipant = true">
						<text>{{ disposeTaskPresent(currentParticipant) }}</text>
						<u-icon name="arrow-right" color="#989999" size="20" /></u-icon>
					</view>
				</view>
				<view class="view-photoList">
					<view>
						<text>图片</text>
					</view>
					<view>
						<view v-for="(item, index) in imgArr" :key='index'>
							<image :src="item" mode="aspectFit"></image>
							<u-icon name="close" color="#000000" @click="photoDelete(item,index)"></u-icon>
						</view>
						<view>
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg"/>
						</view>
					</view>
				</view>
			</view>	
			<view class="btn-box">
				<text class="operate-one" @click="sureEvent">确认</text>
				<text class="operate-three" @click="cancelEvent">取消</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import { createRepairsTask, getTransporter, queryDepartment, queryStructure } from '@/api/project.js'
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
				sureCancelShow: false,
				content: '',
				priorityRadioValue: '1',
				specificAffairDescribe: '',
				storeId: '',
				systemId: '',
				imgArr: [],
				imgIndex: '',
				srcImage: '',
				structureOption: [],
				showStructure: false,
				currentStructure: '请选择',
				
				goalDepartmentOption: [],
				showGoalDepartment: false,
				currentGoalDepartment: '请选择',
				
				participantOption: [],
				showParticipant: false,
				currentParticipant: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				"templateType",
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
		},
		methods: {
			...mapMutations([
				''
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
		
			// 弹框确定按钮
			sureCancel() {
				this.sureCancelShow = false;
				this.imgArr.splice(this.imgIndex, 1)
			},
			// 弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false
			},
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},
			
			// 选择图片方法
			getImg() {
				var that = this
				uni.chooseImage({
					count: 3,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: function(res) {
						uni.previewImage({
							urls: res.tempFilePaths
						});
						for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
							that.srcImage = res.tempFilePaths[imgI];
							uni.getFileSystemManager().readFile({
								filePath: that.srcImage,
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.imgArr.push(base64);
								}
							})
						}
					}
				});
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
				// this.getSpacesByDepartmentId(this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'],false)
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
			
			
			// 并行查询目的建筑、负责人
			parallelFunction (type) {
				this.showLoadingHint = true;
				Promise.all([this.getStructure(),this.queryTransporter()])
				.then((res) => {
					this.showLoadingHint = false;
					if (res && res.length > 0) {
						this.structureOption = [];
						this.participantOption = [];
						let [item1,item2] = res;
						if (item1) {
							// 目的建筑
							for (let i = 0, len = item1.length; i < len; i++) {
								this.structureOption.push({
									text: item1[i].structName,
									value: item1[i].id,
									id: i
								})
							};
							if (this.currentStructure != '请选择') {
								this.getDepartmentByStructureId(this.structureOption.filter((item) => { return item['text'] == this.currentStructure})[0]['value'],false,true)
							}
						};
						if (item2) {
							// 负责人
							for (let i = 0, len = item2.length; i < len; i++) {
								this.participantOption.push({
									text: item2[i].workerName,
									value: item2[i]['id'],
									selected: false
								})
							}
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
							color: #101010;
							&:nth-child(1) {
								color: red !important
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
							}
						}
					}
				};
				.view-photoList {
					width: 100%;
					padding: 8px 6px;
					box-sizing: border-box;
					background: #fff;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 14px;
					margin-top: 6px;
					>view {
						display: inline-block;
						&:first-child {
							color: $color-text-left;
							width: 80px;
							vertical-align: top;
							height: 100px;
							padding-left: 10px;
							line-height: 100px;
						};
						&:nth-child(2) {
							flex: 1;
							font-size: 34px;
							>view {
								width: 32%;
								height: 100px;
								display: inline-block;
								vertical-align: top;
								margin-right: 2%;
								margin-top: 2%;
								position: relative;
								&:nth-child(1) {
									margin-top: 0;
								};
								&:nth-child(2) {
									margin-top: 0;
								};
								&:nth-child(3) {
									margin-top: 0;
								};
								&:nth-child(3n+3) {
									margin-right: 0;
								};
								> /deep/ .u-icon {
									position: absolute;
									top: -12px;
									right: 0
								};
								image {
									width: 100%;
									height: 100%
								}
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
