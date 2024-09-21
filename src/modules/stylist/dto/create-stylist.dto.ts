
import { Gender } from '@prisma/client';
import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsNumber,
    IsOptional,
    IsPhoneNumber,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateStylistDto {
    @IsString({ message: 'Họ và tên không đúng định dạng String' })
    @MaxLength(50, { message: 'Họ và tên không được dài quá 50 ký tự!' })
    full_name: string;

    @IsEmail({}, { message: 'email không đúng định dạng Email' })
    email: string;


    @IsString({ message: 'experience không đúng định dạng String' })
    @IsOptional()
    experience: string;

    @IsOptional()
    @IsString({ message: 'avatar không đúng định dạng String' })
    avatar: string;

    @IsOptional()
    @IsNumber({}, { message: 'rating không đúng định dạng Number' })
    @MaxLength(5, { message: 'rating không không lớn hơn 5' })
    rating: number;

    @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng!' })
    @MaxLength(10, { message: 'phone number không không lớn hơn 10' })
    phone_number: string;

    @IsOptional()
    @IsArray({ message: 'work_schedule không đúng định dạng Array' })
    work_schedule: Array<string>;

    @IsOptional()
    @IsString({ message: 'position không đúng định dạng String' })
    position: string

    @IsOptional()
    @IsString({ message: 'gender không đúng định dạng String' })
    gender: Gender;

    @IsOptional()
    @IsBoolean({ message: "isActive không đúng định dạng Boolean" })
    isActive: boolean;

}
