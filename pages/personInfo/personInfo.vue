<template>
	<view class="content-box">
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import _ from 'lodash'
	
	import {
		setCache,
		removeAllLocalStorage,
		fenToYuan
	} from '@/common/js/utils'
	import { } from '@/api/user.js'
	import navBar from "@/components/zhouWei-navBar"
	export default {
		components: {
			navBar
		},
		data() {
			return {
				infoText: '开启中···',
				showLoadingHint: false,
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo'
			]),
			userName() {
			},
			proId() {
			},
			proName() {
			},  
			workerId() {
			},
			depName() {
			},
			accountName() {
			}
		},
		onShow() {
		},
		methods: {
			...mapMutations([
				'changeUserBasicInfo'
			]),
			
			// 获取用户基本信息
			queryUserBasicMessage (flag) {
				if (flag) {
					this.showLoadingHint = true;
					this.infoText = '加载中...';
				};
				getUserMessage().then((res) => {
					if ( res && res.data.code == 0) {
						this.changeUserBasicInfo(res.data.data);
						this.personPhotoSource = !this.userBasicInfo.avatar ? this.defaultPersonPhotoIconPng :  this.userBasicInfo.avatar;
						this.niceNameValue = !this.userBasicInfo.nickname ? this.niceNameValue : this.userBasicInfo.nickname;
						this.isSendOrdersValue = this.userBasicInfo.receive;
						this.isAuth = this.userBasicInfo.auth;
						this.cashOut = this.userBasicInfo.cashOut;
					} else {
						this.$refs.uToast.show({
							message: res.data.msg,
							type: 'error',
							position: 'bottom'
						})
					};
					if (flag) {
						this.showLoadingHint = false
					}
				})
				.catch((err) => {
					if (flag) {
						this.showLoadingHint = false
					};
					this.$refs.uToast.show({
						message: err.message,
						type: 'error',
						position: 'bottom'
					})
				})
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
		::v-deep .u-popup {
			flex: none !important
		}
	}
</style>
