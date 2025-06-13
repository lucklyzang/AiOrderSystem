// 登录信息store的初始值getDefaultCommonState
export function getDefaultLoginState() {
	return {
		userInfo: {},
		token: null, //请求token,
		isLogin: false,
		overDueWay: false,
		templateType: ''
	}	
}

// 公共信息store的初始值
export function getDefaultCommonState() {
	return {
		//状态栏高度
		statusBarHeight: 0,
		//导航栏栏高度
		navigationBarHeight: 0,
		// 胶囊信息
		capsuleMessage: {}
	}	
}

// 工程订单信息store的初始值
export function getDefaultProjectState() {
	return {
		// 工程订单详情
		schedulingTaskDetails: {}
	}	
}

// 运送订单信息store的初始值
export function getDefaultTransState() {
	return {
		// 运送订单详情
		dispatchTaskMessage: {}
	}	
}

// 环境订单信息store的初始值
export function getDefaultEnvironmentState() {
	return {
		timeMessage: {},
		ossMessage: {},
		locationMessage: [],
		cleanTaskDetails: {}
	}	
}

// 事务订单信息store的初始值
export function getDefaultAffairState() {
	return {
		// 事务订单详情
		affairTaskMessage: {}
	}	
}