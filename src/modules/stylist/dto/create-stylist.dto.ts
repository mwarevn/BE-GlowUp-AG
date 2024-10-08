import { Gender, Roles } from '@prisma/client';
import { IsMobilePhone, IsOptional, IsString } from 'class-validator';

export class CreateStylistDto {
  @IsString()
  gender: Gender;

  @IsString()
  full_name: string;

  @IsMobilePhone('vi-VN')
  phone_number: string;

  @IsOptional()
  profile: {
    stylist: {
      reviews: number;
      experience: string;
      isWorking: boolean;
    };
  };

  @IsOptional()
  date_of_birth: Date;

  @IsString()
  @IsOptional()
  address: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
