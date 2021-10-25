<template>
  <el-main>
    <div class="main_top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main_bo">
      <el-card is-always-shadow>
        <!-- 添加商品 -->
        <el-row id="rows">
          <el-col :span="8" id="search">
            <el-input
              type="text"
              placeholder="请输入内容"
              :clearable="true"
              class="input-with-select"
              @change="searchUser"
              v-model="params.query"
            >
              <el-button slot="append" icon="el-icon-search" @click='searchUser'></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" id="rowsel" @click="goodPush"
              >添加商品</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="goods" style="width: 100%" border stripe>
          <!-- 展开 -->
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
                id="expend"
              >
                <el-form-item label="商品名称">
                  <span>{{ props.row.goods_name }}</span>
                </el-form-item>
                <el-form-item label="价格">
                  <span>{{ props.row.goods_price.toFixed(2) }}</span>
                </el-form-item>
                <el-form-item label="库存">
                  <span>{{ props.row.goods_id }}</span>
                </el-form-item>
                <el-form-item label="重量">
                  <span>{{ props.row.goods_number }}</span>
                </el-form-item>
                <el-form-item label="商品状态">
                  <span>{{ props.row.goods_state ? "已审核" : "未审核" }}</span>
                </el-form-item>
                <el-form-item label="添加时间">
                  <span>{{ props.row.add_time | dateFormat }}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                  <span>{{ props.row.upd_time | dateFormat }}</span>
                </el-form-item>
                <el-form-item label="是否是热销商品">
                  <span>{{ props.row.is_promote ? "是" : "否" }}</span>
                </el-form-item>
                <el-form-item label="热销品数量">
                  <span>{{ props.row.hot_mumber }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column label="商品名称" prop="goods_name">
          </el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price">
          </el-table-column>
          <el-table-column label="商品重量(克)" prop="goods_weight">
          </el-table-column>
          <el-table-column label="创建时间(克)" prop="goods_weight">
          </el-table-column>
          <!-- 编辑/删除 -->
          <el-table-column label="操作" prop="desc">
            <template v-slot="scope">
              <el-row id="btn_icon">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="Editshop(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deGoods(scope.row)"
                  >删除</el-button
                >
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <!-- 编辑商品弹窗 -->
        <el-dialog
          title="编辑商品信息"
          :visible.sync="centerDialogVisible"
          width="40%"
          @close="editDialogClose"
        >
          <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="100px"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="goods_number">
              <el-input v-model="editForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editForm.goods_weight"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 删除商品弹窗 -->
        <el-dialog
          title="提示"
          :visible.sync="dialogDelete"
          width="30%"
        >
          <span>此操作将永久删除 <strong style="color: red;">{{name}}</strong>, 是否继续?</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteNot">取 消</el-button>
            <el-button type="primary" @click="dele()"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <!-- 分页器 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="1"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
  </el-main>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      centerDialogVisible: false, //编辑商品弹窗
      dialogDelete:false,// 删除商品弹窗
      params: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      total:0,//总数量
      goods: [],
      editForm:{
        goods_name:'',//商品名称	不能为空
        goods_price:'',//价格	不能为空
        goods_number:'',//数量	不能为空
        goods_weight:'',//重量	不能为空
        goods_introduce:'',//介绍	可以为空
        pics:"",//上传的图片临时路径（对象）	可以为空
        attrs:''//商品的参数（数组）	可以为空
      },
      name:'',//删除商品名字
      id:'',//当前编辑商品id
      // 编辑对话框的表单验证规则
      editFormRules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' },          
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },          
        ],
        goods_number:[
          { required: true, message: '请输入库存', trigger: 'blur' },          
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' },            
        ]
      }
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    //商品列表
    getGoods() {
      axios({ url: "goods", params: this.params }).then((res) => {
        if (res.meta.status == "200") {
          this.goods = res.data.goods;
          this.total = res.data.total
        }
      });
    },
    //搜索商品
    searchUser() {
      axios({url:'goods',params:this.params}).then(res=>{
        if(res.meta.status == '200'){
          this.goods = res.data.goods;
          this.total = res.data.total
        }else{
          this.$message.error({
            message:res.meta.msg
          })
        }
      })
    },
    //每页数量变化
    handleSizeChange(e) {
      this.params.pagesize = e;
      this.getGoods();
    },
    //页码变化
    handleCurrentChange(e) {
      this.params.pagenum = e;
      this.getGoods();
    },
    //点击编辑
    Editshop(shop) {
      axios(`goods/${shop.goods_id}`).then(res=>{
        this.editForm = res.data;
      })
      this.centerDialogVisible = true;
      this.id = shop.goods_id
    },
    //确定修改
    editGoodsInfo(shop){
      axios.put(`goods/${this.id}`,this.editForm).then(res=>{
        if(res.meta.status == '200'){
          this.centerDialogVisible = false;//隐藏弹窗
          //成功弹出
          this.$message.success({
            message:res.meta.msg
          })
        }else{
          //失败弹出
          this.$message.error({
            message:res.meta.msg
          })
        };
        this.getGoods();
      })
    },
    //监听编辑弹窗关闭
    editDialogClose(){
      this.editForm = {
        goods_name:'',//商品名称	不能为空
        goods_price:'',//价格	不能为空
        goods_number:'',//数量	不能为空
        goods_weight:'',//重量	不能为空
        goods_introduce:'',//介绍	可以为空
        pics:"",//上传的图片临时路径（对象）	可以为空
        attrs:''//商品的参数（数组）	可以为空
      }
    },
    //跳转添加商品
    goodPush(){
      this.$router.push('/add')
    },
    //点击删除商品
    deGoods(shop){
      this.dialogDelete = true;
      this.name = shop.goods_name;
      this.id = shop.goods_id;
    },
    //确认删除
    dele(){
        axios.delete(`goods/${this.id}`).then(res=>{
        this.dialogDelete = false;
        if(res.meta.status == '200'){
          this.$message.success({
            message:res.meta.msg
          })
        }else{
            this.$message.error({
            message:res.meta.msg
          })
        };
        this.getGoods();
      })
    },
    //取消删除
    deleteNot(){
      this.dialogDelete = false;
      this.$message.error({
        message:'已取消删除'
      })
    }
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
  },
};
</script>

<style>
#search {
  margin-right: 5px;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 80%;
}
#expend {
  padding: 20px 50px;
}
</style>