<template>
	<view class="chat" :style="{ 'padding-top': statusBarHeight + 'px' }" @click="wrapperClickEvent">
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 'px' }"></view>
		<u-toast ref="uToast" />
    <!-- 顶部标题 -->
    <view class="topTabbar" :style="{ 'height': navigationBarHeight + 'px', 'lineHeight': navigationBarHeight + 'px', 'paddingRight': capsuleMessage.width + 10 + 'px' }">
      <!-- 返回图标
      <u-icon class="icon" name="arrow-left" size="20px" color="#fff" @click="goback()"></u-icon>
			<!-- 消息条数 -->
		<!-- 	<view class="message-count" @click="goback()">
				{{ `消息(${messageCount})` }}
			</view> -->
      <!-- 聊天对象名称 -->
      <view class="text">{{ fromName }}</view>
			<!-- 创建工单图标 -->
			<view class="create-order-area">
				<u-icon name="plus" size="22px" color="#fff" @click.native.stop="creatWorkOrderListShowEvent"></u-icon>
				<!-- 工单类型列表提示框 -->
				<view class="triangle-rect-list-info" :style="{ 'top': navigationBarHeight + 4 + 'px' }" v-if="triangleRectListInfoShow">
					<view class="triangle-rect-list-content" v-for="(item,index) in workerOrderTypeList" @click="creatWorkOrderEvent(item,index)" :key="index">
						<text>{{ item }}</text>
					</view>
				</view>
			</view>
			<!-- 修改工单图标 -->
			<view class="view-order-area" @click="modificationWorkOrderEvent">
				<u-icon name="order" size="26px" color="#fff"></u-icon>
			</view>
    </view>
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" text="加载中···" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<scroll-view :style="{height: `${windowHeight-inputHeight - 180}rpx`}"
			id="scrollview"
			@scrolltoupper="scrolltoupper"
			upper-threshold="0"
			scroll-y="true" 
			:scroll-top="scrollTop"
			:scroll-anchoring="true"
			class="scroll-view"
		>
			<!-- 聊天主体 -->
			<view id="msglistview" class="chat-body">
				<u-loadmore :status="status"  :loading-text="loadingText"  :loadmore-text="loadmoreText" :nomore-text="nomoreText"  v-if="fullMsgList.length > 0" />
				<!-- 聊天记录 -->
				<view v-for="(item,index) in fullMsgList" :key="index">
					<view class="send-time-box" v-if="item.me">
						<view class="send-time">
							{{ getNowFormatDate(new Date(item.createTime),4) }}
						</view>
					</view>
					<!-- 自己发的消息 -->
					<view class="item self" v-if="item.me">
						<!-- 文字内容 -->
						<view class="content right">
							<text>{{ item.content }}</text>
							<!-- <image src="@/static/img/send-message-load.gif" v-if="item.status == 'sending'"></image> -->
							<u-icon name="error-circle-fill" size="20" color="red" v-if="item.status == 'fail'"></u-icon>
						</view>
						<!-- 头像 -->
						<image class="avatar" :src="item.fromAvatar">
						</image>
					</view>
					<view class="send-time-box" v-if="!item.me">
						<view class="send-time">
							{{ getNowFormatDate(new Date(item.createTime),4) }}
						</view>
					</view>
					<!-- 好友发的消息 -->
					<view class="item Ai" v-if="!item.me">
						<!-- 头像 -->     
						<image class="avatar" :src="item.fromAvatar">
						</image>
						<!-- 文字内容 -->
						<view class="content left">
							{{item.content}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 底部消息发送栏 -->
		<!-- 用来占位，防止聊天消息被发送框遮挡 -->
		<view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
			<view class="send-msg" :style="{bottom:`${keyboardHeight - 60}rpx`}">
				<view class="voice-chat">
					<image src="@/static/img/voice-icon.png" @click="handleVoiceSend"></image>
				</view>
        <view class="uni-textarea">
          <textarea v-model="chatMsg"
            maxlength="300"
						autoHeight
            confirm-type="send"
            @confirm="handleSend"
            :show-confirm-bar="false"
            :adjust-position="false"
            @linechange="sendHeight"
            @focus="focus" @blur="blur">
						</textarea>
        </view>
				<view class="send-btn">
					<image src="@/static/img/meme-icon.png" @click="handleMemeSend"></image>
					<image src="@/static/img/send-icon.png" @click="handleSend"></image>
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
	// import { getUserChatPage, getUserMessage, chatMessageRead } from '@/api/user.js'
	// import { getTradeOrderUserCareInfo } from '@/api/orderForm.js'
	import store from '@/store'
	export default{
		data() {
			return {
				defaultPersonPhotoIconPng: require("@/static/img/default-person-photo.png"),
				workerOrderTypeList: ['运送','环境','工程','事务'],
				showLoadingHint: false,
				triangleRectListInfoShow: false,
				infoText: '加载中···',
				loadingText: '加载中···',
				loadmoreText: '下拉加载更多',
				nomoreText: '没有更多聊天记录了',
				messageCount: 12,
				//键盘高度
				keyboardHeight:0,
				//底部消息发送高度
				bottomHeight: 0,
				// 列表高度
				scrollHeight: 0,
				//滚动距离
				scrollTop: 0,
				userId:'',
				//发送的消息
				chatMsg:"",
				// 定时器(判断socket是否断开)
				timer: null,
				// 定时器(socket心跳)
				socketTimer: null,
				fromId: '',
				fromName: '智慧后勤AI助手',
				userAvatar: '',
				userPhone: '',
				msgList: [],
				fullMsgList:[],
				status: 'nomore',
				currentPage: 1,
				pageSize: 15,
				totalCount: 0,
				beforePageRoute: '',
				personPhotoSource: '',
				newReceiveMessageId: ''
			}
		},
		updated() {},
		computed: {
			...mapGetters([
				'userInfo',
				'socketOpen',
				'statusBarHeight',
				'navigationBarHeight',
				'capsuleMessage'
			]),
			userName() {
				return this.userInfo.userName
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
			},
			windowHeight() {
			  return this.rpxTopx(uni.getSystemInfoSync().windowHeight)
			},
			// 键盘弹起来的高度+发送框高度
			inputHeight(){
				return this.bottomHeight+this.keyboardHeight
			}
		},
		
		onShow() {
			// 获取用户基本信息
			// getUserMessage().then((res) => {
			// 	if ( res && res.data.code == 0) {
			// 		this.changeUserBasicInfo(res.data.data);
			// 		this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng :  this.userBasicInfo.avatar;
			// 	} else {
			// 		this.$refs.uToast.show({
			// 			title: res.data.msg,
			// 			type: 'error',
			// 			position: 'bottom'
			// 		})
			// 	}
			// })
			// .catch((err) => {
			// 	this.$refs.uToast.show({
			// 		title: err.message,
			// 		type: 'error',
			// 		position: 'bottom'
			// 	})
			// })
		},
		
		onLoad(options) {
		// 	this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng : this.userBasicInfo.avatar;
		// 	let pages = getCurrentPages();//当前页
		// 	this.beforePageRoute = pages[pages.length - 2].route;//上个页面路径
		// 	// 从聊天列表进入时不用查医护信息
		// 	if (this.beforePageRoute == 'pages/message/message') {
		// 		this.fromId = JSON.parse(options.transmitData).fromId;
		// 		this.fromName = JSON.parse(options.transmitData).fromName;
		// 		this.userAvatar = JSON.parse(options.transmitData).avatar;
		// 		this.userPhone = JSON.parse(options.transmitData).mobile;
		// 		this.queryChatPageList({
		// 			pageNo: this.currentPage,
		// 			pageSize: this.pageSize,
		// 			fromId: this.fromId
		// 		},true)
		// 	} else {
		// 		this.getTradeOrderUserCareInfoEvent({orderId: options.transmitData})
		// 	};
			
		// 	// socket初始化
		// 	this.init();
	 
		// 	// 定时器，定时判断socket有没有掉线
		// 	this.timer = setInterval(() => {
		// 		this.isSocketConnct()
		// 	}, 3000);

			uni.onKeyboardHeightChange(res => {
				//这里正常来讲代码直接写
				//this.keyboardHeight=this.rpxTopx(res.height)就行了
				//但是之前界面ui设计聊天框的高度有点高,为了不让键盘和聊天输入框之间距离差太大所以我改动了一下。
				this.keyboardHeight = this.rpxTopx(res.height)
				if(this.keyboardHeight<0)this.keyboardHeight = 0
			})
		},
		
		onUnload() {
			if (this.newReceiveMessageId !== '') {
				// this.chatMessageReadEvent(this.newReceiveMessageId)
			};
			uni.offKeyboardHeightChange(() =>{});
			// 关闭定时器(定时判断是否断开)
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null
			};
			// 关闭定时器(socket心跳)
			if (this.socketTimer) {
				clearInterval(this.socketTimer);
				this.socketTimer = null
			};
			// 关闭Socket
			this.closeSocket()
		},
		
		methods: {
			...mapMutations([
				'changeSocketOpen',
				'storeCurrentIndex',
				'storeLocationMessage'
			]),
			
      goback() {
        uni.navigateBack()
      },
			
			focus(){
				this.scrollToBottom()
			},
			
			blur(){
				this.scrollToBottom()
			},
			 
			// 最外层盒子点击事件
			wrapperClickEvent () {
				this.triangleRectListInfoShow = false;
			},
			
			// 创建工单列表显示事件
			creatWorkOrderListShowEvent () {
				this.triangleRectListInfoShow = !this.triangleRectListInfoShow;
			},
			
			// 创建工单事件
			creatWorkOrderEvent (item,index) {
				this.triangleRectListInfoShow = false;
				if (item == '运送') {
					uni.navigateTo({
						url: '/createWorkerOrderPackage/pages/createWorkerOrder/index/index'
					})
				} else if (item == '工程') {
					uni.navigateTo({
						url: '/createWorkerOrderPackage/pages/createWorkerOrder/createProjectWorkerOrder/createProjectWorkerOrder'
					})
				} else if (item == '事务') {
					uni.navigateTo({
						url: '/createWorkerOrderPackage/pages/createWorkerOrder/createAffairWorkerOrder/createAffairWorkerOrder'
					})
				} else if (item == '环境') {
					this.storeLocationMessage({});
					uni.navigateTo({
						url: '/createWorkerOrderPackage/pages/createWorkerOrder/createEnvironmentWorkerOrder/createEnvironmentWorkerOrder'
					})
				}
			}, 
			
			// 修改工单事件
			modificationWorkOrderEvent () {
				this.storeCurrentIndex(0);
				if (this.triangleRectListInfoShow) {
					this.triangleRectListInfoShow = false;
				};
				uni.navigateTo({
					url: '/workerOrderMessagePackage/pages/workerOrderMessage/index/index'
				})
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟秒),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟秒)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				let seconds = currentDate.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// 查询要联系的患者信息(从订单界面进入此页面)
			getTradeOrderUserCareInfoEvent (data) {
				this.showLoadingHint = true;
				getTradeOrderUserCareInfo(data).then((res) => {
					if ( res && res.data.code == 0) {
						this.fromName = res.data.data.userName;
						this.fromId = res.data.data.userId;
						this.userAvatar = res.data.data.userAvatar;
						this.userPhone = res.data.data.userPhone;
						this.queryChatPageList({
							pageNo: this.currentPage,
							pageSize: this.pageSize,
							fromId: this.fromId
						},true)
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
			
			// px转换成rpx
			rpxTopx(px){
				let deviceWidth = uni.getSystemInfoSync().windowWidth;
				let rpx = ( 750 / deviceWidth ) * Number(px);
				return Math.floor(rpx)
			},
			
			// 监视聊天发送栏高度
			sendHeight(){
				setTimeout(()=>{
					let query = uni.createSelectorQuery();
					query.select('.send-msg').boundingClientRect();
					query.exec(res =>{
						this.bottomHeight = this.rpxTopx(res[0].height)
					})
				},10)
			},
			
			// 发送心跳包
			startHeartbeat () {
				const heartbeatMsg = 'ping';
				const sendHeartbeat = () => {
					if (this.socketOpen) {
						uni.sendSocketMessage({
							data: heartbeatMsg,
						}).catch(error => {
							console.log('发送心跳消息失败:', error);
							this.reconnect()
						})
					}
				};
				this.socketTimer = setInterval(sendHeartbeat, 2000)
			},
			
			// 开始重连
			reconnect () {
				if (!this.socketOpen) {
					clearTimeout(this.socketTimer);
					this.socketTimer = setTimeout(() => {
						console.log('开始重连...');
						this.init();
					},200)
				}
			},
			
			// 发送消息(socket)
			sendSocketMessage(msg) {
				let that = this;
				try {
				 const messageContent = JSON.stringify({
						text: msg, // 消息内容
						toUserId: this.fromId, // 接受者用户 ID
						userType: 1  // 用户类型 发送给APP端用户 为1， 发送给管理的为 2
					});
					const jsonMessage = JSON.stringify({
						type: 'chat-message-send', // 消息类型 固定
						content: messageContent   //  消息内容
					});
					if (this.socketOpen) {
						uni.sendSocketMessage({
							data: jsonMessage,
							success: (res) => {
								console.log('发送成功',res);
								setTimeout(() => {
									that.sendMessageHandle(msg)
								}, 300)
							},
							fail: (err) => {
								// 发送失败处理
								this.$refs.uToast.show({
									message: err,
									type: 'error',
									position: 'center'
								})
							}
						})
					} else {
						// Socket没有开启，重新连接并重新发送消息,并将推入列表的消息的状态变为失败
						this.fullMsgList[this.fullMsgList.length - 1]['status'] = 'fail';
						this.init();
						// setTimeout(() => {
						// 	this.sendSocketMessage(msg)
						// },300)
					}
				} catch (err) {
					this.$refs.uToast.show({
						message: err,
						type: 'error',
						position: 'center'
					})
				}
			},
	 
			// 判断是否连接
			isSocketConnct() {
				if (!this.socketOpen) {
					this.init()
				}
			},
	 
			// 初始化
			init() {
				this.connect();
				this.openSocket();
				this.onclose();
				this.onSocketMessage()
			},
	 
			// 建立连接
			connect() {
				uni.connectSocket({
					url: `wss://dev.nurse.blinktech.cn/nurse/infra/ws?token=${store.getters.token}`,
					success: (res) => {
						console.log('成功',res)
					},
					fail: (err) => {
						console.log('失败',err)
					}
				})
			},
	 
			// 监听关闭
			onclose() {
				let that = this;
				uni.onSocketClose((res) => {
					that.changeSocketOpen(false);
				})
			},
	 
			// 关闭
			closeSocket() {
				uni.closeSocket({
					success:() => {
						console.log("退出成功")
					}
				})
			},
	 
			// 打开Soceket
			openSocket() {
				let that = this;
				uni.onSocketOpen((res) => {
					that.changeSocketOpen(true);
					that.startHeartbeat();
					console.log('打开Soceket');
				})
			},
			
			// 打开Soceket失败
			openSocketErr() {
				uni.onSocketError(res => {
					let that = this;
					that.changeSocketOpen(false);
					that.reconnect();
				})
			},	
	 
			// 接收事件
			onSocketMessage() {
				let that = this;
				uni.onSocketMessage((res) => {
					// 心跳返回的消息不做处理
					if (res.data == 'pong') {
						return
					};
					let obj = JSON.parse(res.data)
					that.onMessageHandle(obj)
				})
			},
	 
			// 接收到事件后处理的方法
			onMessageHandle(obj) {
				if (obj.type == 'chat-message-receive') {
					if (!obj.hasOwnProperty('content')) {
						return
					};
					this.newReceiveMessageId = JSON.parse(obj.content).fromUserId;
					this.chatMessageReadEvent(JSON.parse(obj.content).fromUserId);
					let temporaryMessageList = [{
						content: JSON.parse(obj.content)['text'],
						createTime: new Date().getTime(),
						fromAvatar: this.userAvatar,
						fromId: JSON.parse(obj.content)['formUserId'],
						me: false,
						status: 'success',
						read: false,
						toId: this.userInfo.userId
					}];
					this.fullMsgList = [...this.fullMsgList,...temporaryMessageList];
					this.scrollToBottom()
				} else {
					if (!obj.hasOwnProperty('content')) {
						// if (this.fullMsgList[this.fullMsgList.length - 1]['status'] == 'fail') {
						// 	this.fullMsgList[this.fullMsgList.length - 1]['status'] = ''
						// } else {
						// 	this.fullMsgList[this.fullMsgList.length - 1]['status'] = ''
						// }
					}
				}
			},
			
			// 更新消息为已读
			chatMessageReadEvent (data) {
				chatMessageRead(data).then((res) => {
					if ( res && res.data.code == 0) {
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'center'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'center'
					})
				})
			},
	 
			// 发送消息后处理的方法
			sendMessageHandle(msg) {
				console.log('发送成功了',msg);
			},
			
			scrolltoupper () {
				let totalPage = Math.ceil(this.totalCount/this.pageSize);
				if (this.currentPage >= totalPage) {
					this.status = 'nomore'
				} else {
					this.status = 'loadmore';
					this.currentPage = this.currentPage + 1;
					this.queryChatPageList({
						pageNo: this.currentPage,
						pageSize: this.pageSize,
						fromId: this.fromId
					},false)
				}
			},
			
			// 获取当前消息分页信息
			async queryChatPageList (data,flag) {
				if (flag) {
					this.showLoadingHint = true
				} else {
					this.showLoadingHint = false;
					this.infoText = '';
					this.status = 'loading';
				};
				this.msgList = [];
				getUserChatPage(data).then((res) => {
					if ( res && res.data.code == 0) {
						if (JSON.stringify(res.data.data) == '{}') {
							this.isShowNoData = true;
							this.showLoadingHint = false;
							return
						};
						this.totalCount = res.data.data.total;
						this.msgList = res.data.data.list;
						let reverseMsgList = this.msgList.reverse();
						this.fullMsgList = [...reverseMsgList,...this.fullMsgList];
						this.$nextTick(async () => {
							const query = uni.createSelectorQuery().in(this);
							query.select('.chat-body')
							.boundingClientRect(data => {
								// data.height 为已经渲染的聊天列表内容高度
								// this.scrollHeight 为上一次聊天列表内容高度, 如果当前为第一次, 那么this.scrollHeight应该为0
								// 设置滚动条的高度
								this.scrollTop = data.height - this.scrollHeight;
								// (注意: 如果在模板中, upper-threshold设置的值不为0, 为50, 那么可以加上该值), 如:
								// this.scrollTop = data.height - this.scrollHeight + 50
								// 将本次列表渲染后的内容高度记录下来, 方便下次加载时使用
								this.scrollHeight = data.height
							}).exec()
						});
						if (this.fullMsgList.length == 0) {
							this.isShowNoData = true;
						}
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					if (flag) {
						this.showLoadingHint = false;
					} else {
						let totalPage = Math.ceil(this.totalCount/this.pageSize);
						if (this.currentPage >= totalPage) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore';
						}	
					}
				})
				.catch((err) => {
					if (flag) {
						this.showLoadingHint = false;
					} else {
						this.status = 'loadmore'
					};
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
			},
				
			// 滚动至聊天底部
			scrollToBottom(e) {
				setTimeout(() => {
					let query = uni.createSelectorQuery().in(this);
					query.select('#scrollview').boundingClientRect();
					query.select('#msglistview').boundingClientRect();
					query.exec((res) => {
						if(res[1].height > res[0].height) {
							this.scrollTop = this.rpxTopx(res[1].height - res[0].height)
						}
					})
				},15)
			},
			
			// 语音事件
			handleVoiceSend () {},
			
			// 表情事件
			handleMemeSend () {},
			
			// 发送消息
			handleSend() {
				//如果消息为空
				if(this.chatMsg.match(/^[ ]*$/) || this.chatMsg == ''){
					this.$refs.uToast.show({
						message: '不能发送空白消息',
						type: 'default',
						position: 'center'
					})
				} else {
					let obj = {
						content: this.chatMsg,
						createTime: new Date().getTime(),
						fromAvatar: this.personPhotoSource,
						status: 'sending',
						me: true
					};
					this.sendSocketMessage(this.chatMsg);
					this.fullMsgList = this.fullMsgList.concat(obj);
					this.chatMsg = '';
					this.scrollToBottom()
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100%;
	};
	$chatContentbgc: #1E86FD;
	$sendBtnbgc: #4F7DF5;
	view,button,text,input,textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	};
	/* 聊天消息 */
	.chat {
		@include content-wrapper;
		height: 100vh !important;
		box-sizing: border-box;
		position: relative;
		::v-deep .u-popup {
			flex: none !important
		};
		.top-background-area {
			width: 100%;
			background: #4873C0;
			position: absolute;
			top: 0;
			left: 0
		};
    .topTabbar {
			width: 100%;
			display: flex;
			box-sizing: border-box;
			justify-content: center;
			align-items: center;
			position: relative;
			> .icon {
				margin: 0 4rpx 0 20rpx;
			};
			.message-count {
				font-size: 14px;
			};
			.text {
				text-align: center;
				width: 200px;
				padding: 0 10px;
				box-sizing: border-box;
				font-size: 16px;
				font-weight: 700;
				color: #fff;
				flex: 1;
				@include no-wrap;
			};
			.create-order-area {
				margin-right: 10px;
				position: relative;
				.triangle-rect-list-info {
					z-index: 1000 !important;
					position: absolute;
					width: 67px;
					background-color: #fff;
					transform: translateX(-50%);
					left: 50%;
					display: flex;
					flex-direction: column;
					.triangle-rect-list-content {
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 14px;
						color: #101010;
						border-bottom: 1px solid #BBBBBB;
						box-sizing: border-box;
						&:last-child {
							border: none !important;
						}
					};
				};
				.triangle-rect-list-info:before {
					content: ""; /* 必须设置content属性 */
					position: absolute;
					top: -10px; /* 向上移动以覆盖长方形的顶部 */
					left: 50%; /* 水平居中 */
					transform: translateX(-50%); /* 微调位置以完全居中 */
					width: 0; /* 三角形宽度为0 */
					height: 0; /* 三角形高度为0 */
					border-left: 10px solid transparent; /* 左边框透明 */
					border-right: 10px solid transparent; /* 右边框透明 */
					border-bottom: 15px solid #fff; /* 下边框颜色和大小，形成三角形 */
				}
			};
			.view-order-area {
			};
			.button {
				width: 10%;
				margin: auto 20rpx auto 0rpx;
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
		.scroll-view {
			flex: 1;
			::-webkit-scrollbar {
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
				color: transparent;
			};
			// background-color: orange;
			background-color: #EFEFEF;
			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;
				height: 100%;
				// background-color:skyblue;
				.send-time-box {
					height: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
					.send-time {
						margin: 0 auto;
						text-align: center;
						padding: 3px 6px;
						box-sizing: border-box;
						color: #fff;
						font-size: 12px;
						border-radius: 12px;
						background: #CECECE;
					}
				};
				.self {
					justify-content: flex-end;
				};
				.item {
					display: flex;
					padding: 23rpx 30rpx;
					// background-color: greenyellow;
					.right {
						background-color: $chatContentbgc;
						color: #fff !important;
					};
					.left {
						background-color: #FFFFFF;
						color: #101010 !important;
					};
          // 聊天消息的三角形
					.right::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						left: 100%;
						top: 10px;
						border: 12rpx solid transparent;
						border-left: 12rpx solid $chatContentbgc;
					};
					.left::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						top: 10px;
						right: 100%;
						border: 12rpx solid transparent;
						border-right: 12rpx solid #FFFFFF;
					};
					.content {
						position: relative;
						max-width: 486rpx;
						border-radius: 8rpx;
						word-wrap: break-word;
						padding: 22rpx 22rpx;
						margin: 0 24rpx;
						border-radius: 5px;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333333;
						line-height: 42rpx;
						::v-deep .u-icon {
							position: absolute;
							top: 50%;
							left: -44rpx;
							transform: translateY(-50%)
						};
						image {
							width: 20px;
							height: 20px;
							position: absolute;
							top: 50%;
							left: -48rpx;
							transform: translateY(-50%)
						}
					};
					.avatar {
						display: flex;
						justify-content: center;
						width: 78rpx;
						height: 78rpx;
						background: $sendBtnbgc;
						border-radius: 50rpx;
						overflow: hidden;
						image {
							align-self: center;
						}
					}
				}
			}
		};
		/* 底部聊天发送栏 */
		.chat-bottom {
			width: 100%;
			background: #E5E5E5;
			transition: all 0.1s ease;
			padding-bottom: 30px;
			box-sizing: border-box;
			.send-msg {
				display: flex;
				background: #E5E5E5;
				align-items: top;
				width: 100%;
				min-height: 177rpx;
				position: fixed;
				padding: 0 6px;
				box-sizing: border-box;
				bottom: 0;
				transition: all 0.1s ease;
				.voice-chat {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 30px;
					height: 30px;
					margin-top: 4px;
					>image {
						width: 30px;
						height: 30px;
						vertical-align: middle;
					}
				};
				.uni-textarea {
					padding-bottom: 70rpx;
					flex: 1;
					margin: 0 6px 0 4px;
					textarea {
						width: 100% !important;
						min-height: 40px;
						max-height: 500rpx;
						background: #f1f1f1;
						font-size: 32rpx;
						font-family: PingFang SC;
						border-radius: 4px;
						color: #333333;
						line-height: 40rpx;
						padding: 5rpx 8rpx;
				    text-indent: 30rpx;
					}
				};    
				.send-btn {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 70rpx;
					width: 67px;
					height: 33px;
					margin-top: 4px;
					>image {
						width: 28px;
						height: 28px;
						vertical-align: middle;
						&:last-child {
							width: 33px;
							height: 33px;
							margin-left: 6px;
						}
					}
				}
			}
		}
	}
</style>