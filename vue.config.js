const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave:false,    //阻止名字为一个单词时报错
  transpileDependencies: true,
  devServer:{
    proxy:{
      "/seller":{
        target:"http://127.0.0.1:8888",   //目标服务器地址
        changeOrigin:true,
        pathRewrite: {
          "^/sellerpage":""  //对请求路径进行重定向以匹配到正确的请求地址
        }
      },
      "/trend":{
        target:"http://127.0.0.1:8888",
        changeOrigin:true,
        pathRewrite: {
          "^/trendpage":""
        }
      },
      "/map":{
        target:"http://127.0.0.1:8888",
        changeOrigin:true,
        pathRewrite: {
          "^/mappage":""
        }
      },
      "/rank":{
        target:"http://127.0.0.1:8888",
        changeOrigin:true,
        pathRewrite: {
          "^/rankpage":""
        }
      },
      "/hot":{
        target:"http://127.0.0.1:8888",
        changeOrigin:true,
        pathRewrite: {
          "^/hotpage":""
        }
      },
      // "/stock":{
      //   target:"http://127.0.0.1:8888",
      //   changeOrigin:true,
      //   pathRewrite: {
      //     "^/stockpage":""
      //   }
      // }
    },
    host:'127.0.0.1',
    port:8999,
  //   open:true
  }
})
