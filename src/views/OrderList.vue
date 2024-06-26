<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>我的订单</p>
    </header>

    <!-- 订单列表部分 -->
    <h3>未支付订单信息：</h3>
    <ul class="order">
      <li v-for="{ order, index } in isShowOrderList" :key="index">
        <div class="order-info">
          <p>
            {{ order.business.businessName }}
            <i class="fa fa-caret-down" @click="detailShow(order)"></i>
          </p>
          <div class="order-info-right">
            <p>&#165;{{ order.orderTotal }}</p>
            <div class="order-info-right-icon">去支付</div>
          </div>
        </div>
        <ul class="order-detail" v-show="order.isShowDetail">
          <li v-for="(odItem, index) in item.list" :key="index">
            <p>{{ odItem.food.foodName }} x {{ odItem.quantity }}</p>
            <p>&#165;{{ odItem.food.foodPrice * odItem.quantity }}</p>
          </li>
          <li>
            <p>配送费</p>
            <p>&#165;{{ item.business.deliveryPrice }}</p>
          </li>
        </ul>
      </li>
    </ul>

    <h3>已支付订单信息：</h3>
    <ul class="order">
      <li v-for="(item, index) in orderList" :key="index">
        <div class="order-info">
          <p>
            {{ item.business.businessName }}
            <i class="fa fa-caret-down" @click="detailShow(item)"></i>
          </p>
          <div class="order-info-right">
            <p>&#165;{{ item.orderTotal }}</p>
          </div>
        </div>
        <ul class="order-detail" v-show="item.isShowDetail">
          <li v-for="(odItem, index) in item.orderDetails" :key="index">
            <p>{{ odItem.food.foodName }} x {{ odItem.quantity }}</p>
            <p>&#165;{{ odItem.food.foodPrice * odItem.quantity }}</p>
          </li>
          <li>
            <p>配送费</p>
            <p>&#165;{{ item.business.deliveryPrice }}</p>
          </li>
        </ul>
      </li>
    </ul>

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
      user: {},
      orderList: [],
    };
  },
  created() {
    // 生命周期函数
    this.user = this.$getSessionStorage("user");

    // 订单展示
    // 1. 订单支付后就不展示了
    this.$axios
      .get("/OrderController/listOrdersByUserId?userId=" + this.user.userId)
      .then((res) => {
        if (res.data.code == 200 && res.data.message == "success") {
          this.orderList = res.data.data;
          this.orderList.forEach((order) => {
            this.$set(order, 'isShowDetail', false)
          });
          console.log(this.orderList)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    detailShow(order) {
      order.isShowDetail = !order.isShowDetail;
    },
  },
  computed: {
    // 计算属性
    // 未支付订单列表
    isShowOrderList() {
      return this.orderList.filter((order) => {
        order.orderState === 0;
      });
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

/****************** 历史订单列表部分 ******************/
.wrapper h3 {
  margin-top: 12vw;
  box-sizing: border-box;
  padding: 4vw;
  font-size: 4vw;
  font-weight: 300;
  color: #999;
}

.wrapper .order {
  width: 100%;
}

.wrapper .order li {
  width: 100%;
}

.wrapper .order li .order-info {
  box-sizing: border-box;
  padding: 2vw 4vw;
  font-size: 4vw;
  color: #666;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order li .order-info .order-info-right {
  display: flex;
}

.wrapper .order li .order-info .order-info-right .order-info-right-icon {
  background-color: #f90;
  color: #fff;
  border-radius: 3px;
  margin-left: 2vw;
  user-select: none;
  cursor: pointer;
}

.wrapper .order li .order-detail {
  width: 100%;
}

.wrapper .order li .order-detail li {
  width: 100%;
  box-sizing: border-box;
  padding: 1vw 4vw;
  color: #666;
  font-size: 3vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
