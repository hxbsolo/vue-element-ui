<template>
  <div id="params">
    <el-card class="box-card">
      <el-alert
        title="注意: 只允许为第三级分类设置相关参数!"
        type="info"
        show-icon
      >
      </el-alert>
    </el-card>

    <!-- 选择分类 -->
    <div class="block">
      <div>
        <span class="demonstration">选择商品分类：</span>
        <el-cascader
          clearable
          :options="options"
          :props="{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
          }"
          @change="handleChange"
        ></el-cascader>
        <!-- 
                v-model="addForm.goods_cat" -->
      </div>

      <!-- tabs -->
      <el-tabs v-model="info.activeName"
        ><!--@tab-click="handleClick"-->
        <el-tab-pane label="动态参数" name="many"  @click='this.info.activeName = "many"'>
          <el-row>
            <el-button  type="primary">添加参数</el-button>
            <tabparams  :info='info'></tabparams>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only" @click='this.info.activeName = "only"'>
          <el-row>
            <el-button  type="primary">添加属性</el-button>
            <tabparams :info='info'></tabparams>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import tabparams from './param_s'
export default {
  name: "params",
  created() {
    this.getCate();
  },
  components:{tabparams},
  data() {
    return {
      options: [], //分类列表
      info:{
        activeName: "many",
        id:''
      }
    };
  },
  methods: {
    //获取所有分类
    getCate() {
      axios("categories").then((res) => {
        if (res.meta.status == "200") {
          this.options = res.data;
        } else {
          this.$message.error({
            message: res.meta.msg,
          });
        }
      });
    },
    //选中分类
    handleChange(id){
      this.info.id = id[id.length-1]
      console.log(this.info.id)
    }
  },
};
</script>

<style>
#params {
  background: #fff;
}
#params .el-card {
  border: none;
  box-shadow: none !important;
}
.block {
  padding: 0 20px;
}
</style>