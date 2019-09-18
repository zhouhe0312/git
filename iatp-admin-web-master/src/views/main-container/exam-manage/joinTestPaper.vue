<template>
	 <div class="mainPart" >
		<el-row>
			<el-col :span="18" style="width:77%">
                        <div style="margin-bottom:50px">
                            <P  style="text-align: center;font-weight:700;font-size:16px">{{propsData.title}}</P>
                            <P  style="text-align: center;color:#999;font-size:12px;margin-top:10px">{{'满分 '+propsData.score+'分，总时长 '+propsData.paperDuration+'分钟'}}</P> 
                            <!-- <p @click="goBack" style="position:absolute;cursor:pointer;" title="返回上级目录">
                                <img  style="width:25px;height:20px" src="@/assets/images/back.png">
                                <span style="font-size:14px;color:#999;position: relative;top: -6px;left: 6px;">返回</span>
                            </p> -->
                             <div @click="goBack" style="float:right;color: #f38916;cursor:pointer;font-size: 14px;position: relative;top: -50px;"> 
                                <i class="el-icon-d-arrow-right" style="margin:10px 10px 0 0;color:#f38916;font-size:14px"></i>
                                <span>返回</span>
                            </div>
                        </div>
                        <el-col :span="24">
                            <div class="test" style="display:inline-block">
                                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                            </div>
                            <span @click="checkedAdd" style="margin-left:10px;font-size:14px;cursor:pointer;color:#888" class="addBatch">批量加入</span>
                            <el-select style="float:right" @change="changeTest" v-model="currTest" placeholder="请选择题库">
                                <el-option
                                    v-for="item in allTestList"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id" > 
                                </el-option>
                            </el-select> 
                        </el-col> 

                        <!-- 试题渲染 -->
                        <el-col :span="24" infinite-scroll-disabled="busy" infinite-scroll-distance="100" v-infinite-scroll="loadTest">
                            <GeminiScrollbar :autoshow="true" :forceGemini="true" class="myScroll" :style="concentHeight" style="width: 100%">  
                                <div v-for="(item,index) in AllTestPages" :key="index" class="test">
                                    <el-checkbox-group :max="100" v-model="checkedTest" @change="handleCheckedChange" style="display:inline-block" class="allTest">
                                        <el-checkbox :key="index" :label="item.id"></el-checkbox>
                                    </el-checkbox-group>
                                    <span v-if="!item.scoreValue" style="margin-right:5px;color:#999;font-size:13px">{{'(0分)'}}</span>
                                    <span v-else style="margin-right:5px;color:#999;font-size:13px">{{'('+item.scoreValue+'分)'}}</span>
                                    <span style="font-size:14px">{{index+1+'、'}}</span>
                                    <span style="font-size:14px;color:#333">{{item.topicStem}}</span>
                                    <div style="margin:15px 0px 30px 40px">
                                        <p style="margin-bottom:3px;font-size:14px;color:#666">{{'A、'+item.optionA}}</p>
                                        <p style="margin-bottom:3px;font-size:14px;color:#666">{{'B、'+item.optionB}}</p>
                                        <p style="margin-bottom:3px;font-size:14px;color:#666">{{'C、'+item.optionC}}</p>
                                        <p style="font-size:14px;color:#666">{{'D、'+item.optionD}}</p>
                                    </div>
                                    <el-button class="joinpaper" :disabled="addBtnDisabled.indexOf(item.id) != -1" style="border-radius:2px;float:right;margin:-30px 0px 10px;border-color:#f38916;color:#f38916" size="small" @click="joinPaper(item,index+1)">
                                        加入组卷
                                    </el-button>
                                    <div style="width:100%;border:0.5px solid #e7e7e7 ;clear:both;margin:0px 0px 20px 0px"></div>
                                </div>
                                <!-- <p v-if="showNo == true" style="font-size:15px;margin:30px 0px 15px;margin-left:50%">已全部加载 ...</p> -->
                            </GeminiScrollbar>
                        </el-col>
			</el-col>
            <div :style="lineHeight" style="border:6px solid #E9ECF3;display: inline-block;position: absolute;margin: -22px 15px;"></div>
            <el-col :span="5" style="float:right">
                <div style="padding-left:15px;">
                    <div style="margin-bottom:10px">
                        <!-- <i class="el-icon-arrow-right" @click='isLeftArrow'></i> -->
                        <el-badge :value="testData.length" :max="99" class="checkedNum">
                            <p style="font-size:14px;color:#333">已选试题</p>
                        </el-badge>
                        <span style="padding-left: 25px;font-size:14px;color:#333">总分：<span style="color:#f38916;font-size:15px">{{num?num:0}}</span></span>
                        <span v-if="testData.length !== 0" @click="delAllTest" style="cursor:pointer;font-size:13px;float:right;color:#888" class="delAll">全部移除</span>
                    </div>
                    <div v-if="testData.length == 0">
                        <GeminiScrollbar :autoshow="true" :forceGemini="true" class="myScroll" :style="menuHeight" style="">  
                            <div :style="mypicHeight" style="width:100%;text-align: center">
                                <img src="@/assets/images/noTest.jpg" style=""/>
                                <p  style="font-size:12px;color:#888;margin-left:14px">抱歉，目前暂无选题！</p>
                            </div>
                        </GeminiScrollbar>
                    </div>
                    <div v-else  :style="menuHeight" style="wdith:100%">
                        <GeminiScrollbar :autoshow="true" :forceGemini="true" class="menuScroll" >  
                            <div v-for="(item,index) in testData" :key="index" style="">
                                <div style=" overflow:hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">
                                    <span style="font-size:14px">{{index+1+'、'}}</span>
                                    <span style="font-size:14px">{{item.topicStem}}</span>
                                </div>
                                <div style="float:right;margin:27px 0px 15px;">
                                    <span style="font-size:12px;">分值 : 
                                        <span style="cursor:pointer;font-size:14px;color:#f38916" @click="_changeScore(item)" title="点击更改分值">{{item.scoreValue?item.scoreValue:'0'}}</span>
                                        分
                                    </span>
                                    <span style="font-size:12px;color:#ccc;margin:0px 6px">|</span>
                                    <span :underline="false" @click="delOneTest(item,index)" style="cursor:pointer;font-size:12px;color:#f38916">移除</span>
                                </div>
                                <div style="width:100%;border:1px dashed #e7e7e7 ;clear:both;margin:20px 0px"></div>
                            </div>
                    </GeminiScrollbar>
                   </div>
                   <div  v-if="testData.length !== 0" style="width:100%;text-align: center;margin-top: 20px;">
                        <el-button style="background-color:#f38916;color:#fff;border:none;width:120px"  @click="submitPaper">完成组卷</el-button>
                   </div>
                    
                   

                </div>
			</el-col>
		</el-row>
        <!-- 更改分值 -->
         <el-dialog :close-on-click-modal="false" width="30%" title="更改分值" :visible.sync="showchange" :before-close="handleClose">
             <el-input style="margin-bottom:16px" maxlength="3" show-word-limit v-model="changeScore" onkeyup="value=value.replace(/[^\d]/g,'')"   
       onblur="value=value.replace(/[^\d]/g,'')"></el-input>
            <span slot="footer" class="dialog-footer">
		    <el-button size="medium" @click="showchange = false">取 消</el-button>
		    <el-button size="medium" type="primary" @click="tochangeScore">确 定</el-button>
		  </span>
        </el-dialog>
	</div> 
