<template>
  <div>
    <el-container> 
       <div class='main-aside'>
		    	<aside-bar></aside-bar>
		    </div>
		  
		  <el-container>
		    <el-header class='main-header'>
		  	   <header-top></header-top>
		    </el-header>
      
        <v-tags ></v-tags>

		    <el-main>
            <router-view></router-view>
		    </el-main>   
		  </el-container>
		</el-container>
  </div>
</template>

<script>
	import headerTop from './header'
	import asideBar from './aside'
  import vTags from './Tags'
  import bus from '@/util/event'

	export default {
    data(){
            return {

            }
    },
		components:{
      headerTop,
      asideBar, 
      vTags
    },
    created(){
           
        }

	}
</script>

<style>
  .main-header{
    padding: 0;
    background-color: #fff;
    color: #3E3E3E;
    text-align: center;
    font-weight: 600
  }
  
  .main-aside {
    background-color: #03112C;
    color: #fff;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
  	border-left: 10px solid #e9ecf3;
    border-top: 1px solid #e9ecf3;
    color: #333;
	  position: relative;
  }
  .el-menu {
  	border: none;
  }
  body > .el-container {
    margin-bottom: 40px;
  }
</style>