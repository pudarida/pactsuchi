game.ScreenPlay = me.ScreenObject.extend({
  onResetEvent: function () {
    game.data.score = 0

    me.levelDirector.loadLevel(game.data.level_previous)

    this.HUD = new game.HUD.Container()
    me.game.world.addChild(this.HUD)
  },
  onDestroyEvent: function () {
    me.game.world.removeChild(this.HUD)
  }
})
