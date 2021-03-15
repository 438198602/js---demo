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

    async function search() {
        let args = process.argv.splice(2);
        if (!args.length) {
            console.log('请输入参数！格式为：nodejs puppeteer.js [关键字]');
            return;
        }

        await page.goto('https://www.baidu.com/s?wd=' + args[0]);
        await page.emulate(puppeteer.devices['iPhone 6']);
        await page.waitForTimeout(300);

        const html = await page.evaluate(() => {
            // return document.getElementsByTagName('html')[0].outerHTML;
            return document.body.innerHTML;
        });
        writeFile(filePath + '/search.html', html);
    }
})();
