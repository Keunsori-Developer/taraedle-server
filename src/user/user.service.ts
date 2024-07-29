import { Injectable } from '@nestjs/common';

type User = any;

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: '115857054460124542274',
      username: 'john',
      password: 'changeme',
    },
    {
      userId: '2',
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(userId: string): Promise<User | undefined> {
    return this.users.find((user) => user.userId === userId);
  }
}
