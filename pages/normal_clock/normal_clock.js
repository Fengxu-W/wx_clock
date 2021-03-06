var timer

function timing(that) {
  timer = setInterval(function () {
    that.data.data--
    that.setData({
      min: fixNum(parseInt(that.data.data / 6e3 % 60)),
      seconds: fixNum(parseInt(that.data.data / 100 % 60)),
      ms: String(that.data.data).substring(String(that.data.data).length - 2),
      time: that.data.min + "'" + that.data.seconds + "''" + that.data.ms,
    })
    if (that.data.data < 0) {
      wx.showToast({
        title: '时间到'
      })
      that.setData({
        time: "00'00''00",
        btn_counter_name: '启动',
        btn_counter_type: 'primary',
        btn_color: '',
        picker_off: false
      })
      clearInterval(timer)
    }
  }, 10)
}

function fixNum(t) {
  return t = t < 10 ? "0" + t : t+''
}

Page({
  data: {
    min: "00",
    seconds: "00",
    ms: "00",
    data: "00",
    time: "00'00''00",
    currentTab: 0,
    btn_counter_name: '启动',
    btn_counter_type: 'primary',
    btn_color: '',
    picker_off: false,
    multiIndex: [0, 0],
    multiArray: [],
    //toast默认不显示 
    isShowToast: false
  },
  click_counter: function () {
    var status = this.data.btn_counter_name;
    if (this.data.data == '00') {
      wx.showModal({
        title: '提示',
        content: '请点击时间，进行设置',
      })
    } else if (status == '启动') {
      timing(this);
      this.setData({
        btn_counter_name: '停止',
        btn_counter_type: 'warn',
        picker_off: true
      });
    }
    if (status == '停止') {
      clearInterval(timer)
      this.setData({
        btn_counter_name: '清空',
        btn_counter_type: 'default',
        btn_color: '#cccccc'
      });
    }
    if (status == '清空') {
      this.setData({
        btn_counter_name: '启动',
        btn_counter_type: 'primary',
        btn_color: '',
        time: "00'00''00",
        data: "00",
        min: "00",
        seconds: "00",
        ms: "00",
        picker_off: false
      });
    }
  },
  onLoad: function () {
    var temp = []
    for (var i = 0; i < 60; i++) {
      temp.push(fixNum(i))
    }
    var multiArray = [temp, temp]
    
    this.setData({
      min: fixNum(parseInt(this.data.data / 6e3 % 60)),
      seconds: fixNum(parseInt(this.data.data / 100 % 60)),
      ms: String(this.data.data).substring(String(this.data.data).length - 2),
      time: this.data.min + "'" + this.data.seconds + "''" + this.data.ms,
      multiArray: multiArray
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '点击时间，设置定时时长',
    //   showCancel: false
    // })
  },
  // 点击时间组件确定事件  
  bindTimeChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex = e.detail.value;
    var min = data.multiArray[0][data.multiIndex[0]]
    var sec = data.multiArray[1][data.multiIndex[1]]
    var ms = min * 6e3 + sec * 100
    this.setData({
      time: min + "'" + sec + "''00",
      data: ms,
      min: min,
      seconds: sec,
      ms: String(ms).substring(String(ms).length - 2),
      multiIndex: e.detail.value
    })
  }
})
