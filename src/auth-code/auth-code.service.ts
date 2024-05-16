import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { AuthenticationMethodType } from 'src/utils/enums/authentication-method.enum';
import { RefreshToken } from './entity/refresh-token.entity';
import { AuthCode } from './entity/auth-code.entity';
import { getExpiresInFromJwt, getSignedIdToken, getSignedJwtToken, getSignedRefreshToken } from 'src/utils/token.utils';
import { UserCredentials } from 'src/user-credentials/entity/user-credentials.entity';
import { User } from 'src/users/entity/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenResponseType } from 'src/utils/types/responses/token-response.type';
import { AuthCodeType } from 'src/utils/types/auth-code.type';
import { GrantType } from 'src/utils/enums/grant-type.enum';
import { GetAccessTokenByCodeDto } from './dto/get-access-token-by-code.dto';
import { ErrorResponseType } from 'src/utils/types/responses/error-response.type';
import { decode } from 'jsonwebtoken';
import { RefreshTokenType } from 'src/utils/types/refresh-token.type';


@Injectable()
export class AuthCodeService {
    constructor(@InjectModel(AuthCode.name) private authCodeModel: Model<AuthCode>, @InjectModel(User.name) private userModel: Model<User>) { }

    async generateAuthorizationCodeForUser(
        user: User,
        userCredential: UserCredentials,
        authenticationMethod: AuthenticationMethodType
    ) {
        const code = randomBytes(32).toString('hex');
        let token = '';
        let idToken = '';
        let refreshToken = '';
        token = getSignedJwtToken(user, userCredential, authenticationMethod);
        idToken = getSignedIdToken(user);
        refreshToken = getSignedRefreshToken(user, userCredential);

        const authCodeProps = {
            code,
            token,
            idToken,
            refreshToken,
        };
        const refreshTokenProps = {
            token: refreshToken,
            userId: (user as any)._id
        };

        const refreshTokenModel = new RefreshToken(refreshTokenProps);
        const authCode = new AuthCode(authCodeProps);

        try {
            await this.invalidatePreviousCodeForUser(user);
            const refreshToken = new this.authCodeModel({
                user: user,
                type: 'refresh_token',
                refreshToken: JSON.stringify(refreshTokenModel),
                code: null
            });
            console.log('refreshToken -> ', refreshToken);
            await refreshToken.save();
            const accessToken = new this.authCodeModel({
                user: user,
                type: 'access_token',
                token: JSON.stringify(authCode),
                code: authCode.code
            });
            console.log('accessToken -> ', accessToken);
            await accessToken.save();

        } catch (error) {
            throw new Error(error.message);
        }
        return authCode.code;
    }

