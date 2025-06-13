import { setCache, getCache } from '@/common/js/utils'
import { getDefaultProjectState } from '@/common/js/resetStore/resetStore.js'
export default {
  state:{
		state: getDefaultProjectState(),
  },

  getters:{
		schedulingTaskDetails:(state) => {
			state.schedulingTaskDetails = getCache('schedulingTaskDetails') ? getCache('schedulingTaskDetails') : {};
			return state.schedulingTaskDetails
		}
  },

  mutations:{
		// 保存工程订单详情的信息
		changeSchedulingTaskDetails (state, payLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('schedulingTaskDetails', playLoad);
				state.schedulingTaskDetails = payLoad
			}
		}
  },
  
  actions:{}
}
