<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control  v-show="isTabFixed" class="tab-control" ref="tabControl1" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>

    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommand-view :recommands="recommends"/>
      <feature-view></feature-view>
      <tab-control ref="tabControl2" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>

      <goods-list :goods="showGoods"></goods-list>

    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>


  </div>
</template>

<script>
  // 轮播图组件
  import HomeSwiper from "./childComps/HomeSwiper";
  // 推荐组件
  import RecommandView from "./childComps/RecommandView";
  // 本周流行组件
  import FeatureView from "./childComps/FeatureView";

  // 导航栏组件
  import NavBar from "components/common/navbar/NavBar";
  // tabcontrol组件
  import TabControl from "components/content/tabControl/TabControl";
  // Goodslist组件
  import GoodsList from "components/content/goods/GoodsList";
  // 回到顶部组件
  import BackTop from "components/content/backTop/BackTop";


  // 获取数据组件
  import {getHomeMultidata, getHomeGoods} from "network/home";

  //获取better scroll插件
  import Scroll from "components/common/scroll/Scroll";
  // 获取防抖动方法
  import {debounce} from "common/util";
  import {itemListenerMixin,backTopMixin} from "../../common/mixin";

  export default {
    name: "Home",
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        // isShowBackTop: true,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY:0,
        itemImgListener:null
      }
    },
    components: {
      HomeSwiper,
      RecommandView,
      FeatureView,

      NavBar,
      TabControl,
      GoodsList,
      BackTop,

      Scroll
    },
    created() {
      // 组件创建完成后发送网络请求
      // 1.请求多个数据
      this.getHomeMultidata()
      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mixins:[itemListenerMixin,backTopMixin],
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    activated() {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 保存Y值
      this.saveY = this.$refs.scroll.getScorllY()

      // 取消 全局事件监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
    },
    methods: {
      /**
       * 事件监听相关方法
       * **/

      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      // 回到顶部
      // backClick() {
      //   // 500毫秒内回到顶部
      //   this.$refs.scroll.scrollTo(0, 0, 500)
      // },
      // 控制回到顶部按钮的显示隐藏
      contentScroll(positon) {
        //1.判断backTop是否显示
        this.isShowBackTop = -positon.y > 1000

        // 2.决定tabControl是否吸顶{positon:fixed}
        this.isTabFixed = (-positon.y) > this.tabOffsetTop
      },
      // 上拉加载更多
      loadMore() {
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)
        // this.$refs.scroll.scroll()
      },

      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      /**
       * 网络请求相关方法
       * **/
      // 1.请求多个数据
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      // 2.请求商品数据
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      },

    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    /*position: relative;*/
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*在使用浏览器原生滚动的时候*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*.fixed {*/

  /*  position: fixed;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*  top: 44px;*/
  /*}*/

  /*.tab-control {*/
  /*  !*实现吸顶效果css样式*!*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  z-index: 9;*/
  /*}*/
  /*动态获取中间滚动的高度：子绝父相*/
  .tab-control {
    position: relative;
    z-index: 9;
  }
  .content {
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    /*margin-top: 44px;*/
  }
</style>
