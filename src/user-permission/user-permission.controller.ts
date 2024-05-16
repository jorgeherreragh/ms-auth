import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';

@Controller('user-permission')
export class UserPermissionController {
    constructor(
        private userPermissionService: UserPermissionService
    ) { }

    @Post()
    async createUserPermission(@Body() createUserPermissionDto: CreateUserPermissionDto) {
        return await this.userPermissionService.createUserPermission(createUserPermissionDto);
    }

    @Get(':id')
    async getUserPermissionById(@Param('id') id: string) {
        return await this.userPermissionService.getUserPermissionById(id);
    }
}
