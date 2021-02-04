var util = {
    version: "1.0.0",
    files: {
        js: [],
        css: []
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
    // 获取IE浏览器版本号
    getIeVersion: function () {
        var ua = window.navigator.userAgent;
        var is_IE = ua.match(/(rv:|msie )\d+/i);
        var IE_Version = is_IE ? parseInt(is_IE[0].split(/:| /g)[1]) : 9;
        return IE_Version;
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
    // 加载css
    css: function (_href) {
        var that = this,
            _v = "",
            _css = document.createElement("link");
        if (_href.indexOf("?v=") != -1) {
            var arr = _href.split("?v=");
            _href = arr[0];
            _v = arr[1];
        }
        if (that.files.css.indexOf(_href) == -1) {
            _css.rel = "stylesheet";
            _css.type = "text/css";
            _css.href = _href + "?v=" + that.version + _v;
            document.getElementsByTagName("head")[0].appendChild(_css);
            that.files.css.push(_href);
        }
    },
    // 加载js和css
    load: function (_src, callback, _href) {
        var that = this;
        that.js(_src, callback);
        _href && that.css(_href);
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
