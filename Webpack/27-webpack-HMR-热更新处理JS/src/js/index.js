import "../css/index.css"
import addSpan from "./test.js";

let btn = document.createElement("button");
btn.innerText = "添加内容";
document.body.appendChild(btn);

let index = 0;
btn.onclick = function () {
    let p = document.createElement("p");
    p.innerText = "我是第" + index + "个段落";
    index++;
    document.body.appendChild(p);
};

addSpan();

// 判断当前有没有开启热更新
if(module.hot){
    // 告诉热更新需要监听哪一个JS模块的变化
    module.hot.accept("./test.js", function () {
        let oSpan = document.querySelector("span");
        document.body.removeChild(oSpan);
        addSpan();
    });
}



