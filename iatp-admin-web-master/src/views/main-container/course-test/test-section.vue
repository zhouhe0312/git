<template>
    <div class="mainPart">
        <el-row>
            <el-col :span="24">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('course_experiment:experiment:chapter:add')" size="small"
                               type="warning" style='background: #f38916;' @click='showAdd("addSectioneForm")'>新增章节
                    </el-button>
                    <el-button v-if="handleButtonHash('course_experiment:experiment:chapter:edit')" size="small"
                               style='border:1px solid #f38916;color: #f38916;' @click='editTable("addSectioneForm")'>编辑章节
                    </el-button>
                    <el-button v-if="handleButtonHash('course_experiment:experiment:chapter:delete')" size="small"
                               style='border:1px solid #f38916;color: #f38916;' @click='delTable'>删除章节
                    </el-button>
                     <div @click="goBack" style="float:right;color: #f38916;cursor:pointer;font-size: 14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 80%;"> 
                        <i class="el-icon-d-arrow-right" style="margin:10px 10px 0 0;color:#f38916;font-size:14px"></i>
                        <span>当前实验：{{title}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row v-if="!getTreeList || getTreeList.length == 0 " style='margin-top: 22px;'>
            <el-col>
                <div style="margin:15% 0 0 42%">
                    <img src="@/assets/images/tip1.png">
                    <p style="color:#AFAFAF;font-size:14px;margin-left: -50px;">您还没有添加章节哦，请点击<span
                            style="color:#6A8BD1"> 新增章节 </span>按钮...</p>
                </div>
            </el-col>
        </el-row>
        <el-row v-else style='margin-top: 22px;'>
            <el-col :span="4">
                <GeminiScrollbar :autoshow="true" :forceGemini="true" class="myScroll" style="height:685px;">  
                    <el-tree
                        class="testTree"
                        :data="getTreeList"
                        @node-click="handleNodeClick"
                        :expand-on-click-node="false"
                        ref="tree"
                        node-key="id"
                        :indent="0"
                        :accordion="true"
                        :highlight-current="true"
                        :render-content="handleRenderContent"
                        :props="defaultProps">
                    </el-tree>
                </GeminiScrollbar>
            </el-col>
            <el-col :span="20" v-if="currNodeData.pid !== 0 && allNode.level == 2 "> <!--非父节点-->
                <div style="margin:0px 0px 10px 10px;width:99%;border:0.5px solid #E9ECF3"></div>
                <div style=" margin:0px 0px 80px 20px">
                    <div style="float:left">
                        <P style="font-weight:700;font-size:14px">
                            {{allNode.parent.label?allNode.parent.label:'根章节'}}</P>
                        <P style="color:#999;font-size:13px;margin-top:10px">
                            {{allNode.label?allNode.label:"暂无章节名称"}}</P>
                    </div>
                    <div style="float:right">
                        <el-button v-if="handleButtonHash('course_experiment:experiment:chapter:resource:add') && currNodeData.pid !=='0'"
                                   type="text" style="font-size:14px;margin-right:20px" @click="uploadFile('uploadFileForm')">
                            <i class="el-icon-upload" style="font-size:16px;color:#f38916;"></i>
                            <span style="color:#f38916;font-size:14px">上传文件</span>
                        </el-button>
                        <el-button v-if="handleButtonHash('course_experiment:experiment:chapter:resource:addTraining') && currNodeData.pid !=='0'"
                                   type="text" style="font-size:14px" @click="uploadTest('addTestForm')">
                            <i class="el-icon-circle-plus" style="color:#f38916;font-size:15px"></i>
                            <span style="color:#f38916;font-size:14px">添加实训</span>
                        </el-button>
                    </div>

                </div>

                <div v-if="allNode.level == 2 && currNodeData.pid !== 0 && tableData.length == 0" style="margin:15% 0px 0px 42%">
                    <img src="@/assets/images/tip1.png">
                    <p style="color:#AFAFAF;font-size:14px;margin-left: -80px;">您还没有上传内容哦，请点击<span
                            style="color:#6A8BD1"> 上传文件 / 添加实训 </span>按钮...</p>
                </div>

                <draggable v-if="allNode.level == 2 && currNodeData.pid !== 0 && tableData"  v-model="tableData" :move="_getdata" @update="datadragEnd">
                    <el-card v-for="(item, index) in tableData" :key="index" class="cardList">
                        <img v-if="item.type == 2 && item.fileExtensions == 'pdf'" src="@/assets/images/file_pdf.jpg"
                             style="width:32px;height:40px;margin: -9px -5px;" class="filePic"/>
                        <img v-if="item.type == 2 && item.fileExtensions == 'pptx' || item.fileExtensions == 'ppt'"
                             src="@/assets/images/file_ppt.jpg" style="width:32px;height:40px;margin: -9px -5px;"
                             class="filePic"/>
                        <img v-if="item.type == 2 && item.fileExtensions !== 'pdf' && item.fileExtensions !== 'pptx' && item.fileExtensions !== 'ppt'"
                             src="@/assets/images/file_video.jpg" style="width:32px;height:40px;margin: -9px -5px;"
                             class="filePic"/>
                        <img v-if="item.type == 3" src="@/assets/images/file_test.png"
                             style="width:32px;height:40px;margin: -9px -5px;" class="filePic"/>

                        <p class="fileName">{{item.resourceName}}</p>
                        <p v-if="item.type == 3" class="fileSize">文件类型：实训</p>
                        <p v-else class="fileSize">{{item.fileExtensions == 'pptx' || item.fileExtensions == 'ppt' ||
                            item.fileExtensions ==
                            'pdf'?"文件页数：":"视频秒数："}}{{item.resourceSize?item.resourceSize+(item.fileExtensions == 'pptx'
                            || item.fileExtensions == 'ppt' || item.fileExtensions == 'pdf'?"页":"秒"):`未知`}}</p>
                        <span style="float:right">
                            <span style=" font-size:12px; margin-right:45px;color:#999">{{item.createTime}}</span>
                            <i v-if="handleButtonHash('course_experiment:experiment:chapter:resource:edit')"
                               style="font-size:17px;color:#999;cursor:pointer;margin-right:10px"
                               @click="editFile(item,'uploadFileForm','addTestForm')" class="el-icon-edit-outline mybtn"></i>
                            <i v-if="handleButtonHash('course_experiment:experiment:chapter:resource:delete')"
                               style="font-size:17px;color:#999;cursor:pointer" @click="delFile(item)"
                               class="el-icon-delete mybtn"></i>
                        </span>
                    </el-card>
                </draggable>

            </el-col>
            <el-col :span="20" v-if="currNodeData.pid == 0 && allNode.level == 1 || isfirst">  <!-- 父节点-->
                <div style="margin:15% 0px 0px 42%">
                    <img src="@/assets/images/tip1.png" style="margin-top:1px">
                    <p v-if="currNodeData.children || isfirst" style="color:#AFAFAF;font-size:14px;margin-left: 17px;">请点击章节下的节点哦...</p>
                    <p v-else style="color:#AFAFAF;font-size:14px;margin-left: -17px;">请先在此章下创建节点并上传资源哦...</p>
                </div>
            </el-col>
        </el-row>

        <!-- 新增/修改章节 -->
        <el-dialog :close-on-click-modal="false" width="40%" :title="sectionTitle" :visible.sync="sectionVisible"
                   :before-close="handleClose">
            <el-form :model="addSectioneForm" ref="addSectioneForm" class="" label-width="90px"
                     :rules="addSectioneFormRules">
                <div style="margin-left:-40px;padding-left:22px;">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="所属章节" prop="pid">
                                <el-select popper-class="select-test" :disabled="isFather"  style="width: 100%;" placeholder="请选择所属章节"
                                           v-model="addSectioneForm.pid">
                                    <el-option v-for="item in getTreeFatList" :label="item.label" :key="item.id"
                                               :value="item.id">
                                        <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
                                              :title="item.label">{{ item.label }}</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="章节名称" prop="chapterName">
                                <el-input placeholder="请输入章节名称" v-model="addSectioneForm.chapterName">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="内容简介" prop="des">
                                <el-input type="textarea" v-model="addSectioneForm.des"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="sectionVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="getAdd('addSectioneForm')">确 定</el-button>
		  </span>
        </el-dialog>

        <!-- 新增/修章节下的文件 -->
        <el-dialog :close-on-click-modal="false" width="40%" :title="uploadFileTitle" :visible.sync="uploadFileVisible"
                   :before-close="handleClose">
           
            <el-form :model="uploadFileForm" ref="uploadFileForm" class="" label-width="90px"
                     :rules="uploadFileFormRules">
                <div style="margin-left:-40px;padding-left:22px;">
                    <el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item class="_type" label="内容类型" prop="resourceType">
                                    <el-radio-group v-model="uploadFileForm.resourceType" @change="handleUploadType" class="type">
                                        <el-radio :label="2">PPT</el-radio>
                                        <el-radio :label="3">PDF</el-radio>
                                        <el-radio :label="1">视频</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-col :span="24" style="margin:0px 0 18px 20px">
                            <el-upload
                                    class="_upload-demo2"
                                    name="file"
                                    ref="upload"
                                    :action="importCourseUrl"
                                    :headers="headers"
                                    highlight-curren="true"
                                    :accept="accept"
                                    :on-remove="handleCourseRemove"
                                    :before-remove="beforeCourseRemove"
                                    :beforeUpload="beforeFileUpload"
                                    :auto-upload="true"
                                    :multiple="false"
                                    :limit="1"
                                    :on-exceed="handleCourseExceed"
                                    :on-success="handleImportSuccess"
                                    :on-error="handleImportError"
                                    :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" style="font-size:12px;color:#666" class="el-upload__tip">只能上传ppt、 pptx、 pdf、 mp4类型的文件</div>
                            </el-upload>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="文件名称" prop="resourceName" class="_input">
                                <el-input placeholder="请输入文件名称" v-model="uploadFileForm.resourceName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item  class="_input" :label="uploadFileForm.resourceType !== 1?'文件页数':'视频秒数'" prop="resourceSize">
                                <el-input placeholder="" :disabled="true" onkeyup="value=value.replace(/[^\d]/g,'')"
                                          onblur="value=value.replace(/[^\d]/g,'')"
                                          v-model="uploadFileForm.resourceSize"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                   
                    <!-- <el-row>
                         <el-col :span="24">
                             <el-form-item label="默认打开" prop="defaults">
                                 <el-switch
                                     v-model="defaSwitch"
                                     active-color="#f38916"
                                     inactive-color="#ccc">
                                 </el-switch>
                             </el-form-item>
                         </el-col>
                     </el-row> -->
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="uploadFileVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="uploadFileAdd('uploadFileForm')">确 定</el-button>
		  </span>
        </el-dialog>

        <!-- 新增/修改实训 -->
        <el-dialog :close-on-click-modal="false" width="40%" :title="testTitle" :visible.sync="testVisible"
                   :before-close="handleClose">
            <el-form :model="addTestForm" ref="addTestForm" class="" label-width="90px" :rules="addTestFormRules">
                <div style="margin-left:-40px;padding-left:22px;">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="实训名" prop="resourceName">
                                <el-input placeholder="请输入实训名" v-model="addTestForm.resourceName">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="用户名" prop="username">
                                <el-input placeholder="请输入用户名" v-model="addTestForm.username">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="密码" prop="password">
                                <el-input placeholder="请输入密码" show-password v-model="addTestForm.password">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="IP地址" prop="ip">
                                <el-input placeholder="请输入IP地址" v-model="addTestForm.ip">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="端口" prop="port">
                                <el-input placeholder="请输入1~65535之间的正整数" :maxlength="5" onkeyup="value=value.replace(/[^\d]/g,'')"   
       onblur="value=value.replace(/[^\d]/g,'')" v-model="addTestForm.port">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="服务端口" prop="servicePort">
                                <el-input placeholder="请输入1~65535之间的正整数" :maxlength="5" onkeyup="value=value.replace(/[^\d]/g,'')"   
       onblur="value=value.replace(/[^\d]/g,'')"  v-model="addTestForm.servicePort">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="testVisible = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="AddTest('addTestForm')">确 定</el-button>
		  </span>
        </el-dialog>

        <!-- 删除弹层 -->
        <deleteModel :deleteObj="deleteObj"></deleteModel>

    </div>
</template>

<script>
    import draggable from 'vuedraggable'
    import deleteModel from "@/components/deleteModel";
    import {addSectioneFormRules, uploadFileFormRules, addTestFormRules} from '@/util/rules'
    import {getValue} from "@/util/localStorage";
    import { constants } from '@/util/common'

    export default {
        data() {
            return {
                isfirst:true,
                title: '',
                importCourseUrl: process.env.VUE_APP_BASE_API + "/fileserver/file/upload",
                fileList: [],//上传文件
                currFile: [],
                headers: {},
                propsData: {},
                testVisible: false,//实训弹框
                sectionVisible: false,//章节弹框
                uploadFileVisible: false,//上传文件弹框
                sectionTitle: "新增章节",
                testTitle: "添加实训",
                addSectioneForm: {  //章节表单
                    type: 2,//1课程2 实验
                    courseId: '',//上级携带过来的实验id
                    chapterName: "",
                    pid: "",
                    des: "",
                },
                initnNode: false,
                getTreeList: [],//章节树列表
                getTreeFatList: [],
                loading: false,
                uploadFileTitle: "上传文件",
                treeId: "",//获取表格所需父级菜单id
                allNode: {},//当前被点击章节node(包含父级)
                currNodeData: {},//当前被点击章节的内容
                isFather:false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                defaSwitch: true,
                uploadFileForm: {  //上传文件表单数据
                    type: 2,//1 课程 ，2实验 ，3实训
                    defaults: 1,//1默认打开，2否
                    courseId: 0, //课程实验id
                    chapterPid: 0, //章节id
                    chapterId: 0,//小节id
                    resourceName: "",//文件名称
                    resourceSize: "",//文件大小：视频秒，文件页数
                    resourceType: 2,//文件类型，1：视频，2：ppt，3：pdf，4:实训
                    fileId: 0,//文件上传后的id 
                    fileExtensions: ""//文件上传后的文件类型
                },
                tableData: [],
                msg: {
                    chapterId: "",
                    chapterPid: ""
                },
                data: {
                    courseId: "",
                    type: 2 //课程1，实验2
                },
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                },
                currId: "",//自身id
                oldId: "",//上一个
                newId: "",//下一个
                addTestForm: {   //实训表单数据
                    type: 3,//1 课程 ，2实验 ，3实训
                    resourceType: 4,//文件类型，1：视频，2：ppt，3：pdf，4:实训

                    courseId: 0,//实验id
                    chapterPid: 0,//章节id
                    chapterId: 0,//小节id

                    resourceName: "",//实训名
                    username: "",
                    password: "",
                    ip: "",
                    port: "",
                    servicePort: ""
                },
                addSectioneFormRules: addSectioneFormRules,
                uploadFileFormRules: uploadFileFormRules,
                addTestFormRules: addTestFormRules,
                accept: constants.uploadFileTypes["2"]
            }
        },
        mounted() {
            this.headers = {"Authorization": getValue("token")}
            var obj = localStorage.getItem('JUMPCOURSETESTDATA')
            this.propsData = JSON.parse(obj)
            this.data.courseId = JSON.parse(obj).id
            this.title = JSON.parse(obj).courseName
            this.getTree(this.data)
        },
        methods: {
            handleUploadType(type) {
                this.accept = constants.uploadFileTypes[type+""]
            },
            _getdata(evt) {
                //this.draggedId = evt.draggedContext.element.id
                //console.log(evt)
            },
            datadragEnd(evt) {
                let tableData = this.tableData;
                for (var a = 0; a < tableData.length; a++) {
                    if (a == evt.newIndex - 1) {
                        this.oldId = tableData[a].id
                    }
                    if (a == evt.newIndex) {
                        this.currId = tableData[a].id
                    }
                    if (a == evt.newIndex + 1) {
                        this.newId = tableData[a].id
                    }
                }
                if (evt.newIndex == 0) {
                    this.oldId = 0
                }
                if (evt.newIndex == tableData.length - 1) {
                    this.newId = 0
                }
                var val = {
                    'id': this.currId,
                    'nextId': this.newId,
                    'prevId': this.oldId
                }
                // console.log(val)
                this.$store.dispatch('courseSection/toDatadragData', val)
                    .then((response) => {
                        this.$message({
                            message: response.message,
                            type: 'success',
                            center: "true",
                            duration: 1 * 1000
                        });
                        var msg = {
                            chapterId: this.currNodeData.id,
                            chapterPid: this.currNodeData.pid
                        }
                        this.getData(msg)
                    })
                    .catch(() => {
                    })
            },

            goBack() {
                this.$router.push({
                    path: "/index/test-manage",
                });
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

            // 获取表格数据
            getData(val) {
                this.loading = true;
                this.$store.dispatch('courseSection/getAllNodeData', val)
                    .then(() => {
                        this.tableData = this.$store.state.courseSection.nodeData;
                        console.log(this.tableData, 'nodeData')
                        this.loading = false
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
            //获取章节树
            getTree(val) {
                const that = this
                this.$store.dispatch('courseSection/getSectionTree', val)
                    .then(() => {
                        that.getTreeList = that.$store.state.courseSection.treeData[0].children;
                        let arr = JSON.parse(JSON.stringify(that.$store.state.courseSection.treeData[0].children)) || []
                        arr.unshift({
                            id: '0',
                            label: "根章节",
                            pid: '-1'
                        })
                        that.getTreeFatList = arr
                        // console.log(this.getTreeList,'--')
                        //  var obj = this.getTreeList[0].children[0]
                        //  this.msg = {
                        //    chapterId:obj.id,
                        //   chapterPid:obj.pid
                        // }
                        // this.getData(this.msg)
                    })
                    .catch(() => {

                    })

            },
            //添加实训弹框
            uploadTest(formName) {
                this.addTestForm = {   //实训表单数据
                    type: 3,//1 课程 ，2实验 ，3实训
                    resourceType: 4,//文件类型，1：视频，2：ppt，3：pdf，4:实训
                    courseId: this.propsData.id,//实验id                    
                    chapterPid: this.currNodeData.pid,//章节id                 
                    chapterId: this.currNodeData.id,//小节id                   
                    resourceName: "",//实训名
                    username: "",
                    password: "",
                    ip: "",
                    port: "",
                    servicePort: ""
                },
                this.testTitle = "添加实训"
                this.testVisible = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                },10)
            },
            //新增章节弹框
            showAdd(formName) {
                this.addSectioneForm = {
                    type: 2,//1课程2 实验
                    courseId: this.propsData.id,
                    chapterName: "",
                    pid: "",
                    des: "",
                },
                this.sectionTitle = "新增章节"
                this.isFather = false
                this.sectionVisible = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                },10)
            },

            //点击编辑弹框
            editTable(formName) {
                if (!this.currNodeData.id) {
                    this.$message({
                        message: '请选择要编辑的章节！',
                        type: 'warning',
                        center: "true",
                    });
                    return
                } else {
                    this.sectionTitle = "编辑章节"
                    this.isFather = true
                    this.sectionVisible = true
                    setTimeout(()=>{
                        this.$refs[formName].resetFields();
                        this.addSectioneForm = {
                            type: 2,//1课程2 实验
                            courseId: this.propsData.id,
                            chapterName: this.currNodeData.label ? this.currNodeData.label : '',
                            pid: this.currNodeData.pid ? this.currNodeData.pid : "",
                            des: this.currNodeData.desc ? this.currNodeData.desc : "",

                        }
                    },10)

                }
            },
            //新增/修改实训
            AddTest(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var param = ''
                        var val = {
                            ...this.addTestForm,
                        }
                        if (this.testTitle === "添加实训") {
                            param = 'courseSection/toAddTestData'
                        } else {
                            param = 'courseSection/toEditTestData'
                        }
                        console.log(val, '~#~#~')
                        this.$store.dispatch(param, val)
                            .then((response) => {
                                this.testVisible = false
                                var msg = {
                                    chapterId: this.currNodeData.id,
                                    chapterPid: this.currNodeData.pid
                                }
                                this.getData(msg)
                                this.loading = false
                                this.$message({
                                    message: response.message,
                                    type: "success",
                                    center: "true",
                                    duration: 3 * 1000
                                })
                            })
                            .catch((error) => {
                               // this.testVisible = false
                            })
                    } else {
                        this.$message({
                            message: '请检查填写内容',
                            type: "warning",
                            center: "true",
                        })
                    }
                });
            },
            // 新增/修改章节
            getAdd(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var param = ''
                        if (this.sectionTitle === "新增章节") {
                            var val = {
                                ...this.addSectioneForm,
                            }
                            param = 'courseSection/tableDataAdd'
                        } else {
                            var val = {
                                ...this.addSectioneForm,
                                id: this.treeId,
                            }
                            param = 'courseSection/editDataOne'
                        }
                        console.log(val, '~#~#~')

                        this.$store.dispatch(param, val)
                            .then((response) => {
                                this.sectionVisible = false
                                this.data = {
                                    courseId: this.propsData.id,
                                    type: 2 //课程1，实验2
                                }
                                this.getTree(this.data)
                                this.$message({
                                    message: response.message,
                                    type: "success",
                                    center: "true",
                                    duration: 3 * 1000
                                })
                            })
                            .catch((error) => {
                                //this.sectionVisible = false
                            })
                    } else {
                        this.$message({
                            message: '请检查填写内容',
                            type: "warning",
                            center: "true",
                        });
                    }
                });
            },
            //删除章节
            delTable() {
                let that = this
                if (that.treeId == "") {
                    that.$message({
                        message: '请选择要删除的章节！',
                        type: 'warning',
                        center: "true",
                    });
                    return
                } else {
                    that.deleteObj.deleteModel = true;
                }
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        var id = that.treeId
                        console.log(id)
                        await that.$store.dispatch('courseSection/tableDataDelOne', id)
                            .then((response) => {
                                // var msg = {
                                //     chapterId:that.currNodeData.id,
                                //     chapterPid:that.currNodeData.pid,
                                // }
                                that.deleteObj.deleteModel = false;
                                that.$message({
                                    message: response.message,
                                    type: "success",
                                    center: "true",
                                    duration: 3 * 1000
                                })
                                // that.getData(msg)
                                that.data = {
                                    courseId: that.propsData.id,
                                    type: 2 //课程1，实验2
                                }
                                that.getTree(that.data)
                                // that.loading = false
                            })
                            .catch((error) => {
                               // that.deleteObj.deleteModel = false;
                            })
                    }
                }
            },
            handleNodeClick(data) {
                this.isfirst = false
                this.isFather = false
                this.initnNode = true
                this.allNode = this.$refs.tree.currentNode.node;
                console.log(this.allNode, data, '当前节点信息')
                this.treeId = data.id
                this.currNodeData = data
                if (!data.children) {
                    this.msg = {
                        chapterId: data.id,
                        chapterPid: data.pid
                    }
                    this.getData(this.msg)
                }
                if(data.pid == 0){
                    this.isFather = true
                }else{
                    this.isFather = false
                }
            },
            //新增文件弹框
            uploadFile(formName) {
                this.uploadFileForm = { //上传文件表单数据
                    type: 2,//1 课程 ，2实验 ，3实训
                    defaults: 1,//1默认打开，2否 
                    courseId: this.propsData.id, //课程实验id
                    chapterPid: this.currNodeData.pid, //章节id
                    chapterId: this.currNodeData.id,//小节id
                    resourceName: "",//文件名称
                    resourceSize: "",//文件大小：视频秒，文件页数
                    resourceType: 2,//文件类型，1：视频，2：ppt，3：pdf，4:实训
                    fileId: 0,//文件上传后的id
                    fileExtensions: ""
                }
                this.fileList = []
                this.uploadFileTitle = "上传文件"
                this.accept = constants.uploadFileTypes["2"]
                this.uploadFileVisible = true
                setTimeout(()=>{
                    this.$refs[formName].resetFields();
                },10)
            },
            //新增/修改文件保存
            uploadFileAdd(name) {
                this.$refs[name].validate((valid) => {
                    if (this.uploadFileForm.fileId == 0) {
                        this.$message({
                            message: '请上传文件',
                            type: "warning",
                            center: "true",
                        })
                        return
                    }
                    var checked = ''
                    if(this.uploadFileForm.resourceType == 1){
                        if(this.uploadFileForm.fileExtensions == 'mp4'){
                             checked = 'mp4'
                        }else if(this.uploadFileForm.fileExtensions == 'flv'){
                             checked = 'flv'
                        }
                    }else if(this.uploadFileForm.resourceType == 2){
                        if(this.uploadFileForm.fileExtensions == 'ppt'){
                             checked = 'ppt'
                        }else if(this.uploadFileForm.fileExtensions == 'pptx'){
                             checked = 'pptx'
                        }
                    }else if(this.uploadFileForm.resourceType == 3){
                        checked = 'pdf'
                    }
                    if (this.uploadFileForm.fileExtensions !== checked) {
                        this.$message({
                            message: '上传的文件类型与勾选的内容类型不符！',
                            type: 'warning',
                            center: "true",
                        });
                        return
                    }
                    if (valid) {
                        var param = ''
                        var val = {
                            ...this.uploadFileForm,
                        }
                        if (this.uploadFileTitle === "上传文件") {
                            this.defaSwitch == true ? val.defaults = 1 : val.defaults = 2
                            param = 'courseSection/addFileToUp'
                        } else {
                            param = 'courseSection/editFileToUp'
                        }
                        //console.log(val, '~#~#~')
                        this.$store.dispatch(param, val)
                            .then((response) => {
                                this.uploadFileVisible = false
                                var msg = {
                                    chapterId: this.currNodeData.id,
                                    chapterPid: this.currNodeData.pid
                                }
                                this.getData(msg)
                                this.loading = false
                                this.$message({
                                    message: response.message,
                                    type: "success",
                                    center: "true",
                                    duration: 3 * 1000
                                })
                            })
                            .catch((error) => {
                                // this.$message({
                                //     message: error,
                                //     type: "error",
                                //     center:"true",
                                //     duration: 3 * 1000
                                // });
                            })
                    } else {
                        this.$message({
                            message: '请检查填写内容',
                            type: "warning",
                            center: "true",
                        })
                    }
                });
            },

            //编辑文件/实训弹框
            editFile(item,formName,formName2) {
                //console.log(item, '-----item-----')
                if (item.type == 2) {
                    this.fileList = []
                    this.uploadFileTitle = "编辑文件"
                    this.accept = constants.uploadFileTypes[item.resourceType]
                    this.uploadFileVisible = true
                    setTimeout(()=>{
                        this.$refs[formName].resetFields();
                        this.uploadFileForm = {
                            type: 2,//1 课程 ，2实验 ，3实训
                            defaults: item.defaults ? item.defaults : 1,//1默认打开，2否
                            courseId: this.propsData.id ? this.propsData.id : 0, //课程实验id
                            chapterPid: item.chapterPid ? item.chapterPid : 0, //章节id
                            chapterId: item.chapterId ? item.chapterId : 0,//小节id
                            resourceName: item.resourceName ? item.resourceName : '',//文件名称
                            resourceSize: item.resourceSize ? item.resourceSize : '',//文件大小：视频秒，文件页数
                            resourceType: item.resourceType ? item.resourceType : 2,//文件类型，1：视频，2：ppt，3：pdf，4:实训
                            fileId: item.fileId ? item.fileId : 0,//文件上传后的id
                            fileExtensions: item.fileExtensions ? item.fileExtensions : "",
                            id: item.id
                        },
                        item.defaults == 1 ? this.defaSwitch = true : this.defaSwitch = false
                    },10)


                } else if (item.type == 3) {
                    this.testTitle = "编辑实训"
                    this.testVisible = true
                    setTimeout(()=>{
                        this.$refs[formName2].resetFields();
                        this.addTestForm = {   //实训表单数据
                            type: 3,//1 课程 ，2实验 ，3实训
                            resourceType: 4,//文件类型，1：视频，2：ppt，3：pdf，4:实训
                            courseId: this.propsData.id ? this.propsData.id : 0,//实验id
                            chapterPid: item.chapterPid ? item.chapterPid : 0, //章节id
                            chapterId: item.chapterId ? item.chapterId : 0,//小节id
                            resourceName: item.resourceName ? item.resourceName : "",
                            username: item.username ? item.username : "",
                            password: item.password ? item.password : "",
                            ip: item.ip ? item.ip : "",
                            port: item.port ? item.port : "",
                            servicePort: item.servicePort ? item.servicePort : "",
                            id: item.id
                        }
                    },10)
                }
                
            },
            //删除章节下的文件
            delFile(item) {
                console.log(item, '===')
                let that = this
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        var id = item.id
                        console.log(id)
                        await that.$store.dispatch('courseSection/DelOneFile', id)
                            .then((response) => {
                                that.deleteObj.deleteModel = false;
                                var msg = {
                                    chapterId: that.currNodeData.id,
                                    chapterPid: that.currNodeData.pid
                                }
                                that.getData(msg)
                                that.loading = false
                                that.$message({
                                    message: "删除成功！",
                                    type: "success",
                                    center: "true",
                                    duration: 3 * 1000
                                })
                            })
                            .catch((error) => {
                               // that.deleteObj.deleteModel = false;
                                // that.$message({
                                //         message: error,
                                //         type: "error",
                                //         center:"true",
                                //         duration: 3 * 1000
                                // });
                                that.loading = false
                            })
                    }
                }
            },
            handleCourseRemove(file, fileList) {
                this.uploadFileForm.fileId = 0
                this.uploadFileForm.fileExtensions = ""
                this.uploadFileForm.resourceSize = ""
            },
            beforeCourseRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },

            handleCourseExceed(files, fileList) {
                this.$message({
                    message: "当前限制选择 1 个文件！",
                    type: "warning",
                    center: "true",
                    duration: 3 * 1000
                })
            },
            handleImportSuccess(response, file, fileList) {
                this.uploadFileForm.fileId = response.data.id
                this.uploadFileForm.fileExtensions = response.data.type
                this.uploadFileForm.resourceSize = response.data.length
            },
            handleImportError(err, file, fileList) {
                const msg = JSON.parse(err.message).message || "上传失败"
                this.$message({
                    message: msg,
                    type: "error",
                    center: "true",
                })
            },
            handleRenderContent(h, {node, data, store}) {
                return (
                    <span class= "custom-tree-node"
                title = {node.label} > {node.label} </span>
            )
                ;
            },
            beforeFileUpload(file) {
                //console.log(file)
            },


            handleClose(done) {
                done();
            },
        },
        computed: {},
        components: {
            deleteModel, draggable
        },
    }