</template>

<script>

	export default {
		data() {
			return {
                concentHeight:'height:'+(window.innerHeight-283)+'px',
                menuHeight:'height:'+(window.innerHeight-240)+'px',
                lineHeight:'height:'+(window.innerHeight-120)+'px',
                mypicHeight:'margin-top:'+(window.innerHeight/3)+'px',
                addBtnDisabled:[],
                busy: false,
                allTestList:[],//题库
                AllTestPages:[],//试题list
                currTest:null,
                pageAllInfo:{},
                val:{
                   current:1,
                   size:10,
                   topicStem:"",
                   typeId:""
                },
               //headers:{},
               courseId:"",
               propsData:{},
               allCheckedList:[],//组卷候选题目
               checkedTest:[],
               checkAll: false,//全选
               isIndeterminate: false,//半联动
               testData:[], 
               showNo:false,
               changeScore:"",
               showchange:false,
               data:{},
               num:"0",
              // rightSpan:6,
              // leftSpan:18
			}
		},
		mounted() {
            this.getTestAll()

            var obj = localStorage.getItem('JUMPTESTPAGER')
            this.propsData = JSON.parse(obj)
            this.courseId = JSON.parse(obj).id//带过来的单条试卷id
            this.handleSelectTestList(this.courseId)
		},
		methods:{
            
            //下拉加载
            loadTest(){
                this.busy = true
                let i = this.val.current+1
                this.val={
                    current:i,
                    size:10,
                    selectType: 2, //1：列表查询 2：组卷查询
                    topicStem:"",
                    typeId:this.currTest
                }
                if(!this.currTest) {
                    return
                }
                this.$store.dispatch('joinTestPaper/getAllTestPages',this.val)
                .then(() => {
                    var arr = []
                    arr = this.$store.state.joinTestPaper.testAllTableData
                    this.AllTestPages.push(...arr);
                    this.pageAllInfo = this.$store.state.joinTestPaper.pageAllInfo;
                    if(i <= this.pageAllInfo.pages){
                        this.busy = false
                    }else{
                        this.busy = true
                        this.showNo = true
                        this.$message({
                            message: '已全部加载',
                            type: "warning",
                            center:'true',
                            duration: 3 * 1000
                        })
                    }
                })
                .catch(() => {

                })	
               
            },
            handleCheckAllChange(val) {//全选触发子级
                var arr = []
                this.AllTestPages.map((data,index)=>{
                   if(val){
                       arr.push(data.id)
                   }else{
                        arr = []
                   }
                })
                this.checkedTest = val ? arr : [];
                this.isIndeterminate = false;
            },
            handleCheckedChange(value) {//子级勾选触发全选
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.AllTestPages.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.AllTestPages.length;
            },
            goBack(){
                this.$router.push({
                    path:"/index/testPaper-manage",
                });
            },
            //获取题库
            getTestAll(){
                const that = this
                that.$store.dispatch('joinTestPaper/getTestAllList')
                .then(() => {
                    that.allTestList = that.$store.state.joinTestPaper.testAllData;
                    if(that.allTestList.length > 0) {
                        that.currTest = that.allTestList[0].id
                        that.val={
                            current:1,
                            size:10,
                            selectType: 2, //1：列表查询 2：组卷查询
                            topicStem:"",
                            typeId:that.currTest
                        }

                        this.getAllTestPages(that.val)
                    }
                })
                .catch(() => {

                })		
            },
            //切换题库
            changeTest(){
                if(!this.currTest){
                    return
                }
                 this.val={
                    current:1,
                    size:10,
                     selectType: 2, //1：列表查询 2：组卷查询
                    topicStem:"",
                    typeId:this.currTest
                }
                this.getAllTestPages(this.val)
            },
            //获取试题list
            getAllTestPages(val){
                this.$store.dispatch('joinTestPaper/getAllTestPages',val)
                .then(() => {
                    this.AllTestPages = this.$store.state.joinTestPaper.testAllTableData;
                    this.pageAllInfo = this.$store.state.joinTestPaper.pageAllInfo;
                })
                .catch(() => {

				})	
            },

            //改分保存
            tochangeScore(){
                if(this.changeScore > this.propsData.score){
                    this.$message({
                        message: '试题分值不能大于总分值！',
                        type: "error",
                        center:'true',
                        duration: 3 * 1000
                    })
                    return
                }
                this.data.scoreValue = this.changeScore
                this.showchange = false
                var numValue = []
                this.testData.map((item,index)=>{
                    if(item.scoreValue){
                        numValue.push(item.scoreValue)
                    }
                })
                this.num = eval(numValue.join('+'))
            },
            
            _changeScore(item){
                this.data = item
                this.changeScore = item.scoreValue
                this.showchange = true
            },

            //单个试题添加组卷
            joinPaper(item,index){
                this.allCheckedList.push(item.id)
                let arr =[]
                for(var i=0; i<this.allCheckedList.length;i++){
                    if(arr.indexOf(this.allCheckedList[i]) === -1){
                        arr.push(this.allCheckedList[i])
                    }
                }
                this.allCheckedList = arr
               //////////////////已选试题/////////////////////
               var a = JSON.parse(JSON.stringify(this.AllTestPages))
                a.map((data)=>{
                    this.allCheckedList.map((data2)=>{
                        if(data2 === data.id){
                            this.testData.push(data)
                        }
                    })
                })
                var obj = {};
                this.testData = this.testData.reduce(function(item, next) {
                    obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                    return item;
                }, []);
               
                var numValue = []
                this.testData.map((item,index)=>{
                    if(item.scoreValue){
                        numValue.push(item.scoreValue)
                    }
                })
                this.num = eval(numValue.join('+'))
                this.addBtnDisabled.push(item.id)
            },

            //批量加入
            checkedAdd(){
                if(this.checkedTest.length === 0){
                    this.$message({
                        message: '请先选择再加入哦！',
                        type: "warning",
                        center:'true',
                        duration: 1 * 1000
                    })
                    return
                }
                var arr = this.allCheckedList.concat()
                for(var i = 0;i<this.checkedTest.length;i++){
                    if(arr.indexOf(this.checkedTest[i]) === -1){
                        arr.push(this.checkedTest[i])
                        this.addBtnDisabled.push(this.checkedTest[i])
                    }
                }
                this.allCheckedList = arr
                //////////////////已选试题////////////////////
                var a = JSON.parse(JSON.stringify(this.AllTestPages))
                a.map((data)=>{
                    this.allCheckedList.map((data2)=>{
                        if(data2 === data.id){
                            this.testData.push(data)
                        }
                    })
                })
                var obj = {};
                this.testData = this.testData.reduce(function(item, next) {
                    obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                    return item;
                }, []);

                this.checkedTest = []//初始化复选框
                this.isIndeterminate = false;//初始化全选
                this.checkAll= false//初始化半联动

                var numValue = []
                this.testData.map((item,index)=>{
                    if(item.scoreValue){
                        numValue.push(item.scoreValue)
                    }
                })
                this.num = eval(numValue.join('+'))
            },

            //全部移除
            delAllTest(){
                this.num = "0"
                this.testData = []
                this.allCheckedList = []
                this.addBtnDisabled = []
            },
            //移除单个试题
            delOneTest(item,index){
                var delArr =[]
                var delArr2 =[]
                var a = JSON.parse(JSON.stringify(this.testData))
                for(var k=0; k<a.length;k++){
                    if(item.id !== a[k].id){
                        delArr.push(a[k])
                    }
                }
                this.testData = delArr
                this.allCheckedList.map((data,_index)=>{
                    if(item.id !== data){
                        delArr2.push(data)
                    }
                })
                this.allCheckedList = delArr2
                this.num = this.num - item.scoreValue
                console.log(this.addBtnDisabled,index)
                var myarr = []
                this.addBtnDisabled.map((data,index)=>{
                    if(data !== item.id){
                        myarr.push(data)
                    }
                })
                this.addBtnDisabled = myarr


            },
            //完成组卷
            submitPaper(){
                var arr = []
                var val = {"list":[]}
                this.testData.map((item,index)=>{
                    if(item.scoreValue){
                        arr.push(item.scoreValue)
                    }else{
                        this.$message({
                            message: '部分所选的试题未设置分值，请更正后再次尝试！',
                            type: "error",
                            center:'true',
                            duration: 5 * 1000
                        })
                        return
                    }
                    val.list.push({
                        "scoreValue": item.scoreValue?item.scoreValue:0,
                        "topicId": item.id
                    })
                    val.testPaperId = this.courseId
                })
                var num = eval(arr.join('+'))
                if(num !== this.propsData.score){
                    this.$message({
                        message: '所选试题的总分值应等于试卷总分值！',
                        type: "error",
                        center:'true',
                        duration: 2 * 1000
                    })
                    return
                }
                this.$store.dispatch('joinTestPaper/toJoinTestPaper',val)
                .then((response) => {
                    this.testData = []
                    this.num = "0"
                    this.$message({
                        message: response.message,
                        type: "success",
                        center:'true',
                        duration: 3 * 1000
                    })
                    this.goBack()
                })
                .catch((error) => {
                //     this.$message({
                //        message: error,
                //        type: "error",
                //        center:'true',
                //        duration: 3 * 1000
                //    })
				})	
            },
            //试卷ID
            handleSelectTestList(id) {
                this.$store.dispatch("testPaper/seeTestListAct",id).then(() => {
                    this.dialogVisibleSeeTest = true
                    this.testData = this.$store.getters.seeTestList
                    let numValue = []
                    this.testData.map((item,index)=>{
                        if(item.scoreValue){
                            numValue.push(item.scoreValue)
                        }
                    })
                    this.num = eval(numValue.join('+'))
                }).catch(() => {

                })
            },
            handleClose(done) {
                done();
            },
            // // 右侧显示隐藏
            // isLeftArrow() {
            //     this.rightSpan = 0
            //     this.leftSpan = 24
            // }
		},
		computed:{
		
		},
		components: {
            
        },
	}
