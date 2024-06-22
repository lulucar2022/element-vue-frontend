<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>商家列表</p>
    </header>
    <!-- 商家列表部分 -->
    <ul class="business">
      <li
        v-for="(business, index) in businessList"
        :key="index"
        @click="toBusinessInfo(business.businessId)"
      >
        <div class="business-img">
          <img :src="business.businessImg" alt="商家图片" />
          <div class="business-img-quantity" v-show="business.quantity > 0">
            {{ business.quantity }}
          </div>
        </div>
        <div class="business-info">
          <h3>{{ business.businessName }}</h3>
          <p>
            &#165;{{ business.startPrice }}起送 | &#165;{{
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
import Vue from "vue";
export default {
  components: {
    TheFooter,
  },
  data() {
    return {
      orderTypeId: this.$route.query.orderTypeId,
      businessList: [],
      user: {},
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
    listCart() {
      // 获取购物车列表
      this.$axios
        .get("/CartController/listCart?userId=" + this.user.userId)
        .then((response) => {
          let cartList = response.data;
          console.log("cartList:", cartList);
          // 遍历菜品数组，把在购物车中的菜品设置数量
          // 创建一个 Map 来存储 foodId 到 quantity 的映射
          const cartArray = new Array();
          cartList.forEach((cartItem) => {
            cartArray.push({
              businessId: cartItem.businessId,
              quantity: cartItem.quantity,
            });
          });
          console.log("cartArray:", cartArray);
          // 累加菜品数量，按商家分类
          // 可以改成map集合
          const quantityByBusinessId = new Map();
          cartArray.forEach((cartItem) => {
            if (!quantityByBusinessId.has(cartItem.businessId)) {
              quantityByBusinessId.set(cartItem.businessId,0) ;
            }
            let quantity = quantityByBusinessId.get(cartItem.businessId);
            quantityByBusinessId.set(cartItem.businessId, quantity + cartItem.quantity);
          }),
          console.log(quantityByBusinessId);
          // 现在遍历 businessList 并更新 quantity
          this.businessList.forEach((businessItem) => {
            // 响应式添加 quantity属性
            Vue.set(businessItem, "quantity", 0);
            // 匹配到商家就可以赋值菜品数量
            if (quantityByBusinessId.has(businessItem.businessId)) {
              businessItem.quantity = quantityByBusinessId.get(businessItem.businessId);
            }
          });
          console.log(this.businessList);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  created() {
    this.user = this.$getSessionStorage("user");
    // 获取商家列表
    this.$axios
      .get(
        "/BusinessController/listBusinessByOrderTypeId?orderTypeId=" +
          this.orderTypeId
      )
      .then((res) => {
        this.businessList = res.data;
        // 展示

        // 用户存在就不需要去找用户在该商家的购物车信息了
        if (this.user != null) {
          this.listCart();
        }
        console.log(this.businessList);
      })
      .catch((err) => {
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
