import * as address from "area-data";
let specialArea = address.pca;
let area = address.pcaa;
// 直辖市 城市名称 更换为 市名称
area[110000][110100] = "北京市";
area[120000][120100] = "天津市";
area[310000][310100] = "上海市";
area[500000][500100] = "重庆市"
export {specialArea, area};