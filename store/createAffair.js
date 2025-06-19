import { setCache, getCache } from '@/common/js/utils'
import { getDefaultAffairState } from '@/common/js/resetStore/resetStore.js'
export default {
  state:{
		state: getDefaultAffairState(),
  },

  getters:{
		affairTaskMessage:(state) => {
			state.affairTaskMessage = getCache('affairTaskMessage') ? getCache('affairTaskMessage') : {};
			return state.affairTaskMessage
		}
  },

  mutations:{
		// 保存事务订单的信息
		changeAffairTaskMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('affairTaskMessage', playLoad);
				state.affairTaskMessage = playLoad
			}
		}
  },
  
  actions:{}
}
