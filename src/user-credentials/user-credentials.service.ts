import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCredentials } from './entity/user-credentials.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserCredentialsService {
    constructor(@InjectModel(UserCredentials.name) private userCredentials: Model<UserCredentials>) { }
    async getUserCredentialsByUserEmailAndPassword(userEmail: string, password: string) {
        const findUserCredentials = await this.userCredentials.find({
            email: userEmail,
            password: password
        }).populate('user');
        if (!findUserCredentials) {
            throw new NotFoundException(`User credentials with email ${userEmail} not found!`);
        }
        return findUserCredentials[0];
    }

    async getUserCredentialsByUserPhoneAndPassword(userPhoneNumber: string, password: string) {
        const findUserCredentials = await this.userCredentials.find({
            phoneNumber: userPhoneNumber,
            password: password
        }).populate('user');
        if (!findUserCredentials) {
            throw new NotFoundException(`User credentials with phone number ${userPhoneNumber} not found!`);
        }
        return findUserCredentials[0];
    }

    async getUserCredentialsByUserNameAndPassword(userName: string, password: string) {
        const findUserCredentials = await this.userCredentials.find({
            username: userName,
            password: password
        }).populate('user');
        if (!findUserCredentials) {
            throw new NotFoundException(`User credentials with username ${userName} not found!`);
        }
        return findUserCredentials[0];
    }
}
