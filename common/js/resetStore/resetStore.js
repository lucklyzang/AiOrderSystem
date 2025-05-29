// 登录信息store的初始值
export function getDefaultLoginState() {
	return {
		userInfo: {},
		token: null, //请求token,
		isLogin: false,
		overDueWay: false,
		userBasicInfo: null,
		nurseRankDictData: [],
		socketOpen: false
	}	
}