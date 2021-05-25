<template>
  <div id="detail">
    <detail-navbar @titleClick="titleClick" ref="nav" class="detail-nav"/>
    <scroll @scroll="contentScroll" class="content" :probe-type="3" ref="scroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imgLoad="imgLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"/>
      <goods-list ref="recommand" :goods="recommends"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addCart="addToCart" />
    <toast :message="message"  :show="show" />

  </div>
</template>

<script>
  import DetailNavbar from "./childComps/DetailNavbar";
  import {getDetail, Goods, Shop, GoodsParam, getRecommand} from "network/detail";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import BackTop from "components/content/backTop/BackTop";
  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";
  import {debounce} from "../../common/util";
  import {itemListenerMixin,backTopMixin} from "../../common/mixin";
  import {mapActions} from 'vuex'
  import Toast from "components/common/toast/Toast";
  export default {
    name: "Detail",
    components: {
      DetailNavbar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,
      Scroll,
      GoodsList,
      BackTop,
      Toast
    },
    mixins: [itemListenerMixin,backTopMixin],
    methods: {
      ...mapActions(['addCart']),
      imgLoad() {
        this.$refs.scroll.refresh();
        this.getThemeTopY()
      },
      titleClick(index) {
        console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
      },
      contentScroll(position) {
        // 1.获取y值
        const positonY = -position.y
        let length = this.themeTopYs.length
        // 2.positonY和主题中的值进行对比
        for (let i = 0; i < length - 1; i++) {
          // 方式一
          if (this.currentIndex !== i && (positonY >= this.themeTopYs[i] && positonY < this.themeTopYs[i + 1])) {
            console.log(i);
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }

          // 方式二
          // if (this.currentIndex !== i && ((i < length - 1 && positonY >= this.themeTopYs[i] && positonY < this.themeTopYs[i + 1]) || (i === length - 1 && positonY >= this.themeTopYs[i]))) {
          //   this.currentIndex = i
          //   this.$refs.nav.currentIndex = this.currentIndex
          // }


        }

        // 3.是否显示回到顶部
        this.isShowBackTop = -position.y > 1000

      },
      addToCart(){
        // 1.获取需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        // product.count = 0

        // 2.将商品添加到购物车里面
        // this.$store.commit('addCart',product)
        this.addCart(product).then(res => {
          // toast基础方式一
          // console.log(res);
          // this.show = true
          // this.message = res
          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // },1500)

          this.$toast.show(res,2000)
        })

        // this.$store.dispatch('addCart',product).then(res => {
        //   console.log(res);
        // })

      }
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        itemImgListener: null,
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        message:'',
        show:false
        // isShowBackTop: false

      }
    },
    mounted() {

    },
    // 第一种方式：updated解决点击标题滚动到对应内容的问题
    // updated() {
    //   this.themeTopYs = []
    //   this.themeTopYs.push(0);
    //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    //   this.themeTopYs.push(this.$refs.recommand.$el.offsetTop);
    //
    //   console.log(this.themeTopYs);
    // },
    created() {
      // 1.保存存入的 iid
      this.iid = this.$route.params.iid

      // 2.根据 iid 请求数据
      getDetail(this.iid).then(res => {

        // 1.获取顶部的轮播数据
        const data = res.result
        console.log(data);
        this.topImages = res.result.itemInfo.topImages

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 3.创建店铺信息
        this.shop = new Shop(data.shopInfo)

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo

        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        // 6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }

        // 第二种方式 解决点击标题滚动到对应内容的问题
        // this.$nextTick(() => {
        //   this.themeTopYs = []
        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommand.$el.offsetTop);
        //
        //   console.log(this.themeTopYs);
        // })


      })

      // 3.请求推荐数据
      getRecommand().then(res => {
        this.recommends = res.data.list
      })

      // 4.给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44);
        this.themeTopYs.push(this.$refs.recommand.$el.offsetTop - 44);
        this.themeTopYs.push(Number.MAX_VALUE)
        console.log(this.themeTopYs);
      }, 100)
    },

    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>
