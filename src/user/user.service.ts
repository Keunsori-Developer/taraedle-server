import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { InvalidUserException } from 'src/common/exception/invalid.exception';
import { GoogleUser, GuestUser } from 'src/common/interface/provider-user.interface';
import { User } from 'src/entity/user.entity';
import { WordService } from 'src/word/word.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserDetailResDto } from './dto/response.dto';
import { UserProvider } from './enum/user-provider.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private wordService: WordService,
  ) {}

  async createGoogleUser(user: GoogleUser) {
    const { name, providerId, email } = user;
    const userEntity = this.userRepository.create({ name, provider: UserProvider.GOOGLE, providerId, email });

    const newUser = await this.userRepository.save(userEntity);
    return newUser;
  }

  async createGuestUser() {
    const uuid = uuidv4();

    const guestUser: GuestUser = {
      name: `Guest${uuid.slice(0, 4)}`,
      email: '',
      provider: UserProvider.GUEST,
      providerId: uuid,
    };

    const newUser = await this.userRepository.save(this.userRepository.create(guestUser));
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
      throw new InvalidUserException();
    }

    const resDto = plainToInstance(UserDetailResDto, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const solveResDto = await this.wordService.getUserSolveData(user);
    resDto.solveData = solveResDto;

    return resDto;
  }
}
