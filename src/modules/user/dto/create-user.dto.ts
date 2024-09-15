import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsOptional,
  Length,
  IsDate,
} from 'class-validator';
import { Date } from 'mongoose';

export class CreateUserDto {
  @IsString({ message: 'Họ và tên không đúng định dạng!' })
  @MaxLength(50, { message: 'Họ và tên không được dài quá 50 ký tự!' })
  readonly full_name: string;

  @IsString()
  @IsOptional()
  readonly username: string;

  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  readonly email: string;

  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng!' })
  @IsOptional()
  @Length(10)
  readonly phone_number: string;

  @IsString()
  @MinLength(8, { message: 'Mật khẩu tối thiểu phải có 8 ký tự!' })
  password: string;

  @IsString()
  readonly gender: string;

  @IsString()
  @IsOptional()
  readonly avatar: string;

  @IsDate({ message: 'Ngày tháng năm sinh không đúng định dạng!' })
  @IsOptional()
  readonly date_of_birth: Date;

  @IsString()
  @IsOptional()
  readonly address: string;
}
