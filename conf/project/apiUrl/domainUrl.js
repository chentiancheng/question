/**
所有不属于当前项目的链接

即需要携带域名的链接

因此类链接通常是固定的一个链接，其他项目直接引用，在此处配置成一个列表，防止此链接若有修改需在业务代码中重复修改的情况

一个链接需要配置 本地/联调/测试/预生产/生产五个环境的

**/

module.exports = {

	//理顾宝红包发红包页面
	rpkpGiveRedEnvelopesUrl: {
		local: '',
		dev: '',
		test: 'https://rpkptest.chtwmtest.com/redPacket/views/giveRedEnvelopes.html',
        preProduction: 'https://rpkp.haomalljf.com/redPacket/views/giveRedEnvelopes.html',
        production: 'https://rpkp.chtwm.com/redPacket/views/giveRedEnvelopes.html'

	} 


}




