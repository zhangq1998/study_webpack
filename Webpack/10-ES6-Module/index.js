/*
ES6模块化的第一种方式
导出数据: export {xxx};
导入数据: import {xxx} from "path";
* */
/*
注意点:
1.如果是通过export {xxx};方式导出数据, 那么在导入接收的时候接收的变量名称必须和导出的名称一致
  究其原因是因为在导入的时候本质上是ES6的解构赋值
2.如果是通过export {xxx};方式导出数据, 又想在导入数据的时候修改接收的变量名称, 那么可以使用as来修改
  但是如果通过as修改了接收的变量名称, 那么原有的变量名称就会失效
* */
/*
// import {name} from "./a.js";
import {str} from "./a.js";

console.log(str);
 */
/*
let obj = {
    name: "lnj",
    age: 34
};
// let {name, age} = obj;
// console.log(name);
let {str, age} = obj;
console.log(str);
console.log(age);
 */
/*
import {name as str} from "./a.js";

console.log(name);
console.log(str);
 */


/*
ES6模块化的第二种方式
导出数据: export default xxx;
导入数据: import xxx from "path";
* */
/*
注意点:
1.如果是通过export default xxx;导出数据, 那么在接收导出数据的时候变量名称可以和导出的明白不一致
2.如果是通过export default xxx;导出数据, 那么在模块中只能使用一次export default
* */
/*
// import name from "./b.js";
import str from "./b.js";

console.log(str);
 */
/*
import name from "./b.js";
import age from "./b.js";
console.log(name);
console.log(age);
 */
/*
import {name, age} from "./a.js";

console.log(name);
console.log(age);
 */

/*
// 两种方式混合使用
import Person,{name, age, say} from "./c.js";
let p = new Person();
console.log(p);

console.log(name);
console.log(age);
say();
 */

// const icon = require("./lnj.jpg");
// const _ = require("./index.css");

import icon from "./lnj.jpg";
import "./index.css";

let oImg = document.createElement("img");
oImg.src = icon;
oImg.setAttribute("class", "size");
document.body.appendChild(oImg);
