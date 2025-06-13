import { setCache, getCache } from '@/common/js/utils'
import { getDefaultTransState } from '@/common/js/resetStore/resetStore.js'
export default {
  state:{
		state: getDefaultTransState(),
  },

  getters:{
		dispatchTaskMessage:(state) => {
			state.dispatchTaskMessage = getCache('dispatchTaskMessage') ? getCache('dispatchTaskMessage') : {};
			return state.dispatchTaskMessage
		}
  },

  mutations:{
		// 保存运送任务的信息
		changeDispatchTaskMessage (state, payLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('dispatchTaskMessage', playLoad);
				state.dispatchTaskMessage = payLoad
			}
		}
  },
  
  actions:{}
}
