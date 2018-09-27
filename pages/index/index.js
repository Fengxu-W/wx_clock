//index.js
//获取应用实例
const app = getApp()
var commonFunction = require('../../utils/common')

Page({
  data: {
    date: '',
    lunar_date: '',
    time: '',
    second: ''
  },
  onLoad: function () {
    var _this = this
    this.setData({
      date: commonFunction.formatDate(new Date()),
      lunar_date: commonFunction.getLunarDate(new Date()),
      time: commonFunction.formatTime(new Date()),
      second: commonFunction.formatSecond(new Date())
    })
    var interval = setInterval(function () {
      _this.setData({
        time: commonFunction.formatTime(new Date()),
        second: commonFunction.formatSecond(new Date())
      })
    }, 1000);
  }
})
