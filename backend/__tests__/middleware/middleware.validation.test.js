const { validateRegisterInput, validateLoginInput } = require('../../middleware/validation');

describe('validateRegisterInput', () => {
    it('should return valid if input is valid', () => {
        const body = {
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
            email: 'john.doe@example.com',
        };
        const result = validateRegisterInput(body);
        expect(result.valid).toBe(true);
    });

    it('should return error message if firstName is missing', () => {
        const body = {
            lastName: 'Doe',
            password: 'password123',
            email: 'john.doe@example.com',
        };
        const result = validateRegisterInput(body);
        expect(result.error).toBe('"firstName" is required');
    });

    it('should return error message if lastName is missing', () => {
        const body = {
            firstName: 'John',
            password: 'password123',
            email: 'john.doe@example.com',
        };
        const result = validateRegisterInput(body);
        expect(result.error).toBe('"lastName" is required');
    });

    it('should return error message if password is missing', () => {
        const body = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
        };
        const result = validateRegisterInput(body);
        expect(result.error).toBe('"password" is required');
    });

    it('should return error message if email is missing', () => {
        const body = {
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
        };
        const result = validateRegisterInput(body);
        expect(result.error).toBe('"email" is required');
    });

    it('should return error message if firstName is too short', () => {
        const body = {
            firstName: 'Jo',
            lastName: 'Doe',
            password: 'password123',
            email: 'john.doe@example.com',
        };
        const result = validateRegisterInput(body);
        expect(result.error).toBe('"firstName" length must be at least 3 characters long');
    });

    it('should return error message if lastName is too short', () => {
        const body = {
            firstName: 'John',
            lastName: 'Do',
            password: 'password123',
            email: 'john.doe@example.com',
        };
        const result = validateRegisterInput(body);
        expect(result.error).toBe('"lastName" length must be at least 3 characters long');
    });

    it('should return error message if password is too short', () => {
        const body = {
            firstName: 'John',
            lastName: 'Doe',
            password: 'pass',
            email: 'john.doe@example.com',
        };
        const result = validateRegisterInput(body);
        expect(result.error).toBe('"password" length must be at least 6 characters long');
    });

    it('should return error message if email is invalid', () => {
        const body = {
            firstName: 'John',
            lastName: 'Doe',
            password: 'password123',
            email: 'invalid-email',
        };
        const result = validateRegisterInput(body);
        expect(result.error).toBe('"email" must be a valid email');
    });
});

describe('validateLoginInput', () => {
    it('should return valid if input is valid', () => {
        const body = {
            password: 'password123',
            email: 'john.doe@example.com',
        };
        const result = validateLoginInput(body);
        expect(result.valid).toBe(true);
    });

    it('should return error message if password is missing', () => {
        const body = {
            email: 'john@example.com',
        };
        const result = validateLoginInput(body);
        expect(result.error).toBe('"password" is required');

    });

    it('should return error message if email is missing', () => {
        const body = {
            password: 'password123',
        };
        const result = validateLoginInput(body);
        expect(result.error).toBe('"email" is required');
    });

    it('should return error message if password is too short', () => {
        const body = {
            password: 'pass',
            email: 'john@example.com',
        };
        const result = validateLoginInput(body);
        expect(result.error).toBe('"password" length must be at least 6 characters long');
    });

    it('should return error message if email is invalid', () => {
        const body = {
            password: 'password123',
            email: 'invalid-email',
        };
        const result = validateLoginInput(body);
        expect(result.error).toBe('"email" must be a valid email');

    });

});

