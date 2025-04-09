'use server';

import { faker } from '@faker-js/faker';
import { database } from '../index';

export async function seedUser() {
  for (let i = 0; i < 50; i++) {
    const user = await database.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    await database.subscription.create({
      data: {
        userId: user.id,
        plan: faker.helpers.arrayElement([
          'STUDENT',
          'RESEARCHER',
          'INSTITUTION',
        ]),
        status: faker.helpers.arrayElement([
          'ACTIVE',
          'INACTIVE',
          'TRIAL',
          'EXPIRED',
          'CANCELLED',
        ]),
      },
    });
  }
}

seedUser();
