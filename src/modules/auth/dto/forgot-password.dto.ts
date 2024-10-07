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
  ValidateIf,
  registerDecorator,
} from 'class-validator';

export class ForgotPasswdDTO {
  @IsMobilePhone('vi-VN', null, {
    message: 'Số điện thoại không đúng định dạng!',
  })
  @Length(10)
  readonly phone_number: number;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu tối thiểu phải có 8 ký tự!' })
  readonly new_password: string;

  @IsString()
  @ValidateIf((o) => o.password)
  @IsString()
  @IsEqual('new_password', { message: 'Confirm password must match password' })
  readonly confirm_password: string;
}

function IsEqual(property: string, validationOptions?: any) {
  return function (object: Object, propertyName: string) {
    const validator = {
      validate(value: any, args: any) {
        const relatedValue = (args.object as any)[property];
        return value === relatedValue;
      },
      defaultMessage(args: any) {
        return `${propertyName} must match ${property}`;
      },
    };

    registerDecorator({
      name: 'isEqual',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: validator,
    });
  };
}
