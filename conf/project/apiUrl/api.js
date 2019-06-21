
/*
* @page: 接口地址
* @Author: songxiaoyu
* @Date:   2019-01-18 13:33:35
* @Last Modified by:   songxiaoyu
* @description:
*/

module.exports = {
    // getActivityApi : '/brand/public/getActivity',
	// totalEmpApi : '/wap/user/redpacket/totalEmp',
    //    questionnaire:'/questionnaire/answer/detail'
    //营销活动 问卷调查
       questionnaireadd:'/questionnaire/answer/add',//添加问卷内容
       cityList:'/questionnaire/city/list',//根据省市Id获取下辖城市list
       statistics:'/questionnaire/answer/statistics',//判断用户是否填过调查文件
       toWxOAuth:'/questionnaire/toWxOAuth'//授权跳转接口 
       
};