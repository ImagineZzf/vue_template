<template>
  <div class="error">
    <img src="@assets/images/404.png"
         alt="">
    <p>啊哦~ 你所访问的页面不存在</p>
    <div class="error-btns">
      <el-button type="primary"
                 class="error-btn"
                 @click="goHome">返回首页</el-button>
      <el-button type="primary"
                 class="error-btn"
                 @click="goBack">返回上一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push('/');
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>


<style lang="scss" scoped>
.error {
  padding-top: 50px;
  height: 100vh;
  background: url(../../assets/images/error_cloud.png) repeat-x center bottom
    $--color-bg-blue;
  text-align: center;
  box-sizing: border-box;
  p {
    margin: 50px 0 70px;
    font-size: 24px;
    color: $--color-text-white;
  }
  &-btn {
    padding: 9px 20px;
    min-width: 128px;
    background: $--color-text-white;
    border: none;
    border-radius: 17px;
    color: $--color-text-blue;
  }
}
</style>
