import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from 'src/common/interface/provider-user.interface';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserProvider } from './enum/user-provider.enum';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async createGoogleUser(user: GoogleUser) {
    const { name, providerId, email } = user;
    const userEntity = this.userRepository.create({ name, provider: UserProvider.GOOGLE, providerId, email });

    const newUser = await this.userRepository.insert(userEntity);
    return newUser;
  }

  async findOneByProviderId(provider: User['provider'], providerId: User['providerId']) {
    const user = await this.userRepository.findOne({ where: { provider, providerId } });
    return user;
  }
}
