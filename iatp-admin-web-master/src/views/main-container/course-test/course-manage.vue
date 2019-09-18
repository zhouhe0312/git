<template>
	<div class="mainPart" >
		<!-- <el-row class="">
			<div class="handle">
				<div class="left_btn">
  					<el-button  v-if="handleButtonHash('course_experiment:course:add')"  size="medium" type="warning" style='background: #f38916;' @click='showAdd("addTableData")'>创建课程</el-button>
  					<el-button  v-if="handleButtonHash('course_experiment:course:import')"  size="medium" style='border:1px solid #f38916;color: #f38916;' @click='uploadCourse'>导入课程</el-button>
				</div>
				<div class="search_right">
					<el-input style="position:absolute;right:4%;" placeholder="请输入要搜索的课程" v-model="searchInput">
					    <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
					</el-input>
				</div>
			</div>
		</el-row> -->
        <el-row style="min-width:1480px;margin-left: 30px;">
            
		    <el-col :span="24" v-loading="loading">
                <div v-if="tableData.length == 0">
                     <div class="handle">
                        <div class="left_btn">
                            <el-button  v-if="handleButtonHash('course_experiment:course:add')"  size="medium" type="warning" style='background: #f38916;' @click='showAdd("addTableData")'>创建课程</el-button>
                            <el-button  v-if="handleButtonHash('course_experiment:course:import')"  size="medium" style='border:1px solid #f38916;color: #f38916;' @click='uploadCourse'>导入课程</el-button>
                        </div>
                        <div class="search_right">
                            <el-input style="position:absolute;right:8%;" @keyup.enter.native='dataSearch' placeholder="请输入要搜索的课程" clearable v-model="searchInput">
                                <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                            </el-input>
                        </div>
                    </div>
                    <div style="margin:15% 0px 0px 42%">
                            <img src="@/assets/images/tip2.png">
                            <p style="color:#AFAFAF;font-size:14px;margin-left: -44px;">您还没有创建课程哦，请点击<span style="color:#6A8BD1"> 创建课程 </span>按钮...</p>
                    </div>
                </div>
                <div v-else style="display:flex;flex-direction:column;flex-wrap:nowrap;justify-content:center;">
                    <div style="display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center;">
                        <div style="width:1480px;">

                            <div class="handle">
                                <div class="left_btn">
                                    <el-button  v-if="handleButtonHash('course_experiment:course:add')"  size="medium" type="warning" style='background: #f38916;' @click='showAdd("addTableData")'>创建课程</el-button>
                                    <el-button  v-if="handleButtonHash('course_experiment:course:import')"  size="medium" style='border:1px solid #f38916;color: #f38916;' @click='uploadCourse'>导入课程</el-button>
                                </div>
                                <div class="search_right">
                                    <el-input style="position:absolute;right:8%;"  @keyup.enter.native='dataSearch' placeholder="请输入要搜索的课程" clearable v-model="searchInput">
                                        <el-button slot="append" icon="el-icon-search" @click='dataSearch'>搜索</el-button>
                                    </el-input>
                                </div>
                            </div>
                            
                            <div style="width: 270px;display: inline-block;margin-top: 30px;margin-right: 25px;" v-for="(item, index) in tableData" :key="index">
                                <el-card  :body-style="{padding:'0px'}" shadow="hover" >
                                    <img v-if="item.fileId" :src="previewCourse+item.fileId+ '?access_token=' + headers.Authorization.split(' ')[1]" class="image" @click="toJumpCourse(item, index)">
                                    <img v-else src="@/assets/images/coverPic.jpg" class="image" @click="toJumpCourse(item, index)">
                                    <div style="padding: 5px 8px 0px 8px;">
                                        <p class="nameInfo" :title="item.courseName">{{item.courseName}}</p>
                                        <p class="info" :title="item.introduce">{{item.introduce}}</p>
                                        <div class="bottom clearfix">
                                        <time class="time">{{ '创建于：'+item.createTime.substr(0,10) }}</time>
                                        <el-button v-if="handleButtonHash('course_experiment:course:delete')" type="text" class="button"><i style="color:#999" class="el-icon-delete mybtn" @click="delTable(item)"></i></el-button>
                                        <el-button v-if="handleButtonHash('course_experiment:course:delete')" type="text" class="button"><i style="color:#999;margin-right:6px" @click="editTable(item,'addTableData')" class="el-icon-edit-outline mybtn"></i></el-button>
                                    </div>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                    </div>
                </div>
		   </el-col>
		</el-row>
        <el-row v-if="tableData.length !== 0 && allInfo.total > 10" class="course-pagination-row">
			<el-col>
				<el-pagination
                  class="course-pagination"
				  background
				  layout="prev, pager, next"
				  :total="Number(allInfo.total)"
				  :size="Number(allInfo.size)"
                  :current-page="Number(allInfo.current)"
				  @current-change = "currentChange"
				  >
				</el-pagination>
			</el-col>
		</el-row>
		<!-- 创建/修改课程 -->
		<el-dialog :close-on-click-modal="false" width="40%" :title="diaTitle" :visible.sync="dialogVisible"  :before-close="handleClose">
		  <el-form :model="addTableData" ref="addTableData" class="" label-width="90px" :rules="addFormRules">
            <div style="margin-left:-40px;padding-left:22px;">
                <el-row>
                        <el-col :span="24">
                                <el-form-item label="课程名称" prop="courseName">
                                        <el-input placeholder="请输入课程名称" v-model="addTableData.courseName" >
                                        </el-input>
                                </el-form-item>
                        </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" v-bind:style='showUserImg == true?"margin-bottom:50px":"margin-bottom:-15px"'>
                        <p style="margin-left:22px;position: relative;top: 25px;">课程封面</p>
                        <el-upload :file-list="picList" :action='uploadUrl' class="myUpload" :on-success="handlersuccess"  :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit='1'  list-type='picture-card' :headers="headers" name="file">
                             <img v-if="showUserImg == true && previewPic == true && diaTitle == '编辑课程'" style="position: relative;top: -29px;left: 92px;width:70px;height:70px;border-radius:12%" :src="previewUrl" alt=""> 
                             <img v-if="showUserImg == true && previewPic == false && diaTitle == '编辑课程'" style="position: relative;top: -29px;left: 92px;width:70px;height:70px;border-radius:12%" src="@/assets/images/coverPic.jpg" alt=""> 
                             <img v-if="showUserImg == true && diaTitle !== '编辑课程'" style="position: relative;top: -29px;left: 92px"  src="@/assets/images/pic.png" alt=""> 
                        </el-upload>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                            <el-form-item label="课程简介" prop="introduce"> <!--:autosize="{ minRows: 1, maxRows: 4}" -->
                            <el-input type="textarea"  placeholder="" v-model="addTableData.introduce">
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

        <!-- 导入课程 -->
		<el-dialog :close-on-click-modal="false" width="40%" title="导入课程" :visible.sync="toUpLoad"  :before-close="handleClose">
		  <el-form class="" label-width="90px">
            <div style="margin-left:-15px">
                <el-row>
                    <el-col :span="24" style="margin-left:15px">
                        <el-upload
                            class="fileTip"
                            name="file"
                            ref="upload"
                            :action="importCourseUrl"
                            :headers="headers"
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            :on-remove="handleCourseRemove"
                            :before-remove="beforeCourseRemove"
                            :auto-upload="false"
                            :multiple="false"
                            :limit="1"
                            :data="uploadData"
                            :on-exceed="handleCourseExceed"
                            :on-success="handleImportSuccess"
                            :on-error="handleImportError"
                            :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传xls文件</div>
                        </el-upload>
                    </el-col>
                    <el-col :span="24" style="margin-left:15px">
                        <el-button type="text" @click="handleDownloadTemplate">下载模板</el-button>
                    </el-col>
                </el-row>
            </div>               
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="toUpLoad = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="handleExamImportSave">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 删除弹层 -->
        <deleteModel :deleteObj="deleteObj"></deleteModel>
	
	</div>
