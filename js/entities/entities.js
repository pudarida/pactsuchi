game.EntityPlayer = me.Entity.extend({
  init: function (x, y, settings) {
    let _settings = {
      image: me.loader.getImage('tsuchi'),
      width: 16,
      height: 16,
      framewidth: 16,
      frameheight: 16,
      anchorPoint: new me.Vector2d(0.5, 0.5)
    }
    Object.assign(settings, _settings)
    this._super(me.Entity, 'init', [x, y, settings])

    this.alwaysUpdate = true

    this.body.gravity = 0
    this.body.setVelocity(1, 1)
    this.body.collisionType = me.collision.types.PLAYER_OBJECT

    this.renderable.addAnimation('walk', [0, 1], 200)
    this.renderable.addAnimation('idle', [0], 200)
    this.renderable.setCurrentAnimation('idle')

    me.game.viewport.follow(this.pos, me.game.viewport.AXIS_BOTH)

    game.data.keys = 0

    this.hurt = false

    me.state.current().player = this
  },
  addHp: function () {
    game.data.hp += 1
    game.data.hp = game.macro.clamp(game.data.hp, 0, 3)
    console.log('hp:', game.data.hp)
  },
  addScore: function (amount) {
    game.data.score += amount
    console.log('score', game.data.score)
  },
  addKey: function () {
    game.data.keys += 1
    game.data.keys_left -= 1
    if (game.data.keys_left <= 0) {
      game.data.exit.open()
    }
  },
  takeDamage: function () {
    if (!this.hurt) {
      this.hurt = true
      game.data.hp -= 1
      game.data.hp = game.macro.clamp(game.data.hp, 0, 3)

      if (game.data.hp <= 0) {
        this.alive = false
      } else {
        if (!this.renderable.isFlickering()) {
          this.renderable.flicker(750)
        }
      }
    }
  },
  update: function (dt) {
    if (this.alive) {
      let dy = me.input.isKeyPressed('down') - me.input.isKeyPressed('up'),
        dx = me.input.isKeyPressed('right') - me.input.isKeyPressed('left')

            // handle movement
      if (!dx || !dy) {
        let l = Math.sqrt(dx * dx + dy * dy)
        dx /= 1
        dy /= 1
      }
      this.body.vel.x = (dx * this.body.accel.x) * me.timer.tick
      this.body.vel.y = (dy * this.body.accel.y) * me.timer.tick

      this.body.update(dt)

      me.collision.check(this)

            // update animation
      if (!this.renderable.isFlickering()) this.hurt = false

      if (dx || dy) {
        if (!this.renderable.isCurrentAnimation('walk')) {
          this.renderable.setCurrentAnimation('walk')
        }
      } else {
        if (!this.renderable.isCurrentAnimation('idle')) {
          this.renderable.setCurrentAnimation('idle')
        }
      }
      if (dx > 0) this.renderable.flipX(false)
      if (dx < 0) this.renderable.flipX(true)

      return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0)
    } else {
      this.body.setCollisionMask(me.collision.types.NO_OBJECT)
      me.game.viewport.unfollow()
      me.game.viewport.moveTo(0, 0)
      me.state.change(me.state.GAMEOVER)
    }
  },
  onCollision: function (response, other) {
    switch (other.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        return true
      case me.collision.types.ACTION_OBJECT:
        if (other.isOpen()) {
          if (Math.abs(response.overlapV.y) > 8 || Math.abs(response.overlapV.x) > 8) {
            me.levelDirector.loadLevel(other.settings.destination)
          }
          return false
        }
        return true
      case me.collision.types.COLLECTABLE_OBJECT:
        other.collect(this)
        return false
      case me.collision.types.ENEMY_OBJECT:
        if (Math.abs(response.overlapV.y) > 4 || Math.abs(response.overlapV.x) > 4) {
          return true
        }
      default:
        return false
    }
  }
}) // EntityPlayer

