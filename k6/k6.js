import http from 'k6/http';
import { check } from 'k6';
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function () {
  return JSON.parse(open('./users.json'));
});

export const options = {
  vus: 100,
  iterations: 5000,
};

export default function () {
  const user = users[__ITER % users.length];

  const url = 'http://localhost:3333/user';
  const payload = JSON.stringify(user);

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201 or 200': (r) => r.status === 201 || r.status === 200,
  });
}
