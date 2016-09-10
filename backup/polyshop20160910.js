

var check_url = '/index.php/Home/Ajax/updateprice.html';
//var check_url = 'http://localhost/polyshop/updateprice.json';
console.info("check url: %s", check_url);


var seckill_url = '/index.php/Home/Ajax/addPrice.html';
//var seckill_url = 'http://localhost/polyshop/addPrice.json';
console.info("seckill url: %s", seckill_url);


$version = $().jquery;
console.info("jquery version: %s", $version);

//要秒杀的房间id
var ids = [2260, 2261, 2262];
console.info("all id ids: %o", ids);

//秒杀活动是否开启
var isopen = false;
console.info("is open sec kill: %o", isopen);

var sh2 = 1; // 1表示参与秒杀模式，0表示参与加价模式
console.info("sec kill sh2: %d", sh2);

var interval = 1000;
var ok = 0;
var current_id = ids[0];
console.info("current id: %d", current_id);

function start() {
	console.info("启动秒杀脚本~");
	bootstrap(ids);
}

function bootstrap(ids) {
	for (var i in ids) {
		var id = ids[i];

		ok = 0;	
		current_id = id;
		seckill(id);

		if (ok == 1) {
			console.info("成功秒杀, id: %d", id);
			break;
		} else if (ok == -1) {
			console.info("秒杀失败, id: %d", id);
		}

	}

	console.info("finish~~");
}

function seckill(id) {
	console.log("准备秒杀id: %d, sh2: %d", id, sh2);

	check(id, sh2);

	doseckill(id, sh2);

	return;
}

function check(id, sh2) {
	while (!isopen) {
	    $.ajax({
	        url: check_url,
	        data: {id: id},
	        type: 'post',
	        dataType: 'json',
	        async: false,
	        success: function (data) {
	        	if (data.s == 4) {
	        		console.info("秒杀活动正式开启~");
	        		console.warn("秒杀活动正式开启~");
	        		isopen = true;

	        		doseckill(id, sh2);
	        		return;
	        	} else if (data.s == 1) {
                    return;
                } else if (data.s == -1) {
                	isopen = true;
                    console.log('你已经没有选房的机会啦');
                    return false;
                } else if (data.s == 2) {
                	isopen = true;
                    console.log('竞价已结束');
                    return false;
                } else if (data.s == 3) {
                    console.log('竞价未开始');
                    isopen = false;
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

	return true;
}

function doseckill(id, sh2) {
	if (!isopen) {
		console.info("秒杀活动尚未开始~");
		return;
	}

	console.info("正在秒杀id: %d", id);
	while (ok == 0) {
		$.ajax({
		    url: seckill_url,
		    data: {id: id,sh:sh2},
		    type: 'post',
		    async: false,
		    dataType: 'json',
		    success: function (data) {
		        if(data.isok==1){
		        	console.info("竞拍成功id: %d", id);
		        	console.warn("竞拍成功id: %d", id);
		            $('#alert4').show();
		            ok = 1;
		            return;
		        }

		        if (data.s == 1) {
		            // max_one_price=data.price;
		            // $("#maxprice").html(max_one_price.toFixed(2)+"元");
		            // maxdj=data.price/mj;

		            // $("#maxunitprice").html(parseInt(maxdj) + "元");
		        } else if (data.s == -1) {
		            console.info('你已经没有选房的机会啦');
		            changeStatus(id);
		        } else if (data.s == 2) {
		            console.info('竞价已结束');
		            changeStatus(id);
		        } else if (data.s == 3) {
		            console.info('竞价未开始');
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

		//sleep(interval);
	}
}

function changeStatus(id) {
	if (id == current_id) {
		ok = -1;
	}
}

// bad implementation
function sleep(milliSeconds){
	console.log("sleep for %d", milliSeconds);
	var startTime = new Date().getTime(); // get the current time
	while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}


$("#pricelog").click(function() {
	start();
});

$(".wrapper .content2 .mainTitle").click(function() {
	isopen = true;
	bootstrap(ids);
});

$("header div.wrapper h1.fl").click(function() {
	isopen = true;
	bootstrap(ids);
});