game.EntityEnemy = me.Entity.extend({
  init: function (x, y, settings) {
    let _settings = {
      image: me.loader.getImage(`crul_${settings.type}`),
      width: 16,
      height: 16,
      framewidth: 16,
      frameheight: 16,
      anchorPoint: new me.Vector2d(0.5, 0.5)
    }
    Object.assign(settings, _settings)
    this._super(me.Entity, 'init', [x, y, settings])

    this.alwaysUpdate = true

    this.body.gravity = 0
    this.body.setVelocity(1, 1)
    this.body.collisionType = me.collision.types.ENEMY_OBJECT

    this.renderable.addAnimation('down', [0, 1], 200)
    this.renderable.addAnimation('left', [2, 3], 200)
    this.renderable.addAnimation('up', [4, 5], 200)
    this.renderable.addAnimation('right', [6, 7], 200)

    this.renderable.setCurrentAnimation('down')

    game.macro.randomize()
    this.direction = game.macro.randi(4)
  },
  update: function (dt) {
    if (me.state.current().player.alive) {
      let dx = 0,
        dy = 0

      this.body.update(dt)

      me.collision.check(this)

          // handle movement
      switch (this.direction) {
        case 0: // down
          dy = 1
          break
        case 1: // left
          dx = -1
          break
        case 2: // up
          dy = -1
          break
        case 3: // right
          dx = 1
          break
      }
      this.body.vel.x = (dx * this.body.accel.x) * me.timer.tick
      this.body.vel.y = (dy * this.body.accel.y) * me.timer.tick

      this.updateAnimation()

      return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0)
    }
  },
  updateAnimation: function () {
    switch (this.direction) {
      case 0: // down
        if (!this.renderable.isCurrentAnimation('down')) {
          this.renderable.setCurrentAnimation('down')
        }
        break
      case 1: // left
        if (!this.renderable.isCurrentAnimation('left')) {
          this.renderable.setCurrentAnimation('left')
        }
        break
      case 2: // up
        if (!this.renderable.isCurrentAnimation('up')) {
          this.renderable.setCurrentAnimation('up')
        }
        break
      case 3: // right
        if (!this.renderable.isCurrentAnimation('right')) {
          this.renderable.setCurrentAnimation('right')
        }
        break
    }
  },
  onCollision: function (response, other) {
    switch (other.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        this.direction = game.macro.randi(4)
        return true
      case me.collision.types.PLAYER_OBJECT:
        if (Math.abs(response.overlapV.y) > 4 || Math.abs(response.overlapV.x) > 4) {
          other.takeDamage()
        }
        return false
      default:
        return false
    }
  }
}) // EntityEnemy

game.EntityItem = me.Entity.extend({
  init: function (x, y, settings) {
    let _settings = {
      image: me.loader.getImage('item_tiles'),
      width: 16,
      height: 16,
      framewidth: 16,
      frameheight: 16,
      anchorPoint: new me.Vector2d(0.5, 0.5)
    }
    Object.assign(settings, _settings)
    this._super(me.Entity, 'init', [x, y, settings])

        // only collide with player object
    this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT)
    this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT

    this.renderable.addAnimation('bun', [0])
    this.renderable.addAnimation('coin', [1])
    this.renderable.addAnimation('key', [2])

    this.renderable.setCurrentAnimation(this.type)

    if (this.type == 'key') game.data.keys_left += 1
    console.log('keys_left:', game.data.keys_left)
  },
  collect: function (collector) {
    this.body.setCollisionMask(me.collision.types.NO_OBJECT)

    switch (this.type) {
      case 'bun':
        collector.addScore(5)
        collector.addHp()
        break
      case 'coin':
        collector.addScore(1)
        break
      case 'key':
        collector.addScore(2)
        collector.addKey()
        break
    }

    let _container = me.game.getParentContainer(this)
    _container.removeChild(this)
  },
  onCollision: function (response, other) {
    return false
  }
}) // EntityItem

game.EntityDoor = me.Entity.extend({
  init: function (x, y, settings) {
    let _settings = {
      image: me.loader.getImage('world_tiles'),
      width: 16,
      height: 16,
      framewidth: 16,
      frameheight: 16,
      anchorPoint: new me.Vector2d(0.5, 0.5)
    }
    Object.assign(settings, _settings)
    this._super(me.Entity, 'init', [x, y, settings])

    this.settings = settings

    this.alwaysUpdate = true

    this.body.gravity = 0
    this.body.setVelocity(0, 0)
    this.body.collisionType = me.collision.types.ACTION_OBJECT

    this.renderable.addAnimation('closed', [6])
    this.renderable.addAnimation('open', [7])

    this.renderable.setCurrentAnimation('closed')

    game.data.exit = this
  },
  isOpen: function () {
    return this.renderable.isCurrentAnimation('open')
  },
  open: function () {
    if (!this.isOpen()) {
      this.renderable.setCurrentAnimation('open')
    }
    this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT)
  },
  closed: function () {
    if (this.isOpen()) {
      this.renderable.setCurrentAnimation('closed')
    }
    this.body.setCollisionMask(me.collision.types.NO_OBJECT)
  },
  onCollision: function (response, other) {
    return false
  }
}) // EntityDoor
