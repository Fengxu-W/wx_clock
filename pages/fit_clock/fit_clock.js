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
    btn_counter_name: '启动',
    btn_counter_type: 'primary',
    btn_color: '',
    isShowToast: false,
    // 滑动侧边栏
    open: false,
    mark: 0,
    newmark: 0,
    istoright: true,
    // picker
    picker_off: false,
    groupArray: [2, 3, 4, 5, 6],
    relaxArray: [10, 20, 30, 90, 180, 300],
    timeArray: [30, 60, 90, 120, 150, 180, 210, 240, 270, 300],
    groupSum: 2,
    groupTime: 30,
    relaxTime: 10,
    // 倒计时数据
    groupNum: 1,
    time: 30
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
  // 点击组数组件确定事件 
  bindGroupNumChange: function (e) {
    this.setData({
      groupSum: this.data.groupArray[e.detail.value]
    });
  },
  bindRelaxChange: function (e) {
    this.setData({
      relaxTime: this.data.relaxArray[e.detail.value]
    });
  },
  bindTimeChange: function (e) {
    var groupTime = this.data.timeArray[e.detail.value]
    this.setData({
      groupTime: groupTime,
      time: groupTime
    });
  },
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        open: false
      });
      var _this = this;
      setTimeout(function () {
        _this.drawProgressbg();
        _this.drawCircle(0.2);
      }, 500)
    } else {
      this.setData({
        open: true
      });
      this.clearCircle()
    }
  },
  tap_start: function (e) {
    // touchstart事件
    this.data.mark = this.data.newmark = e.touches[0].pageX;
  },
  tap_drag: function (e) {
    // touchmove事件

    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;
    if (this.data.mark < this.data.newmark) {
      this.istoright = true;
    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      this.istoright = false;

    }
    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {
    // touchend事件
    this.data.mark = 0;
    this.data.newmark = 0;
    // this.clearCircle();
    if (this.istoright) {
      this.setData({
        open: true
      });
      this.clearCircle()
    } else {
      this.setData({
        open: false
      });
      var _this = this;
      setTimeout(function () {
        _this.drawProgressbg();
        _this.drawCircle(0.2);
        }, 500)
    }
  },
  onLoad: function () {
  },
  drawProgressbg: function () {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    ctx.setLineWidth(6);// 设置圆环的宽度
    ctx.setStrokeStyle('#d2d2d2'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath();//开始一个新的路径
    ctx.arc(125, 125, 120, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke();//对当前路径进行描边
    ctx.draw();
  },
  drawCircle: function (step) {
    var context = wx.createCanvasContext('canvasProgress');
    // 设置渐变
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#2661DD");
    gradient.addColorStop("0.5", "#40ED94");
    gradient.addColorStop("1.0", "#fb9126");

    context.setLineWidth(6);
    context.setStrokeStyle('#fb9126'); // 设置圆环的颜色
    // context.setStrokeStyle(gradient);
    context.setLineCap('round')
    context.beginPath();
    // 参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(125, 125, 120, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    context.stroke();
    context.draw()
  },
  clearCircle: function (){
    console.log('clear')
    var ctx = wx.createCanvasContext('canvasProgress')
    ctx.clearRect(0, 0, 250, 250)
    ctx.draw()
    var ctx1 = wx.createCanvasContext('canvasProgressbg')
    ctx1.clearRect(0, 0, 250, 250)
    ctx1.draw()
  },
  onReady: function () {
    this.drawProgressbg();
    this.drawCircle(0.2);
  }
})
