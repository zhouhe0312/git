<template>
    <div class="mainPart">
        <el-row style='margin-top: 0px;'>
            <el-col :span="4">
                <div style="margin-bottom:10px">
                    <el-input class="mySearch" placeholder="请输入名称" clearable v-model="searchInput" @keyup.enter.native='dataSearch'>
                        <el-button slot="append" icon="el-icon-search" style="color:#fff;background:#F38916" @click='dataSearch'>搜索</el-button>
                    </el-input>
                </div>
                <GeminiScrollbar :autoshow="true" :forceGemini="true" class="myScroll" style="height:685px;">  
                    <el-tree
                        style="border:1px solid #ebebed;"
                        class="knowTree"
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        :default-expand-all="false"
                        ref="tree"
                        :load="handleLoad"
                        lazy
                        accordion
                        :filter-node-method="filterNode"
                        highlight-current
                        :props="defaultProps">
                    </el-tree>
                </GeminiScrollbar>
            </el-col>
            <el-col :span="20">
                <el-table
                        class="myTable1"
                        v-if="showPage == '1'"
                        highlight-current-row
                        ref="multipleTable"
                        :data="tableData"
                        :header-cell-style="{background:'#e9ecf3'}"
                        tooltip-effect="dark"
                        style="width: 98%;float:right"
                        show-header
                        stripe
                        @row-click="handleRowClick"
                        v-loading="loading"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            min-width="100"
                            :show-overflow-tooltip="true"
                            prop="name"
                            label="名称">
                    </el-table-column>
                    <el-table-column
                            prop="summary"
                            label="摘要"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="version"
                            label="文号"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="issued"
                            label="发布单位"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="releaseDate"
                            label="发布日期"
                            width="100">
                    </el-table-column>
                </el-table>

                <div v-else-if="showPage == '2'">
                    <div style="width:99%;height:110px;border:1px solid #EBEBED;margin-left:10px">
                        <div style="margin:6px 11px 0 11px">
                            <div style="width: 78%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;position: relative;top: 10px;">
                                <span style="font-weight:700;font-size:16px">{{menu2Data.name?menu2Data.name:"暂无名称"}}</span>
                            </div>
                            <el-button v-if="handleButtonHash('knowledge_manage:content:add')" size="medium"
                                       style='float:right;border:1px solid #f38916;color: #f38916;' @click="showAdd2('addTableData')">新增
                            </el-button>
                            <el-button v-if="handleButtonHash('knowledge_manage:content:import')" size="medium"
                                       type="warning" style='float:right;background: #f38916;margin-right:20px'
                                       @click='uploadAdd'>上传
                            </el-button>
                        </div>
                        <div style="clear:both;border-top:1px solid #EBEBED;margin-top:19px;padding:10px 0 0 10px">
                            <p style="font-size:14px;color:#999;overflow:hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
                                {{menu2Data.summary?menu2Data.summary:"暂无内容"}}</p>
                        </div>
                    </div>
                    <el-table
                            class="myTable2"
                            highlight-current-row
                            ref="multipleTable"
                            :data="menu2ContentData"
                            :header-cell-style="{background:'#e9ecf3'}"
                            tooltip-effect="dark"
                            style="width: 99%;float:right;margin-top:7px"
                            show-header
                            stripe
                            v-loading="loading"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                min-width="120" class="name" :show-overflow-tooltip="true"
                                prop="name"
                                label="章节">
                        </el-table-column>
                        <el-table-column
                                :show-overflow-tooltip="true"
                                prop="content"
                                label="内容"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="address"
                                label="操作"
                                show-overflow-tooltip>
                            <template slot-scope="scope">
                                <i v-if="handleButtonHash('knowledge_manage:content:edit')" 
                                   style="color:#999;font-size:16px;cursor:pointer;margin-right:15px" title="编辑"
                                   @click="editTable(scope.row,'addTableData')" class="el-icon-edit-outline mybtn"></i>
                                <i v-if="handleButtonHash('knowledge_manage:content:delete')"
                                   style=" color:#999;font-size:16px;cursor:pointer;margin-right:15px" title="删除"
                                   @click="delTable(scope.row)" class="el-icon-delete mybtn"></i>
                                <el-button v-if="handleButtonHash('knowledge_manage:content:picture')" type="text"
                                           style="color:#999;font-size:12px" @click="uploadPic(scope.row)">
                                    <i class="el-icon-newshangchuan mybtn" style="font-size:16px" title="上传图片"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div v-else-if="showPage == '3'">
                    <div style="width:99%;height:110px;border:1px solid #EBEBED;margin-left:10px">
                        <div style="margin:6px 11px 0 11px">
                            <div style="width: 78%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;position: relative;top: 10px;">
                                <span style="font-weight:700;font-size:16px">{{menu3Data.name?menu3Data.name:"暂无节点名称"}}</span>
                            </div>
                            <el-button v-if="handleButtonHash('knowledge_manage:content:edit')" size="medium"
                                       style='float:right;border:1px solid #f38916;color: #f38916;' @click="editData3('addTableData')">
                                编辑
                            </el-button>
                            <el-button v-if="handleButtonHash('knowledge_manage:content:add')" size="medium"
                                       type="warning" style='float:right;background: #f38916;margin-right:20px'
                                       @click="showAdd2('addTableData')">新增
                            </el-button>
                        </div>
                        <div style="clear:both;border-top:1px solid #EBEBED;margin-top:19px;padding:10px 0 0 10px">
                            <p style="font-size:14px;color:#999;overflow:hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
                                {{menu3Data.content?menu3Data.content:"暂无内容"}}</p>
                        </div>
                    </div>
                    <el-table
                            class="myTable2"
                            v-if="menu2ContentData.length !== 0"
                            highlight-current-row
                            ref="multipleTable"
                            :data="menu2ContentData"
                            :header-cell-style="{background:'#e9ecf3'}"
                            tooltip-effect="dark"
                            style="width: 99%;float:right;margin-top:7px"
                            show-header
                            stripe
                            v-loading="loading"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                prop="name"
                                label="章节">
                        </el-table-column>
                        <el-table-column
                                prop="content"
                                label="内容"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="address"
                                label="操作"
                                show-overflow-tooltip>
                            <template slot-scope="scope">
                                <i v-if="handleButtonHash('knowledge_manage:content:edit')" 
                                   style="color:#999;font-size:16px;cursor:pointer;margin-right:15px" title="编辑"
                                   @click="editTable(scope.row,'addTableData')" class="el-icon-edit-outline mybtn"></i>
                                <i v-if="handleButtonHash('knowledge_manage:content:delete')"
                                   style=" color:#999;font-size:16px;cursor:pointer;margin-right:15px" title="删除"
                                   @click="delTable(scope.row)" class="el-icon-delete mybtn"></i>
                                <el-button v-if="handleButtonHash('knowledge_manage:content:picture')" type="text"
                                           style="color:#999;font-size:12px" @click="uploadPic(scope.row)">
                                    <i class="el-icon-newshangchuan mybtn" style="font-size:16px" title="上传图片"></i>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                 <el-row v-if="showPage == '1'">
                    <el-col>
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :total="Number(knowAllInfo.total)"
                                :size="Number(knowAllInfo.size)"
                                @current-change="currentChange"
                        >
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>

       
        <!-- 右侧折叠边栏 -->
        <el-dialog width="550px" title="详细信息" :visible.sync="dialogViewVisible" custom-class="custom-dialog" top="0"
                   :before-close="handleClose">
            <el-row class="details-row" :gutter="15">
                <el-col :span="4"><b>名称</b></el-col>
                <el-col :span="20">{{rightMenuData.name}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>摘要</b></el-col>
                <el-col :span="20">{{rightMenuData.summary}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>文号</b></el-col>
                <el-col :span="20">{{rightMenuData.version}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>状态</b></el-col>
                <el-col :span="20">{{handleStatus(rightMenuData)}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>发布日期</b></el-col>
                <el-col :span="20">{{rightMenuData.releaseDate}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>发布单位</b></el-col>
                <el-col :span="20">{{rightMenuData.issued}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>关键词</b></el-col>
                <el-col :span="20">{{rightMenuData.keyword}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>类别</b></el-col>
                <el-col :span="20">{{handleCategory(rightMenuData.category)}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>

                <el-col :span="4"><b>小类</b></el-col>
                <el-col :span="20">{{handleClasses(rightMenuData.classes)}}</el-col>
                <el-col :span="24">
                    <el-divider></el-divider>
                </el-col>
            </el-row>
        </el-dialog>

        <!-- 新增/编辑 -->
        <el-dialog :close-on-click-modal="false" width="40%" :title="diaTitle" :visible.sync="dialogVisible"
                   :before-close="handleClose">
            <el-form :model="addTableData" ref="addTableData" class="" label-width="90px" :rules="menu2Rules">

                <div style="margin-left:-40px;padding-left:22px;">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="章节" prop="name">
                                <el-input placeholder="请输入章节名称" v-model="addTableData.name">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="内容" prop="content"> <!--:autosize="{ minRows: 1, maxRows: 4}" -->
                                <el-input type="textarea" placeholder="" v-model="addTableData.content">
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

        <!-- 上传文件 -->
        <el-dialog :close-on-click-modal="false" width="40%" title="上传文件" :visible.sync="toUpLoad"
                   :before-close="handleClose">
            <el-form class="" label-width="90px">
                <div style="margin-left:-15px">
                    <el-row>
                        <el-col :span="24" style="margin-left:15px">
                            <el-upload
                                    class="kenowfileTip"
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
                                    :data="myUploadData"
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

        <!-- 上传图片 -->
        <el-dialog :close-on-click-modal="false" width="40%" title="上传图片" :visible.sync="showUploadPic"
                   :before-close="handleClose">
            <el-row>
                <el-col :span="24" >
                    <el-upload class="_uploadPic" :multiple="false " ref="uploadPic" :action='uploadUrl'  :on-success="handlersuccess"  :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit='1'  list-type='picture-card' :headers="headers" name="file">
                        <img v-if="showPic == true && previewPic == false" style="width:98px;height:98px;border-radius:8px"  src="@/assets/images/pic.png" title="点击上传图片"> 
                        <img v-if="showPic == true && previewPic == true" style="width:98px;height:98px;border-radius:8px"  :src="previewUrl" title="点击更换图片" alt="">  
                    </el-upload>
                </el-col>
            </el-row>
		    <span slot="footer" class="dialog-footer">
		        <el-button size="medium" @click="uploadClose">取 消</el-button>
		        <el-button size="medium" type="primary" @click="handleUploaPicSave">确 定</el-button>
		    </span>
        </el-dialog>

        <!-- 删除弹层 -->
        <deleteModel :deleteObj="deleteObj"></deleteModel>

    </div>
</template>

<script>

    import deleteModel from "@/components/deleteModel";
    import {menu2Rules} from '@/util/rules'
    import {getValue} from "@/util/localStorage";
    import {constants} from '@/util/common'
import { setTimeout } from 'timers';

    export default {
        data() {
            return {
                importCourseUrl: process.env.VUE_APP_BASE_API + "/admin/base-knowledge-content/uploadContent",
                headers:{},
                previewUrl:"",//预览回显
                previewPic:false,
                myUploadData: {},//上传文件携带的信息
                uploadUrl: constants.uploadUrl,
                showPage: '1',
                diaTitle: '新增',
                loading: false,
                treeId: "",//获取表格所需父级菜单id
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                addTableData: {
                    name: "",
                    content: ""
                },
                multipleSelection: [],
                tableData: [],
                dialogVisible: false, //新增知识库内容
                searchInput: '', //搜索条件
                knowAllInfo: {},
                treeVal: {
                    name: "",
                    pid: ""
                },
                msg: {
                    name: '',
                    current: 1,
                    size: 10,
                },
                deleteObj:{
                    deleteModel:false,
                    prompt:"",
                    del:{}
                },
                menu2Data:{},
                isUpload:false,
                menu3Data:{},
                menu2ContentData:[],
                fileList :[],
                uploadDataId:"",//上传图片所点击行的id
                toUpLoad :false,
                showUploadPic:false,//上传图片
                currDeptId:'',//操作一栏选中的单条id
                uploadId:"",//上传图片id
                showPic:true,
                curLoading:false,
                dialogViewVisible: false,
                rightMenuData: {},//右侧折叠边栏
                menu2Rules: menu2Rules,
                categoryList: [
                    {label: '法律法规', value: 1},
                    {label: '标准', value: 2},
                    {label: '中国行业监管政策', value: 3},
                    {label: '组织规章制度', value: 4}
                ],
                classesList: [
                    {label: "国际法", value: 11},
                    {label: "区域组织法", value: 12},
                    {label: "区域组织法", value: 13},
                    {label: "国际标准", value: 21},
                    {label: "国际组织标准", value: 22},
                    {label: "区域组织标准", value: 23},
                    {label: "国家和地区标准", value: 24},
                    {label: "国家行业标准", value: 25},
                    {label: "企业标准", value: 26},
                    {label: "银保监会监管指引", value: 31},
                    {label: "证监会管理办法", value: 32},
                    {label: "证监会管理办法", value: 41},
                    {label: "风险管理制度", value: 42},
                    {label: "其他", value: 99}
                ],
            }
        },
        mounted() {
            this.headers = {"Authorization": getValue("token")}
            this.getData(this.msg)
        },
        methods: {
            handleDownloadTemplate() {
                this.$store.dispatch("common/templateDownloadAct",3).then(() => {
                }).catch(() => {
                })
            },
            handleButtonHash(btnKey) {
                const btns = this.$store.getters.buttons
                for (let key in btns) {
                    if (key === btnKey) {
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
                console.warn(val, '############')
                this.loading = true;
                this.$store.dispatch('knowConst/AllKnowData', val)
                    .then(() => {
                        this.tableData = this.$store.state.knowConst.knowAllTableData;
                        this.knowAllInfo = this.$store.state.knowConst.knowAllInfo;
                        this.loading = false
                        console.log(this.tableData, '知识库内容table')
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
            ////////////content/////////////////
            getMenu2TableData(pid) {
                console.log(pid, '############')
                this.loading = true;
                this.$store.dispatch('knowConst/getmenu2Content', pid)
                    .then(() => {
                        this.menu2ContentData = this.$store.state.knowConst.knowTableData;
                        this.loading = false
                        console.log(this.menu2ContentData, 'meneu2-content')
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
            getMenu2Data(id) {
                this.$store.dispatch('knowConst/getmenu2TableData', id)
                    .then(() => {
                        this.menu2Data = this.$store.state.knowConst.menu2TableData;
                        console.log(this.menu2Data, 'meneu2-top')
                    })
                    .catch(() => {
                    })
            },

            ////////////////////3级菜单头部//////////////////////
            getMenu3Data(id) {
                this.$store.dispatch('knowConst/getmenu3TableData', id)
                    .then(() => {
                        this.menu3Data = this.$store.state.knowConst.menu3TableData;
                        console.log(this.menu3Data, 'meneu3-top')
                    })
                    .catch(() => {
                    })
            },

            //懒加载树
            handleLoad(node, resolve) {
                let self = this;
                if (node.level === 0) {
                    this.treeVal = {
                        name: "" ,
                        pid: ""
                    }
                    this.$store.dispatch('knowConst/getAllKnowTree', this.treeVal)
                        .then(() => {
                            let treeData = []
                            this.$store.state.knowConst.knowData.forEach(e => {
                                treeData.push(e)
                            })
                            resolve(treeData);
                        })
                        .catch(() => {
                            resolve([]);
                        })
                } else if (node.level === 1) {
                    console.log(node.data.id, 'node')
                    this.treeVal = {
                        name: "",
                        pid: node.data.id
                    }
                    this.$store.dispatch('knowConst/getAllKnowTree', this.treeVal)
                        .then(() => {
                            let myList = [];
                            this.$store.state.knowConst.knowData[0].children.forEach(e => {
                                myList.push(e)
                            })
                            resolve(myList);
                        })
                        .catch(() => {
                            resolve([]);
                        })

                } else {
                    this.treeVal = {
                        name: "",
                        pid: node.data.id
                    }
                    this.$store.dispatch('knowConst/getAllKnowTree', this.treeVal)
                        .then(() => {
                            let myList = [];
                            console.log(this.$store.state.knowConst.knowData)
                            this.$store.state.knowConst.knowData.forEach(e => {
                                myList.push(e)
                            })
                            resolve(myList);
                        })
                        .catch(() => {
                            resolve([]);
                        })
                }
            },
            //树的搜索过滤
            filterNode(value, data, node) {
                if (!value) {
                    return true;
                }
                let level = node.level;
                let _array = [];
                this.getReturnNode(node, _array, value);
                let result = false;
                _array.forEach((item) => {
                    result = result || item;
                });
                return result;
            },
            getReturnNode(node, _array, value) {
                let isPass = node.data && node.data.label && node.data.label.indexOf(value) !== -1;
                isPass ? _array.push(isPass) : '';
                this.index++;
                if (!isPass && node.level !== 1 && node.parent) {
                    this.getReturnNode(node.parent, _array, value);
                }
            },
            //树节点切换
            handleNodeClick(data) {
                this.treeId = data.id
                console.log(data.id,'-id')
                if (data.pid === '-1') {
                    this.showPage = "1"
                    this.getData(this.msg)
                } else if (data.pid === '0') {
                    this.showPage = "2"
                    this.getMenu2Data(data.id)
                    this.getMenu2TableData(data.id)

                } else if (data.pid > 0) {
                    this.showPage = "3"
                    this.getMenu3Data(data.id)
                    this.getMenu2TableData(data.id)
                }
            },

            //3级编辑弹框-top 
            editData3(formName) {
                //console.log('--', this.menu3Data, this.treeId)
                this.diaTitle = "编辑"
                this.dialogVisible = true
                this.currDeptId = this.treeId
                this.curLoading = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                    this.addTableData = {
                        name: this.menu3Data.name ? this.menu3Data.name : "",
                        content: this.menu3Data.content ? this.menu3Data.content : "",
                    }
                 },10)
            },

            //2&3级新增弹框-top
            showAdd2(formName) {
                this.addTableData = {
                    name: "",
                    content: ""
                }
                this.diaTitle = "新增"
                this.dialogVisible = true
                setTimeout(()=>{
                     this.$refs[formName].resetFields();
                },10)
            },
            //2级菜单编辑弹框-content
            editTable(row,formName) {
               // console.log(row, '^^^^^')
                this.diaTitle = "编辑"
                this.dialogVisible = true
                this.currDeptId = row.id
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                    this.addTableData = {
                        name: row.name ? row.name : "",
                        content: row.content ? row.content : "",
                    }
                },10)
            },
            // 新增/修改提交-top
            getAdd(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var param = ''
                        if (this.diaTitle === "新增") {
                            var val = {
                                ...this.addTableData,
                                father: this.treeId
                            }
                            param = 'knowConst/tableMenu2Add'
                        } else {
                            var val = {
                                ...this.addTableData,
                                id: this.currDeptId,
                            }
                            param = 'knowConst/tableMenu2Edit'
                        }
                        this.$store.dispatch(param, val)
                            .then((response) => {
                                this.dialogVisible = false

                                if (this.curLoading === true) {
                                    this.getMenu3Data(this.treeId)
                                    this.curLoading = false
                                } else {
                                    this.getMenu2Data(this.treeId)
                                    this.getMenu2TableData(this.treeId)
                                }
                                this.$message({
                                    message: response.message,
                                    type: "success",
                                    center: 'true',
                                    duration: 3 * 1000
                                })
                                this.handleLoad()

                            })
                            .catch((error) => {
                               // this.dialogVisible = false
                                // this.$message({
                                //         message: error,
                                //         type: "error",
                                //center:'true',
                                //         duration: 3 * 1000
                                // });
                            })
                    } else {
                        this.$message({
                            message: '请检查填写内容',
                            type: "warning",
                            center: 'true',
                        })
                    }
                });
            },

            //删除单条
            delTable(row) {
                console.log(row)
                let that = this
                var showPage = that.showPage
                var id = row.father
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        var val = row.id
                        await that.$store.dispatch('knowConst/tableMenu2Del', val)
                            .then((response) => {
                                that.showPage = showPage
                                that.deleteObj.deleteModel = false;
                                that.$message({
                                    message: response.message,
                                    type: "success",
                                    center: 'true',
                                    duration: 3 * 1000
                                })
                                that.getMenu2Data(id)
                                that.getMenu2TableData(id)
                            })
                            .catch((response) => {
                                that.deleteObj.deleteModel = false;
                                // that.$message({
                                //         message: response.message,
                                //         type: "error",
                                //center:'true',
                                //         duration: 3 * 1000
                                // });
                            })
                    }
                }

            },
            //////////////////////折叠边栏//////////////////////////
            handleRowClick(row) {
                this.$store.dispatch('knowConst/getmenu2TableData', row.id)
                    .then(() => {
                        this.dialogViewVisible = true
                        this.rightMenuData = this.$store.state.knowConst.menu2TableData;
                        console.log(this.rightMenuData, '折叠边栏')
                    })
                    .catch(() => {
                    })
            },
            handleClasses(classess) {
                for (let c in this.classesList) {
                    if (this.classesList[c].value === Number(classess)) {
                        return this.classesList[c].label
                    }
                }
            },
            handleCategory(category) {
                for (let c in this.categoryList) {
                    if (this.categoryList[c].value === Number(category)) {
                        return this.categoryList[c].label
                    }
                }
            },
            //1 现行，2 废止，3 试行，0 禁用
            handleStatus(row, column, celValue, index) {
                if (row.status === 1) {
                    return "现行"
                } else if (row.status === 0) {
                    return "禁用"
                } else if (row.status === 2) {
                    return "废止"
                } else if (row.status === 3) {
                    return "试行"
                } else {
                    return "未知"
                }
            },

        //上传图片
        uploadPic(row){
            if(this.isUpload){
                this.$refs.uploadPic.clearFiles()
             }
            this.uploadDataId = row.id
            if(row.filename){
				this.previewUrl = constants.downloadUrl+row.filename//预览
                this.showPic = true
                this.previewPic = true
            }else{
                this.showPic = true
                this.previewPic = false
            }
            this.showUploadPic = true
        },

        handlersuccess(res){
            this.uploadId = res.data.id 
            this.isUpload = true
        },
        beforeAvatarUpload(){
            this.showPic = false
        },
        handleRemove(){
            this.showPic = true
        },
        uploadClose(){
            this.$refs.uploadPic.clearFiles()
            this.showPic = true
            this.showUploadPic = false
        },
        handleUploaPicSave() {
            var val = {
                filename:this.uploadId,
                id:this.uploadDataId
            }
            this.$store.dispatch('knowConst/toUploadPic',val)
                .then((response) => {
                    this.showUploadPic = false;
                    this.getMenu2TableData(this.treeId)
                    this.$message({
                            message:response.message,
                            type: "success",
                            center: 'true',
                            duration: 3 * 1000
                        })
                    })
                    .catch((error) => {
                       // this.showUploadPic = false;
                        // this.$message({
                        //         message: error,
                        //         type: "error",
                        //center:'true',
                        //         duration: 3 * 1000
                        // });
                    })
            },

            //搜索过滤树
            dataSearch() {
                this.msg.name = this.searchInput
                this.getData(this.msg)
                this.$refs.tree.filter(this.searchInput)
                // this.getData(this.searchInput)
            },
            //分页
            currentChange(current) {
                this.msg.size = this.knowAllInfo.size
                this.msg.current = current
                this.getData(this.msg)
            },
            //上传文件
            uploadAdd() {
                this.fileList = []
                this.toUpLoad = true
                this.myUploadData = {
                    infoId:this.treeId,
                }
            },
            handleExamImportSave() {
                if(this.$refs.upload.uploadFiles.length == 0) {
                    this.$message.warning("请选择要上传的文件")
                    return
                }

                this.$refs.upload.submit();
            },
            handleCourseRemove(file, fileList) {
                console.log(file, fileList);
            },
            beforeCourseRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },

            handleCourseExceed(files, fileList) {
                this.$message({
                    message: '当前限制选择 1 个文件！',
                    type: "warning",
                    center: 'true',
                });
            },
            handleImportSuccess(response, file, fileList) {
                this.toUpLoad = false
                this.getData(this.msg)
                this.$message({
                    message: response.message,
                    type: "success",
                    center: 'true',
                    duration: 3 * 1000
                });
            },
            handleImportError(err, file, fileList) {
                const msg = JSON.parse(err.message).message || "导入失败"
                this.$message({
                    message: msg,
                    type: "error",
                    center: 'true',
                });
            },

            handleClose(done) {
                done();
            },
        },
        computed: {},
        components: {
            deleteModel
        },
    }
</script>

<style>
    .mySearch .el-input__inner{
        height:35px !important;
        line-height: 35px !important;
        padding: 0 30px 0 7px !important;
    }
    .mySearch .el-input-group__append .el-button{
        padding:10px 20px
    }
    .kenowfileTip .el-upload__tip{
        display: inline-block;
        margin-left: 10px;
    }
    .myTable2 td{
        padding:4px;
    }
    .myTable2 td:nth-child(1){
        padding-left:10px
    }
    .myTable2 td:nth-child(1),.myTable2 td:nth-child(2){
        text-align: left !important
    }
    ._scrollbar .el-scrollbar__wrap{
        overflow: auto;
        margin-right: 0px !important;
    }
    .knowTree .el-tree-node__content {
        padding: 3px 0
    }
    .knowTree .el-tree-node__label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .myTable1 td:nth-child(1),.myTable1 td:nth-child(2),.myTable1 td:nth-child(3),.myTable1 td:nth-child(4){
        text-align: left !important
    }
    

    .details-row .el-col-4 {
        text-align: left;
    }

    .custom-dialog {
        position: fixed;
        margin: 0 auto 0px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        box-sizing: border-box;
        width: 50%;
        right: 0;
        top: 0;
        height: 100%;
    }

    .el-textarea__inner {
        min-height: 90px !important
    }
     .el-button--medium {
        padding: 8px 20px;
    }

    /* .el-form-item{
        margin-bottom:22px !important
    } */
    .el-table th > .cell {
        color: #4c4b4b
    }

    .el-table td, .el-table th {
       text-align: center
    }

    /* .el-table .el-table_2_column_6  {
        text-align: left;
        pading-left:20px
    } */
    .el-button {
        border-radius: 0;
    }
	
     /* .el-table .el-table_2_column_6  {
         text-align: left;
         pading-left:20px
     } */
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
	._uploadPic .el-upload--picture-card{
		width:0;
		height:0;
		border:0;
        margin-bottom:115px
	}
	._uploadPic .el-upload-list--picture-card .el-upload-list__item{
		width: 100px;
		height: 100px;
	}
    /* 高亮树节点 */
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        color: #f38916
    }

    .el-tooltip__popper {
        max-width: 60% !important;
    }
    .mybtn:hover{
        color: #f38916 !important;
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