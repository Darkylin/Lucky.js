/**
 * Created by darkylin on 1/19/15.
 */
var XLS = require('xlsjs');
var fse = require('fs-extra');
var data = XLS.readFile('app/data/hotel.xls');
console.log(data);
fse.writeJSON('app/data/hotel.json',XLS.utils.sheet_to_json(data.Sheets.sheet1));
