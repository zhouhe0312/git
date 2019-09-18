<template>
	<div class="mainPart">
		<el-row>
			<el-col :span="12">
				<div class="left_btn">
  					<el-button v-if="handleButtonHash('system_manage:dept:add')" size="medium" type="warning" style='background: #f38916;' @click='showAdd("addTableData")'>新增</el-button>
  					<el-button v-if="handleButtonHash('system_manage:dept:delete')" size="medium" style='border:1px solid #f38916;color: #f38916;' @click='getDelete'>删除</el-button>
				</div>
			</el-col>
			<el-col :span="6" :offset='6'>
				<div class="search_right">
					<el-input placeholder="请输入部门"  @keyup.enter.native="dataSearch"  clearable  v-model="searchInput">
					    <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
					</el-input>
				</div>
			</el-col>
		</el-row>
		<el-row style='margin-top: 22px;'>
			<el-col :span="4">
            	<GeminiScrollbar :autoshow="true" :forceGemini="true" class="myScroll" style="height:685px;">  
					<el-tree 
						:data="getTreeList" 
						class="deptTree"
						@node-click="handleNodeClick"
						:expand-on-click-node="false"
						ref="tree" 
						accordion
						highlight-current 
						:props="defaultProps">
					</el-tree>
            	</GeminiScrollbar>
			</el-col>
			<el-col :span="20">
				<el-table
					highlight-current-row
				    ref="multipleTable"
				    :data="tableData"
				    :header-cell-style="{background:'#e9ecf3'}"
				    tooltip-effect="dark"
				    style="width: 98%;float:right"
				    show-header
				    stripe
					v-loading="loading"
				    @selection-change="handleSelectionChange">
				    <el-table-column
				      type="selection"
				      width="55">
				    </el-table-column>
				    <el-table-column
					        width="70"
				       type='index'
				       label="序号">
							<template slot-scope="scope">{{(allInfo.current - 1) * allInfo.size + scope.$index + 1 }}</template>
				    </el-table-column>
				    <el-table-column
				      prop="name"
				      label="部门名称">
				    </el-table-column>
				    <el-table-column
				      prop="code"
				      label="部门编码"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column
				      prop="pname"
				      label="所属部门"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column prop="status" label="状态" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-switch
							   class="mySwitch"
								v-model="scope.row.status==='启用'"
								@change = "_changeStatus(scope.row)"
								active-color="#f38916"
								inactive-color="#bfbfbf">
							</el-switch>       
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
						<i v-if="handleButtonHash('system_manage:dept:edit')" @click="editTable(scope.row,'addTableData')" class="el-icon-edit-outline mybtn" style="color:#999;font-size:17px;cursor:pointer;margin-right:10px"></i>
                        <i v-if="handleButtonHash('system_manage:dept:delete')" @click="delTable(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer"></i>
				      </template>
				    </el-table-column>
				  </el-table>
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
			</el-col>
		</el-row>
		<!-- 新增/修改部门 -->
		<el-dialog  :close-on-click-modal="false" width="40%" :title="diaTitle" :visible.sync="dialogVisible"  :before-close="handleClose">
		  <el-form :model="addTableData" ref="addTableData" class="" label-width="90px" :rules="addFormRules">
            <div style="margin-left:-40px;padding-left:22px;">
                 <el-row>
                        <el-col :span="24">
                             <el-form-item label="所属分类">
                                <label style="color: #a2a2a2;">{{ pname === '' ? '无' : pname }}</label>
                             </el-form-item>
                        </el-col>
                </el-row>
                <el-row>
                        <el-col :span="24">
                                <el-form-item label="部门名称" prop="name">
                                        <el-input placeholder="请输入部门名称" v-model="addTableData.name" >
                                        </el-input>
                                </el-form-item>
                        </el-col>
                </el-row>
                <el-row>
                        <el-col :span="24">
                                <el-form-item label="部门编码" prop="code">
                                        <el-input placeholder="请输入部门编码" v-model="addTableData.code">
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
        </div>               
                        			
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="getAdd('addTableData')">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 删除弹层 -->
        <deleteModel :deleteObj="deleteObj"></deleteModel>

	</div>
