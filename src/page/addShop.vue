<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px;">
      <el-col :span="12" :offset="4">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="110px"
          class="demo-formData"
        >
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="locationInfo.addressName">
            <el-autocomplete
              v-model="formData.locationInfo.addressName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址"
              style="width: 100%;"
              @select="addressSelect"
            ></el-autocomplete>
            <span>当前城市：{{city.name}}</span>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input v-model="formData.telephone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="店铺简介" prop="presentation">
            <el-input type="textarea" v-model="formData.presentation"></el-input>
          </el-form-item>
          <el-form-item label="店铺类型">
            <el-select v-model="formData.shopType" placeholder="店铺分类">
              <el-option label="水站" value="water_store"></el-option>
              <el-option label="便利店" value="convenience_store"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="配送费" prop="float_delivery_fee">
            <el-input-number v-model="formData.float_delivery_fee" :min="0" :max="20"></el-input-number>
          </el-form-item>
          <el-form-item label="营业时间" style="white-space: nowrap;">
            <el-time-select
              placeholder="起始时间"
              v-model="formData.startOpenTime"
              :picker-options="{
							start: '05:30',
							step: '00:15',
							end: '23:30'
							}"
            ></el-time-select>
            <el-time-select
              placeholder="结束时间"
              v-model="formData.endOpenTime"
              :picker-options="{
							start: '05:30',
							step: '00:15',
							end: '23:30',
							minTime: formData.startOpenTime
							}"
            ></el-time-select>
          </el-form-item>

          <el-form-item label="上传店铺头像">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleShopAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!-- <el-form-item label="上传营业执照">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/manage/upload'"
              :show-file-list="false"
              :on-success="handleBusinessAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="formData.business_license_image"
                :src="baseImgPath + formData.business_license_image"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item> 
          <el-form-item label="上传餐饮服务许可证">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/manage/upload'"
              :show-file-list="false"
              :on-success="handleServiceAvatarScucess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="formData.catering_service_license_image"
                :src="baseImgPath + formData.catering_service_license_image"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>-->
          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import { cityGuess, addShop, searchplace, foodCategory } from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
export default {
  data() {
    return {
      uploadUrl: baseUrl + "img/manage/qiniu/upload/",
      city: {},
      formData: {
        name: "",
        shopType: "convenience_store",
        imageUrl: "",
        presentation: "",
        shopDetailImage: [],
        locationInfo: {
          longitude: "",
          latitude: "",
          addressName: ""
        },
        telephone: "",
        startOpenTime: "09:00",
        endOpenTime: "21:00"
      },
      rules: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        telephone: [
          { required: true, message: "请输入联系电话" },
          { type: "string", message: "电话号码必须是数字" }
        ],
        imageUrl:[
          { required: true, message: "请上传店铺头像", trigger: "blur" }
        ]
      },
      baseUrl,
      baseImgPath,
      categoryOptions: [],
      selectedCategory: []
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.city = await cityGuess();
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
        console.log(err);
      }
    },
    async querySearchAsync(queryString, cb) {
      if (queryString) {
        try {
          const res = await searchplace({
            keywords: queryString,
            city: this.city.name
          });
          if (res.status === 0) {
            const cityList = res.data;
            if (cityList instanceof Array) {
              cityList.map(item => {
                item.value = item.name;
                return item;
              });
              cb(cityList);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    addressSelect(address) {
      // console.log(address);
      const location = address.location;
      if (location) {
        const arr = location.split(",");
        this.formData.locationInfo.latitude = arr[1];
        this.formData.locationInfo.longitude = arr[0];
        this.formData.locationInfo.addressName = address.name;
      }

      // console.log(this.formData.latitude, this.formData.longitude);
    },
    handleShopAvatarScucess(res, file) {
      if (res.status == 0) {
        this.formData.imageUrl = res.data.url;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    handleBusinessAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.business_license_image = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    handleServiceAvatarScucess(res, file) {
      if (res.status == 0) {
        this.formData.catering_service_license_image = res.image_path;
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
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 3) {
        return "positive-row";
      }
      return "";
    },
    handleDelete(index) {
      this.activities.splice(index, 1);
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let result = await addShop(this.formData);
          if (result.status == "ok") {
            this.$message({
              type: "success",
              message: "创建店铺成功"
            });
            // 刷新店铺列表
            
            this.resetForm(formName);
          } else {
            this.$message({
              type: "error",
              message: result.message
            });
            return false;
          }
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.button_submit {
  text-align: center;
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
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
</style>
