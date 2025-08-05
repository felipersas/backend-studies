import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

const N = 5000;
const users: {
  email: string;
  name: string;
  avatar: string;
}[] = [];

for (let i = 0; i < N; i++) {
  users.push({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
  });
}

fs.writeFileSync(
  path.join(__dirname, 'users.json'),
  JSON.stringify(users, null, 2),
);
