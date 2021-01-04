async function get() {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => i, 3000);
  }
}

const promises = [];
