var util = {
    version: "1.0.0",
    files: {
        js: [],
        css: []
    },
    // 判断元素是否显示
    isShow: function ($el) {
        if ($el.length && $el.is(":visible")) {
            var scroll_top = $(window).scrollTop(),
                window_height = $(window).height(),
                offset_top = $el.offset().top,
                height = $el.height();
            return (
                scroll_top <= offset_top + height &&
                scroll_top >= offset_top - window_height
            );
        } else {
            return false;
        }
    },
    // 判断是否移动端
    isMobile: function () {
        var browser = navigator.userAgent;
        var isiPad = browser.indexOf("iPad") > -1;
        var isMobile =
            !!browser.match(/AppleWebKit.*Mobile.*/) &&
            !!browser.match(/AppleWebKit/) &&
            !isiPad;
        if (isMobile) {
            return true;
        } else {
            return false;
        }
    },
    // 加载js
    js: function (_src, callback) {
        var that = this,
            _v = "",
            _script = document.createElement("script");
        if (_src.indexOf("?v=") != -1) {
            var arr = _src.split("?v=");
            _src = arr[0];
            _v = arr[1];
        }
        if (that.files.js.indexOf(_src) == -1) {
            _script.type = "text/javascript";
            _script.src = _src + "?v=" + that.version + _v;
            document.getElementsByTagName("head")[0].appendChild(_script);
            if (!(/*@cc_on!@*/ 0)) {
                _script.onload = function () {
                    callback();
                };
            } else {
                _script.onreadystatechange = function () {
                    if (
                        _script.readyState == "loaded" ||
                        _script.readyState == "complete"
                    ) {
                        callback();
                    }
                };
            }
            that.files.js.push(_src);
        }
    },
    // 将 json 转为字符串
    formatJson: function (msg) {
        var rep = "~";
        var jsonStr = JSON.stringify(msg, null, rep);
        var str = "";
        for (var i = 0; i < jsonStr.length; i++) {
            var text2 = jsonStr.charAt(i);
            if (i > 1) {
                var text = jsonStr.charAt(i - 1);
                if (rep != text && rep == text2) {
                    str += "<br/>";
                }
            }
            str += text2;
        }
        jsonStr = "";
        for (var i = 0; i < str.length; i++) {
            var text = str.charAt(i);
            if (rep == text)
                jsonStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            else {
                jsonStr += text;
            }
            if (i == str.length - 2) jsonStr += "<br/>";
        }
        return jsonStr;
    }
};
