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
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="修改订单" @backClick="backTo">
			</nav-bar> 
		</view>
		<!-- 优先级picker -->
		<view class="priority-picker">
			<u-picker :closeOnClickOverlay="true" :show="priorityPickerShow" :defaultIndex="priorityPickerDefaultIndex" :columns="priorityOption" keyName="text" @close="priorityPickerCancel" @cancel="priorityPickerCancel" @confirm="priorityPickerConfirm"></u-picker>
		</view>
		<!-- 来源picker -->
		<view class="source-picker">
			<u-picker :closeOnClickOverlay="true" :defaultIndex="sourcePickerDefaultIndex" :show="sourcePickerShow" :columns="sourceOption" keyName="text" @close="sourcePickerCancel" @cancel="sourcePickerCancel" @confirm="sourcePickerConfirm"></u-picker>
		</view>
		<!-- 保洁员picker -->
		<view class="worker-picker">
			<u-picker :closeOnClickOverlay="true" :show="workerPickerShow" :defaultIndex="workerPickerDefaultIndex" :columns="workerOption" keyName="text" @close="workerPickerCancel" @cancel="workerPickerCancel" @confirm="workerPickerConfirm"></u-picker>
		</view>
		<view class="content">
			<view class="result-picture">
				<view>
					图片
				</view>
				<view class="image-list">
					<view v-for="(item, index) in resultimageList" :key="index">
						<image :src="item" />
						<view class="icon-box"  @click="issueDelete(index)">
								<u-icon name="trash" color="#d70000"></u-icon>
						</view>    
					</view>
					<view @click="getImg">
						<u-icon name="plus" size="30" color="#101010"></u-icon>
					</view>
				</view>
			</view>
			<view class="category-box category-no-select-box">
				<view class="category-title">
					<text>*</text>
					<text>类别</text>
				</view>
				<view class="select-box">
					即时保洁任务
				</view>
			</view>
			<view class="category-box">
				<view class="category-title">
						<text>*</text>
						<text>优先级</text>
				</view>
				<view class="select-box" @click="priorityPickerShow = true">
					<text>{{ priorityText }}</text>
					<u-icon :name="priorityPickerShow ?  'arrow-up' : 'arrow-down' " color="#174E97"></u-icon>
				</view>
			</view>
			<view class="category-box">
				<view class="category-title">
						<text>*</text>
						<text>来源</text>
				</view>
				<view class="select-box" @click="sourcePickerShow = true">
					<text>{{ sourceText }}</text>
					<u-icon :name="sourcePickerShow ?  'arrow-up' : 'arrow-down' " color="#174E97"></u-icon>
				</view>
			</view>
			<view class="category-box location-box">
				<view class="category-title">
						<text>*</text>
						<text>位置</text>
				</view>
				<view class="select-box" @click="locationEvent">
					<text>{{ locationValue }}</text>
					<u-icon name="arrow-right" color="#174E97" size="20"></u-icon>
				</view>
			</view>
			<view class="category-box">
				<view class="category-title">
						<text>*</text>
						<text>保洁员</text>
				</view>
				<view class="select-box" @click="workerPickerShow = true">
					<text>{{ workerText }}</text>
					<u-icon :name="workerPickerShow ?  'arrow-up' : 'arrow-down' " color="#174E97"></u-icon>
				</view>
			</view>
			<view class="category-box person-number-box category-box-other">
				<view class="category-title">
						<text>预计人数</text>
				</view>
				<view class="person-input-box">
						<u-input v-model="personNumberValue" type="number" border="none" />
						<text>人</text>
				</view>
			</view>
			<view class="category-box person-number-box duration-box category-box-other">
				<view class="category-title">
						<text>预计耗时</text>
				</view>
				<view class="person-input-box">
						<u-input v-model="durationValue" type="number" border="none" />
						<text>分钟</text>
				</view>
			</view>
			<view class="category-box category-box-other">
				<view class="category-title">
						<text>违反标准</text>
				</view>
				<UFieldCheckbox
					placeholder="请选择违反标准"
					:selectValue="selectValue"
					:columns="standardColumns"
					label-width="100"
					:option="{label:'text',value:'value'}"
					@showPopu="standardOptionOpenEvent"
					@confirm="standardConfirm"
			/>
			</view>
			<view class="enter-remark">
				<view>
					问题描述
				</view>
				<view class="remark-box">
					<u--textarea v-model="enterRemark" placeholder="请输入问题简要概述"></u--textarea>
				</view>
			</view>
		</view>
		<view class="btn-box">
			<text class="operate-one" @click="submitEvent">确认</text>
			<text class="operate-two" @click="cancelEvent">取消</text>
		</view>
		<u-modal :show="deleteInfoDialogShow" title="确定删除此图片?"
			:closeOnClickOverlay="true" @close="deleteInfoDialogShow = false"
			confirmColor="#218FFF" showCancelButton
			@confirm="sureDeleteEvent"
			@cancel="deleteInfoDialogShow=false"
			>
		</u-modal>
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
	import { editForthwithCleanTask, getViolateStandardMessage,attendanceWorkerList, getAliyunSign } from '@/api/environment.js'
	import axios from 'axios-miniprogram'
	import UFieldCheckbox from "@/components/uFieldCheckbox/uFieldCheckbox";
	import navBar from "@/components/zhouWei-navBar"
	import store from '@/store'
	export default {
		components: {
			navBar,
			UFieldCheckbox
		},
		data() {
			return {
				showLoadingHint: false,
				isShowNoData: false,
				infoText: '加载中···',
				
				photoBox: false,
				imageIndex: '',
				isExpire: false,
				deleteInfoDialogShow: false,
				showDateBox: false,
				overlayShow: false,
				loadingShow: false,
				loadText: '创建中',
				enterRemark: "",
				personNumberValue: '',
				durationValue: '',
				categoryValue: 0,
				minDate: new Date(2010, 0, 1),
				maxDate: new Date(2050, 10, 1),
				currentDate: new Date(),
				selectStandard: [],
				selectValue: [],
				standardColumns: [],
				categoryOption: [
					{
							text: '请选择类别',
							value: 0
							
					},
					{
							text: '即时保洁任务',
							value: 1
							
					}
				],
				
			 workerPickerShow: false,
			 workerValue: 0,
			 workerText: '请选择保洁员',
			 workerPickerDefaultIndex: [0],
			 workerOption: [[]],
			 
			 sourcePickerShow: false,
			 sourceValue: 0,
			 sourcePickerDefaultIndex: [0],
			 sourceText: '请选择来源',
			 sourceOption: [[
					{
							text: '主管反馈',
							value: 1
							
					},
					{
							text: '保洁员反馈',
							value: 2
							
					},
					{
							text: '医护反馈',
							value: 3
							
					},
					{
							text: '病患反馈',
							value: 4
							
					}
				]],
				locationValue: '请选择位置',
				
				priorityPickerShow: false,
				priorityValue: 1,
				priorityPickerDefaultIndex: [0],
				priorityText: '正常',
				priorityOption: [[
					{
						text: '正常',
						value: 1
					},
					{
						text: '重要',
						value: 2
					},
					{
						text: '紧急',
						value: 3
					},
					{
						text: '紧急重要',
						value: 4
					}
				]],
				resultimageList: [],
				imageOnlinePathArr: [],
				fileList: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				"timeMessage",
				"ossMessage",
				"locationMessage",
				'environmentTaskMessage'
			]),
			userName() {
			},
			proId() {
				return this.userInfo.extendData.proId
			}
		},
		
		onShow () {
			const pages = getCurrentPages(); //获取当前页面栈的实例数组
			const prevPage = pages[pages.length - 2]; //获取前一个页面实例
			if (prevPage.route != 'workerOrderMessagePackage/pages/workerOrderMessage/index/index' && prevPage.route != 'workerOrderMessagePackage/pages/workerOrderMessage/environmentWorkerOrderMessage/environmentWorkerOrderMessage') {
				this.echoLoactionMessage();
			}
		},
		
		onLoad () {
			const pages = getCurrentPages(); //获取当前页面栈的实例数组
			const prevPage = pages[pages.length - 2]; //获取前一个页面实例
			this.getWorkerList();
			if (prevPage) {
				if (prevPage.route == 'workerOrderMessagePackage/pages/workerOrderMessage/index/index' || prevPage.route == 'workerOrderMessagePackage/pages/workerOrderMessage/environmentWorkerOrderMessage/environmentWorkerOrderMessage') {
					 this.echoTemporaryStorageMessage();
					 this.storeEchoLocationMessage();
					 this.echoLoactionMessage();
				}
			}
		},
		methods: {
			...mapMutations([
				"changeTimeMessage",
				"changeOssMessage",
				"storeLocationMessage",
				"storeCurrentIndex"
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 回显环境任务编辑信息编辑的信息
			echoTemporaryStorageMessage (flag) {
				try {
					let casuallyTemporaryStorageCreateEnvironmentTaskMessage = this.environmentTaskMessage;
					this.priorityValue = casuallyTemporaryStorageCreateEnvironmentTaskMessage['priority'].toString();
					this.priorityText = this.getPriorityText(casuallyTemporaryStorageCreateEnvironmentTaskMessage['priority']);
					this.priorityPickerDefaultIndex = [this.priorityOption[0].findIndex((item) => { return item.text == this.priorityText })];
					this.enterRemark = casuallyTemporaryStorageCreateEnvironmentTaskMessage['taskRemark'];
					this.personNumberValue = casuallyTemporaryStorageCreateEnvironmentTaskMessage['planPersons'];
					this.durationValue = casuallyTemporaryStorageCreateEnvironmentTaskMessage['planUseTime'];
					this.resultimageList = this.getResultimageList(casuallyTemporaryStorageCreateEnvironmentTaskMessage['images']);
					this.locationValue = `${casuallyTemporaryStorageCreateEnvironmentTaskMessage.structureName}${casuallyTemporaryStorageCreateEnvironmentTaskMessage.depName}${casuallyTemporaryStorageCreateEnvironmentTaskMessage.areaImmediateName}${this.extractSpaceMessage(casuallyTemporaryStorageCreateEnvironmentTaskMessage.spaces)}`;
					this.fileList = this.getResultimageList(casuallyTemporaryStorageCreateEnvironmentTaskMessage['images']);
					this.workerValue = casuallyTemporaryStorageCreateEnvironmentTaskMessage['workerId'] == null ? 0 : casuallyTemporaryStorageCreateEnvironmentTaskMessage['workerId'];
					this.workerText =  casuallyTemporaryStorageCreateEnvironmentTaskMessage['workerName'] == '请选择保洁员' ? '' : casuallyTemporaryStorageCreateEnvironmentTaskMessage['workerName'];
					this.workerPickerDefaultIndex = [this.workerOption[0].findIndex((item) => { return item.text == this.workerText })];
					this.sourceValue = this.getSourceValueEvent(casuallyTemporaryStorageCreateEnvironmentTaskMessage['source']);
					this.sourceText = casuallyTemporaryStorageCreateEnvironmentTaskMessage['source'];
					this.sourcePickerDefaultIndex = [this.sourceOption[0].findIndex((item) => { return item.text == this.sourceText })];
					this.selectValue = '';
					this.selectStandard = casuallyTemporaryStorageCreateEnvironmentTaskMessage['standards'];
					// 如果当前订单选择了违反标准
					if (this.selectStandard.length > 0) {
						this.getViolateStandardMessageEvent(casuallyTemporaryStorageCreateEnvironmentTaskMessage['spaces'][0]['id'],true);
					}
				} catch(err) {
					this.$refs.uToast.show({
						message: `${err}`,
						type: 'error'
					})
				}	
			},
			
			// 回显的位置信息存入store
			storeEchoLocationMessage () {
				let selectArchitectureValue = [];
				selectArchitectureValue.push({
					id: this.environmentTaskMessage['structureId'],
					structName: this.environmentTaskMessage['structureName']
				});
				let selectDepartmentValue = [];
				selectDepartmentValue.push({
					id: this.environmentTaskMessage['depId'],
					departmentName: this.environmentTaskMessage['depName']
				});
				let selectgoalAreaValue = [];
				selectgoalAreaValue.push({
					id: this.environmentTaskMessage['areaImmediateId'],
					itemName: this.environmentTaskMessage['areaImmediateName']
				});
				let selectFunctionAreaValue = [];
				selectFunctionAreaValue.push({
					id: this.environmentTaskMessage['spaces'][0]['id'],
					name: this.environmentTaskMessage['spaces'][0]['name']
				});
				let temporaryMessage = [].concat(selectArchitectureValue,selectDepartmentValue,selectgoalAreaValue,selectFunctionAreaValue);
				this.storeLocationMessage(temporaryMessage);
			},
			
			// 回显位置信息
			echoLoactionMessage () {
			  if (this.locationMessage.length == 4) {
			    this.locationValue = `${this.locationMessage[0]['structName']}-${this.locationMessage[1]['departmentName']}-${this.locationMessage[2]['itemName']}-${this.locationMessage[3]['name']}`
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
			
			// 提取优先级text事件
			getPriorityText (value) {
				let temporaryPriorityArr = this.priorityOption[0].filter((item)=>{ return item.value == value });
				if (temporaryPriorityArr.length > 0) {
					return temporaryPriorityArr[0]['text']
				}
			},
			
			// 提取来源value事件
			getSourceValueEvent (text) {
				let temporarySourceValueArr = this.sourceOption[0].filter((item)=>{ return item.text == text });
				if (temporarySourceValueArr.length > 0) {
					return temporarySourceValueArr[0]['value']
				}
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
			
			// 优先级选择器确定事件
			priorityPickerConfirm (e) {
				this.priorityValue = e.value[0]['value'];
				this.priorityText = e.value[0]['text'];
				this.priorityPickerShow = false
			},
			
			// 优先级选择器值变化事件
			priorityPickerChange (e) {
				this.priorityValue = e.value[0]['value'];
				this.priorityText = e.value[0]['text'];
			},
			
			// 优先级选择器值取消事件
			priorityPickerCancel (e) {
				this.priorityPickerShow = false
			},
			
			
			// 来源选择器确定事件
			sourcePickerConfirm (e) {
				this.sourceValue = e.value[0]['value'];
				this.sourceText = e.value[0]['text'];
				this.sourcePickerShow = false
			},
			
			// 来源选择器值变化事件
			sourcePickerChange (e) {
				this.sourceValue = e.value[0]['value'];
				this.sourceText = e.value[0]['text'];
			},
			
			// 来源选择器值取消事件
			sourcePickerCancel (e) {
				this.sourcePickerShow = false
			},
			
			// 保洁员选择器确定事件
			workerPickerConfirm (e) {
				this.workerPickerShow = false;
				if (e.value[0] == undefined) { return };
				this.workerValue = e.value[0]['value'];
				this.workerText = e.value[0]['text'];
			},
			
			// 保洁员选择器值变化事件
			workerPickerChange (e) {
				this.workerValue = e.value[0]['value'];
				this.workerText = e.value[0]['text'];
			},
			
			// 保洁员选择器值取消事件
			workerPickerCancel (e) {
				this.workerPickerShow = false
			},
			
			 // 违反标准下拉框确定事件
				standardConfirm (data1, data2) {
					this.selectStandard = [];
					this.selectValue = data1;
					if (data2.length > 0) {
						for (let item of data2) {
							this.selectStandard.push(item.text)
						}
					}
				},
				
				// 根据区域查询违反标准列表
				getViolateStandardMessageEvent (id,flag) {
					this.showLoadingHint = true;
					getViolateStandardMessage({id}).then((res) => {
					  this.showLoadingHint = false;
					  if (res && res.data.code == 200) {
					    this.standardColumns = [];
					    if (res.data.data.length > 0) {
					      for ( let i =0, len = res.data.data.length; i< len ; i++) {
					        this.standardColumns.push({
					          text: res.data.data[i],
					          value: i+1,
										checked: false
					        })
					      };
								if(flag) {
									let temporarySelectStandardList = [];
									let temporarySelectStandardIdList = [];
									for (let item of this.selectStandard) {
										temporarySelectStandardList = temporarySelectStandardList.concat(this.standardColumns.filter((innerItem) => { return innerItem['text'] == item}));
									};
									for (let item of temporarySelectStandardList) {
										temporarySelectStandardIdList.push(item.value);
									};
									this.selectValue = temporarySelectStandardIdList;
								}
					    }
					  } else {
					    this.$refs.uToast.show({
					    	message: res.data.msg,
					    	type: 'error',
					    })
					  }
					}).
					catch((err) => {
					 this.showLoadingHint = false;
					  this.$refs.uToast.show({
					  	message: `${err}`,
					  	type: 'error'
					  })
					})
				},
			
			    // 违反标准下拉框打开事件
			    standardOptionOpenEvent () {
			      if (this.locationMessage.length == 4) {
							this.getViolateStandardMessageEvent(this.locationMessage[3]['id'],false)
			      }
			    },
			
			    // 位置点击事件
			    locationEvent () {
						uni.navigateTo({
							url: '/createWorkerOrderPackage/pages/createWorkerOrder/createEnvironmentWorkerOrder/choosePosition'
						})
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
			
			     // 查询保洁员列表
			    getWorkerList () {
						this.showLoadingHint = true;
			      attendanceWorkerList(this.userInfo.proId).then((res) => {
							this.showLoadingHint = false;
			          if (res && res.data.code == 200) {
			            if (res.data.data.length > 0) {
			              for (let item of res.data.data) {
			                if (this.workerOption[0].filter((innerItem) => {return innerItem.value == item.workerId}).length == 0) {
			                  this.workerOption[0].push({
			                    text: item.workerName,
			                    value: item.workerId
			                  })
			                }  
			              }
			            }
			          } else {
			            this.$refs.uToast.show({
			            	message: res.data.msg,
			            	type: 'error',
			            })
			          }
			        }).
			        catch((err) => {
								this.showLoadingHint = false;
			          this.$refs.uToast.show({
			          	message: `${err}`,
			          	type: 'error'
			          })
			        })
			    },
					
					// 选择图片方法
					getImg() {
						if (this.resultimageList.length == 9) {
							this.$refs.uToast.show({
								message: "至多只能上传9张图片",
								position: 'center'
							});
							return
						};
						let that = this;
						uni.chooseImage({
							count: 9,
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
										filePath: res.tempFilePaths[imgI],
										encoding: 'base64',
										success: res => {
											let base64 = 'data:image/jpeg;base64,' + res.data;
											that.resultimageList.push(base64);
										}
									})
								}
							}
						})
					},
					
					// 上传图片到服务器
					uploadFileEvent (imgI) {
						this.infoText = '图片上传中···';
						this.showLoadingHint = true;
						return new Promise((resolve, reject) => {
							uni.uploadFile({
							url: 'https://blink.blinktech.cn/clean/oss/upload ',
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
			
			    // 任务编辑事件
			    async submitEvent() {
			      // if (this.categoryOption.filter((item) => { return item.value == this.categoryValue })[0]['text'] == '请选择类别') {
			      //   this.$toast('请选择类别');
			      //   return
			      // };
			      if (this.sourceText == '请选择来源') {
							this.$refs.uToast.show({
								message: '请选择来源',
							});
			        return
			      };
			      if (this.locationMessage.length != 4) {
			        this.$refs.uToast.show({
			        		message: '请选择位置',
			        });
			        return
			      };
			       if (this.workerText == '请选择保洁员') {
			        this.$refs.uToast.show({
			        		message: '请选择保洁员',
			        });
			      };
			      let paramsData = {
							id: this.environmentTaskMessage['id'], // 任务id
			        managerId: this.userInfo.id, // 保洁主管id，当前登陆人员id
			        managerName: this.userInfo.name,// 保洁主管姓名，当前登陆人员姓名
			        assignId: this.userInfo.id, // 任务分配人员id，当前登陆人员id
			        assignName: this.userInfo.name,// 任务分配人员姓名，当前登陆人员姓名
			        workerId: this.workerValue,//保洁员id
			        priority: this.priorityValue, //优先级
			        workerName: this.workerText,//保洁员姓名
			        path: [], // 上传的问题图片，集合,
			        taskType: 0,// 任务类型，即时保洁为 0
			        source: this.sourceText, // 任务来源
			        structureId: this.locationMessage[0]['id'], // 建筑id
			        structureName: this.locationMessage[0]['structName'], // 建筑名称
			        depId: this.locationMessage[1]['id'], // 科室id
			        depName: this.locationMessage[1]['departmentName'], // 科室名称
			        areaImmediateId: this.locationMessage[2]['id'], // 目的区域id
			        areaImmediateName: this.locationMessage[2]['itemName'], // 目的区域名称
			        spaces: [],
			        standards: this.selectStandard, // 检查标准，违反标准，数组
			        // planFinishTime: this.getNowFormatDate(this.currentDate), // 任务预计完成时间
			        planPersons: this.personNumberValue, // 任务预计所需人数
			        planUseTime: this.durationValue, // 任务预计用时，单位为分钟
			        taskRemark: this.enterRemark, // 任务备注信息
			        proId: this.userInfo.proId, // 所属项目id
			        proName: this.userInfo.proName // 所属项目名称
			      };
					// 上传图片到服务器
					if (this.resultimageList.length > 0) {
						 let alreadyUploadOnlineImgArr = this.resultimageList.filter((item) => { return item.indexOf('https://') != -1} );
						 let needUploadOnlineImgArr = this.fileList.filter((item) => { return item.indexOf('https://') == -1} );
						 if (needUploadOnlineImgArr.length > 0) {
							 for (let imgI of needUploadOnlineImgArr) {
								await this.uploadFileEvent(imgI)
							 };
							 paramsData.path = this.imageOnlinePathArr.concat(alreadyUploadOnlineImgArr);
						} else {
						 paramsData.path = alreadyUploadOnlineImgArr;
						};
					} else {
						paramsData.path = [];
					};
				  paramsData.spaces.push({
						id: this.locationMessage[3]['id'],
						name: this.locationMessage[3]['name']
				  });
				  this.editForthwithCleanTaskEvent(paramsData); 
			    },
			
			    // 编辑环境任务
			    editForthwithCleanTaskEvent (data) {
					 this.infoText = '编辑中···';
			     this.showLoadingHint = true;
			      editForthwithCleanTask(data).then((res) => {
			         this.showLoadingHint = false;
			          this.imageOnlinePathArr = [];
								this.fileList = [];
								if (res && res.data.code == 200) {
							  this.$refs.uToast.show({
										message: '任务编辑成功',
										position: 'center',
										type: 'success'
							   });
			            this.resultimageList = [];
			            this.storeLocationMessage([]);
			            this.selectStandard = [];
			            this.enterRemark = '';
			            this.categoryValue = 0;
			            this.sourceValue = 0;
			            this.workerValue = 0;
			            this.priorityValue = 1;
			            this.currentDate = new Date();
			            this.locationValue = '';
			            this.selectValue = [];
			            this.personNumberValue = '';
			            this.durationValue = '';
									this.storeCurrentIndex(1);
									this.backTo();
								} else {
									this.$refs.uToast.show({
										message: res.data.msg,
										type: 'error',
									})
								}
							}).
							catch((err) => {
								this.$refs.uToast.show({
									message: `${err}`,
									type: 'error'
								});
			          this.imageOnlinePathArr = [];
								this.fileList = [];
								this.showLoadingHint = false;
						})
			    },
					
					// 获取阿里云签名接口
						getSign (filePath = '') {
							return new Promise((resolve, reject) => {
								getAliyunSign().then((res) => {
									if (res && res.data.code == 200) {
										// 存储签名信息
										this.changeOssMessage(res.data.data);
										let temporaryTimeInfo = {};
										temporaryTimeInfo['expire'] = Number(res.data.data.expire);
										// 存储过期时间信息
										this.changeTimeMessage(temporaryTimeInfo);
										if (this.isExpire) {
											this.uploadImageToOss(filePath)
										};
										this.isExpire = false;
										resolve()
									} else {
										this.$refs.uToast.show({
											message: res.data.data.msg,
											type: 'error',
										});
										reject()
									}
								})
								.catch((err) => {
									this.$refs.uToast.show({
										message: `${err}`,
										type: 'error'
									});
									reject()
								})
							})	
						},
						
						// 上传图片到阿里云服务器
						uploadImageToOss (filePath) {
							return new Promise((resolve, reject) => {
								// OSS地址
								const aliyunServerURL = this.ossMessage.host;
								// 存储路径(后台固定位置+随即数+文件格式)
								const aliyunFileKey = this.ossMessage.dir + new Date().getTime() + Math.floor(Math.random() * 100) + filePath.name;
								// 临时AccessKeyID0
								const OSSAccessKeyId = this.ossMessage.accessId;
								// 加密策略
								const policy = this.ossMessage.policy;
								// 签名
								const signature = this.ossMessage.signature;
								let formData = new FormData();
								formData.append('key',aliyunFileKey);
								formData.append('policy',policy);
								formData.append('OSSAccessKeyId',OSSAccessKeyId);
								formData.append('success_action_status','200');
								formData.append('Signature',signature);
								formData.append('file',filePath);
								axios({
									url: aliyunServerURL,
									method: 'post',
									data: formData,
									headers: {'Content-Type': 'multipart/form-data'}
								}).then((res) => {
									this.imageOnlinePathArr.push(`${aliyunServerURL}/${aliyunFileKey}`);
									resolve();
								})
								.catch((err) => {
									reject()
								})
								})
						},
						
						// 结果照片删除
						issueDelete(index) {
							this.deleteInfoDialogShow = true;
							this.imageIndex = index
						},
				
				
						// 确定删除提示框确定事件
						sureDeleteEvent () {
							this.resultimageList.splice(this.imageIndex, 1);
							this.fileList.splice(this.imageIndex, 1);
							this.deleteInfoDialogShow = false;
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
		 .content {
		    flex: 1;
		    display: flex;
		    background: #fff;
		    flex-direction: column;
		    padding: 6px 0;
		    overflow: auto;
		    .category-box {
		      padding: 0 8px;
		      margin-bottom: 6px;
		      height: 40px;
		      box-sizing: border-box;
		      display: flex;
		      background: #fff;
		      justify-content: space-between;
		      align-items: center;
		      .category-title {
		        font-size: 14px;
		        color: #101010;
		        >text {
		            &:first-child {
		                color: red
		            }
		        }
		
		      };
		      .select-box {
		        flex: 1;
		        width: 0;
						display: flex;
						align-items: center;
						justify-content: flex-end;
		        >text {
							display: inline-block;
							padding-left: 10px;
							flex: 1;
							text-align: right;
							color: #174E97 !important;
							font-size: 14px !important;
							margin-right: 4px;
							@include no-wrap();
						}
		      };
		      /deep/ .dh-field {
		        flex: 1;
		        padding-left: 6px !important;
		        padding-right: 0 !important;
		        .u-input__control {
		          color: #174E97 !important
		        };
		        .u-hairline--bottom::after {
		          display: none !important
		        };
		        input::placeholder {
		          color: #174E97 !important;
		        };
		        .u-cell__right-icon {
		          font-size: 21px !important;
		          color: #174E97 !important
		        };
		        .u-picker__cancel {
		          color: #a3a3a3 !important
		        }
		      }
		    };
		    .category-box-other {
		      .category-title {
		        font-size: 14px;
		        color: #101010 !important;
		         >text {
		            &:first-child {
		              margin-left: 10px;
		              color: #101010
		            }
		        }
		      }
		    };
		    .category-no-select-box {
		      .select-box {
		        text-align: right;
		        color: #174E97 !important;
		        font-size: 14px !important
		      }
		    };
		    .location-box {
		      .select-box {
		        text-align: right;
		        padding-left: 4px;
		        box-sizing: border-box;
		        display: flex;
		        align-items: center;
		        >text {
		          font-size: 14px;
		          &:nth-child(1) {
		            flex: 1;
		            @include no-wrap();
		            color: #174E97;
		            vertical-align: middle
		          }
		        };
		        /deep/ .van-icon {
		          vertical-align: middle
		        }
		      }
		    };
		    .completeDate-box {
		        .select-box {
		          text-align: right;
		            >text {
		              font-size: 14px;
		              vertical-align: middle;
		                color: #174E97
		            };
		            /deep/ .u-icon {
		              vertical-align: middle
		            }
		        }
		    };
		    .person-number-box {
					.person-input-box {
							flex: 1;
							display: flex;
							justify-content: flex-end;
							align-items: center;
							/deep/ .u-input {
								width: 30%;
								margin-right: 4px;
								flex: none !important;
								.u-input__content {
									padding: 0 4px;
									box-sizing: border-box;
									font-size: 14px !important;
									border: 1px solid #cacaca;
								}
							};
							>text {
								color:#101010 !important;
								font-size: 14px
							}
					}
		    };
		    .duration-box {
		        /deep/ .u-input {
		            width: 26% !important
		        }
		    };
		    .result-picture {
		      padding: 14px 8px;
		      margin-bottom: 6px;
		      box-sizing: border-box;
		      display: flex;
		      background: #fff;
		      justify-content: space-between;
		      > view {
		        font-size: 14px;
		        color: #a1a0a0;
		        &:first-child {
		        }
		        &:nth-child(2) {
		          margin-left: 8px;
		          display: flex;
		          flex-wrap: wrap;
		          flex: 1;
		          > view {
		            width: 31%;
		            height: 100px;
		            vertical-align: top;
		            margin-right: 2%;
		            margin-top: 2%;
		            position: relative;
		            &:nth-child(1) {
		              margin-top: 0;
		            }
		            &:nth-child(2) {
		              margin-top: 0;
		            }
		            &:nth-child(3) {
		              margin-top: 0;
		            }
		            &:nth-child(3n + 3) {
		              margin-right: 0;
		            }
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
		              height: 100%;
		            }
		            &:last-child {
		             display: flex;
		             justify-content: center;
		             align-items: center;
		              background: #f2f2f2;
		              /deep/ .u-icon {
		                position: relative;
		                top: 0;
		                right: 0;
		              }
		            }
		          }
		        }
		      }
		    }
		    .enter-remark {
		      padding: 14px 8px;
		      margin-bottom: 6px;
		      box-sizing: border-box;
		      display: flex;
		      justify-content: space-between;
		      > view {
		        font-size: 14px;
		        color: #a1a0a0;
		        &:first-child {
		        }
		        &:nth-child(2) {
		          margin-left: 8px;
		          flex: 1;
		          /deep/ .u-cell {
		            padding: 4px !important;
		            border: 1px solid #cacaca;
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
