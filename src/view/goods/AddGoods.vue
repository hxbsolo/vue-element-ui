<template>
  <div id="AddGoods">
    <el-alert title="添加商品信息" type="info" center :closable="false">
    </el-alert>
    <el-steps :active="actived" finish-status="success">
      <el-step title="基本信息" icon="el-icon-edit"></el-step>
      <el-step title="商品参数" icon="el-icon-document"></el-step>
      <el-step title="商品属性" icon="el-icon-document-copy"></el-step>
      <el-step title="商品图片" icon="el-icon-picture"></el-step>
      <el-step title="商品内容" icon="el-icon-reading"></el-step>
      <el-step title="完成" icon="el-icon-circle-check"></el-step>
    </el-steps>
    <!-- 左侧导航栏 -->
    <el-tabs
      tab-position="left"
      style="margin-top: 20px"
      @tab-click="TabClick"
      :before-leave="Roles"
    >
      <el-tab-pane label="基本信息" name
        >基本信息
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <!-- 级联选择器 -->
            <div class="block">
              <el-cascader
                clearable
                v-model="addForm.goods_cat"
                :options="options"
                :props="{
                  expandTrigger: 'hover',
                  value: 'cat_id',
                  label: 'cat_name',
                }"
                @change="handleChange"
              ></el-cascader>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name>
        <div v-if="!many">暂无</div>
        <elForm>
          <el-form-item
            :label="item.attr_name"
            v-for="item in many"
            :key="item.attr_id"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                :label="title"
                v-for="(title, index) in item.attr_vals"
                :key="index"
                style="margin-right: 10px"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </elForm>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name>
        <el-form label-position="top" label-width="80px">
          <el-form-item :label="item.attr_name" v-for="item in only" :key='item'>
            <el-input :value="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name>
        <el-upload action="#" list-type="picture-card" :auto-upload="false">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)"
              >
                <i class="el-icon-download"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name >
        <tinymce></tinymce>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";
import tinymce from '../../components/commonn/rich.vue';
export default {
  name: "AddGoods",
  data() {
    return {
      actived: 1, //steps进度
      // 用于保存添加的商品信息
      addForm: {
        goods_name: "123",
        goods_price: 3213,
        goods_weight: 123,
        goods_number: 213,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        attrs: [],
      },
      uploadUrl: "http://120.53.120.229:8888/api/private/v1/upload",
      // 图片上传的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      id: "", //当前所选三级分支
      many: [], //商品参数
      only: [], //商品属性
      // 表单验证规则对象
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: ["change", "blur"],
          },
        ],
      },
      options: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    };
  },
  components:{tinymce},
  created() {
    this.getCate();
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
    TabClick(i) {
      if (i.paneName == "1") {
        //获取商品参数
        axios({
          url: `categories/${this.id}/attributes`,
          params: { sel: "many" },
        }).then((res) => {
          this.many = res.data;
          this.many.forEach((item) => {
            item.attr_vals = item.attr_vals.split(" ");
          });
        });
      } else if (i.paneName == "2") {
        //获取商品属性
        axios({
          url: `categories/${this.id}/attributes`,
          params: { sel: "only" },
        }).then((res) => {
          this.only = res.data;
        });
      }
    },
    //Tabs切换回调
    handleChange(val) {
      if (val.length < 3) {
        this.addForm.goods_cat = [];
        return this.$message.error({ message: "只允许设置三级分支" });
      } else {
        this.id = val[val.length - 1];
      }
    },
    //验证是否输入
    Roles(Name, oName) {
      if (Name != "0") {
        const RulesArr = Object.keys(this.addFormRules);
        let arrErrorInfo = [];
        this.$refs.ruleForm.validateField(RulesArr, (errorInfo) => {
          if (errorInfo) {
            arrErrorInfo.push(errorInfo);
          }
        });
        if (arrErrorInfo.length !== 0) {
          this.leave = false;
          this.$message.error({
            message: arrErrorInfo[0],
          });
          return false;
        } else {
          this.leave = true;
          this.actived = Number(Name); //同步steps
        }
      }
    },
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
  },
};
</script>

<style>
#AddGoods {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
#AddGoods .el-steps {
  padding-top: 20px;
}
.el-form-item__label {
  float: none;
}
</style>