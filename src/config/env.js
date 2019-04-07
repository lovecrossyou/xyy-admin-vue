/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */
let baseUrl = 'http://47.94.169.143:8004/'; 
let routerMode = 'hash';
let baseImgPath;

if (process.env.NODE_ENV == 'development') {
	baseUrl = '';
    baseImgPath = '/static/img/';
}else{
	// baseUrl = '//elm.cangdu.org';
	// baseUrl = '//elm.cangdu.org';
    // baseImgPath = '//elm.cangdu.org/img/';
}

export {
	baseUrl,
	routerMode,
	baseImgPath
}