<template>
  <div>
    <el-upload
      :action="uploadUrl"
      :headers="headerObj"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> 

    <!-- 身份证信息  -->
    <el-descriptions title="用户信息">
      <el-descriptions-item
        v-for="(item, index) in UserInfo"
        :key="item.location.height"
        :label="index"
        >{{ item.words }}</el-descriptions-item
      >
    </el-descriptions>

    <el-upload
      class="upload-demo"
      drag
      :auto-upload="false"
      action="abc"
      multiple
      :data='msg'
      :on-change="changeFile"
      :http-request="upload"
      ref="up"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <el-button @click='Sub'>上传</el-button>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      base64: "", //选中图片转base64,
      UserInfo: {}, //用户信息
      Userlabel: [], //labe列表
      msg: { avatar: "" ,title: "123"},
      URL: "http://localhost:3000/upload-avatar",
    };
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async handleSuccess(respone, file, fileList) {
      this.base64 = await this.getBase64(file.raw);
      this.getToken();
    },
    //转base64
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    //获取Access_Token
    getToken() {
      axios.defaults.baseURL = "apis";
      axios({
        method: "POST",
        url: `oauth/2.0/token?grant_type=client_credentials&client_id=CoVHG2dgzUmwt6olrdPYyBiG&client_secret=CagQTuLVDjjwzsx2afPWSiCVAw7LGQ5n`,
      }).then((res) => {
        axios
          .post(
            `rest/2.0/ocr/v1/idcard?access_token=${res.access_token}`,
            qs.stringify({
              image: this.base64,
              id_card_side: "front",
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          )
          .then((res) => {
            this.UserInfo = res.words_result;
            this.Userlabel = Object.keys(this.UserInfo);
          });
      });
    },
    //自定义上传
    async upload() {
      var obj = new FormData();
      obj.append('avatar',this.msg.avatar);
      obj.append('title','123');
      const res = await axios.post(
        this.URL,
        obj,
      );
      console.log(res)
    },
    //文件状态发生变化
    changeFile(file,fileList){
      this.msg.avatar = file.raw;
      console.log(file)
    },
    //手动上传
    Sub(){
      this.$refs.up.submit();
    }
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>