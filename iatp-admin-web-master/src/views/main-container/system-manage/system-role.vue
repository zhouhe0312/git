<template>
	<div class="mainPart">
		<el-row>
			<el-col :span="12">
				<div class="left_btn">
  					<el-button  v-if="handleButtonHash('system_manage:role:add')"  size="medium" type="warning" style='background: #f38916;' @click='showAdd("addTableData")'>新增</el-button>
  					<el-button  v-if="handleButtonHash('system_manage:role:delete')"  size="medium" style='border:1px solid #f38916;color: #f38916;' @click='getDelete'>删除</el-button>
				</div>
			</el-col>
			<el-col :span="6" :offset='6'>
				<div class="search_right">
					<el-input placeholder="请输入角色" @keyup.enter.native="dataSearch"   clearable  v-model="searchInput">
					    <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
					</el-input>
				</div>
			</el-col>
		</el-row>
		<el-row style='margin-top: 22px;'>
			<el-col>
				<el-table
					highlight-current-row
				    ref="multipleTable"
				    :data="tableData"
				    :header-cell-style="{background:'#e9ecf3'}"
				    tooltip-effect="dark"
				    style="width: 100%"
				    show-header
				    stripe
						v-loading="loading"
				    @selection-change="handleSelectionChange">
				    <el-table-column
				      type="selection"
				      width="55">
				    </el-table-column>
				    <el-table-column
					        width="60"
				       type='index'
				       label="序号">
							<template slot-scope="scope">{{(allInfo.current - 1) * allInfo.size + scope.$index + 1 }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="角色名称">
				    </el-table-column>
				    <el-table-column
				      prop="code"
				      label="角色编码"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column
				      prop="des"
				      label="描述"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column prop="status" label="状态" show-overflow-tooltip>
						<template slot-scope="scope">
							{{scope.row.status}}
							<!-- <el-link type="info" :underline="false" @click="_changeStatus(scope.row)">{{scope.row.status}} -->
                                <!-- <p v-if="scope.row.status==='启用'"  style="color:#86B3E8">{{scope.row.status}}</p> -->
                                <!-- <p v-else>{{scope.row.status}}</p> -->
                            <!-- </el-link> -->
						</template>
				    </el-table-column>
				    <el-table-column
				      prop="createTime"
				      label="创建时间"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column
				      prop="address"
				      label="操作"
				      show-overflow-tooltip>
				      <template slot-scope="scope">
						  <i v-if="handleButtonHash('system_manage:role:edit')" @click="editTable(scope.row,'addTableData')" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" title="编辑"></i>
						  <i v-if="handleButtonHash('system_manage:role:auth')" @click="asRole(scope.row)" class="el-icon-key mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px" title="授权"></i>
						  <i v-if="handleButtonHash('system_manage:role:delete')" @click="delTable(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer" title="删除"></i>
				      </template>
				    </el-table-column>
				  </el-table>
			</el-col>
		</el-row>
		
		<el-row>
			<el-col>
				<el-pagination
				  background
				  layout="prev, pager, next"
				  :total="Number(allInfo.total)"
				  :size="Number(allInfo.size)"
				  @current-change = "currentChange"
				  >
				</el-pagination>
			</el-col>
		</el-row>

		<!-- 新增/编辑角色 -->
		<el-dialog  :close-on-click-modal="false" width="40%" :title="diaTitle" :visible.sync="dialogVisible"  :before-close="handleClose">
		  <el-form :model="addTableData" ref="addTableData" class="" label-width="90px" :rules="addFormRules">

				<div style="margin-left:-40px;padding-left:22px;">
					<el-row>
							<el-col :span="24">
									<el-form-item label="角色名称" prop="name">
											<el-input placeholder="请输入角色名称" v-model="addTableData.name" >
											</el-input>
									</el-form-item>
							</el-col>
					</el-row>
					<el-row>
							<el-col :span="24">
									<el-form-item label="角色编码" prop="code">
											<el-input placeholder="请输入角色编码" v-model="addTableData.code">
											</el-input>
									</el-form-item>
							</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<el-form-item label="状态" prop="status">
								<el-radio-group v-model="addTableData.status"> 
									<el-radio label="1">启用</el-radio>
									<el-radio label="0">禁用</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							 <el-form-item label="描述" prop="des"> <!--:autosize="{ minRows: 1, maxRows: 4}" -->
								<el-input type="textarea"  placeholder="" v-model="addTableData.des">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
        </div>               
                        
			
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="getAdd('addTableData')">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 删除弹层 -->
        <deleteModel :deleteObj="deleteObj"></deleteModel>

		<!-- 授权 -->
		<el-dialog  :close-on-click-modal="false" title="授权" class="dia" :visible.sync="userDialogVisible" width="40%" :before-close="handleClose">
			<el-tree 
			    :data="getAuthTree.tree" 
				:default-checked-keys="tolerant"
				show-checkbox
				node-key="id" 
				ref="tree" 
				accordion
				highlight-current 
				:props="defaultProps">
			</el-tree>

			<span slot="footer" class="dialog-footer">
				<el-button @click="userDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRoleData">确 定</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>

	import deleteModel from "@/components/deleteModel";
	import {codeRules} from '@/util/rules'
	import { memberCodeChecking } from '@/api/system-role'//验证角色编码唯一性

	export default {
		data() {
			return {
				diaTitle:'新增角色',
				loading:false,
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				addTableData: {
                    name: "",
                    code: "",
					status: "1",
					des:""
				},
				multipleSelection: [],
				tableData:[],
				dialogVisible: false, //新增角色
				userDialogVisible:false, //授权
				searchInput: '', //搜索条件
				allInfo:{},
				msg:{
					name:'',
					current:1,
					size:10
				},
				deleteObj: {
					deleteModel: false,
					prompt: "",
					del: {}
				},
				tolerant:[],
				selectRoleList:[],//选中的权限id
				getAuthTree:[],//获取权限树
				currUserId:'',//操作一栏选中的单条用户id
				getTreeList:[],//部门树列表
				addFormRules:{},
				  
			}
		},
		mounted() {
			this.getData(this.msg)
			this.getTree()
			codeRules.code.push({ validator: this.codeChecking , trigger:'blur'})
			codeRules.name.push({ validator: this.nameChecking , trigger:'blur'})
      		this.addFormRules = codeRules
		},
		methods:{
			codeChecking(rule, value, callback) {
				const acountAndId = {type:2,value: this.addTableData.code,id:this.currUserId}
				memberCodeChecking(acountAndId).then(response => {
						callback();
				}).catch(error => {
						callback(new Error(error));
				})
			},
			nameChecking(rule, value, callback) {
				const acountAndId = {type:1,value: this.addTableData.name,id:this.currUserId}
				memberCodeChecking(acountAndId).then(response => {
					callback();
				}).catch(error => {
					callback(new Error(error));
				})
			},
			 handleButtonHash(btnKey) {
				const btns = this.$store.getters.buttons
				for(let key in btns) {
						if(key === btnKey) {
								return btns[key]
						}
				}
				return null
            },
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			
		   // 获取表格数据
		    getData(value) {
				this.loading = true;
		   		this.$store.dispatch('systemRole/getRoleTableData',value)
                .then(() => {
                    let data = this.$store.state.systemRole.roleTableData;
                    data.map((res,index)=>{
                        res.status === 0? res.status="禁用": res.status="启用"
                    })
                    this.tableData = data
                	this.allInfo = this.$store.state.systemRole.allInfo;
                    this.loading = false
                    console.log(this.tableData,'角色list')
                })
                .catch(() => {
                    this.loading = false
				})		
			},
			//获取权限树
			getTree(val){
				this.$store.dispatch('systemRole/getAllAuthTree',val)
                .then(() => {
					this.getAuthTree  = this.$store.state.systemRole.roleData;
					var arr2 = this.getAuthTree.checkedKeys.map(function(item) {return +item;});
					this.tolerant = arr2
					//console.log(arr2,'--')
                })
                .catch(() => {

				})
				
			},
			//授权弹框
			asRole(row) {
				this.currUserId = row.id
				this.getTree(this.currUserId)
				this.selectRoleList = []
				this.userDialogVisible = true
			},
           
            //添加权限
            addRoleData(){
				 var arr = this.$refs.tree.getCheckedNodes()
				 console.log(arr)
				 var selected = []
				 arr.map((data,index)=>{
					selected.push(data.topId)
					selected.push(data.id)
				 })
				var hash=[];
				for (var i = 0; i < selected.length; i++) {
					if(selected.indexOf(selected[i])==i){
					hash.push(selected[i]);
					}
				}
				this.selectRoleList = hash
                    let val = {
                        id:this.currUserId,
                        resIds:this.selectRoleList.join(',')
                    }
					console.log(val)
                    this.$store.dispatch('systemRole/addRoleAuthData',val)
                    .then((response) => {
                        this.userDialogVisible = false
                        this.$message({
                            message: response.message,
							type: "success",
							center:'true',
                            duration: 3 * 1000
                        })
                        console.log(response,'=!')
                    })
                    .catch((error) => {
                        //this.userDialogVisible = false
                        //this.$message({
						//    message: error,
						//center:'true',
                        //    type: "error",
                         //   duration: 3 * 1000
                        //});
                    })
            },
           
			//点击新增弹框
            showAdd(formName){
                this.addTableData = {
                    name: "",
                    code: "",
					status: "1",
					des:""
                },
                this.diaTitle = "新增角色"
				this.dialogVisible = true
				setTimeout(()=>{
                     this.$refs[formName].resetFields();
                },10)
			},
			
            //点击编辑弹框
            editTable(row,formName){
                //console.log(row)
                this.diaTitle = "编辑角色"
				this.dialogVisible = true
				setTimeout(()=>{
                	this.$refs[formName].resetFields();
					this.addTableData= {
						name: row.name?row.name:'',
						code: row.code?row.code:"",
						status: row.status &&  row.status == "启用"? "1":"0",
						des:row.des?row.des:""
					}
                },10)
				this.currUserId = row.id
            },
		   // 新增/修改提交     
			getAdd(name) {
			   this.$refs[name].validate((valid) => {
				  if (valid) {
                    var param = ''
                    if(this.diaTitle === "新增角色"){
                        var val = this.addTableData
                        param = 'systemRole/tableDataAdd'
                    }else{
                        var val = {
                            ...this.addTableData,
                            id:	this.currUserId
                        }
                        param = 'systemRole/editDataOne'
                    }
					console.log(val,'~#~#~')
                    this.$store.dispatch(param,val)
                        .then((response) => {
                            this.dialogVisible = false
                            
                            var msg = {
                                name:'',
                                current:1,
                                size:10
                            }
							this.getData(msg)
							this.loading = false
							this.$message({
                                    message: response.message,
									type: "success",
									center:'true',
                                    duration: 3 * 1000
                            })
                           
                        })
                        .catch((error) => {
                            //	console.log(response)
                               // this.dialogVisible = false
                               // this.$message({
								//        message: error,
								//center:'true',
                                //        type: "error",
                                //        duration: 3 * 1000
                               // });
                                this.loading = false
                            })
                        } else {
							this.$message({
                                    message: '请检查填写内容',
									type: "warning",
									center:'true',
                                    duration: 3 * 1000
                            })
                        }
                });
            },
            //删除单条
            delTable(row){
                let that = this
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        console.log(row.id)
                        var id = row.id
                        await that.$store.dispatch('systemRole/tableDataDelOne',id)
                        .then((response) => {
                            var msg = {
                                name:'',
                                current:1,
                                size:10
                            }
                            that.deleteObj.deleteModel = false;
                            that.$message({
                                    message:response.message,
									type: "success",
									center:'true',
                                    duration: 3 * 1000
                            })
                            that.getData(msg)
                            that.loading = false
                        })
                        .catch(() => {
                          //  that.deleteObj.deleteModel = false;
                            //that.$message({
                            //        message: response.message,
							//        type: "error",
							//center:'true',
                            //        duration: 3 * 1000
                            //});
                            that.loading = false
                        })
                    }
                }
         },
	     // 批量删除
        getDelete() {
			let that = this
			if(that.multipleSelection.length === 0){
				that.$message({
					message: '请选择要删除的项！',
					type: 'warning',
					center:'true',
				});
				return
			}else{
				that.deleteObj.deleteModel = true;
			}
			that.deleteObj.prompt = "您确定要删除此内容吗？";
			that.deleteObj.del = {
				async del() {
					var dataId = ''
					that.multipleSelection.map(val => {
						dataId += (val.id +',');
					})
					dataId = dataId.substr(0,dataId.length-1)
					await that.$store.dispatch('systemRole/tableDataDel',dataId)
						.then(() => {
							var msg = {
								name:'',
								current:1,
								size:10
							}
							that.deleteObj.deleteModel = false;
							
							that.$message({
									message: '删除成功！',
									type: "success",
									center:'true',
									duration: 3 * 1000
							})
							that.getData(msg)
							that.loading = false
						})
						.catch(() => {
							//that.deleteObj.deleteModel = false;
							//that.$message({
							//		message: '删除失败！',
							//		type: "error",
							//center:'true',
							//		duration: 3 * 1000
							//});
							that.loading = false
						})
                                    
                    }
                }
        },
//		    搜索
        dataSearch() {
            this.msg.name = this.searchInput
            this.getData(this.msg)
        },
//		    分页
        currentChange(current) {
            this.msg.size = this.allInfo.size
            this.msg.current = current
            this.getData(this.msg)
        },


        handleClose(done) {
            done();
            },
		},
		computed:{
		
		},
		components: {
            deleteModel
        },
	}
