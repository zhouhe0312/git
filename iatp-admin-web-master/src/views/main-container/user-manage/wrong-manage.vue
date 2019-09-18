<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-col :span="2">
                <div class="left_btn">
                    <el-button size="medium" v-if="handleButtonHash('user_management:wrong_questions:delete')" style='background:#f38916;color: #fff;' @click='deleteWQ'>删除</el-button>
                </div>
            </el-col>
            <el-col :span="22">
                <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="用户帐号">
                        <el-input v-model="searchInfo.params.userName"  @keyup.enter.native="dataSearch"  class="search_right"  clearable placeholder="请输入用户帐号"></el-input>
                    </el-form-item>
                    <el-form-item label="所属课程/实验" style="margin-left:10px;">
                        <el-select v-model="searchInfo.params.courseId"
                        class="search_right" 
                                   placeholder="所属课程/实验">
                            <el-option label="全部" :value="0"></el-option>
                            <el-option
                                    v-for="item in courseOptions"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属试卷" style="margin-left:10px;">
                        <el-select v-model="searchInfo.params.chapelTestId" placeholder="所属试卷" class="search_right">
                            <el-option label="全部" :value="0"></el-option>
                            <el-option
                                    v-for="item in chapelTestOptions"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="_search" icon="el-icon-search" @click="dataSearch">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row >
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
                            :index="indexNum"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="userName"
                            label="账号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="topicStem"
                            label="题干"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="courseName"
                            label="课程/实验"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="试卷名称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="topicAnswer"
                            label="选择选项"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="correctOption"
                            label="正确选项"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
                            label="创建时间"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="操作对象"
                            show-overflow-tooltip>
                        <template slot-scope="scope">
                            <i @click="deleteWQ(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer"  v-if="handleButtonHash('user_management:wrong_questions:delete')"></i>

                            <!-- <el-link type="info" v-if="handleButtonHash('user_management:wrong_questions:delete')" :underline="false" @click="deleteWQ(scope.row)">删除</el-link> -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col class="pagination">
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="Number(pages.total)"
                        :size="Number(pages.size)"
                        :current-page="Number(pages.current)"
                        @current-change = "currentChange"
                >
                </el-pagination>
            </el-col>
        </el-row>
        <delete-model :deleteObj="deleteObj"></delete-model>
    </div>
</template>

<script>
    import deleteModel from "@/components/deleteModel"

    export default {
        data() {
            return {
                loading:false,
                tableData: [],
                multipleSelection: [],
                indexNum: 1,
                courseOptions: [],
                chapelTestOptions:[],
                pages:{
                    total: 0,
                    size: 10,
                    current: 1
                },
                searchInfo:{
                    page: {
                        current: 1,
                        size: 10
                    },
                    params: {
                        courseId: 0,
                        chapelTestId: 0,
                        userName: ""
                    }
                },
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                }
            }
        },
        mounted() {
            this.getData(this.searchInfo)
            this.courseRemoteMethod()
            this.chapelTestRemoteMethod()
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
//		    获取表格数据
            getData(value) {
                this.loading = true
                this.$store.dispatch('user/obtainWrongQuestionsList',value)
                    .then(() => {
                        this.tableData  = this.$store.state.user.wrongQuestionsList
                        this.pages = this.$store.state.user.wrongQuestionsPage;
                        this.loading = false
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
//		    删除
            deleteWQ(row) {
                let that = this
                let ids = []
                if(row.id) {
                    ids.push(row.id)
                } else {
                    if(that.multipleSelection.length === 0) {
                        that.$message({
                            message: '请选择要删除的项！',
                            type: 'warning',
                            center:"true",
                        });
                        return
                    }
                    that.multipleSelection.map(val => {
                        ids.push(val.id)
                    })
                }
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {

                        that.$store.dispatch('user/deleteWrongQuestionsAct',ids)
                            .then(() => {
                                that.deleteObj.deleteModel = false;
                                // 消息提示
                                that.$message({
                                    message: '删除成功。',
                                    type: "success",
                                     center:"true",
                                    duration: 3 * 1000
                                })
                                that.initPages();
                                that.getData(that.searchInfo)
                                that.loading = false
                            })
                            .catch(() => {
                                that.loading = false
                               // that.deleteObj.deleteModel = false;
                            })
                    }
                }

            },
//		    搜索
            dataSearch() {
                this.initPages();
                this.getData(this.searchInfo)
            },
//		    分页
            currentChange(current) {
                this.searchInfo.page.size = this.pages.size
                this.searchInfo.page.current = current
                this.getData(this.searchInfo)
                this.indexNumber(current,this.pages.size)
            },
            //课程的拉取
            courseRemoteMethod() {
                this.$store.dispatch("user/obtainCourseKeyValueList").then(() => {
                    this.courseOptions = this.$store.state.user.courseKeyValueList
                    console.log('=============',this.courseOptions)
                }).catch(() => {

                })
            },
            //试卷的拉取
            chapelTestRemoteMethod() {
                this.$store.dispatch("user/obtainChapelTestKeyValueList").then(() => {
                    this.chapelTestOptions = this.$store.state.user.chapelTestKeyValueList
                }).catch(() => {

                })
            },
            initPages() {
                this.searchInfo.page = {current: 1,size: 10}
                this.pages.current = 1
                this.indexNumber(1,10)
            },
            indexNumber(current,size) {
                this.indexNum = (current - 1) * size + 1
            }
        },
        components:{
            deleteModel
        }
    }
</script>

<style >
    .mybtn:hover{
        color: #f38916 !important
    }
    .search_right input{
         /* border-right: none; */
        height:32px
     }
    ._search{
        padding: 9px 20px;
        margin-left: -2px;
     }
    .el-form--inline .el-form-item{
         margin-right: 0px
     }
    .wq-form-inline {
        float: right;
    }
     .el-button--medium {
        padding: 8px 20px;
    }
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
    .el-button {
        border-radius: 0;
    }
    .el-icon-more {
        margin-left: 15px;
    }
    /*.el-form-item {
        margin-bottom: 0;
    }*/
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
</style>