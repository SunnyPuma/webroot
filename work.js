/***
充当后台接收和派发消息
***/

onmessage = function (e) {
	if (e) {
		var toPost;
		try {
			switch (e.data.type) {

				//初始化窗口
				case 0:
					var tempId = e.data.toInfo.id;
					var tempSId = e.data.fromInfo.id;
					if (!checkId(tempId)) {//如果id不可用返回提示

						postMessage({
							type: -1,
							pos: 'id',
							dat: 'ID not aviliable'
						});
						return;
					} else if (!checkId(tempSId)){//如果id不可用返回提示
						postMessage({
							type: -1,
							pos: 'sid',
							dat: 'ID not aviliable'
						}); 
						return;
					} else if (tempSId == tempId){
						postMessage({
							type: -1,
							pos: 'sid',
							dat: 'ID cannot same'
						}); 
						return;
					} else if (checkLogStatus(tempSId)) {//如果id已经登录不可用返回提示
						postMessage({
							type: -1,
							pos: 'sid',
							dat: 'ID Already Loged'
						}); 
						return;
					} else {//返回需要的信息
						toPost = {
							type: 0,
							toInfo: {
								img: imgList[tempId],
								name: nameList[tempId],
								id: tempId
							},
							fromInfo: {
								img: imgList[tempSId],
								name: nameList[tempSId],
								id: tempSId
							}
						}
						postMessage(toPost);
					}
					break;

				//新建窗口
				case 1:
					var tempId = e.data.toInfo.id;
					if (!checkId(tempId)) {//如果id不可用返回提示

						postMessage({
							type: -1,
							pos: 'id',
							dat: 'ID not aviliable'
						});
						return;
					} else {//可用则返回当前窗口初始化需要的数据
						toPost = {
							type: 0,
							toInfo: {
								img: imgList[tempId],
								name: nameList[tempId],
								id: tempId,
							},
							fromInfo: null
						}
						postMessage(toPost);
					}
					break;
				case 2:
				break;

				//转发消息
				case 10:
					var tempId = e.data.toInfo.id;
					var tempSId = e.data.fromInfo.id;
					toPost = {
						type: 10,
						dat: e.data.dat,
						toInfo:{
							img: imgList[tempId],
							name: nameList[tempId],
							id: tempId
						},
						fromInfo: {
							img: imgList[tempSId],
							name: nameList[tempSId],
							id: tempSId
						},
						flag:e.data.flag
					}
					postMessage(toPost);
				break;
				default :
				break;
			}
		} catch (e) {
			console.log(e);
		}
	}
}

//查找对应id是否合法
function checkId(tid) {
	return !!idList.find(function(item, index){
		if (tid == item) {
			//如果找到则可用
			return true;
		}
	});
}

//查找对应id是否合法
function checkLogStatus(tid) {
	return !!logedList.find(function(item, index){
		if (tid == item) {
			//如果找到则不可用
			return true;
		}
	});
}

//用户对应图像存储路径，名称信息，id列表
var imgList = {
	1:'resources/img/xm.png',
	2:'resources/img/lxl.png',
	3:'resources/img/lyf.png',
	4:'resources/img/jssts.png',
	5:'resources/img/gxt.png',
	6:'resources/img/hxm.png'
},nameList = {
	1:'小明',
	2:'李小璐',
	3:'刘亦菲',
	4:'杰森斯坦森',
	5:'关晓彤',
	6:'黄晓明'
},idList = [1,2,3,4,5,6],logedList = [];

var curIdMax = 6;
var curIdMin = 1;