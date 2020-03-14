<template>
  <div class="login">
    <div class="login-box">
      <div class="login-title">欢迎登录</div>
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="0px"
               class="login-content">
        <el-form-item prop="userName">
          <el-input v-model="ruleForm.userName"
                    placeholder="用户名">
            <el-button slot="prepend"
                       icon="el-icon-user-solid"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    placeholder="密码"
                    v-model="ruleForm.password"
                    @keyup.enter.native="submitForm('ruleForm')">
            <el-button slot="prepend"
                       icon="el-icon-lock"></el-button>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary"
                     @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setStorage } from '@utils/index'
export default {
  data() {
    return {
      ruleForm: {
        userName: 'admin',
        password: '123123'
      },
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 请求登录接口后，设置token
          setStorage('1111111')
          this.$router.push('/')
        } else {
          this.$message.warning('账号或密码格式不正确')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100vh;
  background: url(../../assets/images/error_cloud.png) repeat-x center bottom $--color-bg-blue;
  &-box {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }
  &-title {
    line-height: 50px;
    border-bottom: 1px solid $--color-bg-gray;
    font-size: 20px;
    color: $--color-text-white;
    text-align: center;
  }
  &-content {
    padding: 30px 30px;
  }
  &-btn {
    text-align: center;
    button {
      width: 100%;
      height: 36px;
      margin-bottom: 10px;
    }
  }
  &-tips {
    line-height: 30px;
    font-size: 12px;
    color: $--color-text-white;
  }
}
</style>
