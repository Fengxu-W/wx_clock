var timer

function timing(that) {
  timer = setInterval(function () {
    that.data.data++
    that.setData({
        min: fixNum(parseInt(that.data.data / 6e3 % 60)),
        seconds: fixNum(parseInt(that.data.data / 100 % 60)),
        ms: String(that.data.data).substring(String(that.data.data).length - 2),
        time: that.data.min + "'" + that.data.seconds + "''" + that.data.ms, 
    })
  }, 10)
}

function fixNum(t) {
  return t = t < 10 ? "0" + t : t
}

// 处理速度太慢，不能接受
function formatSeconds(that) {
  var mins = 0, seconds = 0, micro_seconds = that.data.micro_seconds, time = ''
  if (micro_seconds > 99 && micro_seconds < 6000) {
    seconds = parseInt(micro_seconds / 100)
    micro_seconds = micro_seconds % 100
  } else {
    seconds = parseInt(micro_seconds / 100)
    micro_seconds = micro_seconds % 100
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
  }
  that.setData({
    time: fixNum(mins) + "'" + fixNum(seconds) + "''" + fixNum(micro_seconds)
  });
}

Page({
  data: {
    min: "00",
    seconds: "00",
    ms: "00",
    data: "00",
    time: "00''00'00",
    btn_counter_name: '启动',
    btn_counter_type: 'primary',
    btn_color: '',
    record_list: [],
    scrollTop: 0,
    //toast默认不显示 
    isShowToast: false
  },
  insert: function (event){
    var status = this.data.btn_counter_name;
    if (status == '停止' && event.target.id !== "btn_counter") {
      var record_list = this.data.record_list;
      var index = record_list.length + 1;
      var record = this.data.time;
      record_list.push({ 'index': index, 'record': record })
      this.setData({
        record_list: record_list
      });
      // 新增记录时，跳到顶部
      var _top = this.data.scrollTop;//发现设置scroll-top值不能和上一次的值一样，否则无效
      if (_top == 1) {
        _top = 0;
      } else {
        _top = 1;
      }
      this.setData({
        'scrollTop.scroll_top': _top
      });
    }
  },
  click_counter: function () {
    var status = this.data.btn_counter_name;
    if (status == '启动'){
      timing(this);
      this.setData({
        btn_counter_name: '停止',
        btn_counter_type: 'warn',
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
        micro_seconds: 0,
        time: "00'00''00",
        data: "00",
        min: "00",
        seconds: "00",
        ms: "00",
        record_list: []
      });
    }
  },
  onLoad: function () {
  
  }
})
