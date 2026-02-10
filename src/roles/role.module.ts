import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesService } from './role.service';
import { RolesController } from './role.controller';
import { Role, RoleSchema } from './schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService], 
})
export class RolesModule {}
