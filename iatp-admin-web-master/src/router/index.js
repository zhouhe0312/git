import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path: '/login',
        name: 'login',
        component: ()=> import ('@/views/login.vue'),
        meta: { keepAlive : true }
    },
    //重定向到首页
    { path: '/', redirect: '/index/home'},
    {
        path: '/index',
        name: '首页',
        component: ()=> import ('@/views/index.vue'),
        meta: { keepAlive : true },
        children: [
            {
                path: '/index/home',
                name: '首页',
                component: ()=> import ('@/views/main-container/home/home.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/course-manage',
                name: '课程管理',
                component: ()=> import ('@/views/main-container/course-test/course-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/section-manage',
                name: '课程章节',
                component: ()=> import ('@/views/main-container/course-test/section-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/classify-manage',
                name: '分类管理',
                component: ()=> import ('@/views/main-container/course-test/classify-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/test-manage',
                name: '实验管理',
                component: ()=> import ('@/views/main-container/course-test/test-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/test-section',
                name: '实验章节',
                component: ()=> import ('@/views/main-container/course-test/test-section.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/exam-manage',
                name: '试题管理',
                component: ()=> import ('@/views/main-container/exam-manage/exam-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/itemBank-manage',
                name: '题库管理',
                component: ()=> import ('@/views/main-container/exam-manage/itemBank-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/testPaper-manage',
                name: '试卷管理',
                component: ()=> import ('@/views/main-container/exam-manage/testPaper-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/joinTestPaper',
                name: '组卷',
                component: ()=> import ('@/views/main-container/exam-manage/joinTestPaper.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/system-log',
                name: '日志管理',
                component: ()=> import ('@/views/main-container/system-manage/system-log.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/system-manager',
                name: '管理员管理',
                component: ()=> import ('@/views/main-container/system-manage/system-manager.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/system-safety',
                name: '安全管理',
                component: ()=> import ('@/views/main-container/system-manage/system-safety.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/system-dictionaries',
                name: '字典管理',
                component: ()=> import ('@/views/main-container/system-manage/system-dictionaries.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/system-role',
                name: '角色管理',
                component: ()=> import ('@/views/main-container/system-manage/system-role.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/system-authority',
                name: '权限管理',
                component: ()=> import ('@/views/main-container/system-manage/system-authority.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/system-department',
                name: '部门管理',
                component: ()=> import ('@/views/main-container/system-manage/system-department.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/Paper-collection',
                name: '试卷收藏',
                component: ()=> import ('@/views/main-container/user-manage/Paper-collection.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/user-study',
                name: '用户学习',
                component: ()=> import ('@/views/main-container/user-manage/user-study.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/user-exam',
                name: '用户考试',
                component: ()=> import ('@/views/main-container/user-manage/user-exam.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/user-manage',
                name: '用户管理',
                component: ()=> import ('@/views/main-container/user-manage/user-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/wrong-manage',
                name: '错题管理',
                component: ()=> import ('@/views/main-container/user-manage/wrong-manage.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/knowledge-list',
                name: '知识库目录',
                component: ()=> import ('@/views/main-container/knowledge-manage/knowledge-list.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/knowledge-const',
                name: '知识库内容建设',
                component: ()=> import ('@/views/main-container/knowledge-manage/knowledge-const.vue'),
                meta: { keepAlive : true }
            },
            {
                path: '/index/reset-pwd',
                name: '修改密码',
                component: ()=> import ('@/views/reset-pwd.vue'),
                meta: { keepAlive : true }
            }
        ]
    }
]

const router = new Router({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    next()
});

export default router
