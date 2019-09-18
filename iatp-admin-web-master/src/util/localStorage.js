//保存到localStorage
let setValue = function (key,value){
  let item = value
  localStorage.setItem(key,JSON.stringify(item))
}
//获取localStorage
let getValue = function (key){
  let value = localStorage.getItem(key)
  if(!value) return null
  return JSON.parse(value)
}
//删除localStorage
let removeValue = function (key){
  localStorage.removeItem(key)
}
//清除全部localStorage内容
let clearValue = function (){
  localStorage.clear()
}
//导出全部方法
export {setValue, getValue, removeValue, clearValue}
//使用时引入就可以 import {setValue, getValue, removeValue, clearValue}