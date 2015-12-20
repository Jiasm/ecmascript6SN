"use strict";
let fs = require("fs"),
    thunkify = function(fn) {
        return (fileName) => {
            return new Promise((re, rj) => {
                fn(fileName, (err, data) => {
                    if (err) {
                        rj(err);
                    }
                    re(data);
                })
            })
        }
    },
    readFile = thunkify(fs.readFile),
    gen = function*() {
        let r1 = yield readFile("text1.txt");
        console.log(r1.toString()); // 该条于第二次调用next时执行
        let r2 = yield readFile("text2.txt");
        console.log(r2.toString()); // 该条于第三次调用next时执行
    },
    g = gen();	// 构建生成器
g.next().value.then((data) => {	// 初次调用next，接收的data为第一个文件的文本
    g.next(data).value.then((data) => {	// 第二次调用，接收的data为第二个文件的文本，传入的为第一个yield的返回值
        g.next(data);	// 第三次调用，传入的为第二个yield的返回值
    })
})
