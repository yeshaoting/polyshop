
var constants = {
	"hostname": "polyshop.com.cn",
	"check_url": 'http://polyshop.com.cn/index.php/Home/Ajax/updateprice.html',
	"seckill_url": 'http://polyshop.com.cn/index.php/Home/Ajax/addPrice.html',

	//要秒杀的房间id列表
	"ids": [2661, 2715, 2714, 2663, 2662],

	//秒杀活动是否开启
	"isopen": false,

	//1表示参与秒杀模式，0表示参与加价模式
	"sh2": 1,
	"interval": 250,

	//当前秒杀房间结果
	"ok": 0,

	//当前秒杀的房间id
	"current_id": 0,

	//当前秒杀的房间id下标
	"current_id_idx": 0,

	//查看秒杀活动是否开启间隔
	"check_interval": 200,

	//秒杀抢购间隔
	"seckill_interval": 200,
};


// 去除系统自身请求
function isoutherlogin() {
	console.log("is other login check");
}


// 脚本参数初始化
function constants_init() {
	var hostname = $(location).attr('hostname')
	console.info("hostname: %s", hostname);
	if (hostname == "localhost") {
		constants.check_url = 'http://localhost/polyshop/updateprice.json';
		constants.seckill_url = 'http://localhost/polyshop/addPrice.json';
	}

	if (!$.isArray(constants.ids) || constants.ids.length == 0) {
		console.info("请填写正确的秒杀房间id列表");
		throw "请填写正确的秒杀房间id列表";
	}

	constants.current_id = constants.ids[0];
	constants.current_id_idx = 0;
}


// 脚本参数输出
function constants_display() {
	var version = $().jquery;
	console.info("jquery version: $s, constants: %o", version, constants);
	console.info("ids: %o", constants.ids);
}


// 监听秒杀活动是否开启
function listen_check() {
	console.info("监听秒杀活动是否开启~");
	var isopenCheck = setInterval(function() {
		if (constants.isopen) {
			console.warn("监听到秒杀活动已经开启~");

			seckill();
			clearInterval(isopenCheck);
			return;
		}

		console.info("查看秒杀活动状态~");
		check_seckill(constants.current_id, constants.sh2);
	}, constants.check_interval);
}


// 查看秒杀活动状态
function check_seckill(id, sh2) {
    $.ajax({
        url: constants.check_url,
        data: {id: id},
        type: 'post',
        dataType: 'json',
        async: true,
        success: function (data) {
        	if (data.s == 4) {
        		console.info("秒杀活动正式开启~");
        		console.warn("秒杀活动正式开启~");

        		//seckill();
        		return;
        	} else if (data.s == 1) {
        		console.log("更新竞价价格");
                return;
            } else if (data.s == -1) {
                console.log('你已经没有选房的机会啦');

            	//seckill();
                return false;
            } else if (data.s == 2) {
                console.log('竞价已结束');
            	
            	//seckill();
                return false;
            } else if (data.s == 3) {
                console.log('竞价未开始');

                constants.isopen = false;
                return false;
            }
        	

        	console.info("秒杀活动尚未开启~");
        },
        error: function (data) {
        	console.error("exception: %o", data);
        	sleep(interval);
        }
    });

}


// 排队秒杀
function seckill() {
	console.info("准备排队秒杀ids: %o", constants.ids);
	constants.isopen = true;
	constants.ok = 0;

	constants.current_id_idx = 0;
	constants.current_id = constants.ids[constants.current_id_idx];

	var seckkill_check = setInterval(function() {
		if (constants.current_id_idx >= constants.ids.length) {
			console.info("所有id秒杀失败！");
			console.info("秒杀脚本停止~~");
			clearInterval(seckkill_check);
			return;
		}

		var id = constants.ids[constants.current_id_idx];
		constants.current_id = id;
		if (constants.ok == 1) {
			console.info("成功秒杀id: %d", id);
			console.info("秒杀脚本停止~~");
			clearInterval(seckkill_check);
			return;
		}

		if (constants.ok == 0) {
			doseckill(id, constants.sh2);
			return;
		}

		if (constants.ok == -1) {
			console.info("秒杀失败id: %d", id);
			console.info("开始下一个id秒杀！");
			constants.current_id_idx++;
			constants.current_id = constants.ids[constants.current_id_idx];
			constants.ok = 0;
			return;
		}

		clearInterval(seckkill_check);
		console.info("停止秒杀脚本~");

	}, constants.seckill_interval);

}


// 单个秒杀
function doseckill(id, sh2) {
	console.info("正在秒杀id: %d", id);

	$.ajax({
	    url: constants.seckill_url,
	    data: {id: id,sh:sh2},
	    type: 'post',
	    async: true,
	    dataType: 'json',
	    success: function (data) {
	        if(data.isok==1){
	        	console.info("竞拍成功id: %d", id);
	        	console.warn("竞拍成功id: %d", id);
	            $('#alert4').show();
	            constants.ok = 1;
	            return;
	        }

	        if (data.s == 1) {
	            console.log("更新竞价价格");
	        } else if (data.s == -1) {
	            console.info('你已经没有选房的机会啦');
	            changeStatus(id);
	        } else if (data.s == 2) {
	            console.info('竞价已结束');
	            changeStatus(id);
	        } else if (data.s == 3) {
	            console.log('竞价未开始');
	        } else if (data.s == 10) {
	            console.info('已超过最大额度');
	            changeStatus(id);
	        } else if (data.s == 20) {
	            console.info('您已是目前最高价！');
	            changeStatus(id);
	        } else if (data.s == -99) {
	            console.info(data.msg);
				changeStatus(id);
	        }

	    }
	});

}

// 更新秒杀状态
function changeStatus(id) {
	if (id == constants.current_id) {
		constants.ok = -1;
		console.log("更新秒杀状态id: %s", id);
	}

}

// bad implementation
function sleep(milliSeconds){
	console.log("sleep for %d", milliSeconds);
	var startTime = new Date().getTime(); // get the current time
	while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}


// 启动秒杀脚本
function start() {
	console.info("启动秒杀脚本~");

	constants_init();
	listen_check();
}

// 启动秒杀脚本
function stop(status) {
	console.info("停止秒杀~");
	if (!status) {
		constants.ok = -2;
		console.info("停止秒杀脚本~");
	} else {
		constants.ok = status;
		console.info("停止本次秒杀, id: %d", constants.current_id);
	}
}

//=============================================================================================


constants_init();
constants_display();

$("#pricelog").on("click", function() {
	start();
});

$(".wrapper .content2 .mainTitle").on("click", function() {
	seckill();
});

$("header div.wrapper h1.fl").on("click", function() {
	seckill();
});