</script>

<style>
    .el-upload-list__item .el-icon-close-tip{
        visibility: hidden !important
    }
    ._type{
        margin-bottom:5px
    }
    .mybtn:hover {
        color: #f38916 !important
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
    .testTree{
        border:1px solid #ebebed
    }
    .testTree .el-tree-node.is-expanded .el-tree-node__children .custom-tree-node{
        padding-left: 18px !important;
        font-size:14px !important
    }
    .testTree .el-tree-node__content {
        padding: 3px 0px
    }

    .testTree .custom-tree-node {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .select-test .el-select-dropdown__list {
        max-width: 500px;
        min-width: 300px;
    }
     ._upload-demo2 .el-upload-list__item.is-success:active,._upload-demo2 .el-upload-list__item.is-success.focusing{
        outline-width: 0 !important
    }
    ._upload-demo2 .el-upload--text {
        display: inline-block
    }

    ._upload-demo2 .el-upload-list {
        display: inline-block;
        padding-left: 92px;
        position: absolute;
        top: 38px
    }
    ._upload-demo2 .el-upload-list {
        max-width: 70%;
    }
    .treecard .el-card__body {
        padding: 10px
    }

    .type .el-radio__input.is-checked .el-radio__inner {
        border-color: #f38916;
        background: #f38916;
    }

    .type .el-radio__input.is-checked + .el-radio__label {
        color: #f38916;
    }

    .fileSize {
        float: left;
        font-size: 12px;
        color: #999;
        display: inline-block;
        position: absolute;
        top: 35px;
        left: 62px;
    }

    .fileName {
        display: inline-block;
        position: relative;
        top: -13px;
        left: 20px;
        font-size: 15px;
        max-width: 68%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .cardList {
        position: relative;
        margin: 10px 0px 10px 10px;
        height: 60px;
        border: 1px solid #ebebed;
        clear: both
    }

    .cardList .el-card__body:hover {
        background: #F0F7FF
    }

    .el-textarea__inner {
        min-height: 90px !important
    }

    ._input{
        margin-bottom:22px !important
    } 
    .el-table td, .el-table th {
        text-align: center
    }

    .search_right .el-input-group__append {
        background: #f38916;
        color: #ffffff;
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

    .el-pagination.is-background .el-pager li, .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next {
        border: 1px solid #f38916;
        border-radius: 0;
        background: white;
    }

    .el-icon-more {
        margin-left: 15px;
    }
    .el-button--medium {
        padding: 8px 20px;
    }
    .el-dialog__header {
        border-bottom: 2px solid #f38916;
    }

    .el-dialog__footer {
        text-align: center;
    }

    .el-button--primary, .el-button--primary:hover {
        background: #f38916;
        border: none;
    }

    .el-button--default, .el-button--default:hover {
        color: black;
        border: 1px solid #DCDFE6;
        background: white;
    }

    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        color: #f38916
    }
    
</style>