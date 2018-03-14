/***
* 主程序入口
**/

//webworker 句柄
var w;
//全局id
var _gCount = 0;
//当前用户信息
var curFriend;
//标识自己
var _curSelf;
//整个系统应用构建对象
var _app = {

	Events:{

		//将消息发送到server 由server统一派发
		sendMSG: function(){
			if (w) {
				var toSend = {
					type:10,
					toInfo: {
						id:curFriend.id
					},
					fromInfo: {
						id:_curSelf.id
					},
					dat:$("#chat_input").val(),
				}
				try {
					w.postMessage(toSend);
					resetInput();
				} catch (e) {
					console.log(e);
				}
			}
		},

		//初始化窗口点击提交按钮根据输入的id查找对应好友信息
		initChat: function(){
			var fid = $("input[name=fid]").val();
			var sfid = $("input[name=sfid]").val();
			var toSend;
			if (!sfid || sfid == '') {
				$("input[name=sfid]").css({'border':'1px solid red'});
			} else if (!fid || fid == '') {
				$("input[name=sfid]").css({'border':''});
				$("input[name=fid]").css({'border':'1px solid red'});
			} else {
				$("input[name=fid]").css({'border':''});
				if (w) {
					toSend = {
						type: 0,
						toInfo: {
							id: $.trim(fid)
						},
						fromInfo: {
							id:$.trim(sfid)
						}
					}
					try {
						w.postMessage(toSend);
					} catch (e) {
						console.log(e);
					}
				}
			}
			return false;
		},

		//新建窗口点击提交按钮根据输入的id查找对应好友信息
		newChat: function(){  

			var fid = $("input[name=fid]").val();
			var toSend;
			if (!fid || fid == '') {
				$("input[name=fid]").css({'border':'1px solid red'});
			} else {
				$("input[name=fid]").css({'border':''});
				$("input[name=sfid]").css({'border':''});
				if (w) {
					toSend = {
						type: 1,
						toInfo: {
							id: $.trim(fid)
						},
						fromInfo: null
					}
					try {
						w.postMessage(toSend);
					} catch (e) {
						console.log(e);
					}
				}
			}
			return false;
		},

		//当前窗口下新建聊天
		showNewChats: function(){
			
			$(".dialog-mark").show();
			$(".init-btn").hide();
			$(".new-btn").show();
			$("input[name=sfid]").attr('readonly',true);
		},

		embedSubmit: function () {
			if (w) {
				var toSend = {
					type:10,
					toInfo: {
						id: $.trim($("input[name=embedreceid]").val())
					},
					fromInfo: {
						id:$.trim($("input[name=embedsendid]").val())
					},
					dat:$("#embed_text").val()
				}
				try {
					w.postMessage(toSend);
				} catch (e) {
					console.log(e);
				}
			}
			return false;
		},

		hideEmbedPanel: function () {
			$(this).unbind('click').bind('click', _app.Events.showEmbedPanel)
			$(".embed-form").removeClass("embed-panel-show").addClass("embed-panel-hide");
		},

		showEmbedPanel: function () {
			$(this).unbind('click').bind('click', _app.Events.hideEmbedPanel)
			$(".embed-form").removeClass("embed-panel-hide").addClass("embed-panel-show");
		},

		hideNew: function (argument) {
			$(".dialog-mark").hide();
			$('form input').val('').css({'border':''});
			return false;
		}
	}
};

function resetInput() {
	$("#chat_input, #embed_text").val('');
}

function _initBind(){

	$(document).on("click","#chat_send_btn", _app.Events.sendMSG);
	$(document).on("click","#init_fid_btn", _app.Events.initChat);
	$(document).on("click","#new_fid_btn", _app.Events.newChat);
	$(document).on("click","#new_fid_btn_cancel", _app.Events.hideNew);
	$(document).on("click",".title-right .btn.new", _app.Events.showNewChats);
	$(document).on("click","#em_submit", _app.Events.embedSubmit);
	$(".embed-right-icon").on("click", _app.Events.hideEmbedPanel);
}

function _initChatDialog(ret){
	//判空
	if (!ret) {
		return false;
	}
	var tf = ret.toInfo;
	var fIsExist = false;
	_app.Events.hideNew();

	var curFList = $(".left-list li");

	//如果找到则表示该好友已经正在和自己聊天
	curFList.each(function(index, item){
		if ($(item).attr('userid') == tf.id) {
			fIsExist  = true;
			return ;
		}
	})
	//没找到则根据好友id更新聊天panel
	if (!fIsExist) {
		updateDialog(ret);
	}
}

