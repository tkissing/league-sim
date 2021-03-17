import { generateSchedule } from './src/util/schedule';

const names = ['yrk', 'lan', 'stu', 'tdr'];

console.log(JSON.stringify(generateSchedule(names), null, 4));
