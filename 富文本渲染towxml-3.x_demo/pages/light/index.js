//获取应用实例
const app = getApp();
Page({
	data: {
		isLoading: true,
		article: {}
	},
	onLoad: function () {
		const _ts = this;

		app.getText('https://www.vvadd.com/wxml_demo/demo.txt?v=2',res => {
			let obj = app.towxml(`<p class="p">
			<span class="span">1、第1-3天<span class="span" style="color: rgb(255, 0, 0);">＋5V力</span>，第4-6天<span class="span" style="color: rgb(255, 0, 0);">+7V力</span>，第7天<span class="span" style="color: rgb(255, 0, 0);">+10V力</span>（限连续签到）<span class="span">。&nbsp;</span></span>
	</p>
	<p class="p">
			<span class="span">2、每7天为一个周期，若中途中断，则继续从第1天重新计算。&nbsp;</span>
	</p>
	<p class="p">
			<span class="span">3、签到获得的V力可用兑换精美礼品&nbsp;&nbsp;</span>
	</p>
	<p class="p">
			<span class="span">4、为了避免V力的浪费，每年都会有V力清零计划（清除前一年累计的V力），届时请提前使用完您的V力。</span>
	</p>`,'html',{
				// theme:'dark',
				events:{
					tap:e => {
						console.log('tap',e);
					},
					change:e => {
						console.log('todo',e);
					}
				}
			});

			_ts.setData({
				article:obj,
				isLoading: false
			});
		});
		
	}
})