import {
  CustomerProfile,
  Profile,
  Rank,
  Roles,
  StylistProfile,
} from '@prisma/client';
import {
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
  IsNotEmpty,
  IsDefined,
  IsNumber,
  IsMobilePhone,
  Length,
} from 'class-validator';

export class UpdateProfileUserDTO {
  @IsOptional()
  gender: Gender;

  @IsOptional()
  full_name: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  date_of_birth: string;

  @IsOptional()
  address: string;

  @IsOptional()
  profile:
    | {
        customer: {
          rank: Rank;
          rewards: number;
        };
      }
    | {
        stylist: {
          experience: string;
          reviews: number;
          isWorking: boolean;
        };
      };
}
