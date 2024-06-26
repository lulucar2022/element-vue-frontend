<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>确认订单</p>
    </header>

    <!-- 订单信息部分 -->
    <div class="order-info">
      <h5>订单配送至：</h5>
      <div class="order-info-address" @click="toUserAddress">
        <p>
          {{
            deliveryAddress != null ? deliveryAddress.address : "请选择送货地址"
          }}
        </p>
        <i class="fa fa-angle-right"></i>
      </div>
      <div v-if="deliveryAddress != null">
        姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：{{
          deliveryAddress.contactName
        }}
        <br />
        联系电话：{{ deliveryAddress.contactTel }}
      </div>
      <div v-else>
        <p>姓名：{{ user.userName }}{{ user.userSex | sexFilter }}</p>
        <p>手机号码：{{ user.userId }}</p>
      </div>
    </div>

    <h3>{{ business.businessName }}</h3>

    <!-- 订单明细部分 -->
    <ul class="order-detailed">
      <li v-for="item in cartList" :key="item.cartId">
        <div class="order-detailed-left">
          <img :src="item.food.foodImg" />
          <p>{{ item.food.foodName }} x {{ item.quantity }}</p>
        </div>
        <p>&#165;{{ item.food.foodPrice * item.quantity }}</p>
      </li>
    </ul>
    <div class="order-deliveryFee">
      <p>配送费</p>
      <p>&#165;{{ business.deliveryPrice }}</p>
    </div>

    <!-- 合计部分 -->
    <div class="total">
      <div class="total-left">&#165;{{ totalPrice }}</div>
      <div class="total-right" @click="toPayment">去支付</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      businessId: this.$route.query.businessId,
      business: {},
      user: {},
      cartList: [],
      deliveryAddress: {},
    };
  },
  methods: {
    // 跳转到用户的收货地址页面
    toUserAddress() {
      this.$router.push({
        path: "/userAddress",
        query: {
          businessId: this.businessId,
        },
      });
    },
    // 结算
    toPayment() {
      if (this.deliveryAddress == null) {
        alert("请选择收货地址");
        return;
      }
      // 创建订单
      const data = {
        userId: this.user.userId,
        businessId: this.businessId,
        orderTotal: this.totalPrice,
        daId: this.deliveryAddress.daId,
        orderState: 0, // 0 未支付，1 已支付
      };
      this.$axios
        .post("/OrderController/createOrder", data)
        .then((res) => {
          let orderId = res.data.data;
          let code = res.data.code;
          let msg = res.data.message;
          if (orderId > 0 && code == 200 && msg === "success") {
            alert("订单创建成功");
            // 跳转到支付页面
            this.$router.push({
              path: "/payment",
              query: {
                orderId: orderId,
              },
            });
          } else {
            alert("订单创建失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.user = this.$getSessionStorage("user");
    this.deliveryAddress = this.$getLocalStorage(this.user.userId);

    // 查询当前商家
    this.$axios
      .get("/BusinessController/getBusinessById?businessId=" + this.businessId)
      .then((res) => {
        this.business = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });

    //查询当前用户在购物车中的当前商家食品列表
    const data = this.$qs.stringify({
      userId: this.user.userId,
      businessId: this.businessId,
    });
    this.$axios
      .get("/CartController/listCart?" + data)
      .then((res) => {
        this.cartList = res.data.data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  computed: {
    // 订单总费用
    totalPrice() {
      let totalPrice = 0;
      for (let cartItem of this.cartList) {
        totalPrice += cartItem.food.foodPrice * cartItem.quantity;
      }
      totalPrice += this.business.deliveryPrice;
      return totalPrice;
    },
  },
  filters: {
    sexFilter(value) {
      return value == 1 ? "先生" : "女士";
    },
  },
};
</script>

<style scoped>
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

/****************** 订单信息部分 ******************/
.wrapper .order-info {
  /*注意这里，不设置高，靠内容撑开。因为地址有可能折行*/
  width: 100%;
  margin-top: 12vw;
  background-color: #0097ef;
  box-sizing: border-box;
  padding: 2vw;
  color: #fff;
}

.wrapper .order-info h5 {
  font-size: 3vw;
  font-weight: 300;
}

.wrapper .order-info .order-info-address {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-weight: 700;
  user-select: none;
  cursor: pointer;
  margin: 1vw 0;
}

.wrapper .order-info .order-info-address p {
  width: 90%;
  font-size: 5vw;
}

.wrapper .order-info .order-info-address i {
  font-size: 6vw;
}

.wrapper .order-info p {
  font-size: 3vw;
}

.wrapper h3 {
  box-sizing: border-box;
  padding: 3vw;
  font-size: 4vw;
  color: #666;
  border-bottom: solid 1px #ddd;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailed {
  width: 100%;
}

.wrapper .order-detailed li {
  width: 100%;
  height: 16vw;
  box-sizing: border-box;
  padding: 3vw;
  color: #666;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order-detailed li .order-detailed-left {
  display: flex;
  align-items: center;
}

.wrapper .order-detailed li .order-detailed-left img {
  width: 10vw;
  height: 10vw;
}

.wrapper .order-detailed li .order-detailed-left p {
  font-size: 3.5vw;
  margin-left: 3vw;
}

.wrapper .order-detailed li p {
  font-size: 3.5vw;
}

.wrapper .order-deliveryFee {
  width: 100%;
  height: 16vw;
  box-sizing: border-box;
  padding: 3vw;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 3.5vw;
}

/****************** 订单合计部分 ******************/
.wrapper .total {
  width: 100%;
  height: 14vw;

  position: fixed;
  left: 0;
  bottom: 0;

  display: flex;
}

.wrapper .total .total-left {
  flex: 2;
  background-color: #505051;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  user-select: none;

  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper .total .total-right {
  flex: 1;
  background-color: #38ca73;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  user-select: none;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
