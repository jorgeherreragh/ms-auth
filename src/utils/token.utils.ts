import { sign } from 'jsonwebtoken';
import { SigningError } from './errors/sign-in.error';
import { decode, encode } from './base64.utils';
import { AuthenticationMethodType } from './enums/authentication-method.enum';
import { AccessTokenDataType } from './types/access-token-data.type';
import { TokenTypeEnum } from './enums/token.enum';
import { User } from 'src/users/entity/user.entity';
import { defaults } from './constants/defaults.constant';
import { IdTokenDataType } from './types/id-token.type';
import { RefreshTokenDataType } from './types/refresh-token.type';
import { UserCredentials } from 'src/user-credentials/entity/user-credentials.entity';
export const signToken = (content: any, expiresIn: string): string => {
    try {
        return sign(
            content,
            decode(process.env.JWT_SIGNING_PRIVATE_KEY_BASE64 || ''),
            {
                expiresIn: expiresIn,
                algorithm: 'RS256',
            },
        );
    } catch (error: any) {
        throw new SigningError(error.message);
    }
};


export const getSignedJwtToken = (user: User, userCredential: UserCredentials, authenticationMethod: AuthenticationMethodType): string => {
    const tokenData: AccessTokenDataType = {
        type: TokenTypeEnum.USER,
        role: user.role,
        firstName: user.firstName,
        authenticationMethod,
        email: userCredential.email || '',
        phoneNumber: userCredential.phoneNumber || '',
        userName: userCredential.username || ''
    };

    const expiresIn = process.env.JWT_EXPIRE || defaults.JWT_EXPIRE;

    return signToken(tokenData, expiresIn);
}

export const getSignedIdToken = (user: User): string => {
    const userProfile: IdTokenDataType = {
        role: user.role,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        credentials: user.credentials || {},
    };
    const tokenData: IdTokenDataType = userProfile;
    const expiresIn = process.env.JWT_EXPIRE || defaults.JWT_EXPIRE;
    return signToken(tokenData, expiresIn);
}

export const getSignedRefreshToken = (user: User, userCredential: UserCredentials): string => {
    console.log('user -> ', user);
    const tokenData: RefreshTokenDataType = {
        email: encode(userCredential.email) || '',
        phoneNumber: encode(userCredential.phoneNumber) || '',
        userName: encode(userCredential.username) || ''
    };
    const expiresIn =
        process.env.JWT_REFRESH_TOKEN_EXPIRE || defaults.JWT_REFRESH_TOKEN_EXPIRE;
    return signToken(tokenData, expiresIn);
}

export const getExpiresInFromJwt = (accessToken: string): number => {
    try {
        const decodedAccessToken = JSON.parse(JSON.stringify(decode(accessToken)));
        const accessTokenExp = decodedAccessToken.exp;
        const now = new Date().getTime() / 1000;
        const expirationTime = accessTokenExp > now ? accessTokenExp - now : 0;
        return Math.floor(expirationTime);
    } catch (error: any) {
        throw new Error(error.message);
    }
};


