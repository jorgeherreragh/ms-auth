export type RefreshTokenDataType = {
    email?: string;
    phoneNumber?: string;
    userName?: string;
};

export type RefreshTokenType = {
    userId: string;
    token: string;
};
