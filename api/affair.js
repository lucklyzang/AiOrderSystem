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

// 事务任务取消原因查询
export function queryAffairTaskCancelReason(proId) {
  return request({
    url: `project/cancel/queryAll?proId=${proId}`,
    method: 'get'
  })
};