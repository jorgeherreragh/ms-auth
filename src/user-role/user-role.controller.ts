import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

@Controller('user-role')
export class UserRoleController {
    constructor(
        private userRoleService: UserRoleService
    ) { }

    @Post()
    async createUserRole(@Body() createUserRoleDto: CreateUserRoleDto) {
        return await this.userRoleService.createUserRole(createUserRoleDto);
    }

    @Get(':id')
    async getUserRoleById(@Param('id') id: string) {
        return await this.userRoleService.getUserRoleById(id);
    }
}
