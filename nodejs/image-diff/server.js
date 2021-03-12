const puppeteer = require('puppeteer'),
    BlinkDiff = require('blink-diff');

// npm i --save blink-diff
// npm i --save puppeteer --ignore-scripts
// 单独下载Chromium https://npm.taobao.org/mirrors/chromium-browser-snapshots

// puppeteer api https://zhaoqize.github.io/puppeteer-api-zh_CN/#/

// 视觉感知测试
// 对比网页和设计图差异
async function ImageDiff(options) {
    const browser = await puppeteer.launch({
        headless: true, // 显示浏览器界面，默认true 不显示
        executablePath: 'C:/Users/ycl/Downloads/chrome-win/chrome.exe',
        defaultViewport: {
            width: options.viewport.width || 375,
            height: options.viewport.height || 667,
            hasTouch: options.viewport.hasTouch || true,
            isMobile: options.viewport.isMobile || true,
            deviceScaleFactor: options.viewport.deviceScaleFactor || 2 // dpr
        }
    });
    const page = await browser.newPage();
    await page.goto(options.url);

    // 由于页面数据是异步的，所以等待几秒，等待异步请求完毕，页面渲染完毕
    options.waitTime && (await page.waitForTimeout(options.waitTime));

    // 模拟设备
    await page.emulate(puppeteer.devices['iPhone 6']);

    const html = await page.evaluate(async () => {
        var list = document.querySelectorAll('div.news-list > ul > li > a');
        var result = [];
        for (let i = 0; i < list.length; i++) {
            list[i].style.fontFamily = 'PingFangSC-Regular';
            result.push(list[i].innerHTML);
        }
        return result;
    });
    console.log(html);

    const imgPath = __dirname + options.imgPath,
        targetPath = imgPath + options.imgParams.target,
        examplePath = imgPath + options.imgParams.example,
        imageOutputPath = imgPath + options.imgParams.diff;
    await page.screenshot({
        path: targetPath,
        fullPage: true // 截取全图
    });

    const diff = new BlinkDiff({
        imageAPath: examplePath, // 设计图
        imageBPath: targetPath, // 页面截图
        // 低于其中差异的像素数/ p（默认值：500） - 百分比阈值：1 = 100％，0.2 = 20％
        threshold: 0.02,
        imageOutputPath: imageOutputPath // Diff路径
    });

    diff.run(function (error, result) {
        if (error) {
            throw error;
        } else {
            console.log(diff.hasPassed(result.code) ? '通过' : '失败');
            console.log('总像素:' + result.dimension);
            console.log('发现:' + result.differences + ' 差异.');
        }
    });

    //关闭puppeteer
    await browser.close();
}

ImageDiff({
    url: 'https://segmentfault.com/search',
    viewport: {
        width: 375,
        height: 667
    },
    waitTime: 1000,
    imgPath: '/blink-diff_img/',
    imgParams: {
        example: 'example.png',
        target: 'screenshot.png',
        diff: 'diff.png'
    }
});
