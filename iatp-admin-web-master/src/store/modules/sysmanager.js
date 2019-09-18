import {
	 getTableData,
	 DelTableData,
	 DelOneData,
	 addTableData,
	 getRole,
	 addRole,
	 editOneData,
	resetPassw,
	 getDeptTree,
	 getRoleRela
} from '@/api/system-manager'

const state = {
	tableData: [],//管理员基础表格
	roleData:[],//角色列表
	treeData:[],//部门树
	allInfo:{},
	relationData:[],
}

const getters = {
	getTableData: state => state.tableData,
	getRole: state => state.roleData,
	getRoleRela: state => state.relationData
}

const actions = {
    managerTableData({ commit,state }, data) {
    	return new Promise((resolve,reject) => {
    		getTableData(data).then(response => {
    			if(!response) {
    				reject('获取失败')
    			}
    			commit('tableData',response.data)
    			commit('allInfo',response)
    			resolve(response.data)
    		}).catch(error => {
    			reject(error)
    		})
    	})
    },
    //批量删除管理员
    tableDataDel({ commit,state }, data) {
    	return new Promise((resolve,reject) => {
    		DelTableData(data).then(response => {
    			if(!response) {
    				reject('删除失败')
    			}
    			resolve(response.data)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},
	//删除单条管理员
	tableDataDelOne({ commit,state }, id) {
    	return new Promise((resolve,reject) => {
    		DelOneData(id).then(response => {
    			if(!response) {
    				reject('删除失败')
    			}
    			resolve(response)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},
	//编辑单条管理员
	editDataOne({ commit,state }, val) {
    	return new Promise((resolve,reject) => {
    		editOneData(val).then(response => {
    			if(!response) {
    				reject('编辑失败')
    			}
    			resolve(response)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},
	//系统管理员改密码
	resetPassword({ commit,state }, val) {
    	return new Promise((resolve,reject) => {
			resetPassw(val).then(response => {
    			if(!response) {
    				reject('修改失败')
    			}
    			resolve(response)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},
	//系统管理员新增
	tableDataAdd({ commit,state }, val) {
    	return new Promise((resolve,reject) => {
    		addTableData(val).then(response => {
    			if(!response) {
    				reject('新增失败')
    			}
    			resolve(response)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},
	//获取角色列表
	getRoleData({ commit,state }) {
    	return new Promise((resolve,reject) => {
    		getRole().then(response => {
    			if(!response) {
    				reject('获取角色失败')
				}
				commit('roleData',response.data)
    			resolve(response.data)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},
	//管理员添加角色
	addRoleData({ commit,state },val) {
    	return new Promise((resolve,reject) => {
    		addRole(val).then(response => {
    			if(!response) {
    				reject('添加角色失败')
    			}
    			resolve(response)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},
	//获取部门树
	getUnitTree({ commit,state}) {
    	return new Promise((resolve,reject) => {
    		getDeptTree().then(response => {
    			if(!response) {
    				reject('获取部门失败')
				}
				commit('treeData',response.data)
    			resolve(response.data)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},
	
	//获取用户关系-分配角色回显
	getRoleRelation({ commit,state},uid) {
    	return new Promise((resolve,reject) => {
    		getRoleRela(uid).then(response => {
    			if(!response) {
    				reject('操作失败')
				}
				commit('relationData',response.data)
    			resolve(response.data)
    		}).catch(error => {
    			reject(error)
    		})
    	})
	},

}

const mutations = {
    tableData(state, tableData) {
    	state.tableData = tableData
    },
    allInfo(state, allInfo) {
    	state.allInfo = allInfo
	},
	roleData(state, roleData) {
    	state.roleData = roleData
	},
	treeData(state, treeData) {
    	state.treeData = treeData
	},
	relationData(state, relationData) {
    	state.relationData = relationData
	},
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
  }