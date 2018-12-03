
/* Game namespace */
var game = {

  // an object where to store game information
  data: {
    level_previous: 'debug',
    hp: 3,
    keys: 0,
    keys_left: 0,
    score: 0,
    exit: null
  },

  macro: {
    randomize: function () {
      Math.random()
      Math.random()
    },
    randi: function (max) {
      return Math.floor(Math.random() * max)
    },
    clamp: function (val, min, max) {
      return Math.min(Math.max(min, val), max)
    }
  },

  // Run on page load.
  onload: function () {
    // Initialize the video.
    if (!me.video.init(160, 144, {wrapper: 'screen', scale: '2', antiAlias: false})) {
      alert('Your browser does not support HTML5 canvas.')
      return
    }

    // map keys
    let keys = {
      up: [ me.input.KEY.UP, me.input.KEY.W ],
      down: [ me.input.KEY.DOWN, me.input.KEY.S ],
      left: [ me.input.KEY.LEFT, me.input.KEY.A ],
      right: [ me.input.KEY.RIGHT, me.input.KEY.D ],
      action: [ me.input.KEY.ENTER, me.input.KEY.SPACE ]
    }

    // bind key map
    Object.keys(keys).forEach(function (key) {
      keys[key].forEach(function (code) {
        me.input.bindKey(code, key)
      })
    })

    // set screens
    me.state.set(me.state.LOADING, new game.ScreenLoading())
    me.state.set(me.state.MENU, new game.ScreenTitle())
    me.state.set(me.state.PLAY, new game.ScreenPlay())
    me.state.set(me.state.GAMEOVER, new game.ScreenGameOver())

    // Initialize the audio.
    me.audio.init('mp3,ogg')

    // set and load all resources.
    me.loader.preload(game.resources, this.loaded.bind(this), true)
  },

  // Run on game resources loaded.
  loaded: function () {
    // add our player entity in the entity pool
    me.pool.register('player', game.EntityPlayer)
    me.pool.register('enemy', game.EntityEnemy)
    me.pool.register('item', game.EntityItem)
    me.pool.register('door', game.EntityDoor)

    // Start the game.
    me.state.change(me.state.MENU)
  }
}
