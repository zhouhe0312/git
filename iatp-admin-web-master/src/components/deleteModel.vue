<template>
  <div>
    <el-dialog :visible.sync="deleteObj.deleteModel" custom-class="iatp-header"  title="温馨提示" width="30%" :close-on-click-modal="false">
      <span>{{deleteObj.prompt}}</span>
      <span slot="footer" class="dialog-footer" >
        <el-button size="medium" @click="deleteObj.deleteModel = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="del">{{deleteObj.btnTxt || '删除'}}</el-button>
      </span>
    </el-dialog> 
  </div>
</template>
<script>

  export default {
    data () {
      return {
      }
    },
    props: {
      deleteObj: {
        // type: Object
      },
    },
    methods: {
      del(){
        this.deleteObj.del.del();
      },
    }
  }
</script>

<style>
  .iatp-header .el-dialog__header {
    border-bottom: 2px solid #f38916;
  }
  .iatp-header .el-dialog__footer {
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
  .el-dialog__footer {
      border-top: 1px solid #ddd;
      padding: 10px
  }
</style>