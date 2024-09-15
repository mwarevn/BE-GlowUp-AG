import { IsString, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsString({ message: 'Tag không đúng định dạng!' })
  @MaxLength(35, { message: 'Tên tag không được dài quá 50 ký tự!' })
  @IsNotEmpty({ message: 'Không được bỏ trống tên tag!' })
  readonly name: string;
}