</script>

<style >

 .el-button--medium {
        padding: 8px 20px;
    }
    .checkedNum .el-badge__content{
        background:#ef2323 
    }
    .delAll:hover{
        color: #f38916 !important
    }
    .joinpaper:not(.is-disabled):hover{
        background:#f38916 !important; 
        color:#fff !important
    }
     .joinpaper.is-disabled{
          background:#ddd !important;
          color:#fff !important;
          border:1px solid #ddd !important
     }
    .addBatch:hover{
         color: #f38916 !important
    }
    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        background:#f38916;
        border-color:#f38916
    }
     .el-checkbox__input.is-checked+.el-checkbox__label{
        color: #f38916
    }
     .el-checkbox__inner:hover{
        border-color:#f38916
    }
    .el-checkbox__input.is-focus .el-checkbox__inner{
        border-color: #f38916
    }
    .el-popover__title{
        margin-left:40%
    }
    .allTest .el-checkbox__label{
        display: none !important
    }
    .test .el-checkbox{
        margin-right:10px;
        margin-left: 5px
    }
	.el-textarea__inner{
		min-height: 90px !important
	}
	/* .el-form-item{
		margin-bottom:22px !important
	} */
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
	.el-pagination {
		text-align: center;
		margin-top: 30px;
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
	.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
        color:#f38916
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