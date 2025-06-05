<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar :home="false" backState='3000' fontColor="#FFF" bgColor="none" title="修改订单" @backClick="backTo">
			</nav-bar> 
		</view>
		<view class="creat-box template-one" :class="{'creatStyle':isShowModal}" v-if="templateType === 'template_one'">
			<view class="creat-priority priority-box-one">
				<view class="creat-priority-title">优先级</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="priorityValue" @change="radioGroupChange">
						<u-radio name="1" activeColor="#8af08a" labelColor="#8af08a" label="正常"></u-radio>
						<u-radio name="2" activeColor="#fcd388" labelColor="#fcd388" label="重要"></u-radio>
						<u-radio name="3" activeColor="#ea7171" labelColor="#ea7171" label="紧急"></u-radio>
						<u-radio name="4" activeColor="#b62b2b" labelColor="#b62b2b" label="紧急重要"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-chooseHospital creat-chooseHospital-one">
				<view class="creat-chooseHospital-title">科室选择</view>
				<view class="creat-chooseHospital-content creat-chooseHospital-content-two">
					<ld-select :list="hospitalList"
						@ldShow="ldSelectShow"
						@ldHide="ldSelectHide"
						label-key="value" value-key="id"
						clearable
						placeholder="请选择"
						color="#333"
						selectColor="#43c3f3"
						bgColor="#f9f9f9"
						v-model="hospitalListValue"
						@change="listChangeEvent">
					</ld-select>
				  <!-- <xfl-select 
					  :list="hospitalList"
					  :clearable="false"
					  :showItemNum="5" 
					  :isCanInput="true"
					  :showList="controlListShow"
					  :style_Container="'height: 50px; font-size: 16px;'"
					  :initValue="depName"
					  @change="listChangeEvent"
					  @input="inputEvent"
					  @visible-change="visibleChange"
				  >
				  </xfl-select> -->
				</view>
			</view>
			<view class="creat-transport-type">
				<view class="creat-transport-type-title">
					<text class="creat-transport-type-title-name">运送类型</text>
				</view>
				<view class="creat-transport-type-content">
					<view class="creat-transport-type-content-list" v-for="(item,index) in transportList" :class="{'transTypeListStyle': typeIndex === index}" @click="typeEvent(item,index)" :key="index">{{item.text}}</view>
				</view>
			</view>
			<view class="creat-form">
				<view class="creat-form-top">
					<view class="creat-form-field">
						<text>床号</text>
						<u-input
							:value="bedNumber"
							 border="bottom"
							placeholder="请输入床号"
						>
						</u-input>
					</view>
					<view class="creat-form-field">
						<text>姓名</text>
						<u-input
							:value="patientName"
							 border="bottom"
							placeholder="请输入姓名"
						>
						</u-input>
					</view>
				</view>
				<view class="creat-form-top creat-form-bottom">
					<view class="creat-form-field">
						<text>住院号</text>
						<u-input
							border="bottom"
							:value="patientNumber"
							placeholder="请输入住院号"
						>
						</u-input>
					</view>
					<view class="creat-form-field">
						<text>运送数量</text>
						<u-input
							:value="actualData"
							 border="bottom"
							placeholder="请输入运送数量"
							type="number"
						>
						</u-input>
					</view>
				</view>
			</view>
			<view class="field-four">
				<view class="contact-isolation-box">
					<view>接触隔离</view>
					<view>
						<u-radio-group v-model="isContactisolationValue" activeColor="#3B9DF9">
							<u-radio name="1" label="是"></u-radio>
							<u-radio name="0" label="否"></u-radio>
						</u-radio-group>
					</view>
				</view>
			</view>
			<view class="tool-box">
				<view class="creat-priority-title">转运工具</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="toolValue" @change="toolGroupChange">
						<u-radio
							@change="toolChange"
							activeColor="#333"
							shape="circle"
							v-for="(item, index) in toolList" :key="index"
							:name="item.value"
						>
							{{item.text}}
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-priority creat-is-back">
				<view class="creat-priority-title">运送员是否返回</view>
				<view class="transport-isBack">
					<u-radio-group v-model="isBackValue" @change="isBackGroupChange">
						<u-radio name="0" activeColor="#2c9af1" label="否"></u-radio>
						<u-radio name="1" activeColor="#2c9af1" label="是"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="task-describe task-describe-one">
				<text>任务描述</text>
				<u--textarea v-model="taskDescribe" placeholder="请输入任务描述" height="120" :autoHeight="true" border="none"></u--textarea>
			</view>
		</view>
		<view class="creat-box template-two" :class="{'creatStyle':isShowModal}" v-else-if="templateType === 'template_two'">
			<view class="creat-priority priority-box">
				<view class="creat-priority-title">优先级</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="priorityValue" @change="radioGroupChange">
						<u-radio name="1" activeColor="#8af08a" labelColor="#8af08a" label="正常"></u-radio>
						<u-radio name="2" activeColor="#fcd388" labelColor="#fcd388" label="重要"></u-radio>
						<u-radio name="3" activeColor="#ea7171" labelColor="#ea7171" label="紧急"></u-radio>
						<u-radio name="4" activeColor="#b62b2b" labelColor="#b62b2b" label="紧急重要"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="tool-box">
				<view class="creat-priority-title">转运工具</view>
				<view class="creat-priority-content">
					<u-radio-group v-model="toolValue" @change="toolGroupChange">
						<u-radio @change="toolChange" activeColor="#2c9af1" shape="circle" v-for="(item, index) in toolList" :key="index"
						 :name="item.value">
							{{item.text}}
						</u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-priority creat-is-back">
				<view class="creat-priority-title">运送员是否返回</view>
				<view class="transport-isBack">
					<u-radio-group v-model="isBackValue" @change="isBackGroupChange">
						<u-radio name="0" activeColor="#2c9af1" label="否"></u-radio>
						<u-radio name="1" activeColor="#2c9af1" label="是"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="creat-priority creat-is-back trans-total">
				<view class="trans-total-title">该任务运送总数</view>
				<view class="trans-total-content">
					<u-input disabled :value="taskTotal" type="text" :border="true" />
				</view>
			</view>
			<view class="creat-chooseHospital">
				<view class="creat-chooseHospital-title">科室选择</view>
				<view class="creat-chooseHospital-content-two">
					 <ld-select :list="hospitalList"
						label-key="value" value-key="id"
						@ldShow="ldSelectShow"
						@ldHide="ldSelectHide"
						clearable
						placeholder="请选择"
						color="#333"
						selectColor="#43c3f3"
						bgColor="#f9f9f9"
						v-model="hospitalListTwovalue"
						@change="hospitalListTwoSelectChange">
					</ld-select>
				</view>
			</view>
			<view class="patient-box">
				<view class="patient-box-list" v-for="(item,index) in templateTwoMessage" :key="index">
					<view class="patient-title">
						<view class="patient-name">病人{{index+1}}</view>
						<fa-icon type="edit" @click="editMessage(index)"></fa-icon>
						<fa-icon type="trash-o" v-show="index > 0" @click="deletetMessage(index)"></fa-icon>
					</view>
					<view class="creat-form">
						<view class="field-four">
							<view class="contact-isolation-box">
								<view>接触隔离:</view>
								<view>
									{{ item.isContactisolationValue == 1 ? '是' : item.isContactisolationValue === null ? '' : '否' }}
								</view>
							</view>
						</view>
						<view class="creat-form-top">
							<view class="creat-form-field">
								<text>床号</text>
								<u-input :value="templateTwoMessage[index].bedNumber"  border="none" disabled :clearable="false">
								</u-input>
							</view>
							<view class="creat-form-field">
								<text>姓名</text>
								<u-input :value="templateTwoMessage[index].patientName"  border="none" disabled :clearable="false">
								</u-input>
							</view>
						</view>
						<view class="creat-form-bottom">
							<view class="creat-form-field">
								<text>住院号</text>
								<u-input :value="templateTwoMessage[index].patientNumber" border="none" disabled :clearable="false">
								</u-input>
							</view>
							<view class="creat-form-field">
								<text>性别</text>
								<u-input :value="templateTwoMessage[index].genderValue" border="none" disabled :clearable="false">
								</u-input>
							</view>
							<view class="creat-form-field">
								<text>运送数量</text>
								<u-input disabled :value="templateTwoMessage[index].actualData" type="text" border="none" disabled :clearable="false">
								</u-input>
							</view>
						</view>
					</view>
					<view class="transport-parent-box">
						<view class="content-type-title">运送类型</view>
						<view class="transport-parent-box-title">
							{{item.sampleValue}}
						</view>
						<view class="content-type-name">{{jointTransportMessage(index)}}</view>
					</view>
				</view>
				<view class="addpatient-message-btn" @click="addMessageEvent">
						<fa-icon type="plus" color="#44c3f3"></fa-icon>
						<text>添加病人信息</text>
				</view>
			</view>
			<view class="task-describe">
				<text>任务描述</text>
				<u--textarea v-model="taskDescribe" placeholder="请输入任务描述" height="140" :autoHeight="true" border="none"></u--textarea>
			</view>
		</view>
		<view class="btn-box">
			<view class="btn-sure">
				<button class="sureBtn" type="primary" @click="getTransConfig">确认</button>
			</view>
			<view class="btn-cancel">
				<button class="cancelBtn" type="primary" @click="cancel">取消</button>
			</view>
		</view>
		<view class="u-modal-center-box">
			<u-modal :show="patienModalShow" :title="isPressEdit ? `病人${updateIndex+1}`:`病人信息`" 
				:showCancelButton="true"
				:title-style="{color: '#000000',textAlign: 'left',fontSize: '18px'}"
				@confirm="patienModalSure"
				@cancel="patienModalCancel"
				>
				<scroll-view  scroll-y="true" class="scroll-Y slot-content">
					<view class="field-four">
						<view class="contact-isolation-box">
							<view>
								<text>*</text>
								<text>接触隔离:</text>
							</view>
							<view>
								<u-radio-group v-model="patienModalMessage.isContactisolationValue" activeColor="#101010">
									<u-radio name="1" label="是" labelColor="#101010"></u-radio>
									<u-radio name="0" label="否" labelColor="#101010"></u-radio>
								</u-radio-group>
							</view>
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item">
						<view>床号</view>
						<view>
							<u-input :value="patienModalMessage.bedNumber" border="none" placeholder="请输入床号" />
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item">
						<view>姓名</view>
						<view>
							<u-input :value="patienModalMessage.patientName" border="none" placeholder="请输入姓名" />
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item">
						<view>住院号</view>
						<view>
							<u-input :value="patienModalMessage.patientNumber" border="none" placeholder="请输入住院号" />
						</view>
					</view>
					<view class="genderBox scroll-view-item">
						<view>性别</view>
						<view>
							<u-radio-group v-model="patienModalMessage.genderValue" @change="genderChange" activeColor="#101010">
								<u-radio name="0" label="未知" labelColor="#101010"></u-radio>
								<u-radio name="1" label="男" labelColor="#101010"></u-radio>
								<u-radio name="2" label="女" labelColor="#101010"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="bedNumberBox scroll-view-item transport-number">
						<view>运送数量</view>
						<view>
							<u-input :value="patienModalMessage.actualData" disabled border="none" />
						</view>
					</view>
					<view class="transportBox scroll-view-item">
						<view>运送类型</view>
						<view v-if="xflSelectShow">
							<xfl-select :list="patienModalMessage.sampleList" disabled :clearable="false" :showItemNum="5" :isCanInput="true" :showList="transportParentControlListShow"
							 :style_Container="'height: 50px; font-size: 16px;'" :initValue="patienModalMessage.sampleValue" @change="transportParentChange"
							 @input="transportParentInputEvent" @visible-change="transportParentVisibleChange">
							</xfl-select>
						</view>
					</view>
					<view class="transport-type-child-box scroll-view-item">
						<view class="transport-type-child-content" v-for="(innerItem,innerIndex) in patienModalMessage.transportList"
									:key="innerItem.text">
							<view :class="{'transTypeListStyle': innerItem.typerNumber > 0 }">
								{{innerItem.text}}
							</view>
							<view>
								<stepNumberBox v-model="innerItem.typerNumber"
									@plus="plusNum(arguments)"
									@inputBlur="inputBlurEvent(arguments)"
									:innerIndex="innerIndex"
									@minus="minusNum(arguments)"
									@change="stepperValChange(arguments)"
								></stepNumberBox>
							</view>
						</view>
					</view>
				</scroll-view>
			</u-modal>
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
	import {
		queryTransportTypeClass,
		queryTransportTools,
		queryTransportType,
		queryAllDestination,
		generateDispatchTask,
		generateDispatchTaskMany,
		queryTransConfig
	} from '@/api/transport.js'
	import ldSelect from '@/components/ld-select/ld-select.vue'
	import stepNumberBox from '@/createWorkerOrderPackage/components/step-number-box/step-number-box.vue'
	import faIcon from "@/components/kilvn-fa-icon/fa-icon.vue"
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			ldSelect,
			stepNumberBox,
			faIcon,
			navBar
		},
		data() {
			return {
				isShowNoData: false,
				infoText: '加载中',
				isShowModal: false,
				showLoadingHint: false,
				controlListShow: false,
				transportParentControlListShow: false,
				taskTypeText: '',
				typeText: '',
				typeValue: '',
				taskTotal: '',
				typeIndex: null,
				isContactisolationValue: null,
				priorityValue: 1,
				transportList: [],
				hospitalList: [],
				hospitalListTwovalue: '',
				hospitalListValue: '',
				temporaryHospitalList: [],
				bedNumber: '',
				patientName: '',
				patientNumber: '',
				actualData: '',
				toolValue: '',
				toolName: '',
				toolList: [],
				isBackValue: 0,
				taskDescribe: '',
				startPointId: '',
				startPointName: '',
				updateIndex: 0,
				xflSelectShow: false,
				templateTwoMessage: [{
					bedNumber: '',
					patientName: '',
					patientNumber: '',
					isContactisolationValue: null,
					actualData: 0,
					transportList: [],
					genderValue: '未知',
					sampleList: [],
					sampleValue: '',
					sampleId: ''
				}],
				patienModalMessage: {
					bedNumber: '',
					patientName: '',
					patientNumber: '',
					actualData: 0,
					genderValue: '0',
					isContactisolationValue: null,
					transportList: [],
					sampleList: [],
					sampleValue: '',
					sampleId: ''
				},
				transportTypeParent: [],
				transportTypeChild: [],
				patienModalShow: false,
				isPressEdit: false
			}
		},
		// 监听每个病人对应的运送类型数量
		watch: {
			templateTwoMessage: {
				handler(newVal, oldVal) {
					this.taskTotal = this.templateTwoMessage.reduce((accumulator, currentValue) => {
						return accumulator + Number(currentValue.actualData)
					}, 0);
				},
				deep: true,
				immediate: true
			}
		},
		computed: {
			...mapGetters([
				'statusBarHeight',
				'navigationBarHeight',
				'userInfo',
				'templateType'
			]),
			userName() {
				return this.userInfo.userName
			},
			depName() {
				return this.userInfo.depName
			},
			depId() {
				return this.userInfo.depId
			},
			proId() {
				return this.userInfo.extendData.proId
			},
			proName() {
				return this.userInfo.extendData.proName
			},
			workerId() {
				return this.userInfo.extendData.userId
			},
			accountName() {
				return this.userInfo.name
			}
		},
		mounted() {
			console.log('1',this.templateType);
			this.startPointId = this.depId;
			this.startPointName = this.depName;
			this.parallelFunction()
		},
		onLoad(options) {
			if (options.transmitData == '{}') { return };
			let transmitContent = JSON.parse(options.transmitData);
			this.taskTypeText = transmitContent.value;
			this.templateTwoMessage[0].sampleValue = transmitContent.value;
			this.templateTwoMessage[0].sampleId = transmitContent.id
		},	
		methods: {
			...mapMutations([
			]),
			
			textChange () {
				
			},
			
			radio () {
				
			},
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 科室选择组件显示事件
				ldSelectShow(val) {
					this.isShowModal = val
				},
				
				// 科室选择组件隐藏事件
				ldSelectHide(val) {
					this.isShowModal = val
				},
				
				// 科室选择列表变化时
				listChangeEvent(val) {
					this.hospitalListValue = val;
				},
				
				// 模板二科室选择列表变化时
				hospitalListTwoSelectChange(val) {
					this.hospitalListTwovalue = val;
				},
				
				// 科室搜索事件
				searchEvent (e) {
					let temporaryArray = _.cloneDeep(this.hospitalList);
					this.hospitalList = temporaryArray.filter((item) => { return item.value.indexOf(e) != -1});
					if (e === '') {
						this.hospitalList = _.cloneDeep(temporaryArray);
					}
				},
				
				// 根据科室id获取科室名称
				getDepartmentNameById(id) {
					return this.hospitalList.filter((item) => {return item['id'] == id})[0]['value']
				},
				// 下拉框隐藏或显示时事件
				visibleChange() {
					this.hospitalList = this.temporaryHospitalList
				},
				// input中的数据变化时触发
				inputEvent(val) {
					let innerList = this.temporaryHospitalList;
					this.hospitalList = innerList.filter((item) => {
						return item.value.indexOf(val.detail.value) != -1
					});
				},
				// 运送类型点击事件
				typeEvent(item, index) {
					this.typeIndex = index;
					this.typeText = item.text;
					this.typeValue = item.value;
				},
				// 模板二运送类型点击事件
				sampleTypeEvent(innerItem, innerIndex) {
					this.patienModalMessage.transportList[innerIndex].checked = !this.patienModalMessage.transportList[innerIndex].checked;
					if (!this.patienModalMessage.transportList[innerIndex].checked) {
						if (this.patienModalMessage.transportList[innerIndex]['typerNumber'] != 0) {
							this.patienModalMessage.transportList[innerIndex]['typerNumber'] = 0
						}
					};
					this.reduceTotal(0)
				},
				// 拼接运送类型信息函数
				jointTransportMessage(index) {
					let finalMsg = '';
					let targetMsg = this.templateTwoMessage[index].transportList.filter((item) => {
						return item.typerNumber > 0
					});
					for (let item of targetMsg) {
						finalMsg += `${item.text}${item.typerNumber}个,`
					};
					if (targetMsg.length == 0) {
						return finalMsg 
					};
					return `(${finalMsg})`
				},
				// 运送类型大类选择列表变化时
				transportParentChange(val) {
					this.querytransportChildByTransportParent(val.parentIndex, val.orignItem.id);
					this.patienModalMessage.actualData = 0;
					this.patienModalMessage.sampleValue = val.orignItem.value;
					this.patienModalMessage.sampleId = val.orignItem.id;
				},
				// 运送类型大类下拉框隐藏或显示时事件
				transportParentVisibleChange() {
				},
				// 运送类型大类input中的数据变化时触发
				transportParentInputEvent(val) {},
				
				inpuntClick () {
					
				},
				
				// 运送类型子类步进器值改变事件
				stepperValChange(msg) {
					this.reduceTotal(msg[1]);
				},
				
				// 步进器失去焦点事件
				inputBlurEvent (msg) {
				},
				// 步进器增加或减少事件
				plusNum(msg) {
					this.patienModalMessage.transportList[msg[2]]['typerNumber'] = msg[1];
					this.reduceTotal(msg[2]);
				},
				minusNum(msg) {
					this.patienModalMessage.transportList[msg[2]]['typerNumber'] = msg[1];
					this.reduceTotal(msg[2])
				},
				// 求和函数
				reduceTotal(index) {
					// 求该病人信息对应的运送数量
					let targetMsg = this.patienModalMessage.transportList.filter((item) => {
						return item.typerNumber > 0
					});
					this.patienModalMessage.actualData = targetMsg.reduce((accumulator, currentValue) => {
						return accumulator + currentValue.typerNumber
					}, 0);
				},
				// 底部按钮点击
				clickEvent(item) {
					if (item.text == "呼叫") {
						if (this.isToCallTaskPage) {
							this.backTo()
						} else {
							uni.redirectTo({
								url: '/transportPackage/pages/callTask/callTask'
							});
							this.changeBottomBarIndex(0);
							this.changeIsToCallTaskPage(true)
						}
					} else if (item.text == "任务跟踪") {
						uni.redirectTo({
							url: '/transportPackage/pages/task-tail/task-tail'
						});
						this.changeBottomBarIndex(1);
						this.changeIsToCallTaskPage(true)
					} else if (item.text == "历史任务") {
						uni.redirectTo({
							url: '/transportPackage/pages/historyTask/historyTask'
						});
						this.changeBottomBarIndex(2);
						this.changeIsToCallTaskPage(true)
					} else if (item.text == "意见反馈") {
						uni.redirectTo({
							url: '/transportPackage/pages/totalFeedbackIdea/totalFeedbackIdea'
						});
						this.changeBottomBarIndex(3);
						this.changeIsToCallTaskPage(true)
					}
				},
				radioGroupChange(e) {
					console.log(e);
				},
				toolChange(e) {
					console.log(e);
				},
				toolGroupChange(e) {
					this.toolValue = e;
					let currentText = this.toolList.filter((item) => {
						return item.value == e
					});
					this.toolName = currentText[0]['text']
				},
				isBackGroupChange(e) {
					console.log(e);
				},
				genderChange (e) {
					console.log(e);
				},
				// 查询目的地
				getAllDestination() {
					return new Promise((resolve, reject) => {
						queryAllDestination(this.proId).then((res) => {
								if (res && res.data.code == 200) {
									resolve(res.data.data)
								}
							})
							.catch((err) => {
								reject(err.message)
							})
					})
				},
				// 查询转运工具
				getTransportTools() {
					return new Promise((resolve, reject) => {
						queryTransportTools({
								proId: this.proId,
								state: 0
							})
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
				// 查询运送类型小类
				getTransPorttype(data) {
					return new Promise((resolve, reject) => {
						queryTransportType(data)
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
				// 查询运送类型大类
				getTransportsTypeParent() {
					return new Promise((resolve, reject) => {
						queryTransportTypeClass({
								proId: this.proId,
								state: 0
							}).then((res) => {
								if (res && res.data.code == 200) {
									if (res.data.data.length > 0) {
										resolve(res.data.data)
									}
								}
							})
							.catch((err) => {
								reject(err.message)
							})
					})
				},
				// 根据运送类型大类查询运送类型小类
				querytransportChildByTransportParent(index, id) {
					queryTransportType({
							proId: this.proId,
							state: 0,
							parentId: id
						})
						.then((res) => {
							if (res && res.data.code == 200) {
								this.patienModalMessage['transportList'] = [];
								for (let item of res.data.data) {
									this.patienModalMessage['transportList'].push({
										text: item.typeName,
										value: item.id,
										checked: false,
										typerNumber: 0
									})
								}
							}
						})
						.catch((err) => {
							this.$refs.uToast.show({
								title: `${err.message}`,
								type: 'warning'
							}).then(() => {})
						})
				},
				// 并行查询目的地、转运工具、运送类型小类、运送类型大类
				parallelFunction(type) {
					Promise.all([this.getAllDestination(), this.getTransportTools(), this.getTransPorttype({
							proId: this.proId,
							state: 0,
							parentId: this.titleText.id
						}), this.getTransportsTypeParent()])
						.then((res) => {
							if (res && res.length > 0) {
								this.toolList = [];
								this.transportList = [];
								this.hospitalList = [];
								this.transportTypeParent = [];
								this.templateTwoMessage[0]['sampleList'] = [];
								this.templateTwoMessage[0]['transportList'] = [];
								this.patienModalMessage['sampleList'] = [];
								this.patienModalMessage['transportList'] = [];
								this.transportTypeChild = [];
								let [item1, item2, item3, item4] = res;
								if (item1) {
									Object.keys(item1).forEach((item) => {
										this.hospitalList.push({
											value: item1[item],
											id: item
										})
									});
									this.temporaryHospitalList = this.hospitalList
								};
								if (item2) {
									for (let item of item2) {
										this.toolList.push({
											text: item.toolName,
											value: item.id,
											checked: false
										})
									};
									this.toolList.push({
										text: '无工具',
										value: 0,
										checked: false
									})
								};
								if (item3) {
									for (let item of item3) {
										this.transportList.push({
											text: item.typeName,
											value: item.id
										});
										this.patienModalMessage['transportList'].push({
											text: item.typeName,
											value: item.id,
											checked: false,
											typerNumber: 0
										});
										this.templateTwoMessage[0]['transportList'].push({
											text: item.typeName,
											value: item.id,
											checked: false,
											typerNumber: 0
										});
										this.transportTypeChild.push({
											text: item.typeName,
											value: item.id,
											checked: false,
											typerNumber: 0
										})
									};
								};
								if (item4) {
									for (let item of item4) {
										this.transportTypeParent.push({
											id: item.id,
											value: item.typeName
										})
									};
									this.patienModalMessage.sampleList = this.transportTypeParent;
									this.patienModalMessage.sampleValue = this.titleText.value;
									this.patienModalMessage.sampleId = this.titleText.id;
									this.templateTwoMessage[0].sampleList = this.transportTypeParent;
									this.templateTwoMessage[0].sampleValue = this.titleText.value;
									this.templateTwoMessage[0].sampleId = this.titleText.id;
								}
							}
						})
						.catch((err) => {
							this.$refs.uToast.show({
								title: `${err}`,
								type: 'warning'
							})
						})
				},
				// 转换性别
				transferGenderOne (index) {
					if (this.templateTwoMessage[index].genderValue === '1') {
						this.templateTwoMessage[index].genderValue = '男'
					} else if (this.templateTwoMessage[index].genderValue === '2') {
						this.templateTwoMessage[index].genderValue = '女'
					} else if (this.templateTwoMessage[index].genderValue === '0'){
						this.templateTwoMessage[index].genderValue = '未知'
					}
				},
				transferGenderTwo () {
					if (this.patienModalMessage.genderValue == '男') {
						this.patienModalMessage.genderValue = '1'
					} else if (this.patienModalMessage.genderValue == '女') {
						this.patienModalMessage.genderValue = '2'
					} else if (this.patienModalMessage.genderValue === '未知'){
						this.patienModalMessage.genderValue = '0'
					}
				},
				// 病人模态框信息确认事件
				patienModalSure () {
					if (this.isPressEdit) {
						this.templateTwoMessage.splice(this.updateIndex, 1,_.cloneDeep(this.patienModalMessage));
						this.transferGenderOne(this.updateIndex);
						console.log('病人信息',this.templateTwoMessage);
					} else {
						this.templateTwoMessage.push(_.cloneDeep(this.patienModalMessage));
						if (this.templateTwoMessage[this.templateTwoMessage.length-1].genderValue === '1') {
							this.templateTwoMessage[this.templateTwoMessage.length-1].genderValue = '男'
						} else if (this.templateTwoMessage[this.templateTwoMessage.length-1].genderValue === '2') {
							this.templateTwoMessage[this.templateTwoMessage.length-1].genderValue = '女'
						} else if (this.templateTwoMessage[this.templateTwoMessage.length-1].genderValue === '0'){
							this.templateTwoMessage[this.templateTwoMessage.length-1].genderValue = '未知'
						}
					};
					this.patienModalShow = false;
					this.xflSelectShow = false
				},
				// 病人模态框信息取消事件
				patienModalCancel() {
					this.patienModalShow = false;
					this.xflSelectShow = false;
				},
				// 添加病人信息事件
				addMessageEvent() {
					this.isPressEdit = false;
					this.patienModalShow = true;
					this.xflSelectShow = true;
					this.patienModalMessage = {};
					this.patienModalMessage = _.cloneDeep({
						bedNumber: '',
						patientName: '',
						patientNumber: '',
						genderValue: '0',
						actualData: 0,
						isContactisolationValue: null,
						transportList: this.transportTypeChild,
						sampleList: this.transportTypeParent,
						sampleValue: this.titleText.value,
						sampleId: this.titleText.id
					});
				},
				// 病人信息删除事件
				deletetMessage(index) {
					this.templateTwoMessage.splice(index, 1)
				},
				
				// 返回病人序号
				patientIndexFun() {
					if(this.isPressEdit) {
						return `病人${this.updateIndex+1}`
					};
					return `病人${this.this.templateTwoMessage.length+1}`
				},
				
				// 病人信息编辑事件
				editMessage(index) {
					this.updateIndex = index;
					this.isPressEdit = true;
					this.xflSelectShow = true;
					this.patienModalMessage = {};
					this.patienModalMessage = _.cloneDeep(this.templateTwoMessage[index]);
					this.transferGenderTwo();
					this.patienModalShow = true
				},
				// 生成调度任务(一个病人)
				postGenerateDispatchTask(data) {
					this.showLoadingHint = true;
					generateDispatchTask(data).then((res) => {
							if (res && res.data.code == 200) {
								this.$refs.uToast.show({
									title: `${res.data.msg}`,
									type: 'success'
								});
								setTimeout(() => {
									this.backTo()
								}, 1000)
							} else {
								this.$refs.uToast.show({
									title: `${res.data.msg}`,
									type: 'warning'
								})
							};
							this.showLoadingHint = false
						})
						.catch((err) => {
							this.$refs.uToast.show({
								title: `${err.message}`,
								type: 'error'
							})
							this.showLoadingHint = false;
						})
				},
				
				//生成调度任务(多个病人)
				postGenerateDispatchTaskMany(data) {
					this.showLoadingHint = true;
					generateDispatchTaskMany(data).then((res) => {
							if (res && res.data.code == 200) {
								this.$refs.uToast.show({
									title: `${res.data.msg}`,
									type: 'success'
								});
								setTimeout(() => {
									this.backTo()
								}, 1000)
							} else {
								this.$refs.uToast.show({
									title: `${res.data.msg}`,
									type: 'warning'
								})
							};
							this.showLoadingHint = false
						})
						.catch((err) => {
							this.$refs.uToast.show({
								title: `${err.message}`,
								type: 'error'
							});
							this.showLoadingHint = false;
						})
				},
				
				// 查询是否配置接触隔离选项0-没配置1-配置
				getTransConfig () {
					this.showLoadingHint = true;
					queryTransConfig(this.proId,'TRANS_QUARANTINE').then((res) => {
						if (res && res.data.code == 200) {
							if (JSON.parse(res.data.data)[0]['value'] == 1) {
								if (this.templateType === 'template_one') {
									if (this.titleText.value == '检查') {
										if (this.isContactisolationValue === null) {
											this.$refs.uToast.show({
												title: '请确认病人是否需要接触隔离!',
												type: 'warning'
											})
										} else {
											this.sure(true)
										}
									}	else {
										this.sure(false)
									}
								} else if (this.templateType === 'template_two') {
									if (this.patienModalMessage.sampleValue == '检查') {
										let temporaryFlag = this.templateTwoMessage.some((item) => { return item.isContactisolationValue === null });
										if (temporaryFlag) {
											this.$refs.uToast.show({
												title: '请确认病人是否需要接触隔离!',
												type: 'warning'
											})
										} else {
											this.sure(true)
										}
									}	else {
										this.sure(false)
									}
								}  
							} else {
								this.sure(false)
							}
						} else {
							this.$refs.uToast.show({
								title: `${res.data.msg}`,
								type: 'error'
							})
						};
						this.showLoadingHint = false;
					})
					.catch((err) => {
						this.$refs.uToast.show({
							title: `${err.message}`,
							type: 'error'
						});
						this.showLoadingHint = false;
					})
				},
				
				// 运送类型信息确认事件
				dispatchTaskSure(flag) {
					if (this.templateType === 'template_one') {
						// if (!this.hospitalListValue) {
						// 	this.$refs.uToast.show({
						// 		title: '科室不能为空',
						// 		type: 'warning'
						// 	});
						// 	return 
						// };
						// 获取选中的运送工具信息
						let taskMessage = {
							setOutPlaceId: this.hospitalListValue == '' ? this.startPointId : this.hospitalListValue, //出发地ID
							setOutPlaceName: this.hospitalListValue == '' ? this.startPointName : this.getDepartmentNameById(this.hospitalListValue),//出发地名称
							// destinationId: this.hospitalListValue, //目的地ID
							// destinationName: this.hospitalListValue == '' ? '' : this.getDepartmentNameById(this.hospitalListValue), //目的地名称
							parentTypeId: this.titleText.id, //运送父类型Id
							parentTypeName: this.titleText.value, //运送父类型名称
							taskTypeId: this.typeValue, //运送类型 ID
							taskTypeName: this.typeText, //运送类型 名 称
							priority: this.priorityValue, //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
							toolId: this.toolValue === 0 ? 0 : this.toolValue === '' ? '' : this.toolValue, //运送工具ID
							toolName: this.toolName === '无工具' ? '无工具' : this.toolName === '' ? '' : this.toolName, //运送工具名称
							actualCount: this.actualData, //实际数量
							patientName: this.patientName, //病人姓名
							sex: 0, //病人性别  0-未指定,1-男, 2-女
							age: "", //年龄
							quarantine: this.isContactisolationValue === null ? -1 : this.isContactisolationValue, // 接触隔离
							number: this.patientNumber, //住院号
							bedNumber: this.bedNumber, //床号
							taskRemark: this.taskDescribe, //备注
							createId: this.workerId, //创建者ID  当前登录者
							createName: this.userName, //创建者名称  当前登陆者
							proId: this.proId, //项目ID
							proName: this.proName, //项目名称
							isBack: this.isBackValue, //是否返回出发地  0-不返回，1-返回
							createType: 2 ,//创建类型   0-调度员,1-医务人员(平板创建),2-医务人员(小程序)
							startTerminal: 2 // 发起客户端类型 1-安卓APP，2-微信小程序
						};
						// 创建调度任务
						this.postGenerateDispatchTask(taskMessage)
					} else if (this.templateType === 'template_two') {
						// if (this.hospitalListTwovalue.length == 0) {
						// 	this.$refs.uToast.show({
						// 		title: '科室不能为空',
						// 		type: 'warning'
						// 	});
						// 	return 
						// };
						let taskMessageTwo = {
							setOutPlaceId: this.hospitalListTwovalue == '' ? this.startPointId : this.hospitalListTwovalue, //出发地ID
							setOutPlaceName: this.hospitalListTwovalue == '' ? this.startPointName : this.getDepartmentNameById(this.hospitalListTwovalue),//出发地名称
							destinations: [],//多个目的地列表
							patientInfoList: [], //多个病人信息列表
							priority: this.priorityValue, //优先级   0-正常, 1-重要,2-紧急, 3-紧急重要
							toolId: this.toolValue === 0 ? 0 : this.toolValue === '' ? '' : this.toolValue, //运送工具ID
							toolName: this.toolName === '无工具' ? '无工具' : this.toolName === '' ? '' : this.toolName, //运送工具名称
							actualCount: this.taskTotal, //实际数量
							taskRemark: this.taskDescribe, //备注
							createId: this.workerId, //创建者ID  当前登录者
							createName: this.userName, //创建者名称  当前登陆者
							proId: this.proId, //项目ID
							proName: this.proName, //项目名称
							isBack: this.isBackValue, //是否返回出发地  0-不返回，1-返回
							createType: 2 ,//创建类型   0-调度员,1-医务人员(平板创建),2-医务人员(小程序)
							startTerminal: 2 // 发起客户端类型 1-安卓APP，2-微信小程序
						};
						// 获取目的地列表数据
						// if (this.hospitalListTwovalue.length > 0) {
						// 	for (let item of this.hospitalListTwovalue) {
						// 		taskMessageTwo.destinations.push({
						// 			destinationId: item,
						// 			destinationName: this.getDepartmentNameById(item)
						// 		})
						// 	}
						// };	
						// 获取多个病人信息列表数据
						for (let patientItem of this.templateTwoMessage) {
							taskMessageTwo.patientInfoList.push({
								bedNumber: patientItem['bedNumber'],
								patientName: patientItem['patientName'],
								number: patientItem['patientNumber'],
								quarantine: patientItem['isContactisolationValue'] === null ? -1 : patientItem['isContactisolationValue'], // 接触隔离
								sex:  patientItem['genderValue'] === '男' ? 1 : patientItem['genderValue'] === '女' ? 2 : 0,
								quantity: patientItem['actualData'],
								typeList: []
							})
						};
						// 获取每个病人的运送类型数据
						for (let i = 0, len = this.templateTwoMessage.length; i < len; i++) {
							if (this.templateTwoMessage[i]['transportList'].length > 0) {
								// 获取选中的运送类型小类
								let checkChildTypeList = this.templateTwoMessage[i]['transportList'].filter((item) => {return item.typerNumber > 0});
								if (checkChildTypeList.length > 0) {
									for (let innerItem of checkChildTypeList) {
										taskMessageTwo.patientInfoList[i]['typeList'].push({
											quantity: innerItem['typerNumber'],
											parentTypeId: this.templateTwoMessage[i]['sampleId'],
											parentTypeName: this.templateTwoMessage[i]['sampleValue'],
											taskTypeId: innerItem['value'],
											taskTypeName: innerItem['text']
										})
									}
								} else {
									taskMessageTwo.patientInfoList[i]['typeList'].push({
										quantity: 1,
										parentTypeId: this.templateTwoMessage[i]['sampleId'],
										parentTypeName: this.templateTwoMessage[i]['sampleValue'],
										taskTypeId: '',
										taskTypeName: ''
									});
									// 没选运送类型小类时,大类也算一个数量
									taskMessageTwo.patientInfoList[i]['quantity'] = 1;
									this.templateTwoMessage[i]['actualData'] = 1;
									// 重新计算运送类型总数
									this.totalNumber  = this.templateTwoMessage.reduce((accumulator, currentValue) => {
										return accumulator + Number(currentValue.actualData)
									},0);
									taskMessageTwo['actualCount'] = this.totalNumber
								}	
							}
						};
						this.postGenerateDispatchTaskMany(taskMessageTwo);
						console.log('最终数据',taskMessageTwo);
					}
				},
				// 调度任务生成
				sure(flag) {
					this.dispatchTaskSure(flag)
				},
				// 调度任务取消
				cancel() {
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
		// 病人信息模态框样式
		.u-modal-center-box {
			/deep/ .u-modal {
				padding: 16px;
				.u-modal__title {
					padding-top: 0;
					text-align: left;
				};
				.u-modal__content {
					max-height: 500px;
					padding: 0 !important;
					-webkit-overflow-scrolling:touch;
					overflow: auto;
					.slot-content {
						height: 400px;
						.bedNumberBox {
							height: 60px;
							> view {
								height: 60px;
								line-height: 60px;
								&:first-child {
									width: 30%;
									color: $color-text-left;
									float: left;
								};
								&:last-child {
									width: 70%;
									float: right;
									position: relative;
									.u-input {
										position: absolute;
										width: 100%;
										top: 50%;
										left: 0;
										background: #fff !important;
										transform: translateY(-50%);
										min-height: 59px !important;
										border-bottom: 1px solid #f9f9f9;
										.u-input__input {
											min-height: 59px !important;
										}
									}
								}
							}
						};
						.transport-number {
							> view {
								&:last-child {
									.u-input {
										border: none !important;
									}
								}
							}
						};
						.field-four {
							height: 50px;
							display: flex;
							align-items: center;
							.contact-isolation-box {
								width: 100%;
								line-height: 20px;
								display: flex;
								align-items: center;
								>view {
									font-size: 16px;
									display: inline-block;
									height: 100%;
									&:first-child {
										width: 30%;
										margin-right: 10px;
										vertical-align: top;
										>text {
											color: #101010;
											&:first-child {
												color: red !important;
											}
										}
									};
									&:last-child {
										flex: 1;
										.u-radio-group {
											.u-radio {
												&:nth-child(1) {
													margin-right: 14px !important
												}
											}
										}	
									}
								}
							}
						};
						.genderBox {
							height: 60px;
							> view {
								height: 60px;
								line-height: 60px;
								&:first-child {
									width: 30%;
									color: $color-text-left;
									float: left
								};
								&:last-child {
									width: 70%;
									float: right;
									border-bottom: 1px solid #f9f9f9;
									position: relative;
									.u-radio-group {
										position: absolute;
										top: 50%;
										left: 0;
										transform: translateY(-50%);
										.u-radio {
											&:nth-child(2) {
												margin: 0 14px !important
											}
										}
									}
								}
							}
						};
						.transportBox {
							height: 60px;
							line-height: 60px;
							> view {
								&:first-child {
									float: left;
									width: 30%;
									color: $color-text-left;
									box-sizing: border-box
								};
								&:last-child {
									height: 60px;
									float: right;
									position: relative;
									width: 70%;
									border-bottom: 1px solid #ececec;
									.show-box {
										color: $color-text-right;
										position: absolute;
										left: 0;
										top: 50%;
										transform: translateY(-50%);
										height: 40px !important;
										background: #f9f9f9;
										border: none;
										.input {
											font-size: 15px !important
										};
										.right-arrow {
											color: $color-text-right !important
										}
									}
								}
							}
						};
						.transport-type-child-box {
							max-height: 100px;
							.transTypeListStyle {
									background: #44c4f3;
									color: #fff !important;
									border-radius: 4px;
								}
							.transport-type-child-content {
								height: 60px;
								line-height: 60px;
								> view {
									&:first-child {
										float: left;
										width: 50%;
										height: 60px;
										color: $color-text-left;
										box-sizing: border-box;
										-webkit-overflow-scrolling: touch;
										overflow-x: auto;
									};
									&:last-child {
										height: 60px;
										float: right;
										position: relative;
										width: 50%;
										border-bottom: 1px solid #f9f9f9;
										.num-box {
											align-items: center;
											.subtract-box {
												width: 26px;
												height: 26px;
												background: #d3d3d3;
												border-radius: 50%;
												color: #fff;
												text-align: center;
												line-height: 26px
											};
											.plus-box {
												width: 26px;
												height: 26px;
												background: #3d4864;
												border-radius: 50%;
												color: #fff;
												text-align: center;
												line-height: 26px
											}
											input {
												text-align: center;
												background: #fff
											}
										}
									}
								};
							}
						}
					}
				};
				.u-modal__button-group {
					justify-content: space-between;
					.u-modal__button-group__wrapper {
						border-radius: 30px;
						flex: 0 0 45%;
						margin-top: 8px;
						background: #e8e8e8;
						.u-modal__button-group__wrapper__text {
							color: #666666 !important;
						}
					};
					.u-modal__button-group__wrapper--confirm {
						background: #fff;
						color: #43c3f4 !important;
						border: 1px solid #43c3f4;
						.u-modal__button-group__wrapper__text {
							color: #43c3f4 !important;
						}
					}
				}
			}
		};
		.nav {
			width: 100%;
		};
		.creat-box {
			position: relative;
			width: 100%;
			flex: 1;
			-webkit-overflow-scrolling: touch;
			overflow: auto;
			font-size: 14px;
			color: black;
			display: flex;
			flex-direction: column;
			.creat-priority {
				width: 100%;
				height: 60px;
				line-height: 60px;
				border-bottom: 1px solid $color-underline;
				.creat-priority-title {
					height: 59px;
					line-height: 59px;
					float: left;
					width: 30%;
					color: $color-text-left;
					padding-left: 4px;
					box-sizing: border-box;
				};
				.creat-priority-content {
					height: 59px;
					float: right;
					position: relative;
					width: 70%;
					/deep/ .u-radio-group {
						position: absolute;
						width: 100% !important;
						top: 50%;
						transform: translateY(-50%);
						left: 0;
						display: flex;
						justify-content: space-between;
						.u-radio {
							flex: 1 0 auto !important;
							.u-radio__label {
								margin-right: 9px;
							}
						}
					}
				};
				.transport-isBack {
					height: 59px;
					float: right;
					position: relative;
					width: 70%;
					/deep/ .u-radio-group {
						position: absolute;
						width: 100%;
						top: 50%;
						transform: translateY(-50%);
						left: 0;
						.u-radio {
							&:last-child {
								margin-left: 10px;
							}
						}
					}
				}
			};
			
			.priority-box-one {
				.creat-priority-title {
					width: 20% !important
				};
				.creat-priority-content {
					width: 80% !important
				}
			};
			
			.tool-box {
				width: 100%;
				border-bottom: 12px solid #f6f6f6;
				> view {
					display: inline-block
				};
				.creat-priority-title {
					width: 20%;
					padding-left: 4px;
					box-sizing: border-box;
					height: 48px;
					vertical-align: middle;
					line-height: 48px;
					color: #7d7d7d;
				};	 
				.creat-priority-content {
					font-size: 15px;
					color: $color-text-right;
					width: 80%;
					vertical-align: middle;
					padding: 6px 6px 8px 0;
					box-sizing: border-box;
					/deep/ u-radio-group {
						width: 100%
					}
				}
			};
			.creat-chooseHospital {
				width: 100%;
				height: 60px;
				display: flex;
				align-items: center;
				.creat-chooseHospital-title {
					height: 59px;
					float: left;
					width: 30%;
					line-height: 59px;
					padding-left: 4px;
					color: $color-text-left;
					box-sizing: border-box
				};
				.creat-chooseHospital-content {
					height: 59px;
					float: right;
					position: relative;
					width: 70%;
					.show-box {
						color: $color-text-right;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
						height: 40px !important;
						background: #f9f9f9;
						border: none;
						/deep/ .input {
							font-size: 15px !important
						};
						.right-arrow {
							color: $color-text-right !important
						}
					}
				};
				.creat-chooseHospital-content-two {
					height: 60px;
					float: right;
					position: relative;
					width: 70%;
					background: #fff !important;
					.main {
						color: $color-text-right;
						position: absolute;
						left: 0;
						top: 10px;
						width: 100%;
						background: #f9f9f9;
						border: none;
						/deep/ .input {
							height: 40px !important;
							box-sizing: border-box;
							border: none;
							.uni-input-wrapper {
								font-size: 15px !important
							}
						};
						/deep/.text-blue {
							color: #969696 !important
						};
						/deep/ .text-green {
							color: #43c3f3 !important
						}
					}
				}
			};
			
			.creat-chooseHospital-one {
				.creat-chooseHospital-title {
					width: 20%;
				};
				.creat-chooseHospital-content {
					width: 80%
				}
			};
			.priority-box {
				.creat-priority-title {
					height: 59px;
					line-height: 59px;
					float: left;
					width: 20%;
					color: $color-text-left;
					padding-left: 4px;
					box-sizing: border-box;
				};
				.creat-priority-content {
					width: 80% !important;
					/deep/ .u-radio-group {
						position: absolute;
						width: 100% !important;
						top: 50%;
						transform: translateY(-50%);
						left: 0;
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
			.creat-transport-type {
				width: 100%;
				display: flex;
				flex-direction: row;
				border-top: 12px solid #f6f6f6;
				border-bottom: 12px solid #f6f6f6;
				.creat-transport-type-title {
					margin-top: 8px;
					width: 20%;
					height: 35px;
					line-height: 35px;
					color: $color-text-left;
					text {
						&:nth-child(1) {
							padding-left: 4px;
							box-sizing: border-box;
							margin-right: 8px
						};
			
						&:nth-child(2) {
							font-size: 14px;
							color: red
						}
					}
				};
			
				.creat-transport-type-content {
					flex: 1;
					display: flex;
					font-size: 15px;
					color: $color-text-right;
					width: 0;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-content: flex-start;
					padding: 8px 6px 8px 0;
					box-sizing: border-box;
					.transTypeListStyle {
						background: #d6f4ff;
						color: #01a6ff;
						border: 1px solid #4cc5f2
					};
			
					>view {
						width: 45%;
						margin-bottom: 4px;
						height: 35px;
						text-align: center;
						line-height: 35px;
						background:: #f9f9f9;
						border-radius: 16px;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						padding: 0 6px;
						box-sizing: border-box;
					}
				}
			};
			.creat-form {
				width: 100%;
				border-bottom: 12px solid #f6f6f6;
				display: flex;
				width: 100%;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-between;
				align-content: flex-start;
				.creat-form-top {
					display: flex;
					width: 100%;
					flex-direction: row;
					flex-wrap: wrap;
					justify-content: space-between;
					align-content: flex-start;
					margin: 4px 0;
					.creat-form-field {
						&:first-child {
							margin: 0 6px 0 4px;
						};
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						> text {
							width: 32%;
							margin-right: 4px;
							font-size: 14px;
							color: $color-text-left;
						};
						/deep/ .u-input {
							flex: 1;
							padding: 4px 2px;
							.u-label-text {
								font-size: 14px;
								color: $color-text-left
							};
							.fild-body {
								.uni-input-input {
									color: $color-text-right !important
								}
							}
						}
					}
				}
			};
			.field-four {
				padding-left: 4px;
				box-sizing: border-box;
				border-bottom: 12px solid #f6f6f6;
				.contact-isolation-box {
					width: 100%;
					display: flex;
					>view {
						font-size: 14px;
						display: inline-block;
						height: 100%;
						&:first-child {
							height: 60px;
							display: flex;
							align-items: center;
							color: #7d7d7d;
							margin-right: 10px;
							vertical-align: top;
						};
						&:last-child {
							flex: 1;
							height: 60px;
							display: flex;
							align-items: center;
							::v-deep .u-radio-group {
								width: 100%;
								.u-radio {
									&:nth-child(1) {
										margin-right: 14px !important
									}
								}
							};
							::v-deep u-radio-group {
								width: 100%;
								.u-radio {
									&:nth-child(1) {
										margin-right: 14px !important
									}
								}
							}
						}
					}
				}
			};
			.creat-is-back {
				.creat-priority-title {
					display: inline-block;
					height: 59px;
					line-height: 59px;
					width: 30%;
					padding-left: 4px;
					box-sizing: border-box;
				};
				.creat-priority-content {
					display: inline-block;
					position: relative;
					height: 59px;
					width: 70%;
					
					/deep/ .u-radio-group {
						position: absolute;
						width: 100%;
						top: 50%;
						transform: translateY(-50%);
						left: 0
					}
				}
			};
			.task-describe {
				height: 120px;
				padding: 6px 4px;
				box-sizing: border-box;
				border-bottom: 12px solid #f6f6f6;
				display: flex;
				> text {
					padding-top: 10px;
					box-sizing: border-box;
					color: $color-text-left;
					font-size: 14px;
					margin-right: 10px;
				};
				/deep/ .u-textarea {
					flex: 1;
					padding:10px 0 10px 4px;
					color: $color-text-left;
					background: #f9f9f9;
				}
			};
			.task-describe-one {
				border-top: 12px solid #f6f6f6;
			}
		}
		.template-two {
			.trans-total {
				.trans-total-title {
					float: left;
					width: 30%;
					color: $color-text-left;
					padding-left: 4px;
					line-height: 59px !important;
					height: 59px !important;
				};
				.trans-total-content {
					height: 59px !important;
					float: right;
					width: 70%;
					position: relative;
					/deep/ .u-input {
						position: absolute;
						top: 50%;
						width: 100%;
						min-height: 40px;
						color: $color-text-right;
						transform: translateY(-50%);
						left: 0;
						border: none;
						background: #f9f9f9
					}
				};
			}
			.patient-box {
				border-top: 12px solid #f6f6f6;
				border-bottom: 12px solid #f6f6f6;
				padding: 0 0 8px 4px;
				.addpatient-message-btn {
					width: 96%;
					height: 40px;
					margin: 0 auto;
					margin-top: 8px;
					line-height: 40px;
					text-align: center;
					color: #43c3f3;				
					border: 1px solid #44c3f3;
					border-radius: 20px;
					font-size: 16px;
					/deep/ .fa-plus {
						margin-right: 6px
					}
				};
				.patient-box-list {
					margin-bottom: 4px;
					.creat-transport-type{
						margin-bottom: 0
					};
					.patient-title {
						height: 50px;
						line-height: 50px;
						color: black;
						font-weight: bold;
						position: relative;
						.patient-name {
							position: absolute;
							top: 0;
							height: 100%;
							font-size: 16px;
							width: 100px;
							left: 4px;
							color: #000000
						};
						/deep/ .fa-trash-o {
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							right: 4px;
							color: #000000 !important;
							font-size: 20px !important
						};
						.fa-edit  {
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							right: 50px;
							color: #000000 !important;
							font-size: 20px !important
						}
					};
					.creat-form {
						width: 100%;
						padding: 4px 0 0 4px;
						box-sizing: border-box;
						border: none !important;
						background: #f9f9f9;
						width: 100%;
						.creat-form-top {
							display: flex;
							width: 100%;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: space-between;
							align-content: flex-start;
							margin: 4px 0;
							.creat-form-field {
								&:first-child {
									margin-right: 6px;
								};
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: space-between;
								> text {
									margin-right: 4px;
									font-size: 14px;
									color: $color-text-left;
								};
								/deep/ .u-input {
									flex: 1;
									padding: 4px 2px;
									.u-label-text {
										font-size: 14px;
										color: $color-text-left
									};
									.fild-body {
										.uni-input-input {
											color: $color-text-right !important
										}
									}
								}
							}
						};
						.creat-form-bottom {
							display: flex;
							width: 100%;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: space-between;
							align-content: flex-start;
							.creat-form-field {
								&:nth-child(2) {
									margin: 0 6px;
								};
								flex: 1;
								display: flex;
								align-items: center;
								justify-content: space-between;
								> text {
									margin-right: 4px;
									font-size: 14px;
									color: $color-text-left;
								};
								/deep/ .u-input {
									padding: 4px 2px;
									.u-label-text {
										font-size: 14px;
										color: $color-text-left
									};
									.fild-body {
										.uni-input-input {
											color: $color-text-right !important
										}
									}
								}
							}
						}
					};
					.field-four {
						padding: 4px 0 0 2px;
						box-sizing: border-box;
						background: #f9f9f9;
						border: none !important;
						.contact-isolation-box {
							width: 100%;
							line-height: 20px;
							display: flex;
							align-items: center;
							>view {
								font-size: 14px;
								display: inline-block;
								height: 100%;
								&:first-child {
									color: #7d7d7d;
									margin-right: 10px;
									vertical-align: top;
								};
								&:last-child {
									flex: 1;
									::v-deep .u-radio-group {
										.u-radio {
											&:nth-child(1) {
												margin-right: 14px !important
											}
										}
									}
								}
							}
						}
					};
					.transport-parent-box {
						padding-left: 6px;
						height: 40px;
						display: flex;
						flex-flow: row nowrap;
						background: #f9f9f9;
						justify-content: space-between;
						.content-type-title {
							margin-right: 4px;
							color: $color-text-left;
							font-size: 14px;
							height: 40px;
							line-height: 40px;
							width: 60px;
						};
						.transport-parent-box-title {
							color: $color-text-right;
							font-size: 14px !important;
							height: 40px;
							line-height: 40px;
							margin-right: 4px
						};
						.content-type-name {
							font-weight: bold;
							color: $color-text-right;
							font-size: 15px;
							height: 40px;
							line-height: 40px;
							flex: 1;
							font-size: 12px;
							-webkit-overflow-scrolling: touch;
							overflow: auto
						};
					};
					.creat-transport-type {
						width: 100%;
						height: 110px;
						border: 1px solid red;
						-webkit-overflow-scrolling: touch;
						overflow: auto;
						margin: 0 auto;
						padding: 4px 0;
						display: flex;
						flex: 1;
						flex-direction: column;
						border: 1px solid #bcbcbc;
						.creat-transport-type-content {
							flex: 1;
							display: flex;
							width: 0;
							flex-direction: row;
							flex-wrap: wrap;
							justify-content: space-between;
							align-content: flex-start;
							padding: 0 4px;
							box-sizing: border-box;
							-webkit-overflow-scrolling: touch;
							overflow: auto;
							.transTypeListStyle {
								background: #75acef;
								color: #fff;
								border: none
							};
							.creat-transport-type-content-list {
								width: 49%;
								margin-bottom: 4px;
								height: 35px;
								border: 1px solid #dfdfdf;
								position: relative;
								.creat-transport-type-content-list-title {
									height: 100%;
									position: absolute;
									top: 0;
									width: 45%;
									text-align: left;
									left: 2px;
									-webkit-overflow-scrolling: touch;
									overflow-x: auto;
								};
								.creat-transport-type-content-list-content {
									height: 100%;
									position: absolute;
									top: 0;;
									width: 55%;
									right: 0;
									.subtract-box  {
										width: 30px;
										height: 33px;
										background: #d2d2d2;
										line-height: 33px;
									};
									input {
										flex: 1;
										height: 100%;
										background: #a7a7a7;
									};
									.plus-box  {
										width: 30px;
										height: 33px;
										background: #d2d2d2;
										line-height: 33px
									}
								}
							}
						}
					}
				}
			};
			.task-describe {
			}
		};
		.btn-box {
			width: 100%;
			box-sizing: border-box;
			padding: 0 20px;
			margin: 0 auto;
			height: 80px;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			view {
				::after {
					border-radius: 4px;
					border: none;
				};
				width: 47%;
				&:first-child {
					button {
						border-radius: 4px;
						background-image: linear-gradient(to right, #37d5fc , #429bff);
						color: #fff
					}
				};
				
				&:last-child {
					button {
						border-radius: 4px;
						background: #e8e8e8;
						border: none;
						color: #666666
					}
				}
			}
		}
		.bottom-bar {
			height: 50px;
			width: 100%;
		}
	}
</style>
