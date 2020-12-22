import data from "./data.json";
function fn1 () {
    console.log("fn1");
}

fn1();
console.log(data);
// 开发环境打包
//npx webpack ./src/index.js -o ./dist/ --mode=development
// 生产环境打包
// webpack ./src/index.js -o ./dist/a.js --mode=production

// webpack默认可以处理js文件、json文件
// 生产环境比开发环境多了压缩代码和代码混淆