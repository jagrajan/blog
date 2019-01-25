const { get, set } = require('./src/cache/auth-cache');

set('abc', 'def', 'ghi', (err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully enter value');
  }
});

get('abc', (err, value) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Values: ', value);
  }
});

get('def', (err, value) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Values: ', value);
  }
});
