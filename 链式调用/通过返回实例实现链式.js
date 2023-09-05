class n {
  constructor(value) {
    this.value = value
  }

  add(count) {
    this.value += count

    return this
  }

  minus(count) {
    this.value -= count

    return this
  }

  get() {
    return this.value
  }
}

const nn = new n(12)

const num = nn.add(150).minus(32).get()

console.log(num)