</template>

<script>

	import deleteModel from "@/components/deleteModel";
	import {courseRules} from '@/util/rules'
	import SelectTree from '@/components/SelectTree'
    import { constants } from '@/util/common'
    import {getValue,removeValue} from "@/util/localStorage";
        
	export default {
		data() {
			return {
                showUserImg:true,
                diaTitle:'创建课程',
                uploadUrl:constants.uploadUrl,
                importCourseUrl: process.env.VUE_APP_BASE_API + "/admin/base-course/import",
                fileList: [],//导入课程
                courseClassifyId:0,//导入课程分类id
                uploadData: {},
                headers:{},
                picList:[],
                loading:false,
                toUpLoad:false,
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				addTableData: {
                    type:1,//1:课程  2:实验
                    fileId: "",//封面图片id
                    classifyId: 0,//所属分类
					courseName: "",//课程名称
                    introduce:"",//课程简介
                    classifyPid:0//父级id
                },
				multipleSelection: [],
				tableData:[],
				dialogVisible: false, //创建课程
                searchInput: '', //搜索条件
               // getClassData:"",//下拉框分类选择
				allInfo:{},
				msg:{
                    current:1,
					size:10,
                    courseName:'',
                    type:1,
				},
				deleteObj: {
					deleteModel: false,
					prompt: "",
					del: {}
				},
                tolerant:[],
				selectRoleList:[],//选中的权限id
				getAuthTree:[],//获取权限树
				currCourseId:'',//操作一栏选中的单条用户id
                addFormRules:courseRules,
                jumpData:{},
                previewPic:false,
                previewUrl:"",//预览回显
                previewCourse:"",//课程管理封面
                haddleCurrent:1,
			}
		},
		mounted() {
            this.headers = {"Authorization":getValue("token")}
            this.haddleCurrent = localStorage.getItem('haddleCurrent')
            if(this.haddleCurrent && this.haddleCurrent !== 1){
                this.msg.current =  parseInt(this.haddleCurrent)
                this.msg.size = 10
            }
            this.getData(this.msg)
            this.previewCourse = constants.downloadUrl
            window.onbeforeunload = function (e) {
                removeValue("haddleCurrent")
            }
		},
		methods:{
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
		   		this.$store.dispatch('courseManage/getcoursesData',value)
                .then(() => {
                    this.tableData = this.$store.state.courseManage.coursesData;
                    this.allInfo = this.$store.state.courseManage.allInfo;
                    this.loading = false
                   // console.log(this.tableData,'====list=====')
                })
                .catch(() => {
                    this.loading = false
				})		
            },
           
			//点击创建弹框
            showAdd(formName){
                this.addTableData = {
                    type:1,//1:课程  2:实验
                    fileId: "",//封面图片id
                    classifyId: 0,//所属分类
					courseName: "",//课程名称
                    introduce:"",//课程简介
                    classifyPid:0//分类父级id
                },
               
                this.diaTitle = "创建课程"
                this.dialogVisible = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                },10)
			},
			
            //点击编辑弹框
            editTable(row,formName){
               // console.log('编辑',row)
                if(row.fileId){
                    this.previewPic = true
                    this.previewUrl = constants.downloadUrl+row.fileId//预览
                }else{
                    this.previewPic = false
                }
                this.diaTitle = "编辑课程"
                this.dialogVisible = true
                this.currCourseId = row.id
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                   this.addTableData= {
                        type:1,//1:课程  2:实验
                        fileId: row.fileId?row.fileId:"",//封面图片id
                        classifyId: 0,//所属分类
                        courseName: row.courseName?row.courseName:"课程名称",//课程名称
                        introduce:row.introduce?row.introduce:"",//课程简介
                        classifyPid:0//分类父级id
                    }
                },10)

            },
		   // 创建/修改提交     
			getAdd(name) {
			   this.$refs[name].validate((valid) => {
				  if (valid) {
                    var param = ''
                    if(this.diaTitle === "创建课程"){
                        var val = this.addTableData
                        param = 'courseManage/tableDataAdd'
                    }else{
                        var val = {
                            ...this.addTableData,
                            id:	this.currCourseId
                        }
                        param = 'courseManage/editDataOne'
                    }
                    console.log(val,'~#~#~')
                    this.$store.dispatch(param,val)
                        .then((response) => {
                            this.picList = []
                            this.showUserImg = true
                            this.dialogVisible = false
                            var msg = {
                                current:1,
					            size:10,
                                courseName:'',
                                type:1
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
                                // this.dialogVisible = false
                                //this.$message({
                                //        message: error,
                                //        type: "error",
                                //        center:'true',
                                //        duration: 3 * 1000
                              //  });
                                this.loading = false
                            })
                        } else {
                            this.$message.warning({
                                        message: '请检查填写内容',
                                        type: "warning",
                                        center:'true',
                                });
                        }
                });
            },
            //删除单条
            delTable(item){
                let that = this
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        await that.$store.dispatch('courseManage/tableDataDelOne',item.id)
                        .then((response) => {
                            var msg = {
                                current:1,
					            size:10,
                                courseName:'',
                                type:1
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
                        .catch((error) => {
                          //  that.deleteObj.deleteModel = false;
                            // that.$message({
                            //         message: error,
                            //         type: "error",
                            //         center:'true',
                            //         duration: 3 * 1000
                            // });
                            that.loading = false
                        })
                    }
                }
         },
	    toJumpCourse(item,index){
            localStorage.setItem('JUMPCOURSEDATA',JSON.stringify(item))
            localStorage.setItem('haddleCurrent',JSON.stringify(this.msg.current))
            this.$router.push({
                path:"/index/section-manage",
            });
        },
		// 搜索
        dataSearch() {
            this.msg.courseName = this.searchInput
            this.getData(this.msg)
        },
        //导入课程
        uploadCourse(){
            this.fileList = []
            this.toUpLoad = true
        },
        handleExamImportSave() {
            if(this.$refs.upload.uploadFiles.length == 0) {
                this.$message.warning("请选择要导入的文件")
                return
            }
            this.uploadData = {
                classifyId: 0,
                classifyPid: 0
            }
            this.$refs.upload.submit();
        },
        handleCourseRemove(file, fileList) {
            console.log(file, fileList);
        },
        beforeCourseRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },

        handleCourseExceed(files, fileList) {
            this.$message({
                    message: '当前限制选择 1 个文件！',
                    type: "warning",
                    center:'true',
                   
            })
            
        },
        handleImportSuccess(response, file, fileList) {
            this.toUpLoad = false
            this.getData(this.msg)
            this.$message({
                    message: response.message,
                    type: "success",
                    center:'true',
                    duration: 3 * 1000
            });
        },
        handleImportError(err, file, fileList) {
            const msg = JSON.parse(err.message).message || "导入失败"
            this.$message({
                    message: msg,
                    type: "error",
                    center:'true',
                   
            })
        },
        ////////////////////////////////////
        //封面
        handlersuccess(res){
            this.addTableData.fileId = res.data.id 
        },
        beforeAvatarUpload(){
            this.showUserImg = false
        },
        handleRemove(){
            this.showUserImg = true
           
        },
        handleDownloadTemplate() {
            this.$store.dispatch("common/templateDownloadAct",1).then(() => {

            }).catch(() => {

            })
        },
        handleClose(done) {
            done();
        },
        // 分页
        currentChange(current) {
            this.msg.size = this.allInfo.size
            this.msg.current = current
            this.getData(this.msg)
        },
	},
		computed:{
		
		},
		components: {
            deleteModel,SelectTree
        },
}
</script>