</template>

<script>

	import deleteModel from "@/components/deleteModel";
	import {deptRules} from '@/util/rules'
	import { checkNameAndCodeOnly } from '@/api/system-department'

	export default {
		data() {
			return {
				diaTitle:'新增部门',
                loading:false,
                treeId:"0",//获取表格所需父级菜单id
                pname:"",
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				addTableData: {
                    name: "",
                    code: "",
					status: "1",
				},
				multipleSelection: [],
				tableData:[],
				dialogVisible: false, //新增部门
				searchInput: '', //搜索条件
				allInfo:{},
				msg:{
					name:'',
					current:1,
                    size:10,
                    pid:"0"
				},
				deleteObj: {
					deleteModel: false,
					prompt: "",
					del: {}
				},
				currDeptId:'',//操作一栏选中的单条用户id
                getTreeList:[],//部门树列表
				addFormRules:deptRules,
			}
		},
		mounted() {
            this.getTree()
			this.getData(this.msg)
			this.addFormRules.name.push({validator: this.nameChecking, trigger: 'blur'})
			this.addFormRules.code.push({validator: this.codeChecking, trigger: 'blur'})
		},
		methods:{
			nameChecking(rule, value, callback) {
				const nameCodeAndId = {type: 1, value: value, id: this.currDeptId}
				checkNameAndCodeOnly(nameCodeAndId).then(response => {
					callback();
				}).catch(error => {
					callback(new Error(error));
				})
			},
			codeChecking(rule, value, callback) {
				const nameCodeAndId = {type: 2, value: value, id: this.currDeptId}
				checkNameAndCodeOnly(nameCodeAndId).then(response => {
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
		    getData(val) {
				this.loading = true;
		   		this.$store.dispatch('systemDepment/getRoleTableData',val)
                .then(() => {
                    let data = this.$store.state.systemDepment.deptTableData;
                    console.log(data,'部门list')
                    data.map((res,index)=>{
                        res.status === 0? res.status="禁用": res.status="启用"
                    })
                    this.tableData = data
                	this.allInfo = this.$store.state.systemDepment.allInfo;
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
				})		
			},
			//获取部门树
			getTree(){
				this.$store.dispatch('systemDepment/getAllDeptTree',0)
                .then(() => {
                    this.getTreeList  = this.$store.state.systemDepment.deptData;
                })
                .catch(() => {

				})
				
			},
			
			//点击新增弹框
            showAdd(formName){
                this.addTableData = {
                    name: "",
                    code: "",
					status: "1",
                },
                this.diaTitle = "新增部门"
				this.currDeptId = ""
				this.dialogVisible = true
				setTimeout(()=>{ 
                	this.$refs[formName].resetFields();
				},10)
			},
			_changeStatus(row){
				this.loading = true;
				row.status == "禁用"?row.status = "启用":row.status = "禁用"
				this.addTableData = {
                    name: row.name?row.name:'',
                    code: row.code?row.code:"",
					status: row.status &&  row.status == "启用"? "1":"0",
				}
                 this.currDeptId = row.id
                 var val = {
                    ...this.addTableData,
                    id:	this.currDeptId,
                    pid:this.treeId
                }
				 this.$store.dispatch('systemDepment/editDataOne',val)
					.then((response) => {
						this.getData(this.msg)
					})
					.catch((error) => {
						this.loading = false
					})
			},		
            //点击编辑弹框
            editTable(row,formName){
                //console.log(row)
                this.diaTitle = "编辑部门"
                this.dialogVisible = true
				this.currDeptId = row.id
				setTimeout(()=>{
                	this.$refs[formName].resetFields();
                     this.addTableData= {
						name: row.name?row.name:'',
						code: row.code?row.code:"",
						status: row.status &&  row.status == "启用"? "1":"0",
					}
				},10)
            },
		   // 新增/修改提交     
			getAdd(name) {
			   this.$refs[name].validate((valid) => {
				  if (valid) {
                    var param = ''
                    if(this.diaTitle === "新增部门"){
                        var val = {
                            ...this.addTableData,
                            pid:this.treeId
                        } 
                        param = 'systemDepment/tableDataAdd'
                    }else{
                        var val = {
                            ...this.addTableData,
                            id:	this.currDeptId,
                            pid:this.treeId
                        }
                        param = 'systemDepment/editDataOne'
                    }
                    console.log(val,'~#~#~')
                    this.$store.dispatch(param,val)
                        .then((response) => {
                            this.dialogVisible = false
                            var msg = {
                                name:'',
                                current:1,
                                size:10,
                                pid:this.treeId
                            }
                            this.getData(msg)
                            this.getTree()
							this.loading = false
							this.$message({
                                    message: response.message,
									type: "success",
									 center:"true",
                                    duration: 3 * 1000
                            })
                           
                        })
                        .catch((error) => {
                           // this.dialogVisible = false
                            //this.$message({
                            //        message: error,
							//		type: "error",
							//		 center:"true",
                            //        duration: 3 * 1000
                           // });
                            this.loading = false
                            })
                        } else {
							this.$message({
                                    message: '请检查填写内容',
									type: "warning",
									 center:"true",
                            });
                        }
                });
            },
            handleNodeClick(data) {
				console.log(data,'@@@')
                this.treeId = data.id
                this.pname = data.label
                this.msg={
                    name:'',
                    current:1,
                    size:10,
                    pid:this.treeId
                }
                this.getData(this.msg) 
            },
            //删除单条
            delTable(row){
                let that = this
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        var id = row.id
                        console.log(that.treeId)
                        await that.$store.dispatch('systemDepment/tableDataDelOne',id)
                        .then((response) => {
                            var msg = {
                                name:'',
                                current:1,
                                size:10,
                                pid:that.treeId
                            }
                            that.deleteObj.deleteModel = false;
                            that.$message({
                                    message:response.message,
									type: "success",
									 center:"true",
                                    duration: 3 * 1000
                            })
                            that.getData(msg)
                            that.getTree()
                            that.loading = false
                        })
                        .catch((response) => {
                            that.deleteObj.deleteModel = false;
                           // that.$message({
                            //        message: response.message,
							//		type: "error",
							//		 center:"true",
                           // });
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
					 center:"true",
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
					await that.$store.dispatch('systemDepment/tableDataDel',dataId)
						.then(() => {
							var msg = {
								name:'',
								current:1,
                                size:10,
                                pid:that.treeId
							}
							that.deleteObj.deleteModel = false;
							that.$message({
									message: '删除成功！',
									type: "success",
									 center:"true",
									duration: 3 * 1000
							})
                            that.getData(msg)
                            that.getTree()
							that.loading = false
						})
						.catch(() => {
						//	that.deleteObj.deleteModel = false;
							//that.$message({
							//		message: '删除失败！',
							//		type: "error",
							//		 center:"true",
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
	.mySwitch .el-switch__core{
        width: 36px !important;
        height: 17px !important;
    }
    .mySwitch .el-switch__core:after{
        width: 13px !important;
        height: 13px !important;
        left: 19px !important;
    }
 	.mybtn:hover{
        color: #f38916 !important
    }
	.deptTree .el-tree-node__content{
        padding:3px 0px;
    }
	.deptTree{
		border:1px solid #ececec
	}
	.knowTree .el-tree-node__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
	.el-textarea__inner{
		min-height: 90px !important
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
	 .search_right{
          max-width: 320px;
		float:right
     }
	.search_right input{
         /* border-right: none; */
		  height:32px
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
	 .myScroll{
        position: static !important;
    }
    .myScroll .-vertical,.menuScroll .-vertical {
        display: none !important;
    }
    .myScroll .-horizontal,.menuScroll .-horizontal {
        display: none !important;
    }
</style>