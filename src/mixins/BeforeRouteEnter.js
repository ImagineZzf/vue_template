export default class BeforeRouteEnterMixin extends Vue {
  // 路由进入
  beforeRouteEnter(to, from, next) {
    next()
  }
}
