import icon from "./lnj.jpg";
// import "./index.css"
import cssModule from "./index.css"
import {addImage} from "./custom.js";

console.log(cssModule);
let oImg = document.createElement("img");
oImg.src = icon;
// oImg.setAttribute("class", "size");
oImg.setAttribute("class", cssModule.size);
document.body.appendChild(oImg);

addImage();

