import request from '@/api/request';
import Qs from 'qs'

// 即时保洁任务新增
export function addForthwithCleanTask(data) {
    return request({
        url: 'clean/cleanTask/add',
        method: 'post',
        data
    })
}

// 查询当天保洁员(保洁管理)
export function attendanceWorkerList(proId) {
    return request({
        url: `clean/attendance/forIndex/${proId}`,
        method: 'get'
    })
}

// 获取违反标准信息
export function getViolateStandardMessage(data) {
    return request({
        url: 'clean//cleanArea/standards',
        method: 'get',
        params: data
    })
}

// 获取建筑信息
export function getArchitectureMessage(data) {
    return request({
        url: 'clean/structure/query2Select',
        method: 'get',
        params: data
    })
}

// 获取科室信息
export function getDepartmentMessage(data) {
    return request({
        url: 'clean/department/query2Select',
        method: 'get',
        params: data
    })
}

// 获取目的区域信息
export function getGoalAreaMessage(data) {
    return request({
        url: 'clean/goalArea/queryAll',
        method: 'get',
        params: data
    })
}

// 获取功能区信息
export function getFunctionAreaMessage(data) {
    return request({
        url: 'clean/cleanArea/queryAll',
        method: 'get',
        params: data
    })
}

// 获取阿里云签名接口
export function getAliyunSign() {
	return request({
	    url: 'clean/oss/getSign',
	    method: 'get'
	})
}