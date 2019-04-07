import Vue from 'vue'
import Vuex from 'vuex'
import {getAdminInfo} from '@/api/getData'
import shop from "./modules/shop"
Vue.use(Vuex)

const state = {
	adminInfo: {
		avatar: 'default.png'
	},
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	}
}

const actions = {
	async getAdminData({commit}){
		try{
			const res = await getAdminInfo()
			if (res.status == 1) {
				commit('saveAdminInfo', res.data);
			}else{
				throw new Error(res.type)
			}
		}catch(err){
			// console.log(err.message)
		}
	}
}

export default new Vuex.Store({
	modules:{
		shop
	},
	state,
	actions,
	mutations,
})
