var ClipBoard = function (obj) {
    /**
     * obj
     * handlerID：用于点击事件的控件，在html标签里面加上id这个属性；
     * textID：被复制文本所在的容器的id；
     * isAttr：用于说明复制的内容是否为控件中的属性值，默认为false（此时复制的内容是textID内的文本），如果设置为true，前提需要在控件这个标签上增添一个属性：data-clipboard-text，属性值就是你要复制的文本；eg: <button id="copy-btn" data-clipboard-text="这里是被复制的内容">复制</button>
     * type：操作的类型，取值为copy/cut（复制/剪切），默认是copy
     */
    this.handlerID = obj.handlerID || null;
    this.textID = obj.textID || null;
    this.type = obj.type || "copy";
    this.isAttr = obj.isAttr || false;
    this.isPlugin = true;
    this.isActive = false;

    if (util.getIeVersion() <= 8) {
        this.isPlugin = false;
    }
    var handlerObj = document.getElementById(obj.handlerID);
    if (typeof this.type === "string") {
        handlerObj.setAttribute("data-clipboard-action", this.type);
    } else {
        throw error("type类型错误！");
    }
    if (!obj.isAttr && obj.textID) {
        handlerObj.setAttribute("data-clipboard-target", "#" + obj.textID);
    }
};
ClipBoard.prototype.attach = function () {
    if (this.isActive) {
        // 对象已经被实例化
        return;
    }
    var tip = "复制";
    if (this.type === "cut") {
        tip = "剪切";
    }
    this.isActive = true;
    var self = this;
    if (this.isPlugin) {
        var doFnc = function () {
            var clip = new Clipboard("#" + self.handlerID);
            clip.on("success", function (e) {
                console.log(tip + "成功，可通过Ctrl+V进行粘贴！");
            });
        };
        if (typeof Clipboard == "undefined") {
            util.load("../js/clipboard.min.js", function () {
                doFnc();
            });
        } else {
            doFnc();
        }
    } else if (window.attachEvent) {
        var handlerObj = document.getElementById(this.handlerID);
        handlerObj.attachEvent("onclick", function () {
            var text = "";
            if (self.isAttr) {
                // 复制属性值
                text = handlerObj.getAttribute("data-clipboard-text");
            } else {
                var textObj = document.getElementById(self.textID);
                text = textObj.value || textObj.innerHTML;
            }
            window.clipboardData.setData("Text", text);
            console.log(tip + "成功，可通过Ctrl+V进行粘贴！");
        });
    }
};
