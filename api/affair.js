import request from '@/api/request';
import Qs from 'qs'

// 事务任务列表查询
export function affairList (state,proId,flag) {
	return request({
		url: `project/bxTask/new/queryTask?state=${state}&proId=${proId}&flag=${flag}`,
		method: 'get'
	})
};

// 事务任务取消
export function cancelAffairTask (data) {
  return request({
    url: 'project/bxTask/cancelTask',
    method: 'put',
    data
  })
};

// 维修任务编辑
export function editAffairTask (data) {
  return request({
    url: 'project/bxTask/update',
    method: 'put',
    data
  })
};


// 事务任务创建
export function createAffairTask (data) {
  return request({
    url: 'project/bxTask/cancelTask',
    method: 'put',
    data
  })
};

// 事务任务取消原因查询
export function queryAffairTaskCancelReason(proId) {
  return request({
    url: `project/cancel/queryAll?proId=${proId}`,
    method: 'get'
  })
};

// 事务任务任务详情
export function getAffairTaskDetails(id) {
    return request({
        url: `clean/cleanTask/query/${id}`,
        method: 'get'
    })
}

// 查询建筑信息
export function queryStructure(proId) {
  return request({
    url: `project/structure/queryAll?proId=${proId}`,
    method: 'get'
  })
};

// 查询科室信息
export function queryDepartment(proId,structId) {
  return request({
    url: `project/department/queryAll?proId=${proId}&structId=${structId}`,
    method: 'get'
  })
};