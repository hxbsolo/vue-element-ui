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
          :options="options"
          :props="{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
          }"
          v-model="selectKeys"
          @change="handleChange"
        ></el-cascader>
      </div>

      <!--   -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-button
              type="primary"
              :disabled="isDisabled"
              @click="dialogFormVisible = true"
              >添加参数</el-button
            >
            <el-table :data="reisList" style="width: 100%" border stripe>
              <el-table-column type="expand" id="col">
                <template v-slot="scope">
                  <el-col :class="['']">
                    <el-tag
                      v-for="item in scope.row.attr_vals"
                      :key="item.attr_id"
                      closable
                      @close="removeRightById(scope.row, item1)"
                      v-if="item"
                      >{{ item }}</el-tag
                    >
                  </el-col>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                  >
                    <!-- @blur="handleInputConfirm" -->
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"> </el-table-column>
              <el-table-column label="角色名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作" prop="desc">
                <template v-slot="scope">
                  <el-row id="btn_icon">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="small"
                      round
                      @click="EditParams(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      round
                      @click="open(scope.row)"
                      >删除</el-button
                    >
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-button
              type="primary"
              :disabled="isDisabled"
              @click="dialogFormVisible = true"
              >添加属性</el-button
            >
            <el-table
              :data="reisList"
              style="width: 100%"
              border
              stripe
              id="expand"
            >
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-row>
                    <el-col :class="['']" style="padding: 12px 20px">
                      <el-tag
                        closable
                        @close="removeRightById(scope.row)"
                        v-for="item in scope.row.attr_vals"
                        :key="item.attr_id"
                        v-if="scope.row.attr_vals[0]"
                        >{{ scope.row.attr_vals[0] }}</el-tag
                      >
                    </el-col>
                  </el-row>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"> </el-table-column>
              <el-table-column label="角色名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作" prop="desc">
                <template v-slot="scope">
                  <el-row id="btn_icon">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="small"
                      round
                      @click="EditParams(scope.row)"
                      >编辑</el-button
                    >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      round
                      @click="deUser(scope.row)"
                      >删除</el-button
                    >
                  </el-row>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加弹框 -->
    <el-dialog title="添加动态参数" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="addsFormRef">
        <el-form-item label="动态参数" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog title="修改动态参数" :visible.sync="dialogEditVisible">
      <el-form :model="form" ref="addsEditRef">
        <el-form-item label="动态参数" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "params",
  created() {
    this.getCate();
  },
  data() {
    return {
      options: [], //分类列表
      activeName: "many",
      id: "", //分类三级分支
      ID: "", //选中分类数组
      selectKeys: [], //被选中的id
      isDisabled: true, //是否禁用添加按钮
      reisList: [],
      data: [], //参数的二维数组
      inputVisible: false, //是否新加入存在
      inputValue: "", //新加入tag的内容
      dialogFormVisible: false, //添加动态参数弹框
      dialogEditVisible: false, //编辑动态
      form: {
        name: "",
      },
      formLabelWidth: "150px",
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
    //获取动态参数/静态属性
    async getries() {
      //获取参数列表
      // categories/:id/attributes
      if ((this.id != "") & (this.activeName != "")) {
        const reis = await axios({
          url: `categories/${this.id}/attributes`,
          params: { sel: this.activeName },
        });
        this.reisList = reis.data;
        //处理attr_vals为数组
        this.reisList.forEach((item, val) => {
          item.attr_vals.trim();
          item.attr_vals = item.attr_vals.split(",");
        });
      }
    },
    //选中分类
    handleChange(id) {
      this.ID = id;
      this.JudgeBranch(); //获取分类列表
      this.id = ""; //先清空
      this.id = id[id.length - 1]; //获取最后一个id
      this.getries(); //获取参数列表
    },
    //tabs点击
    handleClick(t) {
      this.JudgeBranch(); //判断是否选中三级分支
      this.activeName = t.paneName; //tabs选中的name
      this.getries(); //获取参数列表
    },
    //判断是否选择三级分支
    JudgeBranch() {
      if (this.ID.length < 3) {
        this.isDisabled = true; //启用禁用按钮
        this.selectKeys = []; //只能填写三级分支,否清空
        this.$message.warning({
          message: "只允许设置三级分支",
        });
      } else {
        this.isDisabled = false; //启用添加按钮
      }
    },
    //删除tag
    async removeRightById(row, item) {
      const res = await axios.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        { attr_name: row.attr_name, attr_sel: this.activeName }
      );
      console.log(res);
    },
    //添加tag
    showInput(v) {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //编辑提交tag
    handleInputConfirm(Info) {
      let inputValue = this.inputValue;
      Info.attr_vals.push(inputValue);
      this.inputVisible = false;
      this.inputValue = "";
      this.saveAttrVals(Info);
    },
    //删除tag
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //编辑提交参数
    async saveAttrVals(Info) {
        axios.put(`categories/${Info.cat_id}/attributes/${Info.attr_id}`, {
          attr_name: Info.attr_name,
          attr_sel: this.activeName,
          attr_vals: Info.attr_vals.join(","),
        });
        this.form.name = "";
        this.getries();
    },
    //添加动态参数/静态属性
    addParams() {
      this.$refs.addsFormRef.validate(async (valid, options) => {
        //未过表单验证
        if (!valid) {
          console.log(options);
          let arr = Object.keys(options);
          return this.$message.error({
            message: options[arr[0]][0].message,
            duration: 1500,
          });
        }
        const res = await axios.post(`categories/${this.id}/attributes`, {
          attr_name: this.form.name,
          attr_sel: this.activeName,
        });
        this.$message.success({
          message: res.meta.msg,
          duration: 1500,
        });
        this.dialogFormVisible = false;
        this.form.name = "";
        this.getries();
      });
    },
    //删除提示
    open(Info) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await axios.delete(
            `categories/${Info.cat_id}/attributes/${Info.attr_id}`
          );
          if (res.meta.status == "200") {
            this.$message({
              type: "success",
              message: res.meta.msg,
            });
            this.form.name = "";
            this.getries();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //编辑
    EditParams(Info){
      this.form.name = Info.attr_name;
      this.dialogEditVisible = true;
            this.$refs.addsEditRef.validate(async (valid, options) => {
        if (!valid) {
          console.log(options);
          let arr = Object.keys(options);
          return this.$message.error({
            message: options[arr[0]][0].message,
            duration: 1500,
          });
        }
        axios.put(`categories/${Info.cat_id}/attributes/${Info.attr_id}`, {
          attr_name: Info.attr_name,
          attr_sel: this.activeName,
          attr_vals: Info.attr_vals.join(","),
        });
        this.form.name = "";
        this.getries();
      });
    }
  },
};
</script>

<style scoped>
#expand .el-table__cell {
  padding: 20px 50px !important;
}
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
.el-tag {
  margin-right: 10px;
}
.el-table td.el-table__cell div {
  display: flex;
}
#col .el-col-5 {
  padding: 5px 20px;
}
.el-table__cell {
  /* display: flex; */
}
.v-center {
  margin-top: 10px;
  float: left;
}
.input-new-tag {
  width: 88px;
  height: 32px;
}
</style>