<style>
   
    .mybtn:hover{
        color: #f38916 !important
    }
    .fileTip .el-upload__tip{
        display: inline-block;
        margin-left: 10px;
    }
  
    .time {
    font-size: 12px;
    color: #C0C4CC;
  }
  .nameInfo{
    font-size: 15px;
    overflow : hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .info{
    font-size: 12px;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 30px;
    color: #999;
    margin-top:4px
  }
  .bottom {
    margin: 6px 0;
    line-height: 18px;
  }

  .button {
    padding: 0;
    float: right;
  }
  .handle > div {
  	width: 50%;
  }
  .handle {
  	display: flex;
  	justify-content: space-between;
  }
  .image {
    width: 100%;
    height: 150px;
    display: block;
    cursor: pointer;
  }

  .clearfix:before, .clearfix:after {
      /* display: table; */
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
	.el-textarea__inner{
		min-height: 90px !important
	}
	/*.el-form-item{
		margin-bottom:22px !important
	}*/
	.el-table td, .el-table th{
		text-align: center
	}
	.search_right .el-input-group__append {
		background: #f38916;
		color: #ffffff;
	}
     .el-button--medium {
        padding: 8px 20px;
    }
    .search_right input{
         /* border-right: none; */
          height:32px
     }
      .search_right{
          max-width: 320px;
          position: relative;
     }
	.el-button {
		border-radius: 0;
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
	.myUpload .el-upload-list--picture-card .el-upload-list__item{
		width: 70px;
		height: 70px;
		border-radius: 12%;
		top: -15px;
		left: 90px;
	}
	.el-input-group__append {
        border: none;
    }
</style>