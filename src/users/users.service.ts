import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/users/entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validateObjectId } from 'src/utils/db.utils';
import { UserCredentials } from 'src/user-credentials/entity/user-credentials.entity';
import { LogInUserDto } from './dto/log-in-user.dto';
import { UserCredentialsService } from 'src/user-credentials/user-credentials.service';
import { AuthCodeService } from 'src/auth-code/auth-code.service';
import { AuthenticationMethodType } from 'src/utils/enums/authentication-method.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(UserCredentials.name) private userCredentials: Model<UserCredentials>,
        private userCredentialsService: UserCredentialsService,
        private authCodeService: AuthCodeService,
    ) { }

    async createUser({ credentials, ...createUserDto }: CreateUserDto) {
        const userCredentials = new this.userCredentials(credentials);
        const savedCredentials = await userCredentials.save();
        if (savedCredentials._id) {
            const newUser = new this.userModel({
                ...createUserDto,
                credentials: savedCredentials._id
            });
            console.log('newUser -> ', newUser);
            const savedUser = await newUser.save();
            console.log('savedUser -> ', savedUser);
            if (savedUser) await this.userCredentials.findByIdAndUpdate(savedCredentials._id, {
                user: savedUser._id
            })
            return savedUser;
        }
        throw new InternalServerErrorException(`We had an issue registering user`);
    }

    getUsers() {
        return this.userModel.find().populate('credentials');;
    }

    async getUserById(id: string) {
        const isValidId = validateObjectId(id);
        if (!isValidId) throw new BadRequestException(`User id ${id} is not a valid ObjectID`);
        const findUser = await this.userModel.findById(id).populate('credentials').populate('role');
        if (!findUser) throw new NotFoundException(`User with id ${id} not found!`);
        return findUser;
    }

    async updateUserById(id: string, updateUserDto: UpdateUserDto) {
        const isValidId = validateObjectId(id);
        if (!isValidId) throw new BadRequestException(`User id ${id} is not a valid ObjectID`);
        const updatedUser = await this.userModel.findByIdAndUpdate(id, {
            ...updateUserDto
        }, {
            new: true
        });
        if (!updatedUser) throw new NotFoundException(`User wit ${id} not found!`);
        return updatedUser;
    }

    async deleteUserById(id: string) {
        const isValidId = validateObjectId(id);
        if (!isValidId) throw new BadRequestException(`User id ${id} is not a valid ObjectID`);
        const deletedUser = await this.userModel.findByIdAndDelete(id);
        if (!deletedUser) throw new NotFoundException(`User wit ${id} not found!`);
        const deletedUserCredential = await this.userCredentials.findByIdAndDelete(deletedUser.credentials);
        if (!deletedUserCredential) throw new InternalServerErrorException(`There was an issue deleting user credentials`);
        return deletedUser;
    }

    async logInUser(logInUserDto: LogInUserDto) {
        const { email, phoneNumber, username, password } = logInUserDto;
        let userCredential: UserCredentials;
        try {
            if (email) {
                userCredential = await this.userCredentialsService.getUserCredentialsByUserEmailAndPassword(email, password);
            }

            if (phoneNumber) {
                userCredential = await this.userCredentialsService.getUserCredentialsByUserPhoneAndPassword(phoneNumber, password);
            }

            if (username) {
                userCredential = await this.userCredentialsService.getUserCredentialsByUserNameAndPassword(username, password);
            }

            if (!userCredential) throw new NotFoundException(`User credentials not found for user ${logInUserDto.email}`);
            console.log('userCredential -> ', userCredential);
            const user = new this.userModel(userCredential.user);
            console.log('user -> ', user);
            const code: string = await this.authCodeService.generateAuthorizationCodeForUser(user, userCredential, AuthenticationMethodType.CREDENTIALS);
            return {
                code: code,
                role: user.role
            };
        } catch (error) {
            console.log('error -> ', error);
        }
    }
} 
