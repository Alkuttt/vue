<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="../../public/static/img/header_border_dark.png" alt="">
      </div>
      <span class="logo">
        ALKT
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <span class="datetime">{{nowDate}}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']">
          <!--销量趋势图表-->
          <Trend ref="trend"></Trend>
          <div class="resize">
            <span @click="changeSize('trend')" :class="['iconfont',fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!--商家销售金额图表-->
          <Seller ref="seller"></Seller>
          <div class="resize">
            <span @click="changeSize('seller')" :class="['iconfont',fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map ? 'fullscreen' : '']">
          <!--商家分布图表-->
          <Map ref="map"></Map>
          <div class="resize">
            <span @click="changeSize('map')" :class="['iconfont',fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!--地区销量排行榜-->
          <Rank ref="rank"></Rank>
          <div class="resize">
            <span @click="changeSize('rank')" :class="['iconfont',fullScreenStatus.resize ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!--热销商品占比图表-->
          <Hot ref="hot"></Hot>
          <div class="resize">
            <span @click="changeSize('hot')" :class="['iconfont',fullScreenStatus.resize ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!--库存销量分析图表-->
          <Stock ref="stock"></Stock>
          <div class="resize">
            <span @click="changeSize('stock')" :class="['iconfont',fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from "@/components/Hot";
import Map from "@/components/Map";
import Rank from "@/components/Rank";
import Seller from "@/components/Seller";
import Stock from "@/components/Stock";
import Trend from "@/components/Trend";
export default {
  name: "ScreenPage",
  data() {
    return {
      //每个图表全屏状态
      fullScreenStatus: {
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false
      },
      nowDate: ''
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
  mounted() {
    this.currentTime();
  },
    beforeDestroy() {
      if (this.formatDate) {
        clearInterval(this.formatDate); // 在Vue实例销毁前，清除时间定时器
    }
  },
  methods: {
    changeSize(chartName) {
      //改变fullScreenStatus的数据
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      //调用该组件的screenAdapter
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    currentTime() {
      setInterval(this.formatDate, 500);
    },
    formatDate() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let week = date.getDay(); // 星期
      let weekArr = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.nowDate = `${year}/${month}/${day} ${hour}:${minute}:${second} ${weekArr[week]}`;
    }
  }
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
> div {
img {
  width: 100%;
}
}
.title {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 20px;
  transform: translate(-50%, -50%);
}
.title-right {
  display: flex;
  align-items: center;
  position:absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-80%);
}
.qiehuan {
  width: 28px;
  height: 21px;
  cursor: pointer;
}
.datetime {
  font-size: 15px;
  margin-left: 10px;
}
.logo {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-80%);
img {
  height: 35px;
  width: 128px;
}
}
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
.screen-left {
  height: 100%;
  width: 27.6%;
#left-top {
  height: 53%;
  position: relative;
}
#left-bottom {
  height: 31%;
  margin-top: 25px;
  position: relative;
}
}
.screen-middle {
  height: 100%;
  width: 41.5%;
  margin-left: 1.6%;
  margin-right: 1.6%;
#middle-top {
  width: 100%;
  height: 56%;
  position: relative;
}
#middle-bottom {
  margin-top: 25px;
  width: 100%;
  height: 28%;
  position: relative;
}
}
.screen-right {
  height: 100%;
  width: 27.6%;
#right-top {
  height: 46%;
  position: relative;
}
#right-bottom {
  height: 38%;
  margin-top: 25px;
  position: relative;
}
}
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>