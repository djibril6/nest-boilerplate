import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto, addUserDto } from './dto';
import { EModelName, TUser, TUserModel, UserField } from 'src/shared/types';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(EModelName.USER) private userModel: Model<TUserModel>,
  ) {}

  async create(user: addUserDto) {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  /**
   *
   * @param id user id
   * @param select add only fields you want to retrieve
   * @returns the user
   */
  async findById(id: string, select?: UserField) {
    const user = await this.userModel.findById(id).select(select).lean();

    if (!user) {
      throw new NotFoundException(`User ${id} Not Found`);
    }

    return user;
  }

  findByOne(filter: Partial<TUser>, select?: UserField) {
    return this.userModel.findOne(filter).select(select).lean();
  }

  getMany(filter: Partial<TUser>) {
    return this.userModel.find(filter).lean();
  }

  async update(userId: string, data: UpdateUserDto) {
    const existing = await this.userModel
      .findByIdAndUpdate(userId, data, { new: true })
      .lean();
    if (!existing) {
      throw new NotFoundException(`User ${userId} Not Found`);
    }
    return existing;
  }

  async delete(id: string) {
    await this.userModel.deleteOne({ _id: id });
    return true;
  }
}
