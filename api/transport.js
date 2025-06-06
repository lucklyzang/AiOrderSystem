import request from '@/api/request';
import Qs from 'qs'

// 查询运送类型
export function queryTransportType(data) {
  return request({
    url: 'taskType/queryAll',
    method: 'get',
    params: data
  })
};

// 查询运送类型分类
export function queryTransportTypeClass(data) {
  return request({
    url: 'taskTypeClass/queryAll',
    method: 'get',
    params: data
  })
};

// 查询调度任务(根据id)
export function getDispatchTaskMessageById(taskId,tempFlag) {
  return request({
    url: store.getters.templateType == 'template_one' ? `task/query/${taskId}/${tempFlag}` : `dispatch/app/query/${taskId}`,
    method: 'get'
  })
};

// 查询目的地(科室)
export function queryAllDestination(proId) {
  return request({
    url: `department/dict/${proId}`,
    method: 'get'
  })
};

// 查询转运工具
export function queryTransportTools(data) {
  return request({
    url: 'tool/queryAll',
    method: 'get',
    params: data
  })
};

// 生成调度任务(一个病人)
export function generateDispatchTask(data) {
  return request({
    url: 'task/add',
    method: 'post',
    data
  })
};

// 生成调度任务(多个病人)
export function generateDispatchTaskMany(data) {
  return request({
    url: 'dispatch/app/save',
    method: 'post',
    data
  })
};

// 查询调度任务(分配给本人的已完成)
export function getDispatchTaskComplete(data) {
  return request({
    url: store.getters.templateType == 'template_one' ? 'task/queryTask':'dispatch/queryTask',
    method: 'get',
    params: data
  })
};

// 取消原因查询
export function queryDispatchTaskCancelReason(data) {
  return request({
    url: 'cancel/queryAll',
    method: 'get',
    params: data
  })
};

// 调度任务的操作(取消)
export function updateDispatchTask(data) {
  return request({
    url: store.getters.templateType == 'template_one' ? 'task/update':'dispatch/update',
    method: 'put',
    data
  })
};

// 调度任务催单
export function taskReminder(proId,taskId) {
  return request({
    url: store.getters.templateType == 'template_one' ? `task/reminder/${proId}/${taskId}` : `dispatch/reminder/${proId}/${taskId}`,
    method: 'get'
  })
};

// 根据科室查询房间信息
export function departmentRoom(data) {
  return request({
    url: 'bxSpace/loadData',
    method: 'get',
    params: data
  })
};

/**
 * 预约任务
*/


// 查询预约任务
export function queryAppointTaskMessage(data) {
  return request({
    url: 'bookTask/queryTask',
    method: 'get',
    params: data
  })
};

/**
 * 循环任务
*/

// 查询循环任务
export function queryCirculationTask(data) {
  return request({
    url: 'circleTask/workerTask',
    method: 'get',
    params: data
  })
};

// 查询反馈意见
export function queryFeedback(data) {
  return request({
    url: 'feedbackConf/queryAll',
    method: 'get',
    params: data
  })
};

// 提交总体反馈意见
export function submitFeedback(data) {
  return request({
    url: 'wholeFeedback/add',
    method: 'post',
    data
  })
};

// 提交任务反馈意见
export function submitTaskFeedback(data,type) {
  return request({
    url: `feedback/feedback/${type}`,
    method: 'post',
    data
  })
};

// 工程维修

// 巡检问题上报
export function reportProblem(data) {
  return request({
    url: 'bxTask/reportProblem',
    method: 'post',
    data
  })
};

// 查询任务类型
export function queryTaskType(data) {
  return request({
    url: 'bxTaskType/queryAll',
    method: 'get',
    params: data
  })
};

// 查询协助人员
export function helpWorkers(data) {
  return request({
    url: 'bxWorker/workers',
    method: 'get',
    params: data
  })
};

