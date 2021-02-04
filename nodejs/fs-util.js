var fs = require("fs");

function geFileList(path) {
    var filesList = [];
    readFile(path, filesList);
    return filesList;
}

//获取文件类型
function getType(filename) {
    var index = filename.lastIndexOf(".");
    if (index != -1) {
        var type = filename.substring(index + 1, filename.length);
        return type;
    }
}
//遍历读取文件
function readFile(path = __dirname, filesList) {
    files = fs.readdirSync(path); //需要用到同步读取
    files.forEach(walk);
    function walk(file) {
        states = fs.statSync(path + "/" + file);
        if (states.isDirectory()) {
            readFile(path + "/" + file, filesList);
        } else {
            var obj = new Object();
            obj.size = states.size;
            obj.name = file; //文件名
            obj.type = getType(file);
            filesList.push(obj);
        }
    }
}
// 统计各类文件数量
function countFileByType(obj) {
    var keyContainer = {};
    obj.forEach((item) => {
        keyContainer[item.type] = keyContainer[item.type] || [];
        keyContainer[item.type].push(item);
    });
    return keyContainer;
}

module.exports.geFileList = geFileList;

module.exports.countFile = countFileByType;

module.exports.getType = getType;
