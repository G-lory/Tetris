class Field {
    constructor(width, height, name) {
        this.width = width                      // 显示区域的宽
        this.height = height                    // 显示区域的高
        this.data = []                          // 显示区域的数据 不同的数据显示不同的颜色
        this.square = null                      // 要显示的方块
        this.fieldDivs = []                     // 显示区域的元素集合
        this.fieldEle = document.getElementById(name)   // 根据id获得显示区域
        this.init()
    }
    // 初始化方法
    init() {
        var data = this.data
        var h = this.height
        var w = this.width
        // 初始化游戏主区域的方格 数据全为0表示区域空
        for (var i = 0; i < h; i++) {
            data[i] = new Array()
            for (var j = 0; j < w; j++) {
                data[i].push(0)
            }
        }
        // 创建元素 添加进页面 定义游戏区域的样式 并获取元素
        for (var i = 0; i < h; i++) {
            var div = []
            for (var j = 0; j < w; j++) {
                var node = document.createElement('div')
                node.className = 'none'
                node.style.top = (i * 20) + 'px'
                node.style.left = (j * 20) + 'px'
                this.fieldEle.appendChild(node)
                div.push(node)
            }
            this.fieldDivs.push(div)
        }
    }
    // 在区域中添加一个新的方块
    addSquare(square) {
        //log(square)
        if (this.square) {
            this.clearSquare(this.square)
        }
        this.square = square
        this.setSquare()
        this.refresh()
        if (!this.isSquareValid(square)) {
            square.fixed()
            this.setSquare()
            this.refresh()
            return false
        }
        return true
        //log(this.data)
    }
    // 判断一个点的位置是否合法（边界之内且为空
    isPointValid(x, y) {
        return (x >= 0 && y >= 0 && x < this.height && y < this.width 
                && this.data[x][y] != 1)
    }
    // 判断方块所在位置是否合法
    isSquareValid(square) {
        var data = square.data
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                var x = square.x + i
                var y = square.y + j
                if (data[i][j] && !this.isPointValid(x, y)) return false
            }
        }
        return true
    }
    // 方块向下移
    down() {
        var square = this.square
        square.down()
        if (this.isSquareValid(square)) {
            square.up()         // 先移回原位
            this.clearSquare()  // 清除现在方块所在位置的数据
            square.down()       // 向下移
            this.setSquare()    // 将方块数据添加到该区域
            this.refresh()      // 移动之后要刷新页面
            return true
        } else {
            square.up()             // 如果移动失败就取消移动
            this.clearSquare()      // 清除现在方块所在位置的数据
            square.fixed()          // 当一个方块无法再向下的时候，它应该被固定
            this.setSquare()        // 将方块数据添加到该区域
            //log(square.data)
            this.refresh()
            return false
        }
    }
    // 左移 逻辑与下移相同
    left() {
        var square = this.square
        square.left()
        if (this.isSquareValid(square)) {
            // log('valid')
            // log(square)
            square.right()
            this.clearSquare()
            square.left()
            this.setSquare()
            this.refresh()
        } else {
            square.right()
        }
    }
    // 右移
    right() {
        var square = this.square
        square.right()
        if (this.isSquareValid(square)) {
            square.left()
            this.clearSquare()
            square.right()
            this.setSquare()
            this.refresh()
        } else {
            square.left()
        }
    }
    // 旋转
    rotate() {
        var square = this.square
        square.leftRotate()
        if (this.isSquareValid(square)) {
            square.rightRotate()
            this.clearSquare()
            square.leftRotate()
            this.setSquare()
            this.refresh()
        } else {
            square.rightRotate()
        }
    }
    // 坠落
    fall() {
        while (this.down()) this.down()
    }
    // 当有一行满了的时候，消除一行，返回消除行数
    clearLine() {
        var line = 0
        var w = this.width
        var h = this.height
        // 要从最下面一行开始判断
        for (var i = h - 1; i >= 0; i--) {
            var full = true
            for (var j = 0; j < w; j++) {
                if (this.data[i][j] != 1) {
                    full = false
                    break
                }
            }
            if (full) {
                line++
                // 如果满了 就从下往上依次覆盖下一行 最上面一行清空
                for (var j = i; j > 0; j--) {
                    // ‘...’扩展运算符 可以实现数组和对象的浅拷贝
                    this.data[j] = [...this.data[j-1]]
                }
                for (var j = 0; j < w; j++) {
                    //log('y')
                    this.data[0][j] = 0
                }
                // 因为清空导致整体下移一行 所以要重新判断第i行
                i++
                //log(this.data)
                this.refresh()
            }
        }
        if (line) {
            playMusic('clearLine')
        }
        return line
    }
    // 判断区域是否被填满
    isFull() {
        // 如果第一行也有数据的话 证明区域已经被填满了
        for (var i = 0; i < this.width; i++) {
            if (this.data[0][i]) return true
        }
        return false
    }
    // 清除方块在区域的数据
    clearSquare() {
        var {x, y, data} = this.square
        // 这里有点乱= = data是方块的数据 this.data是区域的数据
        // 此处要将方块的数据复制到对应位置的区域数据
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (this.isPointValid(x+i, y+j)) {
                    this.data[x+i][y+j] = 0
                }
            }
        }
    }
    // 将方块数据添加到该区域
    setSquare() {
        var {x, y, data} = this.square
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (this.isPointValid(x+i, y+j)) {
                    this.data[x+i][y+j] = data[i][j]
                }
            }
        }
    }
    // 将data数据渲染到页面
    refresh() {
        var data = this.data
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] == 0) {
                    this.fieldDivs[i][j].className = 'none'
                    // log(i, j)
                } else if (data[i][j] == 1) {
                    this.fieldDivs[i][j].className = 'done'
                    // log(i, j)
                } else if (data[i][j] == 2) {
                    this.fieldDivs[i][j].className = 'current'
                }
            }
        }
        //log(data)
    }
    // 删除DOM元素
    destory() {
        var divs = this.fieldDivs
        if (divs) {
            for (var i = 0; i < divs.length; i++) {
                for (var j = 0; j < divs[0].length; j++) {
                    this.fieldEle.removeChild(divs[i][j])
                }
            }
        }

    }

}

