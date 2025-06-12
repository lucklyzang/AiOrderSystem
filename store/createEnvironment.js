import { setCache, getCache } from '@/common/js/utils'
import { getDefaultEnvironmentState } from '@/common/js/resetStore/resetStore.js'
export default {
  state:{
		state: getDefaultEnvironmentState(),
  },

  getters:{
		locationMessage:(state) => {
			state.locationMessage = getCache('locationMessage') ? getCache('locationMessage') : [];
			return state.locationMessage
		},
		timeMessage: (state) => {
			// state.timeMessage = JSON.parse(getCache('timeMessage')) ? JSON.parse(getCache('timeMessage')) : {};
			return state.timeMessage
		},
		ossMessage:(state) => {
			state.ossMessage = getCache('ossMessage') ? getCache('ossMessage') : {};
			return state.ossMessage
		}
  },

  mutations:{
    // 保存环境任务添加的位置信息
    storeLocationMessage (state, payLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('locationMessage', playLoad);
				state.locationMessage = payLoad
			}
    },
		//保存阿里云签名信息
		changeOssMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('ossMessage', playLoad);
				state.ossMessage = playLoad
			}
		},
		//保存阿里云签名过期日期
		changeTimeMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('timeMessage', playLoad);
				state.timeMessage = playLoad
			}
		}
  },
  
  actions:{}
}
