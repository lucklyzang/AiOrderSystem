<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<u-modal :show="sureCancelShow" :content="content" title="确定删除此图片?" :showCancelButton="true" @confirm="sureCancel"
		 @cancel="cancelSure">
		</u-modal>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast"></u-toast>
		<!-- 目的建筑 -->
		<view class="transport-rice-box" v-if="showStructure">
			<ScrollSelection v-model="showStructure" :pickerValues="structureDefaultIndex" :columns="structureOption" title="目的建筑" @sure="structureSureEvent" @cancel="structureCancelEvent" @close="structureCloseEvent" />
		</view>
		<!-- 目的科室 -->
		<view class="transport-rice-box" v-if="showGoalDepartment">
			<ScrollSelection v-model="showGoalDepartment" :pickerValues="goalDepartmentDefaultIndex" :columns="goalDepartmentOption" title="目的科室" @sure="goalDepartmentSureEvent" @cancel="goalDepartmentCancelEvent" @close="goalDepartmentCloseEvent" :isShowSearch="true" />
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
						<u-radio-group v-model="priorityRadioValue">
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
						<u--textarea v-model="specificAffairDescribe" placeholder="请输入具体事项描述" border="none"></u--textarea>
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
				<view class="select-box end-select-box current-participant-box">
					<view class="select-box-left">
						<text>负责人</text>
					</view>
					<view class="select-box-right">
						<u-input v-model="currentParticipant" border="none" :clearable="true" placeholder="请输入负责人姓名" type="text">
						</u-input>
					</view>
				</view>
				<view class="view-photoList">
					<view>
						<text>图片</text>
					</view>
					<view>
						<view v-for="(item, index) in resultimageList" :key='index'>
							<image :src="item" mode="aspectFit"></image>
							<view class="icon-box"  @click="photoDelete(item,index)">
									<u-icon name="trash" color="#d70000"></u-icon>
							</view>    
						</view>
						<view>
							<image class="" mode="aspectFit" :lazy-load="true" src="/static/img/plus.png"  @click="getImg"/>
						</view>
					</view>
				</view>
			</view>	
		</view>
		<view class="btn-box">
			<text class="operate-one" @click="sureEvent">确认</text>
			<text class="operate-three" @click="cancelEvent">取消</text>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import { editAffairTask, queryDepartment, queryStructure } from '@/api/affair.js'
	import navBar from "@/components/zhouWei-navBar"
	import { setCache,removeAllLocalStorage } from '@/common/js/utils'
	import _ from 'lodash'
	import ScrollSelection from "@/components/scrollSelection/scrollSelection";
	import BottomSelect from "@/components/bottomSelect/bottomSelect";
	import store from '@/store'
	export default {
		components: {
			navBar,
			ScrollSelection,
			BottomSelect
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				sureCancelShow: false,
				priorityRadioValue: '1',
				specificAffairDescribe: '',
				resultimageList: [],
				fileList: [],
				imageOnlinePathArr: [],
				imgIndex: '',
				structureOption: [],
				structureDefaultIndex: [0],
				showStructure: false,
				currentStructure: '请选择',
				
				goalDepartmentOption: [],
				showGoalDepartment: false,
				goalDepartmentDefaultIndex: [0],
				currentGoalDepartment: '请选择',
				
				currentParticipant: ''
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				"templateType",
				'affairTaskMessage'
			]),
			userName() {
				return this.userInfo.worker.name
			},
			userAccount() {
				return this.userInfo.username
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
		onLoad() {
			this.parallelFunction()
		},
		methods: {
			...mapMutations([
				'storeCurrentIndex'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 回显事务任务编辑信息编辑的信息
			echoTemporaryStorageMessage () {
				try {
					let casuallyTemporaryStorageCreateAffairTaskMessage = this.affairTaskMessage;
					this.priorityRadioValue = casuallyTemporaryStorageCreateAffairTaskMessage['priority'].toString();
					this.specificAffairDescribe = casuallyTemporaryStorageCreateAffairTaskMessage.hasOwnProperty('details') ? casuallyTemporaryStorageCreateAffairTaskMessage.details : '';
					this.resultimageList = this.getResultimageList(casuallyTemporaryStorageCreateAffairTaskMessage['images']);
					this.fileList = this.getResultimageList(casuallyTemporaryStorageCreateAffairTaskMessage['images']);
					this.currentParticipant = casuallyTemporaryStorageCreateAffairTaskMessage['manager'];
					this.currentStructure = casuallyTemporaryStorageCreateAffairTaskMessage['structureName'] ? casuallyTemporaryStorageCreateAffairTaskMessage['structureName'] : '请选择';
					this.currentGoalDepartment = casuallyTemporaryStorageCreateAffairTaskMessage['departmentName'] ? casuallyTemporaryStorageCreateAffairTaskMessage['departmentName'] : '请选择';
					if (this.currentStructure != '请选择') {
						// 显示目的建筑索引
						this.structureDefaultIndex = [this.structureOption.findIndex((item) => { return item.value == casuallyTemporaryStorageCreateAffairTaskMessage['structureId'] })];
					};
					if (this.currentGoalDepartment != '请选择') {
						// 显示目的科室索引
						this.goalDepartmentDefaultIndex = [this.goalDepartmentOption.findIndex((item) => { return item.value == casuallyTemporaryStorageCreateAffairTaskMessage['departmentId']  })];
					}
				} catch(err) {
					this.$refs.uToast.show({
						message: `${err}`,
						type: 'error'
					})
				}	
			},
			
			// 提取图片事件
			getResultimageList (imgArr) {
				let returnImgArr = [];
				let temporaryImgArr = [];
				if (imgArr.length > 0) {
					temporaryImgArr = imgArr.filter((item) => { return item.imgType == 0});
					for (let item of temporaryImgArr) {
						returnImgArr.push(item.path)
					}
				};
				return returnImgArr;
			},
			
		
			// 图片删除弹框确定按钮
			sureCancel() {
				this.sureCancelShow = false;;
				this.fileList.splice(this.imgIndex, 1);
				this.resultimageList.splice(this.imgIndex, 1)
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
							let url = res.tempFiles[imgI].path;
							//获取最后一个的位置
							let index = url.lastIndexOf(".");
							//获取后缀
							let jpgUrl = url.substr(index + 1);
							if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
								that.$refs.uToast.show({
									message: '只可上传jpg或png格式的图片!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							let isLt2M = res.tempFiles[imgI].size/1024/1024 < 5;
							if (!isLt2M) {
								that.$refs.uToast.show({
									message: '图片必须小于5MB!',
									type: 'error',
									position: 'center'
								});
								continue
							};
							that.fileList.push(res.tempFiles[imgI]['path']);
							uni.getFileSystemManager().readFile({
								filePath: res.tempFiles[imgI]['path'],
								encoding: 'base64',
								success: res => {
									let base64 = 'data:image/jpeg;base64,' + res.data;
									that.resultimageList.push(base64);
								}
							})
						}
					}
				});
			},
			
			// 目的建筑下拉选择框确认事件
			structureSureEvent (val,value,id) {
				if (val) {
					this.structureDefaultIndex = [id];
					this.currentStructure =  val;
					this.currentGoalDepartment = '请选择';
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
			goalDepartmentSureEvent (val,value,id) {
			if (val) {
				this.goalDepartmentDefaultIndex = [id];
				this.currentGoalDepartment =  val;
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
						// 显示目的科室索引
						if (this.currentGoalDepartment != '请选择') {
							this.goalDepartmentDefaultIndex = [this.goalDepartmentOption.findIndex((item) => { return item.value ==  this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value']})];
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
			
			
			// 并行查询目的建筑
			parallelFunction (type) {
				this.showLoadingHint = true;
				Promise.all([this.getStructure()])
				.then((res) => {
					this.showLoadingHint = false;
					if (res && res.length > 0) {
						this.structureOption = [];
						let [item1] = res;
						if (item1) {
							// 目的建筑
							for (let i = 0, len = item1.length; i < len; i++) {
								this.structureOption.push({
									text: item1[i].structName,
									value: item1[i].id,
									id: i
								})
							};
							// 回显编辑信息
							this.echoTemporaryStorageMessage();
							if (this.currentStructure != '请选择') {
								this.getDepartmentByStructureId(this.structureOption.filter((item) => { return item['text'] == this.currentStructure})[0]['value'],false,true)
							}
						}
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
			
			// 查询目的建筑
			getStructure () {
				return new Promise((resolve,reject) => {
					queryStructure(this.proId).then((res) => {
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
						reject({message:err})
					})
				})
			},
			
			// 上传图片到服务器
			uploadFileEvent (imgI) {
				this.infoText = '图片上传中···';
				this.showLoadingHint = true;
				return new Promise((resolve, reject) => {
					uni.uploadFile({
					url: 'https://blink.blinktech.cn/nblink/patrol/oss/getSign',
					filePath: imgI,
					name: 'files',
					header: {
						'content-type': 'multipart/form-data',
						'Authorization': `${store.getters.token}`
					 },
					 success: (res) => {
						if (res.statusCode == 200) {
							if (res.data != '') {
								let temporaryData = JSON.parse(res.data);
								if (temporaryData.code == 200) {
									this.imageOnlinePathArr.push(temporaryData.data[0]);
									resolve()
								} else {
									this.showLoadingHint = false;
									this.$refs.uToast.show({
										message: temporaryData.msg,
										type: 'error',
										position: 'center'
									});
									reject()
								}
							} else {
								this.showLoadingHint = false;
								this.$refs.uToast.show({
									message: '返回数据为空',
									type: 'error',
									position: 'center'
								});
								reject()
							}	
						} else {
							this.showLoadingHint = false;
							this.$refs.uToast.show({
								message: '上传图片失败',
								type: 'error',
								position: 'center'
							});
							reject()
						}
					 },
					 fail: (err) => {
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: err.errMsg,
							type: 'error',
							duration: 5000,
							position: 'center'
						});
						reject()
					 }
					})
				})
			},
			
			// 生成事务任务编号
			generateTaskNumber (type) {
				  let index = Math.floor(Math.random() * 10);
					let startField = '';
					let endIndex = index +1 >= 10 ? `0${index+1}` : `00${index+1}`;
					let month = new Date().getMonth() + 1;
					let date = new Date().getDate();
					let seconds = new Date().getSeconds();
					if (month >= 1 && month <= 9) {
							month = "0" + month;
					};
					if (date >= 0 && date <= 9) {
							date = "0" + date;
					};
					if (type == '即时') {
							startField = 'JS'
					} else if (type == '专项') {
							startField = 'ZX'
					} else if (type == '巡检') {
							startField = 'XJ'
					} else {
							startField = 'TMJS'
					};
					return  `${startField}${month}${date}${seconds}${endIndex}`
			},
			
			
			// 确认事件(编辑事务任务)
			async sureEvent () {
			// 具体事项不能为空
			if (this.specificAffairDescribe == '') {
				this.$refs.uToast.show({
					message: '具体事项不能为空',
					position: 'center'
				});
				return
			};
			// 编辑事务管理任务
			let temporaryMessage = {
				id: this.affairTaskMessage.id,
				number: this.affairTaskMessage['number'],
				priority: this.priorityRadioValue,
				proId: this.proId,
				structureId: this.currentStructure == '请选择' ? '' : this.structureOption.filter((item) => { return item['text'] == this.currentStructure})[0]['value'], // 建筑id
				structureName: this.currentStructure == '请选择' ? '' : this.currentStructure, // 建筑名称
				createId: this.workerId,
				createName: this.userName,
				details: this.specificAffairDescribe, //具体事项
				images: [],
				source: '手动创建',
				system: 6,
				manager: this.currentParticipant, //负责人
				departmentName: this.currentGoalDepartment == '请选择' ? '' : this.currentGoalDepartment, //目的科室名称
				departmentId: this.currentGoalDepartment == '请选择' ? '' : this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'] // 目的科室id
			};
			// 上传图片到服务器
			 let alreadyUploadOnlineImgArr = this.resultimageList.filter((item) => { return item.indexOf('https://') != -1} );
			 let needUploadOnlineImgArr = this.fileList.filter((item) => { return item.indexOf('https://') == -1} );
			   if (needUploadOnlineImgArr.length > 0) {
			     for (let imgI of needUploadOnlineImgArr) {
			     	await this.uploadFileEvent(imgI)
			     };
			     temporaryMessage.images = this.imageOnlinePathArr.concat(alreadyUploadOnlineImgArr);
			  } else {
			   temporaryMessage.images = alreadyUploadOnlineImgArr;
			};
			this.postEditAffairTask(temporaryMessage)
			},
			
			// 编辑事务管理任务
			postEditAffairTask (data) {
			this.infoText = '编辑中···';	
			this.showLoadingHint = true;
			editAffairTask(data).then((res) => {
				this.showLoadingHint = false;
				if (res && res.data.code == 200) {
					this.$refs.uToast.show({
						message: '任务编辑成功',
						type: 'success',
						position: 'center'
					});
					this.storeCurrentIndex(3);
					this.backTo();
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
				height: 100%;
				overflow: scroll;
				width: 100%;
				.message-one {
					width: 100%;
					padding: 10px 6px;
					box-sizing: border-box;
					background: #fff;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 14px;
					margin-top: 6px;
					.message-one-left {
						width: 22%;
						padding-left: 6px;
						box-sizing: border-box;
						color: #101010
					};
					.message-one-right {
						flex: 1;
						/deep/ .u-radio-group {
							display: flex;
							justify-content: space-between;
							.u-radio {
								flex: 1 0 auto !important;
								justify-content: flex-end;
								.u-radio__label {
									margin-right: 9px;
								};
								&:first-child {
									justify-content: flex-start !important;
								};
								&:nth-child(2) {
									justify-content: center !important;
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
						width: 22%;
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
					padding: 8px 2px;
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
					};
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
				.current-participant-box {
					padding: 10px 6px;
					box-sizing: border-box;
					.select-box-left {
						padding-right: 0 !important;
						padding-left: 6px !important;
						width: 22% !important;
					};
					.select-box-right {
						flex: 1;
						::v-deep .u-input {
							background: #f9f9f9;
							padding: 6px 4px !important;
							box-sizing: border-box;
						}
					}
				}
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
							padding-left: 6px!important;
							width: 22%!important;
							box-sizing: border-box;
							vertical-align: top;
							height: 100px;
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
								.icon-box {
									position: absolute;
									bottom: 0;
									right: 0;
									display: flex;
									width: 100%;
									padding: 2px 0;
									box-sizing: border-box;
									justify-content: center;
									align-items: center;
									background: #616161;
									/deep/ .van-icon {}  
								};
								image {
									width: 100%;
									height: 100%
								}
							}
						}
					}
				}
			}
		};
		.btn-box {
			width: 90%;
			margin: 0 auto;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			>text {
				width: 35%;
				display: inline-block;
				height: 45px;
				font-size: 14px;
				line-height: 45px;
				background: #fff;
				text-align: center;
				border-radius: 4px;
				&:nth-child(1) {
					color: #fff;
					background: #2B98FE;
					box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
					margin-right: 30px
				};
				&:nth-child(2) {
					color: #2B98FE;
					border: 1px solid #2B98FE;
					box-sizing: border-box;
					box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
				}
			}
		}	
	}
</style>
