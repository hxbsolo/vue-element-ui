<template>
  <div id="AddGoods">
    <el-alert title="添加商品信息" type="info" center :closable="false">
    </el-alert>
    <el-steps :active="1">
      <el-step title="基本信息" icon="el-icon-edit"></el-step>
      <el-step title="商品参数" icon="el-icon-document"></el-step>
      <el-step title="商品属性" icon="el-icon-document-copy"></el-step>
      <el-step title="商品图片" icon="el-icon-picture"></el-step>
      <el-step title="商品内容" icon="el-icon-reading"></el-step>
      <el-step title="完成" icon="el-icon-circle-check"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: "AddGoods",
};
</script>

<style>
#AddGoods {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
#AddGoods .el-steps{
      padding-top: 20px;
}
</style>