//更新聊天panel
function updateDialog(ret) {
	if (ret) {
		var tf = ret.toInfo;
		var leftList = $('<li onclick="switchPanel()" userID="'+ tf.id +'"><img src="'+ tf.img +'"> <span class="user-name">'+ tf.name +'</span> </li>');
		$(".chat-list .left-list").append(leftList);

		$(".user-info-head img").attr('src',tf.img);
		$(".user-info-head .user-desc").html(tf.name);	

		$(".chat-panel").hide();
		var curPanel = $(".chat-panel[userID="+tf.id+"]");
		if (curPanel.length > 0) {
			curPanel.show();
		} else {
			
			$(".dialog-right-body")
			.append($('<div userID="'+ tf.id +'" class="chat-panel"></div>'))
		}
	}

	curFriend = $.extend(true, {img:'resources/img/default.png',name:'无名'}, ret.toInfo);
	if (ret.fromInfo) {
		_curSelf = $.extend(true, {img:'resources/img/default.png',name:'无名'}, ret.fromInfo);
	}
}

//点击左侧好友列表，切换到对应好友的聊天记录
function switchPanel() {
	var $self;
	if (event) {
		$self = $(event.currentTarget);
	
		$(".left-list li").removeClass("active");
		$self.addClass("active");

		$(".chat-panel").hide();
		var curPanel = $(".chat-panel[userID="+$self.attr("userid")+"]");
		if (curPanel.length > 0) {
			curPanel.show();
		} else {
			
			$(".dialog-right-body")
			.append($('<div userID="'+ $self.attr("userid") +'" class="chat-panel"></div>'))
		}
		curFriend.id  = $self.attr("userid") ;
	}
}

//更新聊天记录
function updateChatPanel(ret){
	if (!ret) {
		return;
	}
	//若是自己发的消息展示在右侧
	var isSelf ="";
	if (ret.fromInfo.id == _curSelf.id ) {
		isSelf = " panel-right";
	} else if (ret.toInfo.id == _curSelf.id){
		isSelf = " panel-left";
	}
	
	if (isSelf.length > 0) {//如果消息与自己相关则处理
		
		//聊天记录panel
		var rightPanelList_str = '<div class="chat-list-line"><div class="chat-text-list '+isSelf+'">'
								    +'<div class="user-info">'
									+'<img src="'
									+ret.fromInfo.img
									+'">'
									+'</div>'
									+'<div class="chat-text-panel">'
									+'<div class="chat-time">'
									+ new Date().toLocaleDateString()
									+'</div>'
									+'<div class="chat-text">'
									+ret.dat
									+'</div></div></div></div>'
		var rightPanelList = $(rightPanelList_str);
		//发送出去的消息则按照toinfo的id追加
		if (isSelf == " panel-right" ) {
			
			$(".dialog-right-body .chat-panel[userid="+curFriend.id+"]").append(rightPanelList);
		} else if (isSelf == " panel-left"){
			//收到的消息按照fromInfo的id追加
			$(".dialog-right-body .chat-panel[userid="+ret.fromInfo.id+"]").append(rightPanelList);
		}
	}
}

//开启服务
function _startWork(){
	w = startWork();
	if (w) {
		w.onmessage = function(e) {
			try {
				// console.log(e.data)
				switch(e.data.type) {
					case 0://打开对应对话框
					case 1:
						_initChatDialog(e.data);
					break;
					case -1:
						handleError(e.data);
					break;
					case 10:
						updateChatPanel(e.data);
					break;
					case 2:
					break
					case 3:
					break;
					default :
						console.log(e.data);
					break
				}
			} catch (e){
				// console.log(e);
			}
		}
	}
}

function handleError(ret) {
	switch(ret.pos) {
		case 'id':
		alert('您id有误');//先用alert提示错误
		break;
		case 'sid':
		alert('好友id有误');//先用alert提示错误
		break;
		default: break;
	}
}

$(document).ready(function(argument) {
	
	//页面国际化
	loadlanguage();
	//初始化页面
	_initBind();
	//开启服务
	_startWork();
	
	resetInput();
});