<template>
    <div class="wrapper">
        <el-row type="flex" justify="space-between">
            <el-col :span="4">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('system_manage:log:export')" size="medium" type="warning" style='background: #f38916;' @click="handleExportLog">导出</el-button>
                    <el-button v-if="handleButtonHash('system_manage:log:delete')" size="medium" style='border:1px solid #f38916;color: #f38916;' @click='deleteWQ'>删除</el-button>
                </div>
            </el-col>
            <el-col :span="20">
                <el-form :inline="true" :model="searchInfo" class="wq-form-inline">
                    <el-form-item label="日志日期" class="datetime-input">
                        <el-date-picker
                                v-model="searchInfo.params.dateTime"
                                type="datetimerange"
                                 class="search_right" 
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item> 
                    <el-form-item label="日志类型" style="margin-left:10px;">
                        <el-select v-model="searchInfo.params.type"
                         class="search_right" 
                                   placeholder="日志类型">
                            <el-option label="全部" :value="0"></el-option>
                            <el-option label="新增" :value="1"></el-option>
                            <el-option label="删除" :value="2"></el-option>
                            <el-option label="修改" :value="3"></el-option>
                            <el-option label="登录" :value="5"></el-option>

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
                            width="55"
                            :selectable="handleCheckBox">
                    </el-table-column>
                    <el-table-column
                            width="70"
                            type='index'
                            :index="indexNum"
                            label="序号">
                    </el-table-column>
                    <el-table-column
                            prop="acount"
                            label="账号">
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="姓名"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="日志类型"
                            show-overflow-tooltip
                            :formatter="handleLogType">
                    </el-table-column>
                    <el-table-column
                            prop="descInfo"
                            label="日志说明"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="remark"
                            label="操作详情"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="isSuccess"
                            label="操作结果"
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
                            <i @click="deleteWQ(scope.row)" class="el-icon-delete mybtn" style="color:#999;font-size:17px;cursor:pointer" v-if="scope.row.backups === 2 && 'system_manage:log:delete'" ></i>

                            <!-- <el-link type="info" :underline="false" v-if="scope.row.backups === 2 && 'system_manage:log:delete'" @click="deleteWQ(scope.row)">删除</el-link> -->
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
                        type: 0,
                        dateTime: []
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
                const logSearch = {
                    page: value.page,
                    params: {
                        type: value.params.type,
                        start: "",
                        end: ""
                    }
                }
                if(value.params.dateTime !== null && value.params.dateTime.length !== 0) {
                    logSearch.params.start = this.$moment(value.params.dateTime[0]).format("YYYY-MM-DD HH:mm:ss")
                    logSearch.params.end = this.$moment(value.params.dateTime[1]).format("YYYY-MM-DD HH:mm:ss")
                }

                this.$store.dispatch('systemLog/obtainLogList',logSearch)
                    .then(() => {
                        this.tableData  = this.$store.state.systemLog.logList
                        this.pages = this.$store.state.systemLog.logPage;
                        this.loading = false
                        console.log(this.tableData)
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

                        that.$store.dispatch('systemLog/deleteLogAct',ids)
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
                              //  that.deleteObj.deleteModel = false;
                                // that.$message({
                                //   message: '删除失败！',
                                //   type: "error",
                                //    center:"true",
                                // })
                            })
                    }
                }

            },
//		    搜索
            dataSearch() {
                console.log(this.searchInfo,"---------------------------------")
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
            handleExportLog() {
                let loading = this.$loading({target:document.querySelector(".wrapper"),fullscreen:false})
                const logSearch = {
                    type: this.searchInfo.params.type,
                    start: "",
                    end: ""
                }
                if(this.searchInfo.params.dateTime !== null && this.searchInfo.params.dateTime.length !== 0) {
                    logSearch.start = this.$moment(this.searchInfo.params.dateTime[0]).format("YYYY-MM-DD HH:mm:ss")
                    logSearch.end = this.$moment(this.searchInfo.params.dateTime[1]).format("YYYY-MM-DD HH:mm:ss")
                }

                this.$store.dispatch('systemLog/exportLogFile',logSearch)
                    .then(() => {
                        loading.close();
                    })
                    .catch(() => {
                        loading.close();
                    })
            },
            handleLogType(row,column,celValue,index) {
                switch (row.type) {
                    case 1:
                        return "新增"
                    case 2:
                        return "删除"
                    case 3:
                        return "修改"
                    case 4:
                        return "查询"
                    case 5:
                        return "登录"
                    default:
                        return "未知"
                }
            },
            handleCheckBox(row, index) {
                return row.backups === 2
            },
            initPages() {
                this.searchInfo.page = {current: 1,size: 10}
                this.pages.current = 1
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
    .el-button--medium {
        padding: 8px 20px;
    }
    ._search{
        padding: 9px 20px;
        margin-left: -11px;
     }
    .search_right input{
         /* border-right: none; */
        height:32px
     }
    .wq-form-inline {
        float: right;
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
     .el-button--medium {
        padding: 8px 20px;
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
     .el-table th>.cell{
        color:#4c4b4b !important
    }
    .el-table td, .el-table th{
		text-align: center
	}
    .el-tooltip__popper{
        max-width: 60% !important;
    }
    .datetime-input .el-date-editor .el-range-input {
        width: 59%;
    }
</style>