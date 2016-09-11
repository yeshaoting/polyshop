// ==UserScript==
// @name         polyshop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       yeshaoting
// @icon http://yeshaoting.cn/favicon.ico
// @match        http://polyshop.com.cn/*
// @grant2        GM_notification
// @grant        none
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
    loadJs('http://ocszqgifn.bkt.clouddn.com/meituan/polyshop-us.js?version=100006');
        
})();


function loadJs(js) {
    var oHead = document.getElementsByTagName('HEAD')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = js;
    oHead.appendChild(oScript);
}

