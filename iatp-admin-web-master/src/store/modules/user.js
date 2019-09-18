import {login
	,getUserMenus
	,userInfo
	,VfCode
	,wrongQuestionsList
	,courseKeyValue
	,chapelTestKeyValue
	,deleteWrongQuestions
	,userCollectList
	,deleteUserCollect
	,userExamList
	,deleteUserExam
	,userLearningList
	,deleteUserLearning
	,memberInfoList
	,deleteMemberInfo
	,depTreeData
	,memberInfoSave
	,memberInfoEdit
	,accountInfoUpdate
	,memberModifyPwd
	,userButtons} from '@/api/user'
import {setValue} from  '@/util/localStorage'

const state = {
    userMenus: {},
    userId: '',
    VfCode: {},
	userInfo:{},

	courseKeyValueList: [],
	chapelTestKeyValueList: [],

	/** 错题list **/
	wrongQuestionsList:[],
	wrongQuestionsPage:{},

	/** 用户收藏 **/
	userCollectList:[],
	userCollectPage:{},

	/** 用户考试 **/
	userExamList:[],
	userExamPage:{},

	/** 用户学习 **/
	userLearningList:[],
	userLearningPage:{},

	/** C端会员 **/
	memberInfoList:[],
	memberInfoPage:{},
	depTreeData:[],

	userButtons:{}
}

const getters = {
	vCodes: state => {
		return state.VfCodes
	}
}

