import { Body, Controller, Post , Get, Delete, Param} from '@nestjs/common';
import { RolesService } from './role.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() dto) {
    return this.rolesService.create(dto);
  }

  @Get()
  getRoles(){
    return this.rolesService.getRoles();
  }

  @Delete(':id')
  deleteRoleById(@Param('id')id:string[]){
    return this.rolesService.deleteRole(id);
  }
}
