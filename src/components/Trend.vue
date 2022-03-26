<!--地区销量趋势-->
<template>
  <div class="com-container">
    <div class="title" @mouseover="showChoice = true" @mouseout="showChoice = false" :style="comStyle">
      <span>{{'┃' + showTitle}}</span>
      <span class="iconfont title-icon" :style="comStyle">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item"
             v-for="item in selectTypes"
             :key="item.key"
             @click="handleSelect(item.key)"
        >{{item.text}}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  name: "Trend",
  data() {
    return {
      chartInstance: null,
      allData: null,   //服务器的数据
      showChoice: false,   //下拉是否显示
      choiceType: 'map',    //显示的数据类型
      titleFontsize:0  //标题字体大小
    }
  },
  created() {
    //组件创建完成后 进行回调函数的注册
    this.$socket.registerCallBack('trendData',this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    //发送数据给服务器 请求数据
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
    //组件销毁时 进行回调函数的取消
    this.$socket.unRegisterCallBack('trendData')
  },
  computed:{
    selectTypes() {
      if (!this.allData) {
        return []
      }else {
        return this.allData.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    showTitle() {
      if (!this.allData){
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    //设置标题样式
    comStyle() {
      return {
        fontSize: this.titleFontsize + 'px'
      }
    },
    marginStyle() {
      return {
        marginLeft: this.titleFontsize + 'px'
      }
    }
  },
  methods:{
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref,'chalk')
      const initOption = {
        //图表位置设置
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        //折线类名修改
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false  //折线紧挨边缘
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    //ret就是服务端发送给客户端的图表的数据
    getData(ret) {
      // const {data: ret} =  await this.$http.get('trend')
      this.allData = ret
      this.updateChart()
    },
    updateChart() {       //处理数据
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      const timeArr = this.allData.common.month  //类目轴数据
      const valueArr = this.allData[this.choiceType].data    //y轴、series数据
      const seriesArr = valueArr.map((item,index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'this.choiceType',
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0,0,0,1,[   //渐变
              {
                offset: 0,
                 color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      this.titleFontsize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontsize,
          itemHeight: this.titleFontsize,
          itemGap: this.titleFontsize,
          textStyle: {
            fontSize: this.titleFontsize
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    handleSelect(currentType) {
      this.choiceType = currentType  //显示类型更新
      this.updateChart()
    }
  }
}
</script>

<style scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
}

.title-icon {
  margin-left: 10px;
  cursor: pointer;
}

.select-item {
  cursor: pointer;
}

.select-con {
  background-color: #222733;
}
</style>