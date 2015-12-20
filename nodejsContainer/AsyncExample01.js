"use strict";
let fs = require("fs"),
    thunkify = require("thunkify"),
    readFile = thunkify(fs.readFile),
    gen = function*() {
    	let r1 = yield readFile("text1.txt");
    	console.log(r1.toString());
    	let r2 = yield readFile("text2.txt");
    	console.log(r2.toString());
    },
    g = gen(),
    r1 = g.next();	// 读取第一个文件
r1.value((err, data) => {
	if (err) {
		throw err;
	}
	let r2 = g.next(data);	// 传回generator函数，并输出data,而且会执行下一条yield 读取第二个文件
	r2.value((err, data) => {
		if (err) {
			throw err;
		}
		g.next(data);	// 这个是最后一个yield，该条返回值为 value: undefined, done: true
	})	// 处理第二个文件读取后的回调
})	// 文件读取完成后的回调
