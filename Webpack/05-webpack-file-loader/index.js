const icon = require("./lnj.jpg");
// file-loader处理之后我们导入图片拿到的是图片打包之后的地址
console.log(icon);

let oImg = document.createElement("img");
oImg.src = icon;
document.body.appendChild(oImg);