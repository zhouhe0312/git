<template>
	<div class="sidebar">
		
		<el-menu ref="menu" @select="handleSelect"
				 :default-active="currPath"
				 :collapse="callback_state"
				 background-color="rgba(4, 18, 39, 1.0)"
				 text-color="#fff"
				 active-text-color="#f39416"
				 :unique-opened="true"
				 :router="true"
				 class="el-menu-vertical-demo" >
			<el-menu-item
					:index="item.url"
					:key="item.id"
					:route="handleRouter(item)"
					v-for='item in menuInfo'
					v-if='!item.childrenMenuTree || item.childrenMenuTree.length === 0'>
					<i :class="item.icon1"></i>
					<span  style="padding-left:8px">{{item.name}}</span>
			</el-menu-item>
			<el-submenu
					v-if='item.childrenMenuTree && item.childrenMenuTree.length !== 0'
					:key="item.id"
					:index="item.id"
					v-for='item in menuInfo'>
				<template slot="title">
					<i :class="item.icon1"></i>
					<span slot="title" style="padding-left:8px">{{item.name}}</span>
				</template>
				<el-menu-item :key="val.id" :index="val.url" :route="handleRouter(val)" v-for='val in item.childrenMenuTree'>
					<span slot="title" class="name" style="margin-left:17px;font-size:14px">{{val.name}}</span>
				</el-menu-item>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
	import bus from '@/util/event';

	export default {
        name: 'asidePage',
        data() {
        	return {
				callback_state:false,
				currPath:'',
        		menuInfo:[
        			/*{title:'首页',id:'home',icon:'el-icon-menu'},
        			{title:'课程实验',id:'course-test',icon:'el-icon-date',
        			 menuItem:[
        			 	{title:'课程管理',id:'course-manage'},
        			 	{title:'实验管理',id:'test-manage'},
        			 	{title:'分类管理',id:'classify-manage'}
        			 ]},
        			{title:'考试管理',id:'exam-manage',icon:'el-icon-edit-outline',
        			 menuItem:[
        			 	{title:'试题管理',id:'exam-manage'},
        			 	{title:'题库管理',id:'itemBank-manage'},
        			 	{title:'试卷管理',id:'testPaper-manage'}
        			 ]},
        			{title:'系统管理',id:'system-manage',icon:'el-icon-setting',
        			 menuItem:[
        			 	{title:'管理员管理',id:'system-manager'},
        			 	{title:'角色管理',id:'system-role'},
        			 	{title:'权限管理',id:'system-authority'},
        			 	{title:'日志管理',id:'system-log'},
        			 	{title:'安全管理',id:'system-safety'},
        			 	{title:'字典管理',id:'system-dictionaries'},
        			 	{title:'部门管理',id:'system-department'}
        			 ]},
        			{title:'用户管理',id:'user-manage',icon:'el-icon-location',
        			 menuItem:[
        			 	{title:'用户管理',id:'user-manage'},
        			 	{title:'用户学习',id:'user-study'},
        			 	{title:'用户考试',id:'user-exam'},
        			 	{title:'试卷收藏',id:'Paper-collection'},
        			 	{title:'错题管理',id:'wrong-manage'}
        			 ]},
        			{title:'知识库管理',id:'knowledge-manage',icon:'el-icon-document',
        			 menuItem:[
        			 	{title:'知识库目录',id:'knowledge-list'},
        			 	{title:'知识库内容建设',id:'knowledge-const'}
        			 ]}*/
        		]
        	}
		},
		watch: {
			$route(newValue, oldValue) {
				//高亮当前菜单
				 var index  = newValue.fullPath.lastIndexOf("\/")
				 var data = newValue.fullPath.substring(index+1,newValue.fullPath.length)
				 this.currPath = data
			},
		},
		mounted() {
			if(this.$route.path){
				var index  = this.$route.path.lastIndexOf("\/")
				var data = this.$route.path.substring(index+1,this.$route.path.length)
				this.currPath  = data
			}else{
				this.currPath = 'home'
			}
     	    this.receive();
			this.handleUserMenus()
		},
        methods: {
			
			receive(){
				bus.$on('RUNSWITCH',(data)=>{
					this.callback_state = data;
				})
			},
			handleSelect(key, keyPath) {
				this.$router.push({path:'/index/'+key})
				console.log(this.$router)
			},
			handleUserMenus() {
				this.$store.dispatch("user/obtainUserMenus").then(() => {
					this.menuInfo = this.$store.state.user.userMenus.mnues
					//console.log(this.menuInfo,'``')
				}).catch(() => {

				})
			},
			handleRouter(obj) {
				return {path:("/index/" + obj.url)}
			}
		},
		
	}
</script>

<style >
	.el-menu-vertical-demo .el-menu .el-submenu, .el-menu--popup{
		min-width: 150px
	}
	.el-menu--vertical {
		text-align:center;
	}
	.el-menu--vertical .name{
		margin-left:0px !important;
	}
	.el-menu-item span .is-active{
		color:#f38916
	}
	.el-menu-item:not(.is-active) .name{
		color:#949ba8
	}
	.sidebar{
		margin-top: 60px
	}
	.el-menu-vertical-demo .el-menu-item, .el-submenu{
		text-align: left;
	}
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
		background-color: rgba(4, 18, 39, 1.0) !important;
	}
	.el-submenu__title:hover, .el-menu-item:hover{
		background-color: transparent !important; 
		/* opacity:0.4; */
	}
	
</style>