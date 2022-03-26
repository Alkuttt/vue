<!--针对/sellerpage显示出来  并基于seller组件显示-->
<template>
  <div class="com-page">
    <Seller></Seller>
  </div>
</template>

<script>
import Seller from "@/components/Seller";
export default {
  name: "SellerPage",
  components:{
    Seller
  }
}
</script>

<style scoped>

</style>