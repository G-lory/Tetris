class TetrisGame {
	constructor() {
		this.init()
	}
	init() {
		this.mainField = new Field(10, 20, 'main')	// 游戏主区域 
		this.nextField = new Field(4, 4, 'next')	// 显示下一个方块的区域
		this.curSquare = new Square(0, 2)			// 每个时刻存在两个方块 一个是当前下落的
		this.nextSquare = new Square(0, 0)			// 一个是下一个出现的方块
		this.timer = null
		this.score = 0
		this.time = 0
		this.level = 1
		this.paused = false
		if (this.gameOverDiv) {
			var mf = document.getElementById('main')
			mf.removeChild(this.gameOverDiv)
			this.gameOverDiv = null
		} else {
			this.gameOverDiv = null
		}
		this.gameOvered = false
	}
	update() {
		// 每0.5秒执行一次update() 以此计时
		this.time++
		setEleContent('time', Math.floor(this.time / 2))
		// 如果当前方块不能掉落
		if (!this.mainField.down()) {
			// 先消行
			var line = this.mainField.clearLine()
			this.addScore(line)
			// 主区域满了 游戏结束 
			if (this.mainField.isFull()) {
				this.gameOver()
				return
			}
			// 否则生成一个新的方块
			this.curSquare = this.nextSquare
			this.curSquare.y = 2
			this.nextSquare = new Square(0,0)
			this.nextField.addSquare(this.nextSquare)
			// 生成的新方块位置不合法 游戏结束
			if (!this.mainField.addSquare(this.curSquare)) {
				this.gameOver()
				return
			}
		}
	}
	// 响应键盘事件
	handleKeyEvent(e) {
		var k = e.keyCode
		// log(k)
		var f = this.mainField

		if (k == 32) {
			this.pause()
			playMusic('move')
		}
		// 暂停时不接受其他指令
		if (this.paused) return
		if (k == 38 || k == 87) { // up or w
			f.rotate()
			playMusic('move')
		} else if (k == 39 || k == 68) { // right or d
			f.right()
			playMusic('move')
		} else if (k == 37 || k == 65) { // left or a
			f.left()
			playMusic('move')
		} else if (k == 40 || k == 83) { // down or s
			f.fall()
			playMusic('move')
		} 
	}
	gameOver() {
		// alert('游戏结束')
		// 显示游戏结束字样的div （go:= GameOver
		var mf = document.getElementById('main')
		this.gameOverDiv = document.createElement('div')
		var go = this.gameOverDiv
		go.style.position = 'absolute'
		go.style.top = '50px'
		go.style.left = '30px'
		go.style.color = 'red'
		go.style.fontSize = '30px'
		go.innerHTML = '游戏结束'
		mf.appendChild(go)
		// log(mf)
		playMusic('gameOver')
		this.clearTimer()
		document.onkeydown = null
		this.gameOvered = true
	}

	start() {
		// 开始游戏 在两个区域设置显示的方块
		this.mainField.addSquare(this.curSquare)
		this.nextField.addSquare(this.nextSquare);
		// 设置键盘事件
		document.onkeydown = (e) => this.handleKeyEvent(e)
		this.setTimer()
	}

	setTimer() {
		// 箭头函数使得this为当前对象 或者setInterval(this.update.bind(this), 500)
		this.timer = setInterval(()=>this.update(), 500)
	}

	clearTimer() {
		// 清除定时器
		window.clearInterval(this.timer)
		this.timer = null
	}

	addScore(line) {
		// 根据消除的行数添加分数
		this.score += (1 + line) * line * 5
		setEleContent('score', this.score)
	}

	pause() {
		if (this.gameOvered) {
			return
		}
		if (this.paused) {
			this.setTimer()
			this.paused = false
		} else {
			this.clearTimer()
			this.paused = true
		}
		playMusic('move')
	}

	destory() {
		this.clearTimer()
		this.mainField.destory()
		this.nextField.destory()
	}

	restart() {
		playMusic('move')
		this.destory()
		this.init()
		this.start()
	}
}



