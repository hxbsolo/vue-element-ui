<template>
  <el-container>
    <el-header>
      <span>佳薪棠后台管理系统</span>
      <div class="Setup">
        <span>欢迎您,{{ this.$store.state.usermsg.username }}</span>
        <span @click="screen" class="icon-quanping_o" id="quanp"></span>
        <img src="http://localhost:8081/img/avatar.ecba1844.gif" alt="" />
        <el-row>
          <el-col :span="12">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-s-home" command="/home"
                  >Welcome</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-close"
                  command='out'
                  >退出</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-container>
      <el-aside width="230px">
        <el-menu :router="true">
          <el-menu-item index="/home">
            <span slot="title">欢迎回来</span>
          </el-menu-item>
        </el-menu>
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          :collapse="false"
          :router="true"
        >
          <el-submenu
            v-for="(item, index) in requirelist"
            :key="item.authName"
            :index="String(index)"
          >
            <template slot="title" :index="item.path">
              <i :class="iconsObj[item.id]"></i>
              <span slot="title">{{ item.authName }}</span>
            </template>
            <el-menu-item-group v-for="v in item.children" :key="v.authName">
              <el-menu-item :index="v.path">
                <i class="el-icon-menu"></i>
                <span>{{ v.authName }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>





<script>
//引入axios封装
import axios from "axios";
//引入全屏插件
import screenfull from "screenfull";
export default {
  name: "home",
  data() {
    return {
      isCollapse: true,
      activeIndex: "1", //切换折线图数据
      fullscreen: false,
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao', //数据统计模块的icon
      },
    };
  },
  created() {
    this.$store.dispatch(
      "getUserInfo",
      JSON.parse(sessionStorage.getItem("user"))
    );
    this.$message({
      message: "登录成功",
      type: "success",
    });
    axios("menus").then((res) => {
      if (res.meta.msg == "获取菜单列表成功" && res.meta.status == "200") {
        this.$store.commit("Permission", res.data);
      }
    });
  },
  computed: {
    requirelist() {
      return this.$store.state.requirelist;
    },
  },
  methods: {
    //全屏
    screen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    handleCommand(command) {
      if(command!='out'){
        this.$router.push(command)
      }else{
        sessionStorage.clear();
        this.$router.replace('/login')
       this.$notify({
          title: '已退出',
          message: '退出成功',
          type: 'success',
          duration:'2000'//显示毫秒
        });
      }
    },
  },
};
</script>

<style scoped>
@import "https://at.alicdn.com/t/font_2882422_a10utsoa8n.css?spm=a313x.7781069.1998910419.40&file=font_2882422_a10utsoa8n.css";
#quanp {
  font-size: 30px;
  cursor: pointer;
  margin: 0 0 0 10px;
}
.is-vertical .el-header {
  display: flex;
  justify-content: space-between;
}
.Setup {
  display: flex;
  align-items: center;
}
.Setup img {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  margin: 0 5px;
}
</style>