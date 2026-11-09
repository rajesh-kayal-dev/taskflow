export interface RegisterInput {
    email: string;
    password: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface JwtPayload {
    userId: string;
    email: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}