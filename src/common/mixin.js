import {debounce} from "./util";
import BackTop from "components/content/backTop/BackTop";

export const itemListenerMixin = {
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200)
    this.itemImgListener = () => {
      refresh()
    }

    this.$bus.$on('itemImgLoad', this.itemImgListener)
    console.log('aaa');
  }
}

export const backTopMixin = {
  components:{
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick()
    {
      // 500毫秒内回到顶部
      this.$refs.scroll.scrollTo(0, 0, 500)
    }
  ,
  }
}
