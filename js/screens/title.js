game.ScreenTitle = me.ScreenObject.extend({
  onResetEvent: function () {
    let background = new me.Sprite(0, 0, {
      image: me.loader.getImage('titlescreen')
    })
    background.anchorPoint.set(0, 0)
    background.scale(me.game.viewport.width / background.width, me.game.viewport.height / background.height)
    me.game.world.addChild(background, 1)

    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keycode, edge) {
      if (action == 'action') {
        me.state.change(me.state.PLAY)
      }
    })
  },
  onDestroyEvent: function () {
    me.event.unsubscribe(this.handler)
  }
})
