const app = getApp();
var that = null;
Page({
	data: {
		deliveryCost: 0,
		deliveryType: 'fast',
		addressData: {
			name: '张三',
			phone: '18912345678',
			address: "深圳市南山区"
		}
	},
	onDeliveryTypeChange(e) {
		this.setData({
			deliveryType: e.detail.value
		})
	},
	getremark(e) {
		that.remark = e.detail.value;
	},

	onLoad() {
		that = this;
		let ids = wx.getStorageSync('ids');
		app.getBillList({
			ids: ids,
			success(list) {
				const totalAmount = list.reduce((amount, good) => {
					return (amount + good.number * good.price);
				}, 0);
				that.setData({
					ids: ids,
					billNum: list.length,
					billList: list,
					totalAmount
				})
			}
		});
	},
	submitorder() {
		wx.requestSubscribeMessage({
			tmplIds: [app.tid],
			success (res) {
			  console.log(res)
			  if(res[app.tid]=='accept'){
				that.excute()
			  } else {
				wx.showModal({
					content:'商城需要发送消息以保证消息即时性，不会向你推送无关内容，请重新允许通知！',
					showCancel:false
				  })
			  }
			},
			fail(e){
			  console.log(e)
			  wx.showModal({
				content:'商城需要发送消息以保证消息即时性，不会向你推送无关内容，请重新允许通知！',
				showCancel:false
			  })
			}
		  })
	},
	excute(){
		app.submitorder({
			ids: that.data.ids,
			deliveryType: that.data.deliveryType,
			addressData: that.data.addressData,
			remark: that.remark,
			success() {
				wx.switchTab({
					url: '../order/order',
				})
			}
		})
	}
})