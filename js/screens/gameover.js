game.ScreenGameOver = game.ScreenGameOver || {}

let Overlay = me.Sprite.extend({
  init: function (x, y) {
    let settings = {
      image: me.loader.getImage('gameover')
    }
    this._super(me.Sprite, 'init', [x, y, settings])
    this.anchorPoint.set(0, 0)
  }
})

game.ScreenGameOver = me.ScreenObject.extend({
  onResetEvent: function () {
    me.game.world.addChild(new me.ColorLayer('background', '#C4CFA1', 0), 0)

    this.overlay = new Overlay(0, 0)
    me.game.world.addChild(this.overlay)

    this.HUD = new game.HUD.Container()
    me.game.world.addChild(this.HUD)

    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keycode, edge) {
      if (action == 'action') {
        me.state.change(me.state.PLAY)
      }
    })
  },

  onDestroyEvent: function () {
    me.game.world.removeChild(this.overlay)
    me.game.world.removeChild(this.HUD)
    me.event.unsubscribe(this.handler)
  }
})
