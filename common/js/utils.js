/*
 * 存储uni localStorage
 * @param{String} name key值
 * @param{String} data value值
*/
export const setCache = (name, data) => {
	try {
		uni.setStorageSync(name, data);
	} catch (e) {
		console.log(e)
	}
}

/*
 * 获取uni localStorage
 * @param{String} name key值
*/
export const getCache = (name) => {
	let data;
	try {
		data = uni.getStorageSync(name);
	} catch (e) {
		console.log(e);
	}
	return data
}

/*
 * 删除指定key的uni localStorage
 * @param{String} name key值
*/
export const removeCache = (name) => {
	try {
		uni.removeStorageSync(name);
	} catch (e) {
		console.log(e);
	}
}

/*
 * 判断指定key在uni localStorage是否存在
 * @param{String} name key值
*/
export const checkCache = (name) => {
	let value;
	try {
		const res = uni.getStorageInfoSync()
		value = res.keys.includes(name)
	} catch (e) {
		console.log(e)
	}
	return value
}

/*
 * 删除本地uni localStorage
 * 
*/
export const clearCache = () => {
	try{
		uni.clearStorageSync();
	} catch (e){
		console.log(e)
	}

}

/*
 * 格式化当前日期
 * 
*/
export const getDate = () => {
	var date = new Date();
	var year = date.getFullYear();        //年 ,从 Date 对象以四位数字返回年份
	var month = date.getMonth() + 1;      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
	var day = date.getDate();             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
	
	var hours = date.getHours();          //小时 ,返回 Date 对象的小时 (0 ~ 23)
	var minutes = date.getMinutes();      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
	var seconds = date.getSeconds();      //秒 ,返回 Date 对象的秒数 (0 ~ 59)   
	//获取当前系统时间  
	var currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	//修改月份格式
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	//修改日期格式
	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}
	//修改小时格式
	if (hours >= 0 && hours <= 9) {
		hours = "0" + hours;
	}
	//修改分钟格式
	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}
	//修改秒格式
	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}
	//获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)+ " " + hours + ":" + minutes + ":" + seconds
	var currentFormatDate = year + "-" + month + "-" + day;
	return currentFormatDate

}

/*
 * 获取字符串的长度
 * @param{String} str 指定字符串
*/
export const getStringLength = (str) => {
	let realLength = 0, len = str.length, charCode = -1;
	for (let i = 0; i < len; i++) {
			charCode = str.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) realLength += 1;
			else realLength += 2;
	}
	return realLength
}

/* 
 * base64格式转化为file对象
 * @param{String} urlData base64字符串
 */

export const dataURItoBlob = (urlData) => {
    let arr = urlData.split(',');
    let type = arr[0].match(/:(.*?);/)[1];
    let fileExt = type.split('/')[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'filename.' + fileExt, {
        type: type
    });
}

/*
 * 合并重复的运送类型
 * @param{Array}
 * @return {Array}
 *
*/

export const  mergeMethods =  (testData) => {
  if (!Array.isArray(testData)) { return };
  var mergeData = [];
  for (var i = 0, len = testData.length; i < len; i++ ) {
    var temporaryObj = {typeList:[]};
    var temporaryParentTypeName = [];
    temporaryObj['typeList'].push({
      patientName: testData[i]['patientName'],
      bedNumber: testData[i]['bedNumber'],
      sex: testData[i]['sex'],
      quarantine: testData[i]['quarantine'],
      typeChildList: []
    });
    for (var innerI = 0, innerLen = testData[i]['typeList'].length; innerI < innerLen; innerI++ ) {
      // 判断运送大类是否存在已有的数组元素中
      if (testData[i]['typeList'].length == 0) { continue };
      var tragetIndex = mergeData.findIndex(function(item) { return item.parentTypeName == testData[i]['typeList'][innerI]['parentTypeName']});
      if (tragetIndex == -1) {
        // 判断该病人是否存在多个运送大类
        if (temporaryParentTypeName.indexOf(testData[i]['typeList'][innerI]['parentTypeName']) != -1) {
          temporaryObj['parentTypeName'] = testData[i]['typeList'][innerI]['parentTypeName'];
          temporaryObj['typeList'][0]['typeChildList'].push({
            taskTypeName: testData[i]['typeList'][innerI]['taskTypeName'],
            quantity: testData[i]['typeList'][innerI]['quantity'],
          })
        } else {
          var temporaryinnerObj = {typeList:[]};
          temporaryinnerObj['parentTypeName'] = testData[i]['typeList'][innerI]['parentTypeName'];
          temporaryinnerObj['typeList'].push({
            patientName: testData[i]['patientName'],
            bedNumber: testData[i]['bedNumber'],
            sex: testData[i]['sex'],
            quarantine: testData[i]['quarantine'],
            typeChildList: []
          });
          temporaryinnerObj['typeList'][0]['typeChildList'].push({
            taskTypeName: testData[i]['typeList'][innerI]['taskTypeName'],
            quantity: testData[i]['typeList'][innerI]['quantity'],
          })
          mergeData.push(temporaryinnerObj)
        }
      } else {
        // 判断病人是否存在于已有运送大类的typelist中
        var patientIndex = mergeData[tragetIndex]['typeList'].findIndex(function(item) { return item.bedNumber == temporaryObj['typeList'][0]['bedNumber']});
        if (patientIndex == -1) {
          mergeData[tragetIndex]['typeList'].push({
            patientName: testData[i]['patientName'],
            bedNumber: testData[i]['bedNumber'],
            sex: testData[i]['sex'],
            quarantine: testData[i]['quarantine'],
            typeChildList: []
          })
        };
        mergeData[tragetIndex]['typeList'][mergeData[tragetIndex]['typeList'].length-1]['typeChildList'].push({
          taskTypeName: testData[i]['typeList'][innerI]['taskTypeName'],
          quantity: testData[i]['typeList'][innerI]['quantity'],
        })
      };
      // 存储该病人信息下的运送大类(一个病人有可能会有多个运送大类)
      temporaryParentTypeName.push(testData[i]['typeList'][innerI]['parentTypeName']);
    };
    temporaryObj.hasOwnProperty('parentTypeName') && mergeData.push(temporaryObj)
  };
  return mergeData
}

