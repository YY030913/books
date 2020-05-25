const child_process = require('child_process');

var cheerio = require('cheerio')
var request = require('yy030913.request')
var fs = require('fs')
var detailContentList = [];
let playlist = [];
let baseUrl = "https://helpx.adobe.com";
const _ = require('lodash')


function sleep(time) {
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve();
        }, time)
    });
}

function fixStr(num) {
    return ("" + (10000 + num)).substr(1);
}

getTs = async function() {
    for (var num = 1; num < 4; num++) {
        let content = await request(`http://www.guoxue.com/?category_name=book1&paged=${num}`, 'get')
        // .then(content => {
            var $ = cheerio.load(content);
            for (var i = 0; i < $(".border-green dd").length; i++) {
                let name = $(".border-green dd").eq(i).find("a").eq(0).attr("href").split("book=")[1];
                let title = $(".border-green dd").eq(i).find("a").eq(0).attr("title");
                let hasNext = true;
                let j = 1;
                while (hasNext) {
                    let body = await request(`http://www.guoxue.com/book/${name}/${fixStr(j)}.htm`, 'get')
                    // .then(body => {
                        if (body) {
                            var $$ = cheerio.load(body);
                            if (!fs.existsSync(title)) {
                                fs.mkdirSync(title);
                            }
                            let a = $$(".entry").text();
                            if (a.indexOf("　　下一页")) {
                                a = a.substring(0, a.length- 72);
                            } else {
                                a = a.substring(0, a.length- 60)
                            }
                            fs.writeFileSync(title + "/" + j + ".db", a)
                            j++;
                        } else {
                            break;
                        }
                        
                    // })
                    
                }
            }
        // }) 
    }
}

getTs();

// http://www.guoxue123.com/