<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <!-- 搜索框 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="审批人">
          <el-input v-model="formInline.user" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="formInline.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        @expand="expand"
        :expand-row-keys="expendRow"
        :row-key="row => row.index"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="用户名">
                <span>{{ props.row.userName }}</span>
              </el-form-item>
              <el-form-item label="店铺名称">
                <span>{{ props.row.shopName }}</span>
              </el-form-item>
              <el-form-item label="收货地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.restaurant_address }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="订单 ID" prop="orderNo"></el-table-column>
        <el-table-column label="总价格" prop="price"></el-table-column>
        <el-table-column label="订单状态" prop="statusContent"></el-table-column>
      </el-table>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import {
  getOrderList,
  getOrderCount,
  getResturantDetail,
  getUserInfo,
  getAddressById
} from "@/api/getData";
export default {
  data() {
    return {
      tableData: [],
      currentRow: null,
      offset: 1,
      limit: 20,
      count: 0,
      currentPage: 1,
      restaurant_id: null,
      expendRow: [],

      formInline: {
          user: '',
          region: ''
        }
    };
  },
  components: {
    headTop
  },
  created() {
    this.restaurant_id = this.$route.query.restaurant_id;
    this.initData();
  },
  mounted() {},
  methods: {
    onSubmit(){

    },
    async initData() {
      try {
        // const countData = await getOrderCount({restaurant_id: this.restaurant_id});
        // if (countData.status == 1) {
        //     this.count = countData.count;
        // }else{
        //     throw new Error('获取数据失败');
        // }
        this.getOrders();
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getOrders();
    },
    async getOrders() {
      const res = await getOrderList({
        page: this.offset,
        pageSize: this.limit,
        shopId: this.restaurant_id
      });
      if (res.status !== "ok") return;
      const Orders = res.data.content;
      this.tableData = Orders;
    },
    async expand(row, status) {
      if (status) {
        const restaurant = await getResturantDetail(row.restaurant_id);
        const userInfo = await getUserInfo(row.user_id);
        const addressInfo = await getAddressById(row.address_id);

        this.tableData.splice(row.index, 1, {
          ...row,
          ...{
            restaurant_name: restaurant.name,
            restaurant_address: restaurant.address,
            address: addressInfo.address,
            user_name: userInfo.username
          }
        });
        this.$nextTick(() => {
          this.expendRow.push(row.index);
        });
      } else {
        const index = this.expendRow.indexOf(row.index);
        this.expendRow.splice(index, 1);
      }
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";

.search-box-wrapper {
  padding: 20px 0 20px 0px;
  box-sizing: border-box;
  width: 80%;
}
.table_container {
  padding: 20px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
