<template>
<!--  ref绑定给子组件-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>

  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props : {
      probeType: {
        type:Number,
        default:0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        scroll : null
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper,{
        click:true,
        probeType:this.probeType,
        pullUpLoad:this.pullUpLoad
      })

      // 监听滚动位置
      this.scroll.on('scroll',(position) => {
        // console.log(position);
        this.$emit('scroll',position)
      })

      // 监听上拉事件
      if(this.pullUpLoad === 2 || this.pullUpLoad === 3){
        this.scroll.on('pullingUp', () => {

          this.$emit('pullingUp')
        })
      }

    },
    methods:{
      scrollTo(x,y,time=300){
        this.scroll  && this.scroll.scrollTo(x,y,time)
      },
      finishPullUp(){
        this.scroll && this.scroll.finishPullUp()
      },
      refresh(){
        // console.log('监听成功');
        this.scroll && this.scroll.refresh()
      },
      getScorllY(){
        return this.scroll? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
