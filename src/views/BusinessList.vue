<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>商家列表</p>
    </header>
    <!-- 商家列表部分 -->
    <ul class="business">
      <li v-for="business in businessList" :key="business.id" @click="toBusinessInfo(business.id)">
        <div class="business-img">
          <img :src="business.businessImg" alt="商家图片" />
          <div class="business-img-quantity">{{ business.deliveryPrice }}</div>
        </div>
        <div class="business-info">
          <h3>{{ business.businessName }}</h3>
          <p>
            &#165;{{ business.starPrice }}起送 | &#165;{{
              business.deliveryPrice
            }}配送
          </p>
          <p>{{ business.businessExplain }}</p>
        </div>
      </li>
    </ul>

    <!-- 底部菜单部分 -->
    <TheFooter></TheFooter>
  </div>
</template>

<script>
import TheFooter from "@/components/TheFooter";
export default {
  components: {
    TheFooter,
  },
  data() {
    return {
      orderTypeId: this.$route.query.orderTypeId,
      businessList: [],
    };
  },
  methods: {
    toBusinessInfo(businessId) {
      this.$router.push({
        path: "/businessInfo",
        query: {
          businessId: businessId,
        },
      });
    },
  },
  created() {
    this.$axios
      .get(
        "/BusinessController/listBusinessByOrderTypeId?orderTypeId=" +
          this.orderTypeId
      )
      .then((res) => {
        this.businessList = res.data;
      })
      .then((err) => {
        console.log(err);
      });
  },
};
</script>

<style>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097ff;
  color: #fff;
  font-size: 4.8vw;

  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;
}

/****************** 商家列表部分 ******************/
.wrapper .business {
  width: 100%;
  margin-top: 12vw;
  margin-bottom: 14vw;
}
.wrapper .business li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  border-bottom: solid 1px #ddd;
  user-select: none;
  cursor: pointer;

  display: flex;
  align-items: center;
}
.wrapper .business li .business-img {
  /*这里设置为相当定位，成为business-img-quantity元素的父元素*/
  position: relative;
}
.wrapper .business li .business-img img {
  width: 20vw;
  height: 20vw;
}
.wrapper .business li .business-img .business-img-quantity {
  width: 5vw;
  height: 5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;
  border-radius: 2.5vw;

  display: flex;
  justify-content: center;
  align-items: center;

  /*设置成绝对定位，不占文档流空间*/
  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}
.wrapper .business li .business-info {
  margin-left: 3vw;
}
.wrapper .business li .business-info h3 {
  font-size: 3.8vw;
  color: #555;
}
.wrapper .business li .business-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}
/****************** 底部菜单部分 ******************/
.wrapper .footer {
  width: 100%;
  height: 14vw;
  border-top: solid 1px #ddd;
  background-color: #fff;

  position: fixed;
  left: 0;
  bottom: 0;

  display: flex;
  justify-content: space-around;
  align-items: center;
}
.wrapper .footer li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: #999;
  user-select: none;
  cursor: pointer;
}
.wrapper .footer li p {
  font-size: 2.8vw;
}
.wrapper .footer li i {
  font-size: 5vw;
}
</style>
