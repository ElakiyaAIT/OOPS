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
import {Role, RoleDocument } from 'src/roles/schema/role.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}

  // CREATE USER
  async create(data: CreateUserDto) {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    let roleIds:any[]=[];

    if(data.role && data.role.length >0){
      const roles= await this.roleModel.find({
        name: { $in: data.role },
        isActive:true,
      });
 if (roles.length !== data.role.length) {
    throw new NotFoundException('One or more roles are invalid or inactive');
  }
      if (roles.some(role => role.name === 'admin')) {
    throw new ConflictException('Admin role cannot be assigned');
  }
      roleIds=roles.map(role=>role._id);
    }
    else{
      const userRole=await this.roleModel.findOne({
        name:'user',
        isActive:true,
      });
      if(!userRole){
        throw new Error('Default role not found');
      }
      roleIds=[userRole._id];
    }

    const user = new this.userModel({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      age: data.age,
      role:roleIds,
    });
    await user.save();
    return user;
  }

  // GET ALL USERS
  async findAll() {
    return this.userModel.find().populate('role');
  }

  // GET USER BY ID
  async findOne(id: string) {
    const user = await this.userModel.findById(id).populate('role') ;
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
