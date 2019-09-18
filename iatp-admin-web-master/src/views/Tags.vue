<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-li-title">
                    {{item.name}}
                </router-link>
                <span v-if="item.name !=='首页'" class="tags-li-icon" @click="closeTags(index)">
                    <i class="el-icon-close"></i>
                </span>
            </li>
        </ul>
        
    </div>
</template>

<script>
import bus from "@/util/event";
//import { mapState } from "vuex";

export default {
     name: 'tagsPage',
    data() {
        return {
            tagsList: [],
        };
    },
    methods: {
        isActive(path) {
           // console.log(path,this.$route.fullPath,'---')
            if(path === this.$route.fullPath){
                return true
            }
        },
        // 关闭单个标签
        closeTags(index) {
            console.log(index,'====!')
            const delItem = this.tagsList.splice(index, 1)[0];
            const item = this.tagsList[index] ?  this.tagsList[index] : this.tagsList[index - 1];
            if (item) {
                delItem.path === this.$route.fullPath && this.$router.push(item.path);
            }
            localStorage.setItem('TAGSLIST',JSON.stringify(this.tagsList))
             if(delItem.path == '/index/course-manage' && this.$route.fullPath == '/index/section-manage'){
                 this.$router.push(item.path)
            }
            if(delItem.path == '/index/test-manage' && this.$route.fullPath == '/index/test-section'){
                this.$router.push(item.path)
            }
        },

        // 设置标签
        setTags(route) {
            if(route.name !== '课程章节' && route.name !== '实验章节' && route.name !== '组卷'){ //屏蔽路由
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath;
                });
                if (!isExist) {
                        this.tagsList.push({
                            name: route.name,
                            path: route.fullPath,
                        });
                    localStorage.setItem('TAGSLIST',JSON.stringify(this.tagsList))
                }
            }
        },
    },
    computed: {
        showTags() {
            return this.tagsList && this.tagsList.length > 0; //是否保留标签占位区域
        },
    },
    watch: {
        $route(newValue, oldValue) {
            this.setTags(newValue);
        },
    },
    mounted() {
        var arr = JSON.parse(localStorage.getItem('TAGSLIST'))
        if(arr){
            this.tagsList.push(...arr)
        }else{
             this.tagsList.push({
                'name': '首页',
                'path': '/index/home',
            });
        }
    }
};
</script>


<style>
.tags {
       border-top: 10px solid #e9ecf3;
       border-left: 10px solid #e9ecf3
} 

.tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.tags-li {
    /* border-bottom:2px solid #f38916; */
    float: left;
    margin: 8px 0px 2px 0px;
    border-radius: 3px;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    line-height: 23px;
    border-right: 1px solid #e9eaec; 
    background: #fff;
    padding: 0 12px 4px 10px;
    vertical-align: middle;
    color: #666;
    -webkit-transition: all 0.3s ease-in;
    -moz-transition: all 0.3s ease-in;
    transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
    background: #f8f8f8;
}

.tags-li.active {
    color: #f38916;
}

.tags-li-title {
    float: left;
    max-width: 110px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-right: 5px;
    color: #999;
    font-size: 14px;
    text-decoration-line: none;
}

.tags-li.active .tags-li-title {
    color: #f38916;
}

.tags-close-box {
    position: absolute;
    right: 182px;
    top: 0;
    box-sizing: border-box;
    padding-top: 1px;
    text-align: center;
    width: 110px;
    height: 30px;
    background: #fff;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
}

</style>
