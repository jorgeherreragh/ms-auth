import { Body, Controller, HttpException, HttpStatus, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthCodeService } from './auth-code.service';
import { GetAccessTokenByCodeDto } from './dto/get-access-token-by-code.dto';
import { GrantType } from 'src/utils/enums/grant-type.enum';
import { Response } from 'express';
import { getExpiresInFromJwt } from 'src/utils/token.utils';

@Controller('auth-code')
@UsePipes(new ValidationPipe())
export class AuthCodeController {
    constructor(
        private authCodeService: AuthCodeService
    ) { }

    @Post('/token')
    async getAccessTokenByCode(@Body() getAccessTokenByCodeDto: GetAccessTokenByCodeDto, @Req() req: any,
        @Res({ passthrough: true }) res: Response) {
        try {
            if (getAccessTokenByCodeDto.grant_type === GrantType.ACCESS) {
                const accessTokenData = await this.authCodeService.exchangeCodeForToken(
                    getAccessTokenByCodeDto
                );

                res.cookie('management_dashboard_access_token', accessTokenData.access_token, {
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    // domain: '.learningally.org',
                    maxAge: accessTokenData.expires_in * 1000, // converts to miliseconds
                    path: '/',
                    sameSite: true,
                });
                res.cookie('management_dashboard_refresh_token', accessTokenData.refresh_token, {
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    // domain: '.learningally.org',
                    maxAge: getExpiresInFromJwt(accessTokenData.refresh_token) * 1000,
                    path: '/',
                    sameSite: true,
                });
                res.status(201);
                res.json(accessTokenData);
            } else if (getAccessTokenByCodeDto.grant_type === GrantType.REFRESH) {
                // eslint-disable-next-line camelcase
                const refreshToken =
                    getAccessTokenByCodeDto.refresh_token || req.cookies.management_dashboard_refresh_token;
                if (!refreshToken) {
                    throw new HttpException(
                        {
                            status: HttpStatus.BAD_REQUEST,
                            error: `refresh_token can't be empty`,
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }
                const reNewToken =
                    await this.authCodeService.renewCredentialsFromRefreshToken(
                        getAccessTokenByCodeDto.user_id,
                        refreshToken,
                    );

                res.cookie('management_dashboard_access_token', reNewToken.access_token, {
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    // domain: '.learningally.org',
                    maxAge: reNewToken.expires_in * 1000, // converts to miliseconds
                    path: '/',
                    sameSite: true,
                });
                res.cookie('management_dashboard_refresh_token', reNewToken.refresh_token, {
                    secure: process.env.NODE_ENV === 'production',
                    httpOnly: true,
                    // domain: '.learningally.org',
                    maxAge: getExpiresInFromJwt(reNewToken.refresh_token) * 1000, // converts to miliseconds
                    path: '/',
                    sameSite: true,
                });
                res.status(201);
                res.json(reNewToken);
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: 'grant_type not supported',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error: any) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                {
                    status: error.code,
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
