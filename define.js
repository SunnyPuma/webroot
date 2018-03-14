/***
定义公共方法
**/

//加载语言
function loadlanguage(){
	var language = getLang();
	var labels = $(".i18n-text");
	labels && $.each(labels, function(index, item){
		var $_self = $(this);
		$_self.html(language[$_self.data('text')]);
	});
}

//获取当前语言环境
function getLang(){
	var lang;
	try {
		lang = parent.lang;
	} catch (e){

	}

	lang = lang ? lang : en_US;
	return lang;
}

//开启服务
function startWork() {
	if (typeof(Worker) != undefined) {
		try {
			return new Worker('work.js');
		} catch (e) {
			return null;
		}
	}
}

//国际化资源
var en_US = {
	pagetitle_str:'CHAT PAGE',
	close:'close',
	newchat_str:'Start',
	fid_str:'Friend ID',
	sfid_str:'My ID',
	cancel_str:'Cancel'
},zh_CN = {
	pagetitle_str:'聊天页面',
	close:'关闭',
	newchat_str:'开始',
	fid_str:'好友ID',
	sfid_str:'我的ID',
	cancel_str:'取消'
};

