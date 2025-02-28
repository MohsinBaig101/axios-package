import { getErrorMessage } from '../../../../src/lib/env/errorHelpers'; 

describe('getErrorMessage', () => {
    it('should replace [fieldName] with the actual field name', () => {
        const result = getErrorMessage('username', 'Error with [fieldName]');
        expect(result).toBe('Error with username');
    });

    it('should handle multiple occurrences of [fieldName]', () => {
        const result = getErrorMessage('email', 'Error with [fieldName] and [fieldName]');
        expect(result).toBe('Error with email and email');
    });

    it('should not change the message if [fieldName] is not present', () => {
        const result = getErrorMessage('username', 'No placeholders here');
        expect(result).toBe('No placeholders here');
    });

    it('should return an empty string if both arguments are empty', () => {
        const result = getErrorMessage('', '');
        expect(result).toBe('');
    });
});
