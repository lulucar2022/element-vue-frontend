<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>在线支付</p>
    </header>

    <!-- 订单信息部分 -->
    <h3>订单信息：</h3>
    <div class="order-info">
      <p>
        {{ orders.business.businessName }}
        <i class="fa fa-caret-down" @click="detailShow"></i>
      </p>
      <p>&#165;{{ orders.orderTotal }}</p>
    </div>

    <!-- 订单明细部分 -->
    <ul class="order-Detail" v-show="isShowDetail">
      <li v-for="(item, index) in orders.orderDetails" :key="index">
        <p>{{ item.food.foodName }} x {{ item.quantity }}</p>
        <p>&#165;{{ item.food.foodPrice * item.quantity }}</p>
      </li>
      <li>
        <p>配送费</p>
        <p>&#165;{{ orders.business.deliveryPrice }}</p>
      </li>
    </ul>

    <!-- 支付方式部分 -->
    <ul class="payment-type">
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option)"
      >
        <img :src="require(`../assets/${option.img}`)" />
        <i
          :class="[
            option.selected ? 'fa' : '',
            option.selected ? 'fa-check-circle' : '',
          ]"
        ></i>
      </li>
    </ul>
    <div class="payment-button" @click="confirmPayment()">
      <button>确认支付</button>
    </div>

    <!-- 底部菜单部分 -->
    <TheFooter></TheFooter>
  </div>
</template>

<script>
import TheFooter from "@/components/TheFooter.vue";
export default {
  components: {
    TheFooter,
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      orders: {
        business: {},
      },
      isShowDetail: false,
      selectedOption: null,
      options: [
        // 默认选择支付宝
        { name: "支付宝", img: "alipay.png", selected: true },
        { name: "微信支付", img: "wechat.png", selected: false },
      ],
    };
  },
  created() {
    // 获取订单
    this.$axios
      .get("/OrderController/getOrdersById?orderId=" + this.orderId)
      .then((res) => {
        this.orders = res.data.data;
        console.log("order:{}", this.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  mounted() {
    //这里的代码是实现：一旦路由到在线支付组件，就不能回到订单确认组件。
    //先将当前url添加到history对象中
    history.pushState(null, null, document.URL);
    //popstate事件能够监听history对象的变化
    window.onpopstate = () => {
      this.$router.push({ path: "/index" });
    };
  },
  destroyed() {
    window.onpopstate = null;
  },
  methods: {
    detailShow() {
      this.isShowDetail = !this.isShowDetail;
    },
    // 确认支付
    confirmPayment() {
      let shouldContinue = confirm("确认支付");
      if (shouldContinue) {
        const data = {
          orderId: this.$route.query.orderId,
          orderState: 1,
        };
        this.$axios
          .patch("/OrderController/order", data)
          .then((res) => {
            if (res.data.code === 200 && res.data.message == "success") {
              alert("支付成功！");
              this.$router.push({
                path: "/orderList",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("支付已取消");
      }
    },

    // 选择支付方式
    selectOption(option) {
      this.options.forEach((opt) => {
        opt.selected = opt === option;
      });
      this.selectedOption = option;
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
.wrapper h3 {
  margin-top: 12vw;
  box-sizing: border-box;
  padding: 4vw 4vw 0;

  font-size: 4vw;
  font-weight: 300;
  color: #999;
}

.wrapper .order-info {
  box-sizing: border-box;
  padding: 4vw;
  font-size: 4vw;
  color: #666;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order-info p:last-child {
  color: orangered;
}

/****************** 订单明细部分 ******************/
.wrapper .order-Detail {
  width: 100%;
}

.wrapper .order-Detail li {
  width: 100%;
  box-sizing: border-box;
  padding: 1vw 4vw;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order-Detail li p {
  font-size: 3vw;
  color: #666;
}

/****************** 支付方式部分 ******************/
.wrapper .payment-type {
  width: 100%;
}

.wrapper .payment-type li {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .payment-type li img {
  width: 33vw;
  height: 8.9vw;
}

.wrapper .payment-type li .fa-check-circle {
  font-size: 5vw;
  color: #38ca73;
}

.wrapper .payment-button {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw;
}

.wrapper .payment-button button {
  width: 100%;
  height: 10vw;
  border: none;
  /*去掉外轮廓线*/
  outline: none;
  border-radius: 4px;
  background-color: #38ca73;
  color: #fff;
}
</style>
