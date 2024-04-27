import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

export class InputValidator {
    private req: Request;
    private validators: ValidationChain[];

    constructor(req: Request) {
        this.req = req;
        this.validators = [];
    }

    validateName() {
        this.validators.push(
            body('name')
                .optional()
                .isString()
                .escape()
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ min: 3 })
                .withMessage('Name should be at least 3 characters')
        );
        return this;
    }

    ValidateEmail() {
        this.validators.push(
            body('email')
                .optional()
                .isEmail()
                .normalizeEmail()
                .notEmpty()
                .withMessage('Email is required')
        );
        return this;
    }

    validatePassword() {
        this.validators.push(
            body('password')
                .optional()
                .isString()
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 6 })
                .withMessage('Password should be at least 6 characters')
        );
        return this;
    }

    validateAvatar() {
        this.validators.push(
            body('avatar')
                .optional()
                .custom((value) => {
                    if (!value) {
                        return true;
                    }
                    if (value.match(/\.(jpeg|jpg|png)$/)) {
                        return true;
                    }
                    throw new Error('Avatar must be a JPG, PNG or JPEG image');
                })
        );
        return this;
    }

    validatePhone() {
        this.validators.push(
            body('phone')
                .optional()
                .notEmpty()
                .withMessage('Phone is required')
                .isLength({ min: 10, max: 10 })
                .withMessage('Phone number should be 10 digits')
        );
        return this;
    }

    validateAddress() {
        this.validators.push(
            body('address')
                .optional()
                .isString()
                .escape()
                .notEmpty()
                .withMessage('Address is required')
                .isLength({ min: 5, max: 50 })
                .withMessage('Address should be at least 5 characters')
        );
        return this;
    }

    validateCity() {
        this.validators.push(
            body('city')
                .optional()
                .isString()
                .escape()
                .notEmpty()
                .withMessage('City is required')
        );
        return this;
    }

    validateState() {
        this.validators.push(
            body('state')
                .optional()
                .isString()
                .escape()
                .notEmpty()
                .withMessage('State is required')
        );
        return this;
    }

    validatePincode() {
        this.validators.push(
            body('pincode')
                .optional()
                .isPostalCode('IN')
                .isString()
                .notEmpty()
                .withMessage('Pincode is required')
        );
        return this;
    }

    validateStoreName() {
        this.validators.push(
            body('storeName')
                .optional()
                .isString()
                .escape()
                .notEmpty()
                .withMessage('Store name is required')
                .isLength({ min: 3 })
                .withMessage('Store name should be at least 3 characters')
        );
        return this;
    }

    validateDescription() {
        this.validators.push(
            body('description')
                .optional()
                .isString()
                .escape()
                .notEmpty()
                .withMessage('Description is required')
                .isLength({ min: 10 })
                .withMessage('Description should be at least 10 characters')
        );
        return this;
    }

    validatePrice() {
        this.validators.push(
            body('price')
                .optional()
                .isNumeric()
                .notEmpty()
                .withMessage('Price is required')
        );
        return this;
    }

    validateStock() {
        this.validators.push(
            body('stock')
                .optional()
                .isNumeric()
                .notEmpty()
                .withMessage('Stock is required')
        );
        return this;
    }

    validateCategory() {
        this.validators.push(
            body('category')
                .optional()
                .isString()
                .notEmpty()
                .withMessage('Category is required')
        );
        return this;
    }

    validateProductImages() {
        this.validators.push(
            body('productImages')
                .optional()
                .custom((value) => {
                    if (!value) {
                        return true;
                    }
                    if (value.length > 5) {
                        throw new Error('Maximum of 5 images are allowed');
                    }
                    return true;
                })
        );
        return this;
    }

    public validateProduct() {
        this.validateName()
            .validateDescription()
            .validatePrice()
            .validateStock()
            .validateCategory()
            .validateProductImages();
        return this;
    }

    async validate(req: Request, res: Response, next: NextFunction) {
        try {
            await Promise.all(
                this.validators.map((validator) => validator.run(req))
            );
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }
            const extractedErrors = errors
                .array()
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                .map((err) => ({ [err.path]: err.msg }));
            return res.status(422).json({ errors: extractedErrors });
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
