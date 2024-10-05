import { Exclude } from 'class-transformer';

export class UserResponeEntity {
  full_name: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponeEntity>) {
    Object.assign(this, partial);
  }
}
