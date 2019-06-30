<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <div style="margin-bottom:20px">
        <el-button type="primary" @click="addBanner">添加子系列</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column width="240" class-name="shop-name" label="名称">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="goProductList(scope.$index, scope.row)"
            >{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="子系列" width="240" prop="image"></el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" @click="showPictureList(scope.$index, scope.row)">图片集</el-button>
            <el-button size="mini" @click="editBanner(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delbrand(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改banner信息 -->
      <el-dialog title="修改子系列" v-model="dialogFormVisible">
        <el-form :model="formData">
          <el-form-item label="名称" label-width="100px">
            <el-input v-model="formData.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="banner图片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleBannerAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="bannerImage" :src="bannerImage" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateBrand">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加 -->
      <el-dialog title="添加子系列" v-model="dialogAddFormVisible">
        <el-form :model="formData">
          <el-form-item label="名称" label-width="100px">
            <el-input v-model="formData.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="品牌logo" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleBannerAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="bannerImage" :src="bannerImage" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateBrand">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 图片集 -->
      <el-dialog title="添加图片" v-model="pictureFormVisible">
        <el-form :model="formData">
          <el-form-item label="系列图片" label-width="100px">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleBannerAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="bannerImage" :src="bannerImage" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addPicture">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import headTop from "../components/headTop";
import { baseUrl, baseImgPath } from "@/config/env";

import { delbrand, editbrand, addbrand, listbrand } from "@/api/getData";
export default {
  data() {
    return {
      uploadUrl: "/api/v1/addimg/food",
      baseImgPath,
      city: {},
      offset: 1,
      limit: 20,
      count: 0,
      tableData: [],
      currentPage: 1,
      pictureData:{

      },
      dialogFormVisible: false,
      dialogAddFormVisible: false,
      pictureFormVisible:false,
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
      },
      tableData: [],
      formData: {
        name: "",
        image: ""
      },
      bannerImage: "",
      parentId:0
    };
  },
  created() {
    const id = this.$route.query.id;
    this.parentId = id;
    this.initData();
  },
  components: {
    headTop
  },
  methods: {
    async initData() {
      this.listbrand();
    },
    async listbrand() {
      const res = await listbrand(this.parentId);
      this.tableData = res.data;
    },

    async delbrand(index, row) {
      const res = await delbrand(row._id);
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "操作成功"
        });
      }
      this.listbrand();
    },
    async editBanner(index, row) {
      console.log(row);
      this.formData = row;
      this.dialogFormVisible = true;
    },
    async addPicture(){
      const res = await addPicture(this.pictureData);
      
    },
    async showPictureList(index,row){
      this.pictureData = row;
      this.pictureFormVisible = true;
    },
    async addBanner() {
      this.dialogAddFormVisible = true;
    },

    handleServiceAvatarScucess(res, file) {
      if (res.status == 0) {
        this.shopImage = res.data.url;
        this.selectTable.imageUrl = res.data.url;
      } else {
        this.$message.error("上传图片失败！");
      }
    },

    handleBannerAvatarScucess(res, file) {
      this.formData.image = res.data.url;
      this.bannerImage = res.data.url;
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
    async updateBrand() {
      this.dialogFormVisible = false;
      this.dialogAddFormVisible = false;
      console.log("this.formData ", this.formData);

      try {
        this.formData = {
          ...this.formData,
          bannerType: 1,
          parentId:this.parentId
        };
        const res = this.formData._id
          ? await editbrand(this.formData)
          : await addbrand(this.formData);
        if (res.status == 1) {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.listbrand();
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      } catch (err) {
        console.log("添加失败", err);
      }
    }
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
