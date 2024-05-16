import { RefreshTokenType } from "src/utils/types/refresh-token.type";

export class RefreshToken {
    userId: string;
    token!: string;

    constructor(refreshToken: RefreshTokenType) {
        Object.assign(this, refreshToken);
    }

    static get prefix(): string {
        return 'refresh-token/';
    }
}
