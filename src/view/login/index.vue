<template>
  <div id="login">
    <div class="login_box">
      <div class="logins">
        <el-form>
          <el-form-item>
            <el-input
              placeholder="请输入内容"
              prefix-icon="el-icon-user-solid"
              type="text"
              v-model="username"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入内容"
              type="password"
              prefix-icon="el-icon-lock"
              v-model="password"
              show-password
            >
            </el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" plain @click="Reset">重置</el-button>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { loginRef } from "../../network/login";
export default {
  name: "login",
  data() {
    return {
      password: "123456", //密码
      username: "admin", //账号
    };
  },
  created() {
    this.open("默认账号为 admin, 密码为 123456", "success");
  },
  methods: {
    //登录请求
    login() {
      loginRef({ username: this.username, password: this.password }).then(
        (res) => {
          console.log;
          if (res.meta.status == "200" && res.meta.msg == "登录成功") {
            //存储用户信息
            window.sessionStorage.setItem("user", JSON.stringify(res.data));
            //存储token信息
            window.sessionStorage.setItem("token", res.data.token);
            //成功跳转首页
            if (
              window.sessionStorage.getItem("user") &&
              window.sessionStorage.getItem("token")
            ) {
              this.$router.push("/home");
            }
          } else {
            //返回错误
            this.open(res.meta.msg, "error");
          }
        }
      );
    },
    //重置
    Reset() {
      this.username = "admin";
      this.password = "123456";
    },
    //提示
    open(message, type) {
      this.$message({
        message,
        type,
      });
    },
  },
};
</script>

<style>
#login {
  width: 100%;
  height: 100vh;
  background: url("https://i.loli.net/2021/11/03/hq3PXFK1f2Iy5cW.jpg");
  background-size: 100% 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(#feac5e, transparent, #0083b0);
}
.login_portrait {
  padding: 10px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  top: -80px;
  border: 1px solid #eee;
  background: #fff;
}
.login_portrait img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
}
.logins {
  position: absolute;
  width: 90%;
  padding: 0 5%;
  bottom: 25px;
}
</style>