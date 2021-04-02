<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-swiper :banners="banners"/>
    <recommand-view :recommands="recommends"/>
    <feature-view></feature-view>
    <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>

    <goods-list :goods="showGoods"></goods-list>

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

  // 获取数据组件
  import {getHomeMultidata, getHomeGoods} from "network/home";

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
        currentType:'pop'
      }
    },
    components: {
      HomeSwiper,
      RecommandView,
      FeatureView,

      NavBar,
      TabControl,
      GoodsList
    },
    created() {
      // 组件创建完成后发送网络请求
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
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
        })
      },

    }
  }
</script>

<style scoped>
  #home {
    padding-top: 44px;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {
    /*实现吸顶效果css样式*/
    position: sticky;
    top: 44px;
    z-index: 9;
  }
</style>