/* 
  * 引用类型数据深度克隆
  * @param{Array || Object} obj
*/
export const deepClone = (obj) => {
  let newObj=Array.isArray(obj)?[]:{}
  if(obj&&typeof obj ==="object"){
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        newObj[key]=(obj && typeof obj[key]==='object')?deepClone(obj[key]):obj[key];
      }
    }
  }
  return newObj
}

/* 
 * 生成随机字符串
 */

export const randomStr = () => {
	let used = new Set();
	let result;
	let map='abcdefghijklmnopqrstuvwxyz0123456789';
	result = map[Math.floor(Math.random()*26)];
	for (let i = 0; i < 7; i++) {
		let random = map[Math.floor(Math.random() * 36)]
		result += random
	};
	if (used.has(result)) {
		return Random()
	};
	used.add(result);
	return result
}

/* 
 * 防止重复点击
 * @param{Function} methods 执行的方法
 * @param{} info  传递的参数
 */
export function noMultipleClicks(methods, info) {
	let that = this;
	if (that.noClick) {
			// 第一次点击
			that.noClick= false;
			if(info && info !== '') {
				methods(info)
			} else {
				methods()
			};
			setTimeout(()=> {
					that.noClick= true;
			}, 1000)
	} else {
	}
}

/* 
 * 金额分转换成元
 */

export const fenToYuan = (amount) => {
  return (Number(amount) / 100).toFixed(2)
}

/* 
 * 输出几分钟前，几小时前，几天前，几个月前，几小时前
 */
export const formatMsgTime = (dateTimeStamp) => {
  // 时间字符串转时间戳 获取毫秒数
  let timestamp = new Date(dateTimeStamp.replace(/-/g,'/')).getTime();
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let year = day * 365;
  let now = new Date().getTime();
  let diffValue = now - timestamp;
  let result;
  if (diffValue < 0) {
      return;
  };
  let yearC = diffValue / year;
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  if (yearC >= 1) {
    result = "" + parseInt(yearC) + "年前";
  } else if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
}

/*
* 当type=1时获取出生日期,type=2时获取性别,type=3时获取年龄
* */
export const IdCard = (IdCard, type) => {
		if (type === 1) {
				//获取出生日期
				let birthday = IdCard.substring(6, 10) + "-" + IdCard.substring(10, 12) + "-" + IdCard.substring(12, 14)
				return birthday
		}
		if (type === 2) {
				//获取性别
				if (parseInt(IdCard.substr(16, 1)) % 2 === 1) {
						return "男"
				} else {
						return "女"
				}
		}
		if (type === 3) {
				//获取年龄
				let ageDate = new Date()
				let month = ageDate.getMonth() + 1
				let day = ageDate.getDate()
				let age = ageDate.getFullYear() - IdCard.substring(6, 10) - 1
				if (IdCard.substring(10, 12) < month || IdCard.substring(10, 12) === month && IdCard.substring(12, 14) <= day) {
						age++
				}
				if (age <= 0) {
						age = 1
				}
				return age
		}
}

export const removeAllLocalStorage = () => {
  // removeStore('userName');
  // removeStore('userPassword');
  removeCache('userInfo');
  removeCache('isLogin');
  removeCache('token');
  removeCache('storeOverDueWay');
	removeCache('socketOpen')
}
