import { setCache, getCache } from '@/common/js/utils'
import { getDefaultProjectState } from '@/common/js/resetStore/resetStore.js'
export default {
  state:{
		state: getDefaultProjectState(),
  },

  getters:{
		temporaryStorageCreateRepairsTaskMessage:(state) => {
			state.userInfo = getCache('temporaryStorageCreateRepairsTaskMessage') ? getCache('temporaryStorageCreateRepairsTaskMessage') : {};
			return state.temporaryStorageCreateRepairsTaskMessage
		}
  },

  mutations:{
    // 保存暂存创建维修任务的信息
    changeTemporaryStorageCreateRepairsTaskMessage (state, payLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('temporaryStorageCreateRepairsTaskMessage', playLoad);
				state.temporaryStorageCreateRepairsTaskMessage = payLoad
			}
    }
  },
  
  actions:{}
}
