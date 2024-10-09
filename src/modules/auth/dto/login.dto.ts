import { ApiProperty } from '@nestjs/swagger';
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

export class LoginDTO {
  @IsMobilePhone(
    'vi-VN',
    {},
    { message: 'Số điện thoại có định dạng không chính xác!' },
  )
  @Length(10)
  @ApiProperty({ example: '0968999999' })
  readonly phone_number?: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống!' })
  readonly password: string;
}