const actions = {

    obtainLogin({ commit, state },data) {
    	return new Promise((resolve,reject) => {
    		login(data).then(response => {
	            if (!response) {
	                reject('操作失败')
	            }
				setValue('token',response.token_type+' '+response.access_token)
	            commit('userId', response)
	            resolve(response)
	        }).catch(error => {
	            reject(error)
	        })
    	})
    },
    VerificationCode({ commit, state },data) {
    	return new Promise((resolve,reject) => {
    		VfCode(data).then(response => {
//  			登录验证码
	            if (!response) {
	                reject('操作失败')
	            }
	            commit('VfCode', response.data)
	            resolve(response)
	        }).catch(error => {
	            reject(error)
	        })
    	})
    },
	obtainUserMenus({ commit, state }) {
		return new Promise((resolve,reject) => {
			getUserMenus().then(response => {
				if (!response) {
					reject('操作失败')
				}
				commit('userMenus', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	obtainUserInfo({commit,state}) {
		return new Promise((resolve,reject) => {
			userInfo().then(response => {
				if (!response) {
					reject('操作失败')
				}
				commit('userInfo', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	/**
	 * 课程/实验select的key value
	 */
	obtainCourseKeyValueList({commit,state},type) {
		return new Promise((resolve,reject) => {
			const t = type || 0
			courseKeyValue(t).then(response => {
				if (!response) {
					reject('操作失败')
				}
				commit('courseKeyValueList', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	/**
	 * 试卷select的key value
	 */
	obtainChapelTestKeyValueList({commit,state}) {
		return new Promise((resolve,reject) => {
			chapelTestKeyValue().then(response => {
				if (!response) {
					reject('操作失败')
				}
				commit('chapelTestKeyValueList', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	/**
	 * ------------------------------------------
	 * 用户错题管理
	 * ------------------------------------------
	 */
	obtainWrongQuestionsList({commit,state},wqSearch) {
		return new Promise((resolve,reject) => {
			wrongQuestionsList(wqSearch).then(response => {
				if (!response) {
					reject('操作失败')
				}
				commit('wrongQuestionsList', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	/**
	 * 删除错题记录
	 */
	deleteWrongQuestionsAct({commit,state},ids) {
		return new Promise((resolve,reject) => {
			deleteWrongQuestions(ids).then(response => {
				if(response.code === 200) {
					resolve(response)
				} else {
					reject(response.message)
				}
			}).catch(error => {
				reject(error)
			})
		})
	},
	/**
	 * ------------------------------------------
	 * 用户收藏管理
	 * ------------------------------------------
	 */
	obtainUserCollectList({commit,state},ucSearch) {
		return new Promise((resolve,reject) => {
			userCollectList(ucSearch).then(response => {
				if (!response) {
					reject('查询用户收藏失败')
				}
				commit('userCollectList', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	deleteUserCollectAct({commit,state},ids) {
		return new Promise((resolve,reject) => {
			deleteUserCollect(ids).then(response => {
				if(response.code === 200) {
					resolve(response)
				} else {
					reject(response.message)
				}
			}).catch(error => {
				reject(error)
			})
		})
	},
	/**
	 * ------------------------------------------
	 * 用户考试管理
	 * ------------------------------------------
	 */
	obtainUserExamList({commit,state},ucSearch) {
		return new Promise((resolve,reject) => {
			userExamList(ucSearch).then(response => {
				if (!response) {
					reject('查询用户考试失败')
				}
				commit('userExamList', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	deleteUserExamAct({commit,state},ids) {
		return new Promise((resolve,reject) => {
			deleteUserExam(ids).then(response => {
				if(response.code === 200) {
					resolve(response)
				} else {
					reject(response.message)
				}
			}).catch(error => {
				reject(error)
			})
		})
	},
	/**
	 * ------------------------------------------
	 * 用户学习管理
	 * ------------------------------------------
	 */
	obtainUserLearningList({commit,state},ucSearch) {
		return new Promise((resolve,reject) => {
			userLearningList(ucSearch).then(response => {
				if (!response) {
					reject('查询用户学习失败')
				}
				commit('userLearningList', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	deleteUserLearningAct({commit,state},ids) {
		return new Promise((resolve,reject) => {
			deleteUserLearning(ids).then(response => {
				if(response.code === 200) {
					resolve(response)
				} else {
					reject(response.message)
				}
			}).catch(error => {
				reject(error)
			})
		})
	},
	/**
	 * ------------------------------------------
	 * C端会员管理
	 * ------------------------------------------
	 */
	obtainMemberInfoList({commit,state},ucSearch) {
		return new Promise((resolve,reject) => {
			memberInfoList(ucSearch).then(response => {
				if (!response) {
					reject('查询会员失败')
				}
				commit('memberInfoList', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	deleteMemberInfoAct({commit,state},ids) {
		return new Promise((resolve,reject) => {
			deleteMemberInfo(ids).then(response => {
				if(response.code === 200) {
					resolve(response)
				} else {
					reject(response.message)
				}
			}).catch(error => {
				reject(error)
			})
		})
	},
	obtainDepTreeData({commit,state}) {
		return new Promise((resolve,reject) => {
			depTreeData().then(response => {
				if (!response) {
					reject('查询部门树失败')
				}
				commit('depTreeData', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	memberInfoSave({commit,state},memberInfo) {
		return new Promise((resolve,reject) => {
			memberInfoSave(memberInfo).then(response => {
				if (!response) {
					reject('保存会员失败')
				}
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	memberInfoEdit({commit,state},memberInfo) {
		return new Promise((resolve,reject) => {
			memberInfoEdit(memberInfo).then(response => {
				if (!response) {
					reject('保存会员失败')
				}
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	accountInfoUpdateAct({commit,state},memberInfo) {
		return new Promise((resolve,reject) => {
			accountInfoUpdate(memberInfo).then(response => {
				if (!response) {
					reject('保存会员失败')
				}
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},
	memberModifyPwd({commit,state},pwdInfo) {
		return new Promise((resolve,reject) => {
			memberModifyPwd(pwdInfo).then(response => {
				if (!response) {
					reject('修改密码失败')
				}
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	},


	userButtonsAct({commit,state},resId) {

		return new Promise((resolve,reject) => {
			userButtons(resId).then(response => {
				if (!response) {
					reject('操作失败')
				}
				commit('userButtons', response)
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	}
}

const mutations = {
	userId(state,response) {
        state.userId = response['X-AOHO-UserId']
    },
    VfCode(state,VfCode) {
    	state.VfCode = VfCode
    },
	userMenus(state, { data }) {
		state.userMenus = data
	},
	userInfo(state,{data}) {
		state.userInfo = data
	},
	/**
	 * 课程/实验
	 */
	courseKeyValueList(state,{data}) {
    	state.courseKeyValueList = data
	},
	/**
	 * 试卷
	 */
	chapelTestKeyValueList(state,{data}) {
		state.chapelTestKeyValueList = data
	},
	/** 错题模块 **/
	wrongQuestionsList(state,{data,total,size}) {
		state.wrongQuestionsList = data
		state.wrongQuestionsPage = {total,size}
	},
	/** 用户收藏 **/
	userCollectList(state,{data,total,size}) {
		state.userCollectList = data
		state.userCollectPage = {total,size}
	},
	/** 用户考试 **/
	userExamList(state,{data,total,size}) {
		state.userExamList = data
		state.userExamPage = {total,size}
	},
	/** 用户学习 **/
	userLearningList(state,{data,total,size}) {
		state.userLearningList = data
		state.userLearningPage = {total,size}
	},
	/** C端会员管理 **/
	memberInfoList(state,{data,total,size}) {
		state.memberInfoList = data
		state.memberInfoPage = {total,size}
	},
	depTreeData(state,{data}) {
		state.depTreeData = data
	},


	userButtons(state,{data}) {
		state.userButtons = data
	}
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }