import {
  // BadRequestException,
  Injectable,
  // NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';
import {
  Category,
  CategoryDocument,
} from 'src/modules/category/schemas/category.schema';
import { ICategoryRespone } from 'src/modules/category/types/category.type';

interface ICategory {
  _id: string;
  name: string;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly CategoryModel: Model<CategoryDocument>,
  ) {}

  async getCategoryById(_id: string): Promise<ICategory> {
    try {
      return await this.CategoryModel.findById(_id);
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException();
    }
  }

  async getAllCategories(): Promise<ICategory[]> {
    try {
      return await this.CategoryModel.find();
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException();
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<ICategoryRespone> {
    try {
      const createdCategory = await new this.CategoryModel(
        createCategoryDto,
      ).save();

      return createdCategory as unknown as ICategoryRespone;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async updateCategoryById(_id: string, updateCategoryDto: CreateCategoryDto) {
    try {
      return await this.CategoryModel.findByIdAndUpdate(_id, updateCategoryDto);
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }

  async deleteCategoryById(_id: string) {
    try {
      const deletedCategory = await this.CategoryModel.findByIdAndDelete(_id);
      return deletedCategory;
    } catch (error) {
      throw new ServiceUnavailableException();
    }
  }
}
