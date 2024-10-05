import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsOptional,
  Length,
  IsDate,
  IsMobilePhone,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Họ và tên không đúng định dạng!' })
  @MaxLength(100, { message: 'Họ và tên không được dài quá 50 ký tự!' })
  readonly full_name: string;

  @IsMobilePhone('vi-VN', null, {
    message: 'Số điện thoại không đúng định dạng!',
  })
  @IsOptional()
  @Length(10)
  readonly phone_number: number;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu tối thiểu phải có 8 ký tự!' })
  readonly password: string;
}
