const { canonicalizeEmail } = require('../index');

describe('Email validations', () => {

    test('Invalid Email Check', () => {
        expect(() => { canonicalizeEmail("example.com") })
            .toThrow("Invalid Email Format")
    });

    test('Canonicalization Check', () => {
        expect(canonicalizeEmail("Hello+home@example.com"))
            .toBe("hello@example.com");

        expect(canonicalizeEmail("user(home)@example.com"))
            .toBe("user@example.com")

        expect(canonicalizeEmail(" user@example.com "))
            .toBe("user@example.com")

        expect(canonicalizeEmail("hell.o@gmail.com"))
            .toBe("hello@gmail.com")

        expect(canonicalizeEmail("HELLO@EXAMPLE.COM"))
            .toBe("hello@example.com")
    })
});
