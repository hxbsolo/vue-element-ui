<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app .el-container{
  height: 100vh;
}
#app .el-container .el-header{
  background-color: #b6e8f3;
  border-bottom: 1px solid #eee;
}
#app .el-container .el-aside{
  background-color:#b6e8f3
}
#app .el-container .el-aside ul{
  background-color:#b6e8f3
}
#app .el-container .el-main {
  background: #eaedf1;
}
</style>
