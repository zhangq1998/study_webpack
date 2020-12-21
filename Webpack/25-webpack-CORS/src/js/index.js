import $ from "jquery";

/*
当前发送请求的地址: http://127.0.0.1:9090/user
服务端的地址:       http://127.0.0.1:3000/user
* */
$.get("/user", function (result) {
    console.log(result);
});

$.get("/login", function (result) {
    console.log(result);
});