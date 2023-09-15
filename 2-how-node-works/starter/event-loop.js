const fs = require('fs');
const crypto = require('crypto');
const start = Date.now();

setTimeout(() => {
  console.log('Timer 1 finished');
}, 0);
setImmediate(() => console.log('immidiate 1 finished'));

fs.readFile('text-file.txt', () => {
  console.log('I/O finished');

  setTimeout(() => {
    console.log('Timer 3 finished');
  }, 3000);

  setTimeout(() => {
    console.log('Timer 2 finished');
  }, 0);

  setImmediate(() => console.log('immidiate 2 finished'));

  process.nextTick(() => console.log('Process.nextTick'));

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });

  crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
});

console.log('Hello from the top-level code');
