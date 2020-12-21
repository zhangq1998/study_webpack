import moment from 'moment';
import 'moment/locale/zh-cn.js';

moment.locale('zh-cn');
const time = moment('20111031', 'YYYYMMDD').fromNow();
console.log(time);
