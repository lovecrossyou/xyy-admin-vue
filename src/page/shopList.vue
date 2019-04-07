<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="店铺名称">
            <el-input v-model="formInline.user" placeholder="店铺名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍">
                <span>{{ props.row.presentation }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.shopSn }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.telephone }}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column class-name="shop-name" label="店铺名称">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goProductList(scope.$index, scope.row)"
            >{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="店铺地址" prop="address"></el-table-column>
        <el-table-column label="开店时间" prop="createTime"></el-table-column>

        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="Success" @click="addFood(scope.$index, scope.row)">添加商品</el-button>
            <el-button
              v-if="scope.row.shopStatus==='已禁用'"
              size="mini"
              type="primary"
              @click="handleValid(scope.$index, scope.row)"
            >启用</el-button>

            <el-button
              v-else-if="scope.row.shopStatus==='待审核'"
              size="mini"
              type="primary"
              @click="verifyShop(scope.$index, scope.row)"
            >通过审核</el-button>
            <el-button
              v-else
              size="mini"
              type="danger"
              @click="handleDisable(scope.$index, scope.row)"
            >禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count"
        ></el-pagination>
      </div>
      <el-dialog title="修改店铺信息" v-model="dialogFormVisible">
        <el-form :model="selectTable">
          <el-form-item label="店铺名称" label-width="100px">
            <el-input v-model="selectTable.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px">
            <el-autocomplete
              v-model="selectTable.locationInfo.addressName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%;"
              @select="addressSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="店铺介绍" label-width="100px">
            <el-input v-model="selectTable.presentation"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" label-width="100px">
            <el-input v-model="selectTable.telephone"></el-input>
          </el-form-item>
          <el-form-item label="营业时间" label-width="100px">
            <el-time-picker
              type="fixed-time"
              placeholder="选择时间"
              v-model="selectTable.startOpenTime"
              style="width: 40%;"
            ></el-time-picker>
            <el-time-picker
              type="fixed-time"
              placeholder="选择时间"
              v-model="selectTable.endOpenTime"
              style="width: 40%;"
            ></el-time-picker>
          </el-form-item>
          <el-form-item label="店铺图片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="shopImage" :src="shopImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateShop">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import headTop from "../components/headTop";
import { baseUrl, baseImgPath } from "@/config/env";

import {
  cityGuess,
  getResturants,
  getResturantsCount,
  foodCategory,
  updateResturant,
  searchplace,
  disableShop,
  validShop,
  verifyShop
} from "@/api/getData";
export default {
  data() {
    return {
      uploadUrl: "/img/manage/qiniu/upload/",
      baseImgPath,
      city: {},
      offset: 1,
      limit: 20,
      count: 0,
      // tableData: [],
      currentPage: 1,
      dialogFormVisible: false,
      categoryOptions: [],
      selectedCategory: [],
      address: {},
      formInline: {
        user: "",
        region: ""
      },
      shopImage: "",
      selectTable: {
        name: "第一个店铺",
        shopType: "convenience_store",
        imageUrl: "",
        presentation: "小本生意，诚信经营",
        locationInfo: {
          longitude: 34.991231,
          latitude: 113.091231,
          addressName: "小测试地址名称"
        },
        telephone: "",
        startOpenTime: "",
        endOpenTime: ""
      }
    };
  },
  created() {
    this.initData();
  },
  components: {
    headTop
  },
  methods: {
    ...mapActions({
      fetchProducts: "shop/fetchProducts",
      fetchShopList: "shop/fetchShopList"
    }),
    ...mapMutations({
      setShop: "shop/setShop"
    }),
    onSubmit() {},
    async initData() {
      try {
        this.getResturants();
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    async getCategory() {
      try {
        this.categoryOptions = [
          {
            value: "convenience_store",
            label: "便利店"
          }
        ];
        // const categories = await foodCategory();
        // categories.forEach(item => {
        //   if (item.sub_categories.length) {
        //     const addnew = {
        //       value: item.name,
        //       label: item.name,
        //       children: []
        //     };
        //     item.sub_categories.forEach((subitem, index) => {
        //       if (index == 0) {
        //         return;
        //       }
        //       addnew.children.push({
        //         value: subitem.name,
        //         label: subitem.name
        //       });
        //     });
        //     this.categoryOptions.push(addnew);
        //   }
        // });
      } catch (err) {
        console.log("获取商铺种类失败", err);
      }
    },
    async getResturants() {
      this.fetchShopList({
        page: this.offset,
        pageSize: this.limit
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getResturants();
    },
    goProductList(index, row) {
      const shopId = row.id;
      this.fetchProducts(shopId);
      this.$router.push({ path: "foodList", query: { shopId } });
    },
    handleEdit(index, row) {
      console.log(row);
      const { address, id, imageUrl, name, presentation } = row;
      this.selectTable = row;

      console.log("handleEdit ", row);
      // this.selectTable.name = row.headName;
      // this.selectTable.presentation = row.productDescribe;
      this.selectTable.imageUrl = row.headImage;

      this.shopImage = row.headImage;
      this.selectTable.locationInfo = {
        addressName: address,
        latitude: 0,
        longitude: 0
      };
      this.dialogFormVisible = true;
      // this.selectedCategory = row.category.split("/");
      // if (!this.categoryOptions.length) {
      //   this.getCategory();
      // }
    },
    addFood(index, row) {
      this.setShop(row);
      this.$router.push({ path: "addGoods", query: { shopId: row.id } });
    },
    async verifyShop(index, row) {
      try {
        const res = await verifyShop({
          shopId: row.id,
          verifyResult: true
        });
        if (res.status == "ok") {
          this.$message({
            type: "success",
            message: "店铺已禁用"
          });
          this.tableData.splice(index, 1);
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: err.message
        });
        console.log("删除店铺失败");
      }
    },
    async handleDisable(index, row) {
      try {
        const res = await disableShop({
          shopId: row.id
        });
        if (res.status == "ok") {
          this.$message({
            type: "success",
            message: "店铺已禁用"
          });
          this.tableData.splice(index, 1);
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: err.message
        });
        console.log("删除店铺失败");
      }
    },
    async querySearchAsync(queryString, cb) {
      if (queryString && queryString.length != 0) {
        try {
          const res = await searchplace({
            keywords: queryString,
            city: this.city.name
          });
          const cityList = res.data;

          console.log("cityList ## ", res);
          if (cityList instanceof Array) {
            cityList.map(item => {
              item.value = item.name;
              return item;
            });
            cb(cityList);
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    addressSelect(vale) {
      const { address, location } = vale;
      const latitude = location.split(",")[0];
      const longitude = location.split(",")[1];
      this.selectTable.locationInfo = {
        addressName: address,
        latitude,
        longitude
      };
    },
    handleServiceAvatarScucess(res, file) {
      if (res.status == 0) {
        console.log("handleServiceAvatarScucess res.data.url", res.data.url);
        this.shopImage = res.data.url;
        this.selectTable.imageUrl = res.data.url;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isRightType && isLt2M;
    },
    async updateShop() {
      this.dialogFormVisible = false;

      try {
        const {shopType} = this.selectTable ;
        if(shopType === "便利店"){

          this.selectTable.shopType = 'convenience_store';
        }
        else{
          this.selectTable.shopType = 'water_store';
        }
        const res = await updateResturant(this.selectTable);
        if (res.status == "ok") {
          this.$message({
            type: "success",
            message: "更新店铺信息成功"
          });
          this.getResturants();
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      } catch (err) {
        console.log("更新餐馆信息失败", err);
      }
    }
  },
  computed: {
    ...mapState({
      tableData: state => state.shop.shopList
    })
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.el-select .el-input {
  width: 120px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.search-box-wrapper {
  padding: 20px 0 20px 0px;
  box-sizing: border-box;
  // width: 60%;
}
.shop-name {
  color: #20a0ff;
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
.table_container {
  padding: 20px;
}
.Pagination {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
