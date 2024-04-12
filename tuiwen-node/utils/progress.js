const readline = require('readline');

class Prograss {
  constructor(options) {
    this.index = 0;
    this.timer = null;
    this.duration = options?.duration || 300;
  }

  getPercent() {
    if (this.index >= 100) {
      clearInterval(this.timer);
    }

    let arr = []
    for (let i = 0; i < 10; i++) {
      if (i * 10 < this.index) {
        arr.push("■")
      } else {
        arr.push("_")
      }
    }

    return arr.join("")
  }

  start() {
    console.log(`[${this.getPercent()}] ${this.index}%`)
    this.timer = setInterval(() => {
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
      this.index = this.index + 10;
      console.log(`[${this.getPercent()}] ${this.index}%`)
    }, this.duration)
  }
}

module.exports = Prograss;