import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole } from './entity/user-role.entity';
import { Model } from 'mongoose';
import { UserPermissions } from 'src/user-permission/entity/user-permission.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

@Injectable()
export class UserRoleService {
    constructor(@InjectModel(UserRole.name) private userRoleModel: Model<UserRole>) { }
    async createUserRole(createUserRoleDto: CreateUserRoleDto) {
        const newUserRole = new this.userRoleModel({
            ...createUserRoleDto,
        });
        return await newUserRole.save();
    }

    async getUserRoleById(id: string) {
        const userRole = await this.userRoleModel.findById(id).populate('permissions');
        if (!userRole) throw new NotFoundException(`User role with id ${id} not found!`);
        return userRole;
    }
}
