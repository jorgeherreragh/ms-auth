export class SigningError extends Error {
    constructor(m: string) {
        super(`There was an error on the signing of the JWT: ${m}`);
        this.name = 'SigningError';
        Object.setPrototypeOf(this, SigningError.prototype);
    }
}