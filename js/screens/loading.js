// based off of https://github.com/melonjs/melonJS/blob/master/src/loader/loadingscreen.js
let ProgressBar = me.Renderable.extend({
  init: function (x, y, w, h) {
    this._super(me.Renderable, 'init', [x, y, w, h])
    // flag to know if we need to refresh the display
    this.invalidate = false
    // current progress
    this.progress = 0

    this.anchorPoint.set(0, 0)
  },
  onProgressUpdate: function (progress) {
    this.progress = ~~(progress * this.width)
    this.invalidate = true
  },
  update: function () {
    if (this.invalidate === true) {
      // clear the flag
      this.invalidate = false
      // and return true
      return true
    }
    // else return false
    return false
  },
  draw: function (renderer) {
    var color = renderer.getColor()
    var height = renderer.getHeight()

    // draw the progress bar
    renderer.setColor('#1F1F1F')
    renderer.fillRect(this.pos.x, height / 2, this.width, this.height / 2)

    renderer.setColor('#C4CFA1')
    renderer.fillRect(this.pos.x, height / 2, this.progress, this.height / 2)

    renderer.setColor(color)
  }
})

game.ScreenLoading = me.ScreenObject.extend({
  onResetEvent: function () {
    me.game.world.addChild(new me.ColorLayer('background', '#8B956D', 0), 0)

    // progress bar
    let progressBar = new ProgressBar(
        0,
        me.video.renderer.getHeight() / 2,
        me.video.renderer.getWidth(),
        8 // bar height
    )

    this.loaderHdlr = me.event.subscribe(
        me.event.LOADER_PROGRESS,
        progressBar.onProgressUpdate.bind(progressBar)
    )

    this.resizeHdlr = me.event.subscribe(
        me.event.VIEWPORT_ONRESIZE,
        progressBar.resize.bind(progressBar)
    )

    me.game.world.addChild(progressBar, 1)
  },
  onDestroyEvent: function () {
    me.event.unsubscribe(this.loaderHdlr)
    me.event.unsubscribe(this.resizeHdlr)
    this.loaderHdlr = this.resizeHdlr = null
  }
})