// 查询备注信息
export function getRemarks(data) {
  return request({
    url: 'bxRemark/remarks',
    method: 'get',
    params: data
  })
};

// 查询工程任务列表
export function getMaintainTask(data) {
  return request({
    url: 'bxTask/queryTask',
    method: 'get',
    params: data
  })
};

// 任务取消
export function projectTaskCancel(data) {
  return request({
    url: 'bxTask/cancelTask',
    method: 'put',
    data
  })
};

// 工程任务催单
export function projectTaskReminder(proId,taskId) {
  return request({
    url: `bxTask/reminder/${proId}/${taskId}`,
    method: 'get'
  })
};

// 任务取消原因
export function projectTaskCancelReason(data) {
  return request({
    url: 'cancel/queryAll',
    method: 'get',
    params: data
  })
}

// 查询创建调度任务时是否配置接触隔离选项
export function queryTransConfig (proId, key) {
  return request({
    url: `paramConfig/queryByKey?proId=${proId}&key=${key}`,
    method: 'get'
  })
};

// 维修任务列表查询
export function repairsList (state,proId,flag) {
    return request({
      url: `bxTask/new/queryTask?state=${state}&proId=${proId}&flag=${flag}`,
      method: 'get'
    })
  };

// 维修任务详情查询
export function repairsDetails (id) {
  return request({
    url: `bxTask/query/${id}`,
    method: 'get'
  })
};

// 维修任务任务类型查询
export function getRepairsTaskType (proId) {
  return request({
    url: `bxTaskType/init/${proId}`,
    method: 'get'
  })
};

// 维修任务创建
export function createRepairsTask (data) {
  return request({
    url: 'bxTask/add',
    method: 'post',
    data
  })
};

// 维修任务分配
export function assignRepairsTask (data) {
  return request({
    url: 'bxTask/assignTask',
    method: 'put',
    data
  })
};

// 维修任务延迟
export function delayRepairsTask (data) {
  return request({
    url: 'bxTask/delayTask',
    method: 'put',
    data
  })
};

// 维修任务取消
export function cancelRepairsTask (data) {
  return request({
    url: 'bxTask/cancelTask',
    method: 'put',
    data
  })
};

// 维修任务完成
export function completeRepairsTask (data) {
  return request({
    url: 'bxTask/completeTask',
    method: 'put',
    data
  })
};

// 维修任务编辑

export function editRepairsTask (data) {
  return request({
    url: 'bxTask/update',
    method: 'put',
    data
  })
};

// 维修任务取消原因查询
export function queryRepairsTaskCancelReason(proId) {
  return request({
    url: `cancel/queryAll?proId=${proId}`,
    method: 'get'
  })
};

// 维修任务延迟原因查询
export function queryRepairsTaskDelayReason(proId) {
  return request({
    url: `delay/queryAll?proId=${proId}`,
    method: 'get'
  })
};

// 维修任务工具查询
export function queryRepairsTaskTool(proId) {
  return request({
    url: `bxTool/queryAll?proId=${proId}`,
    method: 'get'
  })
};

// 维修任务物料查询
export function queryRepairsTaskMaterial(proId) {
  return request({
    url: `bxMaterial/queryAllFromStorageServer?proId=${proId}`,
    method: 'get'
  })
};

// 查询建筑信息
export function queryStructure(proId) {
  return request({
    url: `structure/queryAll?proId=${proId}`,
    method: 'get'
  })
};

// 查询科室信息
export function queryDepartment(proId,structId) {
  return request({
    url: `department/queryAll?proId=${proId}&structId=${structId}`,
    method: 'get'
  })
};

// 查询空间信息
export function querySpace(proId,depId) {
  return request({
    url: `bxSpace/queryAll?proId=${proId}&depId=${depId}`,
    method: 'get'
  })
};

// 查询维修员
export function getTransporter(proId) {
  return request({
    url: `worker/workerList/${proId}`,
    method: 'get'
  })
};
