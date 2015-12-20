"use strict";
let fs = require("fs"),
    thunkify = require("thunkify"),
    readFile = thunkify(fs.readFile);
function run (fn) {	// 参数为一个generator构造器
	let gen = fn();	// 构建generator函数

	function next (err, data) {
		let result = gen.next(data);
		if (err) {
			throw err;
		}
		if (result.done) {
			return;
		}
		result.value(next);	// 将函数自身传入

	}

	next();	// 不传入任何参数，相当于第一次调用generator.next()
};

run(function* () {
	let r1 = yield readFile("text1.txt");
	console.log(r1.toString());	// 该条于第二次调用next时执行
	let r2 = yield readFile("text2.txt");
	console.log(r2.toString());	// 该条于第三次调用next时执行
})