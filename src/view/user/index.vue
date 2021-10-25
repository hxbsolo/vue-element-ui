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
        <el-row id="rows">
          <el-input
            placeholder="请输入内容"
            :clearable="true"
            class="input-with-select"
            @change="searchUser"
            v-model="params.query"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button
            type="primary"
            id="rowsel"
            @click="dialogFormVisible = true"
            >添加用户</el-button
          >
        </el-row>
        <!-- 用户列表 -->
        <el-table :data="userList" border style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="用户名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <template v-slot="scope">
              <!-- scope.row  能接收到这一行的数据 -->
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChanged(scope.row)"
              >
              </el-switch> </template
          ></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-row id="btn_icon">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  round
                  size="mini"
                  @click="showEdit(scope.row)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  round
                  size="mini"
                  @click="deleteUser(scope.row)"
                ></el-button>
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  round
                  size="mini"
                  @click="setRole(scope.row)"
                >
                </el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration"></span>
          <el-pagination
            @size-change="setPageN"
            @current-change="setcurrent"
            :current-page="currentPage4"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-card>
      <!-- 添加用户弹窗 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="addFormRules" ref="addForm">
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            :label-width="formLabelWidth"
            prop="password"
          >
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号码"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDilog">取 消</el-button>
          <el-button type="primary" @click="addDilog('go')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户弹窗 -->
      <el-dialog title="编辑用户信息" :visible.sync="dialogUserVisible">
        <el-form :model="Edit" :rules="editFormRules" ref="EditForm">
          <el-form-item
            label="用户名"
            :label-width="formLabelWidth"
            prop="username"
          >
            <el-input
              v-model="Edit.username"
              autocomplete="off"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="Edit.email"></el-input>
          </el-form-item>
          <el-form-item
            label="手机号码"
            :label-width="formLabelWidth"
            prop="mobile"
          >
            <el-input v-model="Edit.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogUserVisible = false">取 消</el-button>
          <el-button type="primary" @click="ShowEditUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配权限弹窗 -->
      <el-dialog title="分配权限" :visible.sync="dialogRole">
        <div id="user">
          <p>当前的用户:{{ userInfo.id }}</p>
          <p>当前的权限:{{ userInfo.role_name }}</p>
        </div>
        <p class="newRole">
          分配新权限
          <el-select placeholder="请选择活动区域" v-model="Rolemsg">
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="item in RoleList"
              :key="item.id"
            ></el-option>
          </el-select>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogRole = false">取 消</el-button>
          <el-button type="primary" @click="setUserRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-main>
</template>

