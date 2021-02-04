// 1、引入模块
var http = require("http");
var path = require("path");
var fs = require("fs");
var fsutil = require("./fs-util");
const os = require("os");

///获取本机ip///
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (
                alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal
            ) {
                return alias.address;
            }
        }
    }
}

// 2、搭建服务器
var server = http.createServer(function (request, response) {
    // 请求来源
    let origin = request.headers.origin || "*";
    let port = "8080";
    let originArr = [
        `http://localhost:${port}`,
        `http://${getIPAdress()}:${port}`
    ];
    let allowOrigin = origin;
    let isAllowOrigin = false;

    for (let item of originArr) {
        if (item === origin) {
            isAllowOrigin = true;
            allowOrigin = origin;
        }
    }

    // if (!isAllowOrigin) return;

    // 文件目录
    let rootFile = "data";
    // 文件列表
    let rootFileList = fsutil.countFile(fsutil.geFileList(rootFile));
    let urlArr = request.url.split("?");
    // 文件后缀
    let suffix = "json";
    if (urlArr.length > 1) {
        for (let i = 0; i < urlArr.length; i++) {
            var _target = "type=";
            if (urlArr[i].indexOf(_target) !== -1) {
                suffix = urlArr[i].replace(_target, "");
            }
        }
    }
    let files = rootFileList[suffix];
    let result;

    for (let i = 0; i < files.length; i++) {
        let key = urlArr[0].replace("/", "");
        let value = files[i].name.replace("." + suffix, "");

        switch (key) {
            case value:
                result = fs.readFileSync(rootFile + "/" + files[i].name);
                break;
        }
    }

    if (result) {
        response.writeHead(200, {
            "content-type": "application/json; charset:utf-8",
            "Access-Control-Allow-Origin": allowOrigin
        });
        response.write(result);
    } else {
        response.writeHeader(404, {
            "content-type": "text/html; charset=utf-8",
            "Access-Control-Allow-Origin": allowOrigin
        });
        response.write("<h1>404页面</h1>");
    }

    response.end();
});

server.listen(3333, function () {
    console.log("端口号localhost:" + server.address().port);
});
