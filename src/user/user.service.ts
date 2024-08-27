import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from 'src/common/interface/provider-user.interface';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { UserProvider } from './enum/user-provider.enum';
import { plainToInstance } from 'class-transformer';
import { UserResDto } from './dto/response.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async createGoogleUser(user: GoogleUser) {
    const { name, providerId, email } = user;
    const userEntity = this.userRepository.create({ name, provider: UserProvider.GOOGLE, providerId, email });

    const newUser = await this.userRepository.save(userEntity);
    return newUser;
  }

  async fineOneById(id: User['id']) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async findOneByProviderId(provider: User['provider'], providerId: User['providerId']) {
    const user = await this.userRepository.findOne({ where: { provider, providerId } });
    return user;
  }

  async getMyUserData(userId: User['id']) {
    const user: User = await this.fineOneById(userId);
    if (!user) {
      throw new BadRequestException('Invalid User');
    }

    const resDto = plainToInstance(UserResDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return resDto;
  }
}