    async invalidatePreviousCodeForUser(user: User): Promise<void> {
        try {
            await this.authCodeModel.findOneAndDelete({
                user: user,
                type: 'access_token'
            })
            await this.authCodeModel.findOneAndDelete({
                user: user,
                type: 'refresh_token'
            })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async invalidatePreviousRefreshTokenForUser(user: User): Promise<void> {
        try {
            await this.authCodeModel.findOneAndDelete({
                user: user,
                type: 'refresh_token'
            })
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async exchangeCodeForToken(getAccessTokenByCode: GetAccessTokenByCodeDto): Promise<TokenResponseType> {
        try {
            const authCode: AuthCode | undefined = await this.getAuthCodeByCode(
                getAccessTokenByCode.user_id
            );
            if (!authCode) {
                const errorResponse: ErrorResponseType = {
                    message:
                        'Invalid code. May have already been used, had expired or a new code could have been generated.',
                };
                throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
            }

            console.log('JSON.parse(authCode.refreshToken) -> ', authCode);

            return {
                access_token: JSON.parse(authCode.token).token,
                id_token: authCode.idToken,
                refresh_token: JSON.parse(authCode.refreshToken).token || '',
                token_type: 'bearer',
                expires_in: getExpiresInFromJwt(authCode.token),
            };
        } catch (error) {
            console.error(error);
        }
    }

    async getAuthCodeByCode(userId: string): Promise<AuthCode | undefined> {
        try {
            const codeFromDb = await this.authCodeModel.findOne({
                user: userId,
                type: GrantType.ACCESS
            });
            const refreshTokenFromDb = await this.authCodeModel.findOne({
                user: userId,
                type: GrantType.REFRESH
            });
            if (!codeFromDb) {
                return undefined;
            }
            console.log('codeFromDb -> ', codeFromDb);
            return {
                user: codeFromDb.user,
                code: codeFromDb.code,
                token: codeFromDb.token,
                idToken: codeFromDb.idToken,
                refreshToken: refreshTokenFromDb.refreshToken,
                type: codeFromDb.type
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async renewCredentialsFromRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<TokenResponseType> {
        let refreshTokenModel: AuthCode | undefined;
        try {
            refreshTokenModel = await this.getRefreshToken(userId, refreshToken);
            console.log('refreshTokenModel- > ', refreshTokenModel);
        } catch (error) {
            const errorResponse: ErrorResponseType = {
                message:
                    'Invalid refresh token. May have already been used, had expired or may have been invalidated.',
            };
            throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
        }

        if (!refreshTokenModel) {
            const errorResponse: ErrorResponseType = {
                message:
                    'Invalid refresh token. May have already been used, had expired or may have been invalidated.',
            };
            throw new HttpException(errorResponse, HttpStatus.BAD_REQUEST);
        }
        const renewTokens: any = await this.renewTokensForUser(userId);
        console.log('renewTokens -> ', renewTokens);
        return {
            //eslint-disable-next-line
            access_token: renewTokens.access_token || '',
            //eslint-disable-next-line
            id_token: renewTokens.id_token || '',
            //eslint-disable-next-line
            refresh_token: renewTokens.refresh_token || '',
            //eslint-disable-next-line
            token_type: 'bearer',
            //eslint-disable-next-line
            expires_in: renewTokens.expires_in || 0,
        };
    }

    async renewTokensForUser(userId: string): Promise<TokenResponseType> {

        const userFromDb = await this.userModel.findById(userId).populate('credentials');

        if (!userFromDb) throw new NotFoundException(`User not found for id ${userId}`);
        console.log('userFromDb -> ', userFromDb);
        const accessToken = getSignedJwtToken(userFromDb, userFromDb.credentials, AuthenticationMethodType.REFRESH);
        const idToken = getSignedIdToken(userFromDb);
        const refreshToken = getSignedRefreshToken(userFromDb, userFromDb.credentials);
        const refreshTokenProps = {
            token: refreshToken,
            userId: (userFromDb as any)._id
        };
        const refreshTokenModel = new RefreshToken(refreshTokenProps);
        try {
            console.log('refreshTokenModel -> ', refreshTokenModel);
            await this.invalidatePreviousRefreshTokenForUser(userFromDb);
            const refreshTokenToSave = new this.authCodeModel({
                user: userFromDb,
                type: 'refresh_token',
                refreshToken: JSON.stringify(refreshTokenModel),
                code: null
            });
            await refreshTokenToSave.save();
        } catch (error) {
            throw new Error(error.message);
        }
        return {
            access_token: accessToken,
            id_token: idToken,
            refresh_token: refreshToken,
            token_type: 'bearer',
            expires_in: getExpiresInFromJwt(refreshTokenProps.token),
        };
    }

    async getRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<AuthCode | undefined> {
        try {
            const refreshTokenFromDb = await this.authCodeModel.findOne({
                user: userId,
                type: GrantType.REFRESH
            }).populate('user');
            if (!refreshTokenFromDb) {
                return undefined;
            }
            console.log('JSON.parse(refreshTokenFromDb.refreshToken).token !== refreshToken -> ', JSON.parse(refreshTokenFromDb.refreshToken).token !== refreshToken);
            console.log(JSON.parse(refreshTokenFromDb.refreshToken).token);
            console.log(refreshToken);
            if (JSON.parse(refreshTokenFromDb.refreshToken).token !== refreshToken) {
                return undefined;
            }
            return refreshTokenFromDb;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
