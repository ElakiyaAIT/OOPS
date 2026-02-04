import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // CREATE USER
  async create(data: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new this.userModel({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    await user.save();
    return user;
  }

  // GET ALL USERS
  async findAll() {
    return this.userModel.find();
  }

  // GET USER BY ID
  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // UPDATE USER (no password here)
  async update(id: string, data: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // DELETE USER
  async delete(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
