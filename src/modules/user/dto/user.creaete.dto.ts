import { IsMobilePhone, IsOptional } from 'class-validator';

export class CreateUserDTO {
  @IsOptional()
  gender: Gender;

  @IsOptional()
  full_name: string;

  @IsMobilePhone('vi-VN')
  phone_number: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  date_of_birth: string;

  @IsOptional()
  address: string;
}
