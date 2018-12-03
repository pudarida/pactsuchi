game.HUD = game.HUD || {}

game.HUD.Container = me.Container.extend({
  init: function () {
    this._super(me.Container, 'init')

    this.isPersistent = true

    this.floating = true

    this.addChild(new game.HUD.Window(0, 120))
    this.addChild(new game.HUD.Health(8, 128))
    this.addChild(new game.HUD.Key(44, 128))
    this.addChild(new game.HUD.LabelKey(51, 127))
    this.addChild(new game.HUD.LabelScore(81, 127))
  }
}) // HUD.Container

game.HUD.Window = me.Sprite.extend({
  init: function (x, y) {
    let settings = {
      image: me.loader.getImage('hud_window')
    }
    this._super(me.Sprite, 'init', [x, y, settings])
    this.anchorPoint.set(0, 0)
  }
}) // HUD.Window

game.HUD.Health = me.Sprite.extend({
  init: function (x, y) {
    let settings = {
      image: me.loader.getImage('hud_hp'),
      framewidth: 32,
      frameheight: 8
    }
    this._super(me.Sprite, 'init', [x, y, settings])
    this.anchorPoint.set(0, 0)

    this.addAnimation('default', [0, 1, 2, 3])
    this.setCurrentAnimation('default')
  },
  update: function (dt) {
    this.setAnimationFrame(game.data.hp)
  }
}) // HUD.Health

game.HUD.Key = me.Sprite.extend({
  init: function (x, y) {
    let settings = {
      image: me.loader.getImage('hud_key')
    }
    this._super(me.Sprite, 'init', [x, y, settings])
    this.anchorPoint.set(0, 0)
  }
}) // HUD.Key

game.HUD.LabelKey = me.Renderable.extend({
  init: function (x, y) {
    this._super(me.Renderable, 'init', [x, y])

    this.font = new me.BitmapFont(me.loader.getBinary('ProggyTinySZ'), me.loader.getImage('ProggyTinySZ'))

    this.amount = -1
  },
  update: function () {
    if (this.amount !== game.data.keys.keys) {
      this.amount = game.data.keys.keys
      return true
    }
    return false
  },

  draw: function (context) {
    this.font.draw(context, `:${game.data.keys.toString().padStart(2, '0')}`, this.pos.x, this.pos.y)
  }

}) // HUD.LabelKey

game.HUD.LabelScore = me.Renderable.extend({
  init: function (x, y) {
    this._super(me.Renderable, 'init', [x, y])

    this.font = new me.BitmapFont(me.loader.getBinary('ProggyTinySZ'), me.loader.getImage('ProggyTinySZ'))

    this.score = -1
  },
  update: function () {
    if (this.score !== game.data.score) {
      this.score = game.data.score
      return true
    }
    return false
  },
  draw: function (context) {
    this.font.draw(context, `Score:${game.data.score.toString().padStart(6, '0')}`, this.pos.x, this.pos.y)
  }

}) // HUD.LabelScore
