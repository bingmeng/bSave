(function (d) {
	var inputArray = [],
		inputTimer = undefined,
		proxy = undefined,
		workMode = undefined,
		proxyUrl = "http://www.test.com/proxy.html";
	/** 将待存储队列中的数据存入本地存储 */
	function set (str) {
		if (workMode === "normalMode") {
			proxy.contentWindow.postMessage(str, "*");
		} else {
			proxy.src = proxyUrl + str;
			//宽度必须设大一些，否则 IE6、7下不会触发iframe中window的onresize事件。
			proxy.style.width = proxy.style.width === "100px" ? "200px" : "100px";
		}
		if (!inputArray.length) {
			clearInterval(inputTimer);
			inputTimer = undefined;
		};
	}
	/** 将数据存入待存储队列
	 * @param key string 必须为数字、字母、下划线组成的字符串。
	 * @param data string key对应的数据。
	 */
	function save(key, data) {
		var str = "#" + key + "#" + data;
		inputArray.push(str);
		if (!inputTimer) {
			inputTimer = setInterval(function () {
				inputArray.length && set(inputArray.shift());
			}, 50);
		}
	}
	/** 初始化跨域模块（代理iframe） */
	function initialize () {
		workMode = /msie 6.0|msie 7.0/i.test(navigator.userAgent.split(";")[1]) ? "compatMode" : "normalMode";
		proxy = d.createElement("iframe");
		proxy.style.cssText = "visibility:hidden;width:100px;";
		proxy.src = proxyUrl;
		d.body.appendChild(proxy);
	}
	initialize();
	window.save = save;
})(document);