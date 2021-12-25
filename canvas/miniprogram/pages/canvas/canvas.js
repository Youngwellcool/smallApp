Page({
    data: {

    },
    drawImage() {
      let ctx = wx.createCanvasContext('myCanvas');
      ctx.rect(20,20,200,100);
      /*ctx.setFillStyle('#00f');
      ctx.fill();*/
      ctx.setStrokeStyle('#00f')
      ctx.stroke();

      ctx.beginPath()
      ctx.arc(150, 120, 50, 0, Math.PI)
      ctx.setFillStyle('#f00');
      ctx.fill();

      // ctx.beginPath();
      // ctx.arc(100, 75, 50, 0, Math.PI)
      // ctx.setFillStyle('#EEEEEE')
      // ctx.fill()

      ctx.draw();
    },
    onLoad() {
        this.drawImage()
    },
})