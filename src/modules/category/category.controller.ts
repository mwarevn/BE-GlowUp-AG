import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { CategoryService } from 'src/modules/category/category.service';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/:_id')
  async getCategoryById(@Req() req: Request, @Res() res: Response) {
    const _id: string = req.params._id;
    const category = await this.categoryService.getCategoryById(_id);

    if (!category) {
      throw new NotFoundException();
    }

    res.json({ success: true, data: category });
  }

  @Get()
  async getAllCategories(@Req() req: Request, @Res() res: Response) {
    const categories = await this.categoryService.getAllCategories();

    if (!categories) {
      throw new NotFoundException();
    }

    res.json({ success: true, data: categories });
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Post('create')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const createdCategory =
      await this.categoryService.createCategory(createCategoryDto);

    if (!createdCategory) {
      throw new BadRequestException();
    }

    res.json({ success: true, data: createdCategory });
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Put('/:_id/update')
  async updateCategoryById(
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateCategoryDto,
  ) {
    try {
      const _id: string = req.params._id;
      const updatedCategory = await this.categoryService.updateCategoryById(
        _id,
        updateCategoryDto,
      );

      if (!updateCategoryDto) {
        throw new ServiceUnavailableException();
      }

      res.json({
        success: true,
        data: updatedCategory,
      });
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Delete('/:_id/delete')
  async deleteCategoryById(@Req() req: Request, @Res() res: Response) {
    const _id = req.params._id;
    const deletedCategory = await this.categoryService.deleteCategoryById(_id);
    if (!deletedCategory) {
      throw new BadRequestException();
    }
    return res.json({ success: true, data: deletedCategory });
  }
}
