import { UserProvider } from 'src/user/enum/user-provider.enum';

export interface GoogleUser {
  provider: UserProvider;
  providerId: string;
  name: string;
  email: string;
}
