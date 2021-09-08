const puppeteer = require('puppeteer'),
    fs = require('fs');

// 添加文件/文件夹
function addDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

// 删除文件/文件夹
function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + '/' + file;
            if (fs.statSync(curPath).isDirectory()) {
                // 递归删除文件夹
                delDir(curPath);
            } else {
                // 删除文件
                fs.unlinkSync(curPath);
            }
        });
        // 删除文件夹自身
        fs.rmdirSync(path);
    }
}

// 写入文件
function writeFile(path, data) {
    fs.writeFile(path, data, {}, function (err) {
        err && console.log('---写入失败---', err);
    });
}

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: 'C:/Users/ycl/Downloads/chrome-win/chrome.exe',
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        });
        const page = await browser.newPage();
    
        let filePath = 'dist';
        // await delDir(filePath);
        await addDir(filePath);
    
        // await book118();
        await search();
    
        await page.screenshot({
            path: filePath + '/screenshot.png'
        });

        await browser.close();
        console.log('---end---');

        async function book118() {
            await page.goto('https://max.book118.com/');
            await page.waitForTimeout(300);

            // 模拟登录
            await page.click('#header ul.menu .member a');
            await page.waitForTimeout(1000);
            const loginIframe = await page.frames().find(frame => {
                return frame.name() == 'layui-layer-iframe1';
            });
            await loginIframe.click('.login-box .quick-link a.login-account');
            await loginIframe.waitForTimeout(300);
            await loginIframe.type('.account-form input.username', 'fuyang');
            await loginIframe.type('.account-form input[type="password"]', '123456');
            await loginIframe.waitForTimeout(300);
            await loginIframe.click('.account-form .button-box input.submit');
            await loginIframe.waitForTimeout(500);
        }

        async function search(searchUrl = '') {
            let baseUrl = 'https://www.baidu.com/s?wd=',
                url = '',
                keyword = '',
                args = process.argv.splice(2);
            keyword = '微任务 宏任务';
            if (searchUrl) {
                url = searchUrl;
            } else {
                if (keyword) {
                    url = baseUrl + keyword;
                } else {
                    if (!args.length) {
                        console.log('\x1B[31m%s\x1B[0m', '请输入参数！格式为：nodejs puppeteer.js [关键字]');
                        return;
                    } else {
                        url = baseUrl + args[0];
                    }
                }
            }
            url = 'https://www.zhihu.com/';

            await page.goto(url);
            await page.emulate(puppeteer.devices['iPhone 6']);
            await page.waitForTimeout(300);

            let html = await page.evaluate(async () => {
                try {
                    let $ = window.$,
                        rootHtml = $ ? $('body').html() : document.body.innerHTML,
                        scriptReg = /<script.*?>([\s\S]+?)<\/script>/img,
                        noscriptReg = /<noscript.*?>([\s\S]+?)<\/noscript>/img,
                        styleReg = /<style.*?>([\s\S]+?)<\/style>/img,
                        noteReg = /<!--.*?>([\s\S]+?)-->/img,
                        nbspReg = /&nbsp;/img;
                    rootHtml = rootHtml.replace(scriptReg, '').replace(noscriptReg, '').replace(styleReg, '').replace(noteReg, '').replace(nbspReg, '');

                    return rootHtml;
                } catch (error) {
                    return 'evaluate error => ' + error;
                }
            });
            writeFile(filePath + '/search.html', html);
        }
    } catch (error) {
        console.log(error);
    }
})();
