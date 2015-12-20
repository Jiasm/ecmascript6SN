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
    };


function run(gen) {
    let g = gen();

    function next(data) {
        let result = g.next(data);
        if (result.done) {
            console.log("is over");
            return;
        }
        result.value
            .then(next) // 调用自身
            .catch((err) => {
                console.log(err)
            }); // 虽说这个异常可以捕获，但是抛不出去
    }
    next();
}

run(gen);
