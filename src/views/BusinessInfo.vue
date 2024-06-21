<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>商家信息</p>
    </header>

    <!-- 商家logo部分 -->
    <div class="business-logo">
      <img :src="business.businessImg" />
    </div>

    <!-- 商家信息部分 -->
    <div class="business-info">
      <h1>{{ business.businessName }}</h1>
      <p>
        &#165;{{ business.startPrice }}起送 &#165;{{
          business.deliveryPrice
        }}配送
      </p>
      <p>{{ business.businessExplain }}</p>
    </div>

    <!-- 食品列表部分 -->
    <ul class="food">
      <li v-for="(item, index) in foodList" :key="index">
        <div class="food-left">
          <img :src="item.foodImg" />
          <div class="food-left-info">
            <h3>{{ item.foodName }}</h3>
            <p>{{ item.foodExplain }}</p>
            <p>&#165;{{ item.foodPrice }}</p>
          </div>
        </div>
        <div class="food-right">
          <div>
            <i
              class="fa fa-minus-circle"
              @click="minusCart(index)"
              v-show="item.quantity != 0"
            ></i>
          </div>
          <p>
            <span v-show="item.quantity > 0">{{ item.quantity }}</span>
          </p>
          <div>
            <i class="fa fa-plus-circle" @click="addCart(index)"></i>
          </div>
        </div>
      </li>
    </ul>

    <!-- 购物车部分 -->
    <div class="cart">
      <div class="cart-left">
        <div
          class="cart-left-icon"
          :style="
            totalQuantity == 0
              ? 'background-color:#505051;'
              : 'background-color:#3190E8;'
          "
        >
          <i class="fa fa-shopping-cart"></i>
          <div class="cart-left-icon-quantity" v-show="totalQuantity != 0">
            {{ totalQuantity }}
          </div>
        </div>
        <div class="cart-left-info">
          <p>&#165;{{ totalPrice }}</p>
          <p>另需配送费{{ business.deliveryPrice }}元</p>
        </div>
      </div>
      <div class="cart-right">
        <!-- 不够起送费 -->
        <div
          class="cart-right-item"
          v-show="totalSettlementPrice < business.startPrice"
          style="background-color: #535356; cursor: default"
        >
          &#165;{{ business.startPrice }}起送
        </div>
        <!-- 达到起送费 -->
        <div
          class="cart-right-item"
          @click="toOrder"
          v-show="totalSettlementPrice >= business.startPrice"
        >
          去结算
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      businessId: this.$route.query.businessId,
      business: {},
      foodList: [],
      user: {},
    };
  },
  created() {
    // 查看用户是否登录
    this.user = this.$getSessionStorage("user");
    console.log("businessId =", this.businessId);
    // 商家信息
    this.$axios
      .get("/BusinessController/getBusinessById?businessId=" + this.businessId)
      .then((res) => {
        this.business = res.data;
        console.log("business = ", this.business);
      })
      .catch((err) => {
        console.log(err);
      });
    // 该商家的菜品
    this.$axios
      .get("/FoodController/listFoodByBusinessId?businessId=" + this.businessId)
      .then((res) => {
        this.foodList = res.data;
        console.log("foodList =", this.foodList);
        // 初始化菜品的数量
        this.foodList.forEach((foodItem) => {
          Vue.set(foodItem, "quantity", 0);
        });
        // 如果登录了，则需要去查询用户的购物车数据
        if (this.user != null) {
          this.listCart();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },
  methods: {
    // 购物车展示
    listCart() {
      const data = this.$qs.stringify({
        userId: this.user.userId,
        businessId: this.business.businessId,
      });
      this.$axios
        .get("/CartController/listCart?" + data)
        .then((res) => {
          let cartList = res.data;

          // 遍历菜品数组，把在购物车中的菜品设置数量
          // 创建一个 Map 来存储 foodId 到 quantity 的映射
          const cartMap = new Map();
          cartList.forEach((cartItem) => {
            cartMap.set(cartItem.foodId, cartItem.quantity);
          });

          // 现在遍历 foodList 并更新 quantity
          this.foodList.forEach((foodItem) => {
            if (cartMap.has(foodItem.foodId)) {
              foodItem.quantity = cartMap.get(foodItem.foodId);
            }
          });
          console.log("foodList={}", this.foodList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 登录验证
    checkUser() {
      // 登录验证
      if (this.user == null) {
        this.$router.push("/login");
        return;
      }
    },
    // 购物车添加按钮功能
    addCart(index) {
      // 登录验证
      this.checkUser();
      // 当数量为0执行添加，数量不为0执行更新
      if (this.foodList[index].quantity === 0) {
        this.saveCart(index);
      } else {
        this.updateCart(index, 1);
      }
    },

    // 购物车减少按钮功能
    minusCart(index) {
      // 登录验证
      this.checkUser();
      // 当数量>1，执行更行，数量为1就执行删除
      if (this.foodList[index].quantity > 1) {
        this.updateCart(index, -1);
      } else {
        this.removeCart(index);
      }
    },

    // 添加菜品
    saveCart(index) {
      const data = {
        userId: this.user.userId,
        businessId: this.businessId,
        foodId: this.foodList[index].foodId,
      };
      this.$axios
        .post("/CartController/saveCart", data)
        .then((res) => {
          let saved = res.data;
          if (saved === 1) {
            this.foodList[index].quantity = 1;
          } else {
            alert("添加失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 删除菜品
    removeCart(index) {
      const data = {
        userId: this.user.userId,
        businessId: this.businessId,
        foodId: this.foodList[index].foodId,
      };
      this.$axios
        .post("/CartController/removeCart", data)
        .then((res) => {
          let removed = res.data;
          if (removed == 1) {
            this.foodList[index].quantity = 0;
          } else {
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 更新菜品
    updateCart(index, num) {
      const data = {
        userId: this.user.userId,
        businessId: this.businessId,
        foodId: this.foodList[index].foodId,
        quantity: this.foodList[index].quantity + num,
      };
      this.$axios
        .post("/CartController/updateCart", data)
        .then((res) => {
          let updated = res.data;
          if (updated == 1) {
            this.foodList[index].quantity += num;
          } else {
            alert("更新失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 跳转到order
    toOrder() {
      this.$router.push({
        path: '/orders',
        query: {
          businessId: this.business.businessId
        }
      })
    },
  },
  computed: {
    // 菜品总价格
    totalPrice() {
      let total = 0;
      for (let foodItem of this.foodList) {
        total += foodItem.foodPrice * foodItem.quantity;
      }

      return total;
    },
    // 菜品总数量
    totalQuantity() {
      let quantity = 0;
      for (let foodItem of this.foodList) {
        quantity += foodItem.quantity;
      }

      return quantity;
    },
    // 结算总价格(菜品总价+配送费)
    totalSettlementPrice() {
      return this.totalPrice + this.business.deliveryPrice;
    },
  },
};
</script>

<style lang="css" scoped>
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

/****************** 商家logo部分 ******************/
.wrapper .business-logo {
  width: 100%;
  height: 35vw;
  /*使用上外边距避开header部分*/
  margin-top: 12vw;

  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper .business-logo img {
  width: 40vw;
  height: 30vw;
  border-radius: 5px;
}

/****************** 商家信息部分 ******************/
.wrapper .business-info {
  width: 100%;
  height: 20vw;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.wrapper .business-info h1 {
  font-size: 5vw;
}
.wrapper .business-info p {
  font-size: 3vw;
  color: #666;
  margin-top: 1vw;
}

/****************** 食品列表部分 ******************/
.wrapper .food {
  width: 100%;
  /*使用下外边距避开footer部分*/
  margin-bottom: 14vw;
}
.wrapper .food li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  user-select: none;

  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .food li .food-left {
  display: flex;
  align-items: center;
}
.wrapper .food li .food-left img {
  width: 20vw;
  height: 20vw;
}
.wrapper .food li .food-left .food-left-info {
  margin-left: 3vw;
}
.wrapper .food li .food-left .food-left-info h3 {
  font-size: 3.8vw;
  color: #555;
}
.wrapper .food li .food-left .food-left-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}
.wrapper .food li .food-right {
  width: 16vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper .food li .food-right .fa-minus-circle {
  font-size: 5.5vw;
  color: #999;
  cursor: pointer;
}
.wrapper .food li .food-right p {
  font-size: 3.6vw;
  color: #333;
}
.wrapper .food li .food-right .fa-plus-circle {
  font-size: 5.5vw;
  color: #0097ef;
  cursor: pointer;
}

/****************** 购物车部分 ******************/
.wrapper .cart {
  width: 100%;
  height: 14vw;

  position: fixed;
  left: 0;
  bottom: 0;

  display: flex;
}
.wrapper .cart .cart-left {
  flex: 2;
  background-color: #505051;
  display: flex;
}
.wrapper .cart .cart-left .cart-left-icon {
  width: 16vw;
  height: 16vw;
  box-sizing: border-box;
  border: solid 1.6vw #444;
  border-radius: 8vw;
  background-color: #3190e8;
  font-size: 7vw;
  color: #fff;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: -4vw;
  margin-left: 3vw;

  position: relative;
}
.wrapper .cart .cart-left .cart-left-icon-quantity {
  width: 5vw;
  height: 5vw;
  border-radius: 2.5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;

  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}
.wrapper .cart .cart-left .cart-left-info p:first-child {
  font-size: 4.5vw;
  color: #fff;
  margin-top: 1vw;
}
.wrapper .cart .cart-left .cart-left-info p:last-child {
  font-size: 2.8vw;
  color: #aaa;
}

.wrapper .cart .cart-right {
  flex: 1;
}
/*达到起送费时的样式*/
.wrapper .cart .cart-right .cart-right-item {
  width: 100%;
  height: 100%;
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

/*不够起送费时的样式（只有背景色和鼠标样式的区别）*/
/*
.wrapper .cart .cart-right .cart-right-item{
	width: 100%;
	height: 100%;
	background-color: #535356;
	color: #fff;
	font-size: 4.5vw;
	font-weight: 700;
	user-select: none;
	
	display: flex;
	justify-content: center;
	align-items: center;
}
*/
</style>
