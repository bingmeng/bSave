(function (d) {
	var inputArray = [],
		inputTimer = undefined,
		proxy = undefined,
		workMode = undefined,
		proxyUrl = "http://www.test3.com/proxy.html";
	/**
	 * 将待存储队列中的数据存入本地存储
	 */
	function set (data, cmd) {
		var str = data + "#" + cmd;
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
	function save(cmd) {
		return function (key, data) {
			var str = "#" + key + "#" + data;
			inputArray.push(str);
			if (!inputTimer) {
				inputTimer = setInterval(function () {
					inputArray.length && set(inputArray.shift(), cmd);
				}, 50);
			}
		}
	}
	/**
	 * 初始化跨域模块（代理iframe）
	 */
	function initialize () {
		workMode = /msie (6.0|7.0)/i.test(navigator.userAgent) ? "compatMode" : "normalMode";
		proxy = d.createElement("iframe");
		proxy.style.cssText = "visibility:hidden;width:100px;";
		proxy.src = proxyUrl;
		d.body.appendChild(proxy);
	}
	initialize();
	window.bsave = {
		setItem: save("setItem"),
		removeItem: save("removeItem"),
		removeAll: save("removeAll")
	};
})(document);