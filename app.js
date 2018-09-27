//app.js
App({
  onLaunch: function () {
    // 屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },
  globalData: {
    userInfo: null
  }
})