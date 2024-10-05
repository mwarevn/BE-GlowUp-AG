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

export class LoginDto {
  @IsMobilePhone(
    'vi-VN',
    {},
    { message: 'Số điện thoại có định dạng không chính xác!' },
  )
  @Length(10)
  readonly phone_number?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống!' })
  readonly password: string;
}
