<!--商家销量横向柱状图-->
<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  name: "Seller",
  data(){
    return{
      chartInstance: null,  //图表
      allData: null,     //服务器返回的数据
      currentPage: 1,  //当前显示的页数
      totalPage: 0,    //共有多少页
      timerId: null
    }
  },
  created() {
    //组件创建完成后 进行回调函数的注册
    this.$socket.registerCallBack('sellerData',this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize',this.screenAdapter)
    //页面加载完先进行一次分辨率的适配
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    //销毁监听器
    window.removeEventListener('resize',this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')

  },
  methods:{
    //初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref,'chalk')
      //对图表初始化配置的控制
      const initOption = {
        title:{
          text: '┃商家销售统计',
          left: 20,
          top: 20
        },
        grid:{
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true   //可以包含坐标轴文字进行图表的移动
        }, //X、Y轴类型
        xAxis:{
          type: 'value'
        },
        yAxis:{
          type: 'category',
        },
        tooltip:{        //鼠标消失数据
          trigger: 'axis',
          axisPointer:{   //背景的设置
            type: 'line',
            z: 0,
            lineStyle:{
              color: '#2D3443',
            },
          }
        },
        series:[
          {
            type: 'bar',
            label:{
              show:true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle:{
              color: new this.$echarts.graphic.LinearGradient(0,0,1,0,[   //渐变颜色设置
                {
                  offset: 0,
                  color: '#ec008c'
                },
                {
                  offset: 1,
                  color: '#fc6767'
                }

              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover',() => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout',() => {
        this.startInterval()
      })
    },
    //获取服务器的数据
    getData(ret) {            //http://127.0.0.1:8888/api/seller
      // const {data: ret} = await this.$http.get('seller')  //由于已经设置好baseurl  不用写前面的内容  用data对象获取
      this.allData = ret
      this.allData.sort((a,b) =>{         //对数组进行排序
        return a.value-b.value
      })
      this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1
      this.updateChart()     //更新数据
      this.startInterval()   //启动定时器
    },
    //更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.allData.slice(start,end)      //将数据分页展示 没页五个数据
      const sellerNames = showData.map((item) => {
        return item.name   //用allData中的商家的name进行创建新的数组并存入sellerNames
      })
      const sellerValues = showData.map((item) => {
        return item.value
      })
      const dataOption = {
        yAxis:{
          data: sellerNames
        },
        series:[
          {
            data: sellerValues,
            }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage){
          this.currentPage = 1
        }
        this.updateChart()   //根据页数更新数据
      },3000)
    },
    //适应浏览器窗口大小
    screenAdapter() {
      const titleFontsize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      //调整分辨率配置
      const adapterOption = {
        title:{
          textStyle:{
            fontSize: titleFontsize
          }
        },
        tooltip:{        //鼠标消失数据
          trigger: 'axis',
          axisPointer:{
            lineStyle:{
              width: titleFontsize,
            },
          }
        },
        series:[
          {
            barWidth: titleFontsize,
            itemStyle:{
              barBorderRadius: [0,titleFontsize / 2,titleFontsize / 2,0],
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 调用图表resize
      this.chartInstance.resize()
    }
  }
}
</script>

<style scoped>

</style>