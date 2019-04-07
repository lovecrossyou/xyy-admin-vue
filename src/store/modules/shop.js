import {getFoods, getResturants, getMenu, updateFood, deleteFood, getResturantDetail, getMenuById} from '@/api/getData'

const state = {
    selectShop: {
        name:''
    },
    productList: [],
    productCount:0,
    shopList:[]
}

const mutations = {
    setShop(state, shop) {
        state.selectShop = shop;
    },
    setProducts(state, datas) {
        state.productList = datas;
    },
    setCount(state,count){
        state.productCount = count;
    },
    setShops(state,data){
        state.shopList = data;
    }
}

const actions = {
    async fetchProducts({ commit, state }, shopId,offset=1,limit=20) {
        const res = await getFoods({ page: offset, pageSize:limit, shopId: shopId });
        const Foods = res.data.content;
        commit('setCount',res.data.totalElements);
        commit('setProducts',Foods);
    },
    async fetchShopList({commit}){
        const res = await getResturants({
            page: this.offset,
            pageSize: this.limit
          });
          const ShopList = res.data.content;
          commit('setShops',ShopList)
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
