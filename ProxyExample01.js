"use strict";
var obj = new Proxy({}, {
    get() {
        console.log("get");
    }
});
obj;
