import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
  ) {}

  async create(dto: CreateRoleDto): Promise<RoleEntity> {
    const exists = await this.roleModel.findOne({ name: dto.name });
    if (exists) {
      throw new ConflictException('Role already exists');
    }

    const role = await this.roleModel.create(dto);

    return new RoleEntity({
      id: role.id,
      name: role.name,
      description: role.description,
      isActive: role.isActive,
    });
  }

  async getRoles(){
    return this.roleModel.find({isActive:true});
  }

async deleteRole(id: string[]) {
  return this.roleModel.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );
}
  async findByIds(ids: string[]) {
    return this.roleModel.find({ _id: { $in: ids }, isActive: true });
  }
}