<script>
import axios from "axios";
export default {
  name: "user",
  data() {
    // 验证手机号码的规则
    let checkMobile = (rule, value, callback) => {
      const RegExpMobile = /^[1]([3-9])[0-9]{9}$/;
      if (RegExpMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入中国大陆11位手机号码"));
    };
    return {
      userList: [], //用户列表
      total: 0, //总数量
      params: {
        //请求页数/每页数量
        query: "", //搜索框内容
        pagenum: 1,
        pagesize: 10,
      },
      value: true, //状态
      dialogFormVisible: false, //添加用户弹窗
      dialogUserVisible: false, //编辑用户弹窗
      dialogRole: false, //分配权限弹窗
      Rolemsg: "",
      RoleList: "", //用户权限列表
      userInfo: {}, // 用户信息
      formLabelWidth: "120px",
      form: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      Edit: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      id: "",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      // 修改用户信息的验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      //添加用户信息的验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 16,
            message: "长度在 3 到 16 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "长度在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getuserList();
  },
  methods: {
    //获取用户列表
    getuserList() {
      let params = this.params;
      axios({ url: "users", data: {}, params }).then((res) => {
        let msg = this.params.query;
        this.userList = res.data.users;
        console.log(res.data)
        let params = {
          pagenum: res.data.pagenum,
          pagesize: res.data.pagesize || 5,
          query: msg,
        };
        this.params = params;
        this.total = res.data.total;
      });
    },
    //搜索用户
    searchUser() {
      console.log(1);
      this.getuserList();
    },
    // 添加重置
    addDilog(status) {
      if (status == "go") {
        this.$refs.addForm.validate(async (valid, field) => {
          if (!valid) {
            console.log(field);
            let arr = Object.keys(field);
            return this.$message.error({
              message: field[arr[0]][0].message,
              duration: 1500,
            });
          }
        });

        axios({ url: "users", data: this.form, method: "POST" }).then((res) => {
          if (res.meta.status != "201") {
            console.log(res.meta.status);
            return this.$message.error({
              message: res.meta.msg,
              duration: 1500,
            });
          } else {
            this.$notify({
              type: "success",
              title: "添加成功",
              message: `注意当您添加成功后：<br/>1.需要开启该用户 <br/>2.请为该用户分配角色(默认角色无效)`,
              dangerouslyUseHTMLString: true,
              duration: 0,
            });

            //隐藏重置添加弹窗
            this.$refs.addForm.resetFields();
            this.dialogFormVisible = false;
          }
        });
      } else {
        //隐藏重置添加弹窗
        this.$refs.addForm.resetFields();
        this.dialogFormVisible = false;
      }
    },
    //更改状态
    userStateChanged(userInfo) {
      axios
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then((res) => {
          if (res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error({
              message: res.meta.msg,
              duration: 1000,
            });
          }

          this.$message.success({
            message: "更新状态成功！",
            duration: 1000,
          });
        });
    },
    //修改信息
    showEdit(userInfo) {
      console.log(userInfo);
      (this.Edit = {
        username: userInfo.username,
        password: "",
        email: userInfo.email,
        mobile: userInfo.mobile,
      }),
        (this.id = userInfo.id);
      this.dialogUserVisible = true;
    },
    //提交修改
    ShowEditUser() {
      //判断表单提交是否成功
      this.$refs.EditForm.validate(async (valid, field) => {
        if (!valid) {
          console.log(field);
          let arr = Object.keys(field);
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500,
          });
        } else {
          //发送修改请求
          axios.put(`users/${this.id}`, this.Edit).then((res) => {
            if (res.meta.status !== 200) {
              //修改失败,弹出失败原因
              userInfo.mg_state = !userInfo.mg_state;
              return this.$message.error({
                message: res.meta.msg,
                duration: 1000,
              });
            } else {
              //成功修改 退出编辑弹窗/并弹出消息
              this.getuserList();
              this.$message.success({
                message: "修改成功",
                duration: 1000,
              });
              this.dialogUserVisible = false;
            }
          });
        }
      });
    },
    //删除
    deleteUser(userInfo) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }) //确定/取消
        .then(() => {
          axios.delete(`users/${userInfo.id}`).then((res) => {
            console.log(res);
            if (res.meta.status == "200") {
              this.$message({
                type: "success",
                message: "删除成功 ",
              });
              this.getuserList();
            } else {
              this.$message({
                type: "error",
                message: res.meta.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //获取权限列表
    setRole(userInfo) {
      this.userInfo = userInfo;
      this.dialogRole = true;
      axios("roles").then((res) => {
        this.RoleList = res.data;
      });
    },
    //提交修改权限信息
    setUserRole() {
      if (this.Rolemsg != "") {
        axios
          .put(`users/${this.userInfo.id}/role`, { rid: this.Rolemsg })
          .then((res) => {
            if (res.meta.status == "200") {
              this.$message({
                type: "success",
                message: res.meta.msg,
              });
              this.getuserList();
              this.dialogRole = false
            }
          });
      } else {
        this.$message({
          message: "不能为空",
        });
      }
    },
    //分页修改 
    //修改?条/页
    setPageN(val){
      this.params.pagesize = val
      this.getuserList();
    },
    //修改页数
    setcurrent(val){
      this.params.pagenum = val;
      this.getuserList();
    }
  },
};
</script>

<style scoped>
#rows {
  display: flex;
  width: 40%;
}
#rowsel {
  margin-left: 20px;
}
#btn_icon {
  display: flex;
  font-size: 20px;
  align-items: center;
  justify-content: space-between;
}
#user {
  padding: 10px 32px;
}
#user p {
  margin-bottom: 5px;
}
.newRole {
  padding: 0 32px;
}
</style>
