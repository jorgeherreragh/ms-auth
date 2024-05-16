import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermissions } from './entity/user-permission.entity';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';

@Injectable()
export class UserPermissionService {
    constructor(@InjectModel(UserPermissions.name) private userPermissionModel: Model<UserPermissions>) { }
    async createUserPermission(createUserPermissionDto: CreateUserPermissionDto) {
        const newUserPermission = new this.userPermissionModel({
            ...createUserPermissionDto,
        });
        return await newUserPermission.save();
    }

    async getUserPermissionById(id: string) {
        const userPermission = await this.userPermissionModel.findById(id);
        if (!userPermission) throw new NotFoundException(`User permission with id ${id} not found!`);
        return userPermission;
    }
}
