import {getFoods, getFoodsCount, getMenu, updateFood, deleteFood, getResturantDetail, getMenuById} from '@/api/getData'

const state = {
    selectShop: {
        name:''
    },
    productList: [],
    productCount:0,
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
    }
}

const actions = {
    async fetchProducts({ commit, state }, shopId,offset=1,limit=20) {
        const res = await getFoods({ page: offset, pageSize:limit, shopId: shopId });
        const Foods = res.data.content;
        // let products = [];
        // Foods.forEach((item, index) => {
        //     const tableData = {};
        //     tableData.name = item.headName;
        //     tableData.item_id = item.item_id;
        //     tableData.description = item.productDescribe;
        //     tableData.rating = item.rating;
        //     tableData.month_sales = item.month_sales;
        //     tableData.restaurant_id = item.restaurant_id;
        //     tableData.category_id = item.category_id;
        //     tableData.image_path = item.image_path;
        //     tableData.specfoods = item.specfoods;
        //     tableData.index = index;
        //     products.push(tableData);
        // })
        commit('setCount',res.data.totalElements);
        commit('setProducts',Foods);
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
