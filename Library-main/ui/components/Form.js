const CONDITION_REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONDITION_MIN_LENGTH_PASSWORD = 8;
const CONDITION_MAX_LENGTH_PASSWORD = 64;
const CONDITION_HAS_UPPERCASE_REGEX = /[A-Z]/;
const CONDITION_HAS_LOWERCASE_REGEX = /[a-z]/;
const CONDITION_HAS_NUMBER_REGEX = /[0-9]/;
const CONDITION_HAS_SPECIAL_CHARACTER_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const defaultValidators = {
    required: ({ message }) => (value) => {
        if (!value) {
            return message || 'This field is required';
        }
        return true;
    },
    email: ({ message }) => (value) => {
        if (!CONDITION_REGEX_EMAIL.test(value)) {
            return message || 'This field must be a valid email';
        }
        return true;
    },
    minLength: ({ minLength = 0, message }) => (value) => {
        if (value.length < minLength) {
            return message || `This field must be at least ${minLength} characters`;
        }
        return true;
    },
    maxLength: ({ maxLength = 0, message }) => (value) => {
        if (value.length > maxLength) {
            return message || `This field must be at most ${maxLength} characters`;
        }
        return true;
    },
    min: ({ min = 0, message }) => (value) => {
        if (Number(value) < min) {
            return message || `This field must be at least ${min}`;
        }
        return true;
    },
    max: ({ max = 0, message }) => (value) => {
        if (Number(value) > max) {
            return message || `This field must be at most ${max}`;
        }
        return true;
    },
    password: ({ message }) => (value) => {
        if (value.length < CONDITION_MIN_LENGTH_PASSWORD) {
            return message?.min || `This field must be at least ${CONDITION_MIN_LENGTH_PASSWORD} characters`;
        }
        if (value.length > CONDITION_MAX_LENGTH_PASSWORD) {
            return message?.max || `This field must be at most ${CONDITION_MAX_LENGTH_PASSWORD} characters`;
        }
        if (!CONDITION_HAS_UPPERCASE_REGEX.test(value)) {
            return message?.uppercase || 'This field must have at least one uppercase letter';
        }
        if (!CONDITION_HAS_LOWERCASE_REGEX.test(value)) {
            return message?.lowercase || 'This field must have at least one lowercase letter';
        }
        if (!CONDITION_HAS_NUMBER_REGEX.test(value)) {
            return message?.hasNumber || 'This field must have at least one number';
        }
        if (!CONDITION_HAS_SPECIAL_CHARACTER_REGEX.test(value)) {
            return message?.specialCharacter || 'This field must have at least one special character';
        }
        return true;
    }
};
const SELECTOR_INPUT = 'cc-input';
class Field {
    _field;
    _input;
    _name;
    _value;
    _validators;
    _errors = [];
    _values = null;
    _displayError = false;
    constructor(field) {
        this._field = field;
        this._input = field.querySelector(`.${SELECTOR_INPUT}`);
        if (!this._input)
            throw new Error(`Field must have a child with class ${SELECTOR_INPUT}`);
        this._name = this._input.name;
        this._value = this._input.value;
        this._validators = [];
        this._input.addEventListener('input', () => {
            this._value = this._input.value;
            this.validate();
        });
    }
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
    get validators() {
        return this._validators;
    }
    set name(name) {
        this._name = name;
    }
    set validators(validators) {
        this._validators = validators;
    }
    set values(values) {
        this._values = values;
    }
    set displayError(value) {
        this._displayError = value;
    }
    validate() {
        const removeErrors = () => {
            const errorSpans = this._field.querySelectorAll('.cc-error');
            errorSpans.forEach(span => span.remove());
        };
        this._errors = [];
        this._validators.forEach(validator => {
            if (typeof validator === 'function') {
                const valuesOther = this._values ? this._values() : {};
                const result = validator(this._value, valuesOther);
                if (result !== true) {
                    this._errors.push('This field is invalid');
                }
            }
            else if (typeof validator === 'object') {
                const { type, ...other } = validator;
                if (!defaultValidators[type]) {
                    throw new Error(`Validator ${type} not found`);
                }
                const result = defaultValidators[type](other)(this._value);
                if (result !== true) {
                    this._errors.push(result);
                }
            }
        });
        removeErrors();
        if (this._errors.length > 0 && this._displayError) {
            const errorSpan = document.createElement('span');
            errorSpan.classList.add('cc-error');
            errorSpan.innerText = this._errors[0];
            this._field.appendChild(errorSpan);
        }
        else {
            removeErrors();
        }
        return this;
    }
}
export default class FormValidator extends FormData {
    _form;
    _fields = [];
    constructor(form) {
        super(form);
        this._form = form;
        this.onSubmit(() => { });
    }
    onSubmit(callback) {
        if (!this._form)
            throw new Error('Form not found');
        this._form.addEventListener('submit', (e) => {
            e.preventDefault();
            this._fields.forEach(field => {
                field.displayError = true;
                field.validate();
            });
            if (this._fields.every(field => field._errors.length === 0)) {
                callback(this.getValues());
                this._form.reset();
            }
        });
    }
    getValues() {
        const values = {};
        for (let field of this._fields) {
            values[field.name] = field.value;
        }
        return values;
    }
    validator(fieldName, validateElements) {
        if (!Array.isArray(validateElements)) {
            validateElements = [validateElements];
        }
        const input = this._form.querySelector(`[name="${fieldName}"]`);
        const field = input.closest('.cc-field');
        if (!field) {
            throw new Error(`Field ${fieldName} not found`);
        }
        const fieldElement = new Field(field);
        this._fields.push(fieldElement);
        fieldElement.values = this.getValues.bind(this);
        fieldElement.validators = validateElements;
        return fieldElement;
    }
    getErrors() {
        const errors = {};
        this._fields.forEach(field => {
            const result = field.validate();
            if (result._errors.length > 0) {
                errors[field.name] = result._errors;
            }
        });
        return errors;
    }
}
