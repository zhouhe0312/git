<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
    export default {
        data () {
            return {
               
            };
        },
       
        beforeDestroy () {
 
        },
        methods: {
 
        },
        mounted(){
            // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
           // window.onbeforeunload = function (e) {
            //    var storage = window.localStorage;
            //    storage.clear()
           // }
        }
 
 
    };
</script>
<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  .el-pagination {
    text-align: center;
    margin-top: 50px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #f38916;
  }
  .el-pagination.is-background .el-pager li ,.el-pagination.is-background .btn-prev,.el-pagination.is-background .btn-next{
    border: 1px solid #f38916;
    border-radius: 0;
    background: white;
  }
</style>