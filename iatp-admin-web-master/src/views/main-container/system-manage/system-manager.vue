<template>
    <div class="mainPart">
        <el-row>
            <el-col :span="12">
                <div class="left_btn">
                    <el-button v-if="handleButtonHash('system_manage:system:add')" size="medium" type="warning"
                               style='background: #f38916;' @click='showAdd("addTableData")'>新增
                    </el-button>
                    <el-button v-if="handleButtonHash('system_manage:system:delete')" size="medium"
                               style='border:1px solid #f38916;color: #f38916;' @click='getDelete'>删除
                    </el-button>
                </div>
            </el-col>
            <el-col :span="6" :offset='6'>
                <div class="search_right">
                    <el-input placeholder="请输入管理员"  @keyup.enter.native="dataSearch"  clearable  v-model="searchInput">
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
                            type='index'
                                    width="60"
                            label="序号">
                        <template slot-scope="scope">{{(allInfo.current - 1) * allInfo.size + scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="acount"
                            label="帐号">
                    </el-table-column>
                    <el-table-column
                            prop="nickname"
                            label="昵称"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="姓名"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="sex"
                            label="性别"
                            :formatter="function(row) {
									return row.sex == 1 ? '男':'女'
								}"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="deptName"
                            label="所属部门"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="手机号"
                            show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column 
                        prop="status"
                        label="状态" 
                        :formatter="handleStatus"
                        show-overflow-tooltip>
                        
                        <!-- <template slot-scope="scope"> -->
                            <!-- <el-switch
                                v-model="scope.row.status == '1'"
                                @change = "_changeStatus(scope.row)"
                                active-color="#f38916"
                                inactive-color="#bfbfbf">
                            </el-switch> -->

                            <!-- <el-link type="info" :underline="false" @click="_changeStatus(scope.row)">
                                <p v-if="scope.row.status == '1' && 'system_manage:system:disable'"
                                   style="color:#f38916">启用</p>
                                <p v-if="scope.row.status == '0' && 'system_manage:system:enable'" style="color:#999">
                                    禁用</p>
                            </el-link> -->
                        <!-- </template> -->

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
                            <el-link v-if="handleButtonHash('system_manage:system:role')" type="info" :underline="false"
                                     @click="asRole(scope.row)">分配角色
                            </el-link>
                            <el-dropdown :hide-on-click="false" @command="handleMore"
                                         v-if="handleButtonHash('system_manage:system:edit') || handleButtonHash('system_manage:system:delete') || handleButtonHash('system_manage:system:password')">
										<span class="el-dropdown-link">
											<i class="el-icon-more"></i>
										</span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item v-if="handleButtonHash('system_manage:system:edit')"
                                                      :command="{type:1,data:scope.row,form:'addTableData'}">编辑
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="handleButtonHash('system_manage:system:delete')" divided
                                                      :command="{type:2,data:scope.row}">删除
                                    </el-dropdown-item>
                                    <el-dropdown-item v-if="handleButtonHash('system_manage:system:password')" divided
                                                      :command="{type:3,data:scope.row.id,form:'restPassw'}">重置密码
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
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
                        @current-change="currentChange"
                >
                </el-pagination>
            </el-col>
        </el-row>

        <!-- 新增/编辑人员 -->
        <el-dialog :close-on-click-modal="false" width="50%" :title="diaTitle" :visible.sync="dialogVisible"
                   :before-close="handleClose">
            <el-form :model="addTableData" ref="addTableData" class="" label-width="90px" :rules="addFormRules">
                <div>
                    <p style="margin:0px 10px">头像</p>
                    <img v-if="showUserImg == true && previewPic == true"
                         style="position: absolute;top: 73px;left: 80px;width:42px;height:42px;border-radius:50%" :src="previewUrl"
                         alt="">
                    <img v-if="showUserImg == true && previewPic == false"
                         style="position: absolute;top: 73px;left: 80px;" src="@/assets/images/up_uesr.png" alt="">
                    <el-upload :action='avatarUrl' :file-list="picList" class="addManagerUpload" :on-success="handlersuccess" :on-remove="handleRemove"
                               :before-upload="beforeAvatarUpload" :limit='1' list-type='picture-card'
                               :headers="headers" name="file">
                        <p style="color:#F38A17;position:absolute;left:145px;top:24px;width:70px;height:0px">添加头像</p>
                    </el-upload>
                </div>

                <div style="margin-left:-40px;padding-right:15px;margin-top:5px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="username">
                                <el-input placeholder="请输入姓名" v-model="addTableData.username">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <el-select style="width: 100%;" placeholder="请选择性别" v-model="addTableData.sex">
                                    <el-option label="女" :value="0"></el-option>
                                    <el-option label="男" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="昵称" prop="nickname">
                                <el-input placeholder="请输入昵称" v-model="addTableData.nickname">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号" prop="phone">
                                <el-input placeholder="请输入手机号" onkeyup="value=value.replace(/[^\d]/g,'')"   
       onblur="value=value.replace(/[^\d]/g,'')" :maxlength="11" v-model="addTableData.phone">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="帐号" prop="acount">
                                <el-input placeholder="请输入账号" v-model="addTableData.acount">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="帐号状态" prop="status">
                                <el-select style="width: 100%;" placeholder="请选择帐号状态" v-model="addTableData.status">
                                    <el-option label="启用" :value="1"></el-option>
                                    <el-option label="禁用" :value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="diaTitle == '新增人员'">
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password">
                                <el-input placeholder="请输入密码" show-password v-model="addTableData.password">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="确认密码" prop="repeatPassword">
                                <el-input placeholder="请再次输入密码" show-password v-model="addTableData.repeatPassword">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="邮箱" prop="email">
                                <el-input placeholder="请输入邮箱" v-model="addTableData.email">
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属部门" prop="unitId">
                                <select-tree
                                        style="width: 100%;" placeholder="请选择所属部门"
                                        :props="props"
                                        :options="getTreeList"
                                        :clearable="isClearable"
                                        :accordion="isAccordion"
                                        :value="addTableData.unitId"
                                        @getValue="getValue($event)"
                                />
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

        <el-dialog
                :close-on-click-modal="false"
                title="分配角色"
                :visible.sync="userDialogVisible"
                width="40%"
                :before-close="handleClose">
            <div>
                <el-checkbox-group v-model="selectRoleList">
                    <el-checkbox v-for="item in getRoleList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </div>

            <span slot="footer" class="dialog-footer">
		    <el-button @click="userDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addRoleData">确 定</el-button>
		  </span>
        </el-dialog>

        <el-dialog
                :close-on-click-modal="false"
                title="重置密码"
                :visible.sync="pwDialogVisible"
                width="40%"
                :before-close="handleClose">

            <el-form :model="restPassw" ref="restPassw" class="" label-width="80px" :rules="resetPwdRules"
                     style="padding-right:10px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input placeholder="请输入新密码" show-password v-model="restPassw.newPassword">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="确认密码" prop="repPassword">
                            <el-input placeholder="请再次输入密码" show-password v-model="restPassw.repPassword">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <span slot="footer" class="dialog-footer">
		    <el-button @click="pwDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="commitPassword('restPassw')">确 定</el-button>
		  </span>
        </el-dialog>
    </div>
</template>

<script>

    import deleteModel from "@/components/deleteModel";
    import {getValue} from "@/util/localStorage";
    import SelectTree from '@/components/SelectTree'
    import {constants} from '@/util/common'
    import {memberRules, resetPwdRules} from '@/util/rules'
    import {memberAcountChecking} from '@/api/system-manager'//验证账户唯一性

    export default {
        data() {
            return {
                avatarUrl: constants.uploadUrl,
                diaTitle: '新增人员',
                loading: false,
                headers: {},
                props: {               // 配置项（必选）
                    value: 'id',
                    label: 'label',
                    children: 'children'
                },
                isClearable: true,     // 可清空（可选）
                isAccordion: true,     // 可收起（可选）
                addTableData: {
                    avatar: "",//头像上传接口成功后返回的id ，可为空
                    username: "",
                    sex: 1,
                    nickname: "",
                    phone: "",
                    acount: "",//账户
                    status: 1,//账户状态
                    password: "",
                    repeatPassword: "",
                    email: "",
                    unitId: "",//所属部门
                    type: "1", //1为管理员，2为c端用户
                    //	level: "0",//级别
                },
                picList:[],
                multipleSelection: [],
                tableData: [],
                dialogVisible: false, //新增人员
                userDialogVisible: false, //分配角色
                pwDialogVisible: false, //密码修改
                searchInput: '', //搜索条件
                showUserImg: true,//头像初始图
                allInfo: {},
                msg: {
                    acount: '',
                    current: 1,
                    size: 10
                },
                deleteObj: {
                    deleteModel: false,
                    prompt: "",
                    del: {}
                },
                selectRoleList: [],//选中的角色
                getRoleList: [],//获取角色列表
                currUserId: '',//操作一栏选中的单条用户id
                getTreeList: [],//部门树列表
                restPassw: { //改密码
                    newPassword: "",
                    repPassword: "",
                },
                resetPwdRules: resetPwdRules,
                addFormRules: {},
                previewPic: false,
                previewUrl: "",//预览回显
            }
        },
        mounted() {
            this.headers = {"Authorization": getValue("token")}
            memberRules.acount.push({validator: this.acountChecking, trigger: 'blur'})
            this.addFormRules = memberRules
            this.getData(this.msg)
            this.getRoleData()//获取角色列表
            this.getUnitTree()//获取部门树
        },
        methods: {
            acountChecking(rule, value, callback) {
                const acountAndId = {acount: value, id: this.currUserId}
                memberAcountChecking(acountAndId).then(response => {
                    callback();
                }).catch(error => {
                    callback(new Error(error));
                })
            },

            // _changeStatus(row) {
            //     this.loading = true;
            //     row.status == "1" ? row.status = "0" : row.status = "1"
            //     Object.assign(this.addTableData, row)
            //     var val = this.addTableData
            //     this.$store.dispatch('sysmanager/editDataOne', val)
            //         .then((response) => {
            //             this.getData(this.msg)
            //         })
            //         .catch((error) => {
            //             this.loading = false
            //         })
            // },
             handleStatus(row,column,celValue,index) {
                if(row.status === 1) {
                    return "启用"
                } else if(row.status === 0) {
                    return "禁用"
                } else if(row.status === 2){
                    return "锁定"
                }else if(row.status === 3){
                    return "密码被重置 "
                }else if(row.status === 4){
                    return "密码已过期"
                }
            },
            getValue(value) {
                this.addTableData.unitId = value
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
            getData(value) {
                this.loading = true;
                this.$store.dispatch('sysmanager/managerTableData', value)
                    .then(() => {
                        this.tableData = this.$store.state.sysmanager.tableData;
                        this.allInfo = this.$store.state.sysmanager.allInfo;
                        this.loading = false
                    })
                    .catch(() => {
                        this.loading = false
                    })
            },
            //获取部门树
            getUnitTree() {
                this.$store.dispatch('sysmanager/getUnitTree')
                    .then(() => {
                        this.getTreeList = this.$store.state.sysmanager.treeData[0].children;
                        //	console.log(this.getTreeList,'部门树列表')
                    })
                    .catch(() => {

                    })
            },
            //获取角色列表
            getRoleData() {
                this.$store.dispatch('sysmanager/getRoleData')
                    .then(() => {
                        this.getRoleList = this.$store.state.sysmanager.roleData;
                    })
                    .catch(() => {

                    })
            },
            //系统管理用户添加角色
            addRoleData() {
                let val = {
                    id: this.currUserId,
                    roleIds: this.selectRoleList.join(',')
                }
                //console.log(val)
                this.$store.dispatch('sysmanager/addRoleData', val)
                    .then((response) => {
                        this.userDialogVisible = false
                        this.$message({
                            message: response.message,
                            type: "success",
                            center: 'true',
                            duration: 3 * 1000
                        })
                        // console.log(response,'=!')
                    })
                    .catch((error) => {
                      //  this.userDialogVisible = false
                        //this.$message({
                        //		message: error,
                        //		type: "error",
                        //		center:'true',
                        //		duration: 3 * 1000
                        //});
                    })
            },

            handlersuccess(res) {
                this.addTableData.avatar = res.data.id
            },
            beforeAvatarUpload() {
                this.showUserImg = false
            },
            handleRemove() {
                this.showUserImg = true
            },
            showAdd(formName) {
                this.addTableData = {
                    avatar: "",
                    username: "",
                    sex: 1,
                    nickname: "",
                    phone: "",
                    acount: "",//账户
                    status: 1,//账户状态
                    password: "",
                    repeatPassword: "",
                    email: "",
                    unitId: "",//所属部门
                    type: "1", //1为管理员，2为c端用户
                    //	level: "0",//级别
                },
                this.getUnitTree()//获取部门树
                this.diaTitle = "新增人员"
                this.dialogVisible = true
                setTimeout(()=>{
                   this.$refs[formName].resetFields();
                },10)
            },

            //编辑
            editTable(row,command) {
                console.log('~~~~~编辑~~~~~~~~~~',row)
                this.$store.dispatch("sysmanager/getUnitTree").then(() => { //获取部门
                    this.getTreeList = this.$store.state.sysmanager.treeData[0].children;
                    this.diaTitle = "编辑人员"
                    this.currUserId = row.id
                    if (row.avatar) {
                        this.previewPic = true
                        this.previewUrl = constants.downloadUrl + row.avatar
                    } else {
                        this.previewPic = false
                    }
                    this.dialogVisible = true
                    setTimeout(()=>{
                        this.$refs[command.form].resetFields();
                        this.addTableData = {
                            id:row.id,
                            avatar: row.avatar?row.avatar:"",
                            username:  row.username?row.username:"",
                            sex: row.sex?row.sex:"",
                            nickname:  row.nickname?row.nickname:"",
                            phone:  row.phone?row.phone:"",
                            acount:  row.acount?row.acount:"",//账户
                            status: row.status?row.status:1,//账户状态
                            email:  row.email?row.email:"",
                            unitId:  row.unitId?row.unitId:"",//所属部门
                            type: "1", //1为管理员，2为c端用户
                            //	level: "0",//级别
                        }
                       // Object.assign(this.addTableData, row);
                    },10)
                }).catch(() => {

                })
            },
		    //新增/修改提交     
            getAdd(name) {
                const that = this
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var val = that.addTableData
                        var param = ''
                        if (that.diaTitle === "新增人员") {
                            param = 'sysmanager/tableDataAdd'
                        } else {
                            param = 'sysmanager/editDataOne'
                        }
                        //	console.log(val)
                        that.$store.dispatch(param, val)
                            .then((response) => {
                                this.picList = []
                                this.showUserImg = true
                                that.dialogVisible = false
                                that.$message({
                                    message: response.message,
                                    type: "success",
                                    center: 'true',
                                    duration: 3 * 1000
                                })
                                var msg = {
                                    acount: '',
                                    current: 1,
                                    size: 10
                                }
                                that.getData(msg)
                                that.loading = false
                            })
                            .catch((error) => {

                            })
                    } else {
                        that.$message.warning(
                            {
                                message: "请检查填写内容",
                                type: "warning",
                                center: 'true',
                            }
                        )
                    }
                });
            },
            handleMore(command) {
                const type = command.type
                if (type === 1) {
                    this.editTable(command.data,command)
                } else if (type === 2) {
                    this.delTable(command.data)
                } else if (type === 3) {
                    this.resetPassword(command.data,command)
                }
            },
            //删除单条
            delTable(row) {
                let that = this
                that.deleteObj.deleteModel = true;
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        //	console.log(row.id)
                        var id = row.id
                        await that.$store.dispatch('sysmanager/tableDataDelOne', id)
                            .then((response) => {
                                var msg = {
                                    acount: '',
                                    current: 1,
                                    size: 10
                                }
                                that.deleteObj.deleteModel = false;
                                that.$message({
                                    message: response.message,
                                    type: "success",
                                    center: 'true',
                                    duration: 3 * 1000
                                })
                                that.getData(msg)
                                that.loading = false
                            })
                            .catch(() => {
                               // that.deleteObj.deleteModel = false;
                                //that.$message({
                                //		message: "删除失败！",
                                //		type: "error",
                                //		center:'true',
                                //		duration: 3 * 1000
                                //	});
                                that.loading = false
                            })
                    }
                }
            },
//		    删除
            getDelete() {
                let that = this
                if (that.multipleSelection.length === 0) {
                    that.$message({
                        message: '请选择要删除的项！',
                        type: 'warning',
                        center: 'true',

                    });
                    return
                } else {
                    that.deleteObj.deleteModel = true;
                }
                that.deleteObj.prompt = "您确定要删除此内容吗？";
                that.deleteObj.del = {
                    async del() {
                        var dataId = ''
                        that.multipleSelection.map(val => {
                            dataId += (val.id + ',');
                        })
                        dataId = dataId.substr(0, dataId.length - 1)
                        await that.$store.dispatch('sysmanager/tableDataDel', dataId)
                            .then(() => {
                                var msg = {
                                    acount: '',
                                    current: 1,
                                    size: 10
                                }
                                that.deleteObj.deleteModel = false;

                                that.$message({
                                    message: '删除成功！',
                                    type: "success",
                                    center: 'true',
                                    duration: 3 * 1000
                                })
                                that.getData(msg)
                                that.loading = false
                            })
                            .catch(() => {
                               // that.deleteObj.deleteModel = false;
                                // that.$message({
                                // 		message: '删除失败！',
                                // 		type: "error",
                                //	center:'true',
                                // 		duration: 3 * 1000
                                // });
                                that.loading = false
                            })

                    }
                }
            },
//		    搜索
            dataSearch() {
                this.msg.acount = this.searchInput
                this.getData(this.msg)
            },
//		    分页
            currentChange(current) {
                this.msg.size = this.allInfo.size
                this.msg.current = current
                this.getData(this.msg)
            },


//		    分配角色
            asRole(row) {
                //	console.log(row,'######')
                this.currUserId = row.id
                var arr = []
                this.$store.dispatch('sysmanager/getRoleRelation', row.id)
                    .then(() => {
                        this.relationData = this.$store.state.sysmanager.relationData;
                        //	console.log(this.relationData)
                        this.relationData.map((data, index) => {
                            if (data.checked) {
                                arr.push(data.roleId)
                            }
                        })
                        this.selectRoleList = arr
                        this.userDialogVisible = true
                    })
                    .catch(() => {
                    })
            },
            handleClose(done) {
                done();
            },
            //改密码
            resetPassword(id,command) {
                this.restPassw = {
                    newPassword: "",
                    restPassw: "",
                }
                this.currUserId = id
                this.pwDialogVisible = true
                setTimeout(()=>{
                    this.$refs[command.form].resetFields();
                },10)
            },
            commitPassword(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let newP = this.restPassw.newPassword
                        let reptP = this.restPassw.repPassword
                        if (newP !== reptP) {
                            this.$message({
                                message: "新密码输入不一致！",
                                type: "error",
                                center: 'true',
                                duration: 3 * 1000
                            });
                            return
                        }
                        const val = {
                            id: this.currUserId,//用户id
                            newPassword: newP,
                            repPassword: reptP
                        }
                        this.$store.dispatch('sysmanager/resetPassword', val)
                            .then((response) => {
                                this.pwDialogVisible = false
                                this.$message({
                                    message: response.message,
                                    type: "success",
                                    center: 'true',
                                    duration: 3 * 1000
                                })
                            })
                            .catch(() => {

                            })
                    } else {
                        this.$message.warning(
                            {
                                message: "请检查填写内容",
                                type: "warning",
                                center: 'true',
                            }
                        )
                    }
                });
            },

        },
        computed: {},
        components: {
            deleteModel, SelectTree
        },
    }
</script>

<style>
    /* .el-form-item{
        margin-bottom:22px !important
    } */
    .el-table th > .cell {
        color: #4c4b4b
    }

    .el-table td, .el-table th {
        text-align: center
    }

    .search_right .el-input-group__append {
        background: #f38916;
        color: #ffffff;
    }

    .search_right input {
        /* border-right: none; */
         height:32px
    }

    .search_right {
        max-width: 320px;
        float:right
    }
     .el-button--medium {
        padding: 8px 20px;
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

    /* 头像 */
    .el-upload--picture-card {
        width: 0px;
        height: 0PX;
        border: 0px
    }

    .addManagerUpload .el-upload-list--picture-card .el-upload-list__item {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        top: -40px;
        left: 60px;
        margin: 0 8px -37px 0;
    }
</style>