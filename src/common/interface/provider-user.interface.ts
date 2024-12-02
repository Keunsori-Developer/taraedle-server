import { UserProvider } from 'src/user/enum/user-provider.enum';

interface User {
  provider: UserProvider;
  providerId: string;
  name: string;
  email: string;
}

export interface GoogleUser extends User {}
export interface GuestUser extends User {}
