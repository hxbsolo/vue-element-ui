<template>
  <div>
    <!-- 角色列表 -->
    <el-table :data="userList" style="width: 100%" border stripe>
      <el-table-column type="expand">
        <div v-for="tag in userList" :key="tag.id">
            <el-tag  v-for="(item,index) in tag.attr_vals" :key="index" closable :type="tag.type">
          {{ item }}
        </el-tag>
        </div>
      </el-table-column>
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column label="角色名称" prop="attr_name"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-row id="btn_icon">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="CancelEditing(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deUser(scope.row)"
              >删除</el-button
            >
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "proms",
  props: ["info"],
  data() {
    return {
      userList: [],
    };
  },
  methods: {
    //获取角色列表
    getUerList(info) {
      if (info.id != "" && info.activeName != "") {
        axios({
          url: `categories/${info.id}/attributes`,
          params: { sel: info.activeName },
        }).then((res) => {
          this.userList = res.data;
          this.userList.forEach((item) => {
            item.attr_vals = item.attr_vals.split(" ");
          });
          console.log(this.userList)
         
        });
      } else {
        console.log(`info:${info}`);
      }
    },
  },
  watch: {
    "info.id"() {
      this.userList = [];
      this.getUerList(this.info);
    },
    "info.activeName"() {
      this.userList = [];
      this.getUerList(this.info);
    },
  },
};
</script>

<style>
</style>