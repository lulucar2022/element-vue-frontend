<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>地址管理</p>
    </header>

    <!-- 地址列表部分 -->
    <ul class="addresslist">
      <li v-for="(item, index) in deliveryAddressList" :key="index">
        <div class="addresslist-left" @click="setDeliveryAddress(item)">
          <h3>
            {{ item.contactName }}{{ item.contactSex | sexFilter }}
            {{ item.contactTel }}
          </h3>
          <p>{{ item.address }}</p>
        </div>
        <div class="addresslist-right">
          <i class="fa fa-edit" @click="editUserAddress(item.daId)"></i>
          <i class="fa fa-remove" @click="removeUserAddress(item.daId)"></i>
        </div>
      </li>
    </ul>

    <!-- 新增地址部分 -->
    <div class="addbtn" @click="toAddUserAddress">
      <i class="fa fa-plus-circle"></i>
      <p>新增收货地址</p>
    </div>

    <!-- 底部菜单部分 -->
    <TheFooter></TheFooter>
  </div>
</template>

<script>
import TheFooter from "@/components/TheFooter.vue";
export default {
  data() {
    return {
      businessId: this.$route.query.businessId,
      user: {},
      deliveryAddressList: [],
    };
  },
  methods: {
    // 获取用户的收货地址
    listDeliveryAddressByUserId() {
      this.$axios
        .get(
          "/DeliveryAddressController/listDeliveryAddressByUserId?userId=" +
            this.user.userId
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.deliveryAddressList = res.data.data;
          }
          console.log(this.deliveryAddressList);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 存入收货地址
    setDeliveryAddress(deliveryAddress) {
      //把用户选择的默认送货地址存储到localStorage中
      this.$setLocalStorage(this.user.userId, deliveryAddress);
      this.$router.push({
        path: "/orders",
        query: { businessId: this.businessId },
      });
    },
    // 跳转到新增地址页面
    toAddUserAddress() {
      this.$router.push({
        path: "/addUserAddress",
        query: { businessId: this.businessId },
      });
    },
    // 跳转到编辑收货地址
    editUserAddress(daId) {
      this.$router.push({
        path: "/editUserAddress",
        query: { businessId: this.businessId, daId: daId },
      });
    },
    // 删除用户的收货地址
    removeUserAddress(daId) {
      if (!confirm("确定要删除吗？")) {
        return;
      }
      const data = {
        daId: daId,
      };
      this.$axios
        .post("/DeliveryAddressController/removeDeliveryAddressById", data)
        .then((res) => {
          if (res.data.code == 200) {
            let deliveryAddress = this.$getLocalStorage(this.user.userId);
            if (deliveryAddress != null && deliveryAddress.daId == daId) {
              this.$removeLocalStorage(this.user.userId);
            }
            this.listDeliveryAddressByUserId();
          } else {
            alert(res.data.msg);
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    // 从SessionStorage 拿到 user
    this.user = this.$getSessionStorage("user");
    this.listDeliveryAddressByUserId();
  },
  filters: {
    sexFilter(value) {
      return value == 1 ? "先生" : "女士";
    },
  },

  components: {
    TheFooter,
  },
};
</script>

<style scoped>
/*************** 总容器 ***************/
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

/*************** header ***************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097ff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  /*保证在最上层*/
  z-index: 1000;
}

/*************** addresslist ***************/
.wrapper .addresslist {
  width: 100%;
  margin-top: 12vw;
  background-color: #fff;
}

.wrapper .addresslist li {
  width: 100%;
  box-sizing: border-box;
  border-bottom: solid 1px #ddd;
  padding: 3vw;

  display: flex;
}

.wrapper .addresslist li .addresslist-left {
  flex: 5;
  /*左边这块区域是可以点击的*/
  user-select: none;
  cursor: pointer;
}

.wrapper .addresslist li .addresslist-left h3 {
  font-size: 4.6vw;
  font-weight: 300;
  color: #666;
}

.wrapper .addresslist li .addresslist-left p {
  font-size: 4vw;
  color: #666;
}

.wrapper .addresslist li .addresslist-right {
  flex: 1;
  font-size: 5.6vw;
  color: #999;
  cursor: pointer;

  display: flex;
  justify-content: space-around;
  align-items: center;
}

/*************** 新增地址部分 ***************/
.wrapper .addbtn {
  width: 100%;
  height: 14vw;
  border-top: solid 1px #ddd;
  border-bottom: solid 1px #ddd;
  background-color: #fff;
  margin-top: 4vw;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 4.5vw;
  color: #0097ff;
  user-select: none;
  cursor: pointer;
}

.wrapper .addbtn p {
  margin-left: 2vw;
}
</style>
