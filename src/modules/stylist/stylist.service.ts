import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { CreateStylistDto } from './dto/create-stylist.dto';
import { UpdateStylistDto } from './dto/update-stylist.dto';
import { UserService } from 'src/modules/user/user.service';
import { Roles } from '@prisma/client';

@Injectable()
export class StylistService {
  constructor(private userService: UserService) {}

  create(createStylistDto: CreateStylistDto) {
    return 'This action adds a new stylist';
  }

  async findAll() {
    const stylists = await this.userService.getAll({
      role: Roles.STYLIST,
    });

    return stylists;
  }

  findOne(id: number) {
    return `This action returns a #${id} stylist`;
  }

  update(id: number, updateStylistDto: UpdateStylistDto) {
    return `This action updates a #${id} stylist`;
  }

  remove(id: number) {
    return `This action removes a #${id} stylist`;
  }
}
