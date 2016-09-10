// ==UserScript==
// @name         polyshop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       yeshaoting
// @icon http://yeshaoting.cn/favicon.ico
// @match        http://polyshop.com.cn/*
// @grant        GM_notification
// @run-at document-start

// @require2 http://cdn.bootcss.com/jquery/2.0.0/jquery.min.js
// @require2 file:///Users/yeshaoting/workspace/apache/polyshop/polyshop.js
// @require2 file:///Users/yeshaoting/workspace/apache/polyshop/polyshop-us.js
// @require2 http://ocszqgifn.bkt.clouddn.com/meituan/polyshop.js?version=20

// ==/UserScript==

(function() {
    'use strict';

    console.info("tampermonkey polyshop");
    loadJs('http://cdn.bootcss.com/jquery/2.0.0/jquery.min.js');
    loadJs('http://ocszqgifn.bkt.clouddn.com/meituan/polyshop-us.js?version=' + Math.random());
    
    var constants = constants || {};
    var success_check = setInterval(function() {
        if (constants && constants.ok && constants.ok == 1) {
            GM_notification({
                "title": "秒杀通知",
                "text": "成功秒中，房间id=" + constants.current_id,
            });
            
            clearInterval(success_check);
        }
    }, 500);
    
})();


function loadJs(js) {
    var oHead = document.getElementsByTagName('HEAD')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = js;
    oHead.appendChild(oScript);
}

