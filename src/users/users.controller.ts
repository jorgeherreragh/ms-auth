import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogInUserDto } from './dto/log-in-user.dto';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UsersController {
    constructor(
        private usersService: UsersService
    ) { }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.createUser(createUserDto);
    }

    @Post('login')
    async logInUser(@Body() logInUserDto: LogInUserDto) {
        return await this.usersService.logInUser(logInUserDto);
    }

    @Get()
    async getUsers() {
        return await this.usersService.getUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id);
    }

    @Patch(':id')
    async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.updateUserById(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUserById(@Param('id') id: string) {
        return await this.usersService.deleteUserById(id);
    }
}
