import { PartialType } from '@nestjs/swagger';
import { CreateStylistDto } from './create-stylist.dto';
import { UpdateProfileUserDTO } from 'src/modules/user/dto/user.update.dto';

export class UpdateStylistDto extends PartialType(UpdateProfileUserDTO) {}