</script>

<style>
 	
	.dia .el-dialog{
		max-height: 70% !important;
		overflow: overlay !important;
	}
	.el-textarea__inner{
		min-height: 90px !important
	}
	 .mybtn:hover{
        color: #f38916 !important
    }
	/* .el-form-item{
		margin-bottom:22px !important
	} */
	 .el-table th>.cell{
        color:#4c4b4b
    }
	.el-table td, .el-table th{
		text-align: center
	}
	.search_right .el-input-group__append {
		background: #f38916;
		color: #ffffff;
	}
	.search_right input{
         /* border-right: none; */
		  height:32px
     }
	  .search_right{
          max-width: 320px;
		float:right
     }
	.el-button {
		border-radius: 0;
	}
	 .el-button--medium {
        padding: 8px 20px;
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
	.el-icon-more {
		margin-left: 15px;
	}
	.el-dialog__header {
		border-bottom: 2px solid #f38916;
	}
	.el-dialog__footer {
		text-align: center;
	}
	.el-button--primary ,.el-button--primary:hover {
		background: #f38916;
		border: none;
	}
	.el-button--default,.el-button--default:hover {
		color: black;
		border: 1px solid #DCDFE6;
		background: white;
	}
	/* 头像 */
	.el-upload--picture-card{
		width:0px;
		height:0PX;
		border:0px
	}
</style>