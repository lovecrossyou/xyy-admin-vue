import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/api/merchant/login', data, 'POST');

// 发送验证码
export const smssend = data => fetch('/api/sms/send', data, 'POST');

// 添加品牌 category_m/add
export const addbrand = data => fetch('/api/category_m/add', data, 'POST');


/**
 * 退出
 */

export const signout = () => fetch('/api/merchant/signout');

/**
 * 获取用户信息
 */

export const getAdminInfo = () => fetch('/api/admin/info');

/**
 * api请求量
 */

export const apiCount = date => fetch('/api/statis/api/' + date + '/count');

/**
 * 所有api请求量
 */

export const apiAllCount = () => fetch('/api/statis/api/count');


/**
 * 所有api请求信息
 */

export const apiAllRecord = () => fetch('/api/statis/api/all');

/**
 * 用户注册量
 */

export const userCount = date => fetch('/api/statis/user/' + date + '/count');

/**
 * 某一天订单数量
 */

export const orderCount = date => fetch('/api/statis/order/' + date + '/count');


/**
 * 某一天管理员注册量
 */

export const adminDayCount = date => fetch('/api/statis/admin/' + date + '/count');

/**
 * 管理员列表
 */

export const adminList = data => fetch('/admin/all', data);

/**
 * 管理员数量
 */

export const adminCount = () => fetch('/api/admin/count');

/**
 * 获取定位城市
 */

export const cityGuess = () => fetch('/api/v1/cities', {
	type: 'guess'
});

/**
 * 添加商铺
 */

export const addShop = data => fetch('/api/admin/shop/create', data, 'POST');

/**
 * 获取搜索地址
 */

export const searchplace = data => fetch('/api/img/map/search', data, 'POST');

/**
 * 获取当前店铺食品种类
 */

export const getCategory = data => fetch('/api/admin/shop/productCategory/list',data,'POST');
 
/**
 * 添加食品种类
 */

export const addCategory = data => fetch('/api/admin/shop/productCategory/create', data, 'POST');


/**
 * 添加食品
 */

export const addFood = data => fetch('/api/admin/shop/createProduct', data, 'POST');


/**
 * category 种类列表
 */

export const foodCategory = (latitude, longitude) => fetch('/api/shopping/v2/restaurant/category');

/**
 * 获取餐馆列表
 */

export const getResturants = data => fetch('/api/admin/shop/list', data,'POST');

/**
 * 获取餐馆详细信息
 */

export const getResturantDetail = restaurant_id => fetch('/api/shopping/restaurant/' + restaurant_id);

/**
 * 获取餐馆数量
 */

export const getResturantsCount = () => fetch('/api/shopping/restaurants/count');

/**
 * 更新餐馆信息
 */

export const updateResturant = data => fetch('/api/admin/shop/update', data, 'POST');

export const createResturant = data => fetch('/api/admin/shop/create', data, 'POST');

/**
 * 删除餐馆
 */

export const disableShop = data => fetch('/api/admin/shop/invalid',data , 'POST');

//通过审核 
export const validShop = data => fetch('/api/admin/shop/valid',data , 'POST');

export const verifyShop = data => fetch('/api/admin/shop/verify',data , 'POST');

/**
/**
 * 获取食品列表
 */

export const getFoods = data => fetch('/api/admin/shop/productList', data,'POST');

/**
 * 获取食品数量
 */

export const getFoodsCount = data => fetch('/api/shopping/v2/foods/count', data);


/**
 * 获取menu列表
 */

export const getMenu = data => fetch('/api/shopping/v2/menu', data);

/**
 * 获取menu详情
 */

export const getMenuById = category_id => fetch('/api/shopping/v2/menu/' + category_id);

/**
 * 更新食品信息
 */

export const updateFood = data => fetch('/api/admin/shop/editProduct', data, 'POST');

/**
 * 删除食品
 */

export const deleteFood = data => fetch('/api/admin/shop/productRemove', data, 'POST');

/**
 * 获取用户列表
 */

export const getUserList = data => fetch('/api/admin/user/list', data,'POST');

/**
 * 获取用户数量
 */

export const getUserCount = data => fetch('/api/v1/users/count', data);

/**
 * 获取订单列表
 */

export const getOrderList = data => fetch('/api/admin/order/shopOrderList', data,'POST');

/**
 * 获取订单数量
 */

export const getOrderCount = data => fetch('/api/bos/orders/count', data);

/**
 * 获取用户信息
 */

export const getUserInfo = user_id => fetch('/api/v1/user/' + user_id);

/**
 * 获取地址信息
 */

export const getAddressById = address_id => fetch('/api/v1/addresse/' + address_id);

/**
 * 获取用户分布信息
 */

export const getUserCity = () => fetch('/api/v1/user/city/count');

//banner 添加 编辑 列表 删除
export const bannerList = data => fetch('/api/admin/banner/list', data);
export const bannerDel = id => fetch(`/api/admin/banner/delete?id=${id}`);
export const bannerEdit = data => fetch('/api/admin/banner/edit', data,'POST');
export const bannerAdd = data => fetch('/api/admin/banner/create', data,'POST');
