var iconv = require('iconv-lite');
const child_process = require('child_process');

var https = require('https')

var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')

fetchLib = function(url) {
    return new Promise((resolve, reject) => {
        http.get(url, function(res) {
            // res.setEncoding('gb2312');
            content = "";
            let arr = [];
            let length = 0;
            res.on('data', function(data) { //加载到内存
                // content += data;
                arr.push(data);
                length += data.length;
            }).on('end', function() {
                var data = Buffer.concat(arr, length);
                var content = iconv.decode(data, 'gb2312');
                
                if (content) {
                    var $ = cheerio.load(content);
                    console.log($("h1").text())
                    console.log($("#content").text().substr(0, 10))
                    fs.writeFileSync(dirName + "/" + $("h1").text(), $("#content").text() + "/r/n" + $(".translation").eq(0).text() + "/r/n" + $(".translation").eq(1).text())
                    // document.getElementById("").innerText
                    resolve(true);
                    return;
                }
                resolve(false);
            }).on('error', function(e) {
                console.log(e)
                resolve(false);
            });
        }).on('error', function(e) {
            console.log(e)
            resolve(false);
        })
    });
}

let dirName = "./智囊";
if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, {
        recursive: true,
    })
}
task = async function() {
    for (var i = 1; i <= 247; i++) {
        let url = `http://www.vsucai.cn/zhinang/content-${i}.html`
        await fetchLib(url);
    }
}
task();