<!-- 商家分布图表 -->
<template>
  <div class="com-container" >
    <div>
      <span class="iconfont com-rever" @click="reverMap" v-show="pre">&#xe6eb;</span>
    </div>
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import {getProvinceMapInfo} from "@/utils/map_utils";
export default {
  name: "Map",
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {},   //缓存地图数据
      pre: false
    }
  },
  created() {
    //组件创建完成后 进行回调函数的注册
    this.$socket.registerCallBack('mapData',this.getData)
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize',this.screenAdapter)
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize',this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref,'chalk')
      // 获取地图矢量数据
      // 数据在此项目中而不是KOA2后台 不能用this.$http
      const ret = await axios.get('http://127.0.0.1:8999/static/map/china.json')
      this.$echarts.registerMap('china',ret.data)
      const initOption = {
        title: {    //标题
          text: '┃商家分布',
          left: 20,
          top: 20
        },
        geo: {   //地图
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: "5%",
          itemStyle: {
            areaColor: '#ff7e5f',
            borderColor: '#333'
          }
        },
        legend: {   //标签
          left: "5%",
          bottom: "5%",
          orient: 'vertigo'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click',async arg=> {
        const provinceInfo = getProvinceMapInfo(arg.name)   //获取点击地区名称
        this.pre = true
        // 获取矢量数据
        if (!this.mapData[provinceInfo.key]) {   //判断缓存器中是否有匹配的数据
          const ret = await axios.get('http://127.0.0.1:8999' + provinceInfo.path)
          this.mapData[provinceInfo.key] = ret.data
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    getData(ret) {
      // const {data: ret} = await this.$http.get('map')
      this.allData = ret
      this.updateChart()
    },
    updateChart() {
      const legendArr = this.allData.map(item => {
        return item.name
      })
      const seriesArr = this.allData.map(item => {
        return {   //类别下的散点数据
          type: 'effectScatter',
          rippleEffect: {    //涟漪效果
            scale: 5,
            // brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'   //使用坐标系系统
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter() {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    reverMap() {    //点击返回界面
      this.pre = false
      const reverOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(reverOption)
    }
  }
}
</script>

<style scoped>
.com-rever {
  position: absolute;
  top: 50%;
  left: 6%;
  z-index: 10;
  font-size: 30px;
  color: white;
  border-radius: 15px;
  cursor: pointer;
}
</style>