<template>
  <el-main>
    <!-- 路径 -->
    <div class="main_top">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main_bo">
      <el-card is-always-shadow>
        <el-row>
          <el-button
            type="primary"
            id="rowsel"
            @click="dialogUserVisible = true"
            >添加用户</el-button
          >
        </el-row>
      </el-card>
      <!-- 添加用户弹窗 -->
      <el-dialog title="添加用户" :visible.sync="dialogUserVisible">
        <el-form :model="Edit" :rules="editFormRules" ref="addForm">
          <el-form-item
            label="角色名称"
            :label-width="formLabelWidth"
            prop="email"
          >
            <el-input v-model="Edit.email"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="Edit.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="Cancel">取 消</el-button>
          <el-button type="primary" @click="addDilog">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改用户信息弹窗 -->
      <el-dialog title="编辑用户" :visible.sync="dialogUserVis">
        <el-form :model="Editting" :rules="editFormRules" ref="addForm">
          <el-form-item
            label="角色名称"
            :label-width="formLabelWidth"
            prop="email"
          >
            <el-input v-model="Editting.email"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="Editting.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUserVis = false">取 消</el-button>
          <el-button type="primary" @click="Suresbm">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配权限列表 -->
      <el-dialog
        title="提示"
        :visible.sync="dialogPower"
        @close="setRightDialogClose"
      >
        <!-- 树形组件 -->
        <el-tree
          :data="Power"
          show-checkbox
          node-key="id"
          :props="treeProps"
          :default-expand-all="true"
          :default-checked-keys="activeKeys"
          getCurrentKey=""
          ref='treeRef'
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogPower = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 角色列表 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="[i1 === 0 ? 'bd-top' : '', 'bd-bottom', 'v-center']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5" :class="['']">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19" id="rr">
                <!-- 通过for循环嵌套来渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bd-top', 'v-center']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  id="rows"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" prop="desc">
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
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="getAllPower(scope.row)"
                >分配权限
              </el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-main>
</template>

<script>
import axios from "axios";
export default {
  name: "roles",
  data() {
    return {
      dialogUserVisible: false, //添加用户弹窗
      dialogUserVis: false, //编辑用户
      dialogPower: false, //分配权限
      formLabelWidth: "120px",
      userId:'',//被选中的用户id
      // 添加角色绑定数据
      Edit: {
        email: "",
        mobile: "",
      },
      //tree属性绑定
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中权限的id
      activeKeys: [],
      Editting: {
        email: "",
        mobile: "",
      },
      //添加角色的验证规则
      editFormRules: {
        email: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 角色列表渲染
      userList: [],
      //所有权限
      Power: [],
    };
  },
  created() {
    this.getUerList();
  },
  methods: {
    // 确定添加
    addDilog(status) {
      this.$refs.addForm.validate(async (valid, field) => {
        if (!valid) {
          let arr = Object.keys(field);
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500,
          });
        } else {
          axios
            .post("roles", {
              roleName: this.Edit.email,
              roleDesc: this.Edit.mobile,
            })
            .then((res) => {
              console.log(res);
              if (res.meta.status != "201") {
                return this.$message.error({
                  message: res.meta.msg,
                  duration: 1500,
                });
              } else {
                this.getUerList();
                this.$message({
                  type: "success",
                  message: "添加成功",
                  duration: 0,
                });

                //隐藏重置添加弹窗
                this.$refs.addForm.resetFields();
                this.dialogUserVisible = false;
              }
            });
        }
      });
    },
    //获取角色列表
    getUerList() {
      axios("roles").then((res) => {
        console.log(res);
        if (res.meta.status == "200") {
          this.userList = res.data;
        }
      });
    },
    // 取消
    Cancel() {
      this.Edit.email = "";
      this.Edit.mobile = "";
      this.dialogUserVisible = false;
    },
    // 删除指定权限
    removeRightById(roles, child) {
      axios.delete(`roles/${roles.id}/rights/${child}`).then((res) => {
        if (res.meta.status == "200") {
          this.$message.success({
            message: "删除角色成功！",
            duration: 1500,
          });
          this.getUerList();
        } else {
          console.log(res.meta.msg);
        }
      });
    },
    //点击编辑
    CancelEditing(user) {
      this.Editting.id = user.id;
      this.dialogUserVis = true;
      this.Editting.email = user.roleName;
      this.Editting.mobile = user.roleDesc;
    },
    //确定编辑
    Suresbm() {
      axios
        .put(`roles/${this.Editting.id}`, {
          roleName: this.Editting.email,
          roleDesc: this.Editting.mobile,
        })
        .then((res) => {
          console.log(res);
          if (res.meta.status == "200") {
            this.getUerList();
            this.dialogUserVis = false;
            this.$message.success({
              message: "编辑成功",
              duration: 1000,
            });
          } else {
            console.log(res.meta.msg);
          }
        });
    },
    //删除用户
    deUser(user) {
      console.log(user);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        axios.delete(`roles/${user.id}`).then((res) => {
          if (res.meta.status == "200") {
            this.getUerList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            console.log(res.meta.msg);
          }
        });
      });
    },
    //获取所有权限
    getAllPower(user) {
      //弹窗显示
      this.userId = user.id;
      this.dialogPower = true;
      //获取获取所有权限列表
      axios(`rights/tree`).then((res) => {
        if (res.meta.status == "200") {
          //赋值进行渲染
          this.Power = res.data;
          //获取当前角色所有权限的id
          this.getActive(user, this.activeKeys);
        } else {
          console.log(re.meta.msg);
        }
      });
    },
    //遍历寻找已有权限
    getActive(node, arr) {
      console.log(node);
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((v) => {
        this.getActive(v, arr);
      });
    },
    //监听分配权限框消失
    setRightDialogClose() {
      this.activeKeys = [];
    },
    //确定分配权限
    allotRights(user) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(), //返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys(), //则返回目前半选中的节点的 key 所组成的数组
      ];
      //分隔为字符串
      const idStr = keys.join(',') ;
      if(this.userId !=''){
        axios.post(`roles/${this.userId}/rights`,{rids:idStr}).then(res=>{
        if(res.meta.status == '200'){
          this.getUerList();
          this.dialogPower = false;
          this.$message.success({
            message:'分配权限成功'
          })
        }else{
          this.$message.error({
            message:res.meta.msg
          })
        }
      })
      }else{
        console.log('用户id未获取')
      }
    },
  },
};
</script>

<style>
.el-tag {
  margin: 7px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.v-center {
  display: flex;
  align-items: center;
}
.el-table__body .el-table__expanded-cell {
  padding: 20px 50px;
}
</style>