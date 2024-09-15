import { IsString, IsEmail, MinLength, IsOptional, IsNotEmpty, IsDefined } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không đúng định dạng !' })
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống!' })
  readonly password: string;
}
