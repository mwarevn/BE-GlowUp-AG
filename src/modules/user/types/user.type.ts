import { Gender } from 'src/modules/user/enums/gender.enum';
import { AccountRole } from 'src/modules/user/enums/role.enum';

export interface IUserResponse {
  _id: string;
  full_name: string;
  username: string;
  email: string;
  avatar: string;
  role: AccountRole;
  gender: Gender;
}
