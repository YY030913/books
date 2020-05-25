const child_process = require('child_process');

var https = require('https')

var http = require('http')
var fs = require('fs')
var cheerio = require('cheerio')

fetchLib = function(url) {
    return new Promise((resolve, reject) => {
        https.get(url, function(res) {
            res.setEncoding('utf-8');
            content = "";
            res.on('data', function(data) { //加载到内存
                content += data;
            }).on('end', function() {
                if (content) {
                    var $ = cheerio.load(content);
                    console.log($("#c_title").text())
                    console.log($("#content").text().substr(0, 10))
                    fs.writeFileSync(dirName + "/" + $("#c_title").text(), $("#content").text())
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

let dirName = "./白色巨塔";
if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, {
        recursive: true,
    })
}
task = async function() {
	for (var i = 305242; i <= 305261; i++) {
	    let url = `https://www.99lib.net/book/8607/${i}.htm`
	    await fetchLib(url);
	}
}
task();
