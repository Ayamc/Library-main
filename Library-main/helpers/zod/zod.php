<?php
/**
 * $validationRules defines a set of validation rules for various input fields or data types.
 * Each key in the array represents a validation rule name, and its corresponding value is an array
 * containing the specific validation rules applicable to that rule.
 * 
 * Example:
 * - 'email' => ['email', 'required']: Specifies that the 'email' field must be a valid email address and is required.
 * - 'integer' => ['integer', 'required', 'min', 'max', 'length']: Specifies that the 'integer' field must be an integer, required, and meet certain length and range constraints.
 * 
 * This array is used by a validator class or function to enforce validation rules on input data.
 */
$validationRules  = [
    'email' => ['required'],
    'date' => ['required'],
    'bool' => ['required'],
    'input' => ['required', 'integer', 'bool', 'min', 'max', 'length'],
    'integer' => ['required', 'min', 'max', 'length'],
    'string' => ['required', 'min', 'max', 'length'],
    'url' => ['required'],
    'html' => ['required'],
    'regex' => ['required', 'integer', 'url', 'input', 'date'],
    'enum' => ['required'],
    'min' => ['required', 'max', 'length', 'integer', 'array', 'object', 'tuple', 'union', 'input'],
    'max' => ['required', 'min', 'length', 'integer', 'array', 'object', 'tuple', 'union', 'input'],
    'length' => ['required', 'integer', 'array', 'object', 'tuple', 'union', 'input'],
    'array' => ['required', 'min', 'max', 'length'],
    'object' => ['required'],
    'tuple' => ['required'],
    'union' => ['required'],
    'required' => ['email', 'date', 'bool', 'input', 'integer', 'url', 'html', 'regex', 'enum', 'min', 'max', 'length', 'array', 'object', 'tuple', 'union'],
    'options' => [],
    'each' => ['array', 'min', 'max', 'length', 'required'],
    'file' => ['required'],
];

$validationRules_init = [
    'required',
    'email',
    'date',
    'bool',
    'string',
    'file',
    'input',
    'integer',
    'url',
    'html',
    'regex',
    'enum',
    'array',
    'object',
    'tuple',
    'union',
    'options'
];


class Zod
{
    private mixed $value = null;
    private $default = null;
    private $errors = [];
    private $listValidators = [];
    public $has_default = false;

    private $methodInjection = [];
    private $pile = [];

    public function __construct()
    {
        $this->errors = [];
        $this->listValidators = [];
        $this->default = null;
        $this->has_default = false;
        $this->value = null;
    }

    public function getValues()
    {
        return $this->value;
    }

    public function setValues($value)
    {
        $this->value = $value;
    }

    public function getListValidators()
    {
        return $this->listValidators;
    }

    public function getDefaults()
    {
        return $this->default;
    }

    public function getInjections()
    {
        return $this->methodInjection;
    }

    public function setErrors($error)
    {
        $this->errors = $error;
    }

    public function setDefault($defaultValues)
    {
        if (!$this->has_default) {
            $this->validateDefault($defaultValues);
            $this->has_default = true;
        }
        if (is_array($defaultValues)) {
            foreach ($defaultValues as $field => $value) {
                if (!array_key_exists($field, $this->listValidators)) {
                    echo "$field not found";
                    continue;
                }
                $validator = $this->listValidators[$field];
                $validator->setDefault($defaultValues[$field]);
                $validator->has_default = true;
                $this->default[$field] = $value;
            }
        }
        return $defaultValues;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function options(array $options = []): Zod
    {
        $this->pile[] = 'options';
        foreach ($options as $key => $validator) {
            $this->listValidators[$key] = $validator;
        }

        return $this;
    }

    public function each(Zod $validator): Zod
    {
        $this->pile[] = 'each';
        $this->listValidators['each'] = $validator;
        return $this;
    }

    private function validateRules()
    {
        global $validationRules;
        global $validationRules_init;
        foreach ($this->pile as $validator) {
            if (!array_key_exists($validator, $validationRules)) {
                throw new Exception("Invalid validator for $validator in the validation rules");
            }
            $validValidators = $validationRules[$validator];
            foreach ($this->pile as $validator) {
                if ($validator === $validator) continue;
                if (!in_array($validator, $validValidators)) {
                    throw new Exception("Invalid validator for $validator");
                }
            }
        }
        if (!empty($this->pile) && !in_array($this->pile[0], $validationRules_init)) {
            throw new Exception("You can't start with" . $this->pile[0]);
        }
        if (in_array('each', $this->pile)) {
            if (!in_array('array', $this->pile)) {
                throw new Exception("You can't use each without array");
            }
        }
    }

    public function validate(mixed $valueField, array | null $default = null, array $arg = []): mixed {
        $this->validateRules();
        if(!empty($default)) $this->setDefault($default);
        $hasOption = in_array('options', $this->pile);

        $validateADefaultValue = in_array('validateDefault', $arg) ? true : false;
        
        // if validator is an options type then the $key is the field name, and the $value is an instance of Zod
        // if key is an normal type then the $key is validator callback with this match 'validate' . ucfirst($fieldname), and the $validator is an array having the options
        
        // check if pile has options type
        
        if($hasOption) {
            // validation for options type
            foreach ($this->listValidators as $key => $validator) {

                $hasRequired = in_array('required', $validator->pile) ? true : false;
                $has_each = in_array('each', $validator->pile) ? true : false;
                try{
                    if($has_each) {
                        echo 'kkkkkkkkkkey : ' . $key . '<br>';
                        echo '<pre>';
                        echo 'valueField : ' . print_r($valueField) . '<br>';
                        echo '</pre>';
                        $validator->validate($valueField[$key]);
                    }

                    if(array_key_exists($key, $valueField)) {
                        $value = $valueField[$key];
                        if(!is_array($value))
                            $this->value[$key] = $validator->validateOrFail($value);
                        else{
                            $this->value[$key][] = $validator->validateOrFail($value);
                        }
                    } else if($hasRequired) {
                        $validator->validateOrFail(null);
                    } else {
                        // remove the field key from the $this->value
                        unset($this->value[$key]);
                        throw new Exception("Field $key is required");
                    }
                } catch (Exception $e) {
                    if (empty($this->has_default)) {
                        $fieldErrors = $validator->getErrors();
                        if($hasRequired) {
                            $this->errors[$key] = $fieldErrors;
                        }
                    } else {
                        if(array_key_exists($key, $this->default)) {
                            $this->value[$key] = $this->default[$key];
                        } else {
                            $this->value[$key] = null;
                        }
                    }
                }
            }
        } else {
            // validation for normal type
            $this->value = $valueField;
            foreach ($this->listValidators as $key => $validator) {
                if($key === 'each') {
                    $this->value = array_map(function($value) use ($validator) {
                        return $validator->validateOrFail($value);
                    }, $this->value);
                    continue;
                }
                if(!(substr($key, 0, strlen('validate')) === 'validate')) {
                    throw new Exception("Invalid validator for $key");
                }
                $this->$key($validator['options']);
            }
        }
        
        $response = [];
        if (empty($this->errors)) {
            $response = $this->value;
            if(is_array($response)) {
                $response['_state'] = 'success';
            }
        } else {
            $response = $this->errors;
            if(is_array($response)) {
                $response['_state'] = 'error';
            }
        }
        return $response;
    }
    private function validateDefault(mixed $default)
    {
        $defaultErrors = [];
        $this->errors = [];
        $this->validate($default, null, ['validateDefault' => true]);
        $defaultErrors = $this->getErrors();
        if (!empty($defaultErrors))
            throw new Exception("default values is invalid: " . json_encode($defaultErrors));
        return $this;
    }

    public function validateOrFail(mixed $value, mixed $default = []): mixed
    {
        $this->validate($value, $default);
        if (!empty($this->errors)) {
            throw new Exception("Validation failed " . json_encode($this->errors));
        }
        return $this->value;
    }

    public function addValidatorRule($fieldname, $callable)
    {
        $keyValidator = 'validate' . ucfirst($fieldname);

        $this->addMethod($keyValidator, function ($options = []) use ($callable, $fieldname) {
            $response = $callable($this->getValues(), $options);
            if ($response !== true) {
                $this->errors[$fieldname] = $response;
            };
        });

        $this->addMethod($fieldname, function ($options = []) use ($fieldname, $keyValidator) {
            $this->pile[] = $fieldname;
            if (!array_key_exists($keyValidator, $this->listValidators)) {
                $this->listValidators[$keyValidator] = ['options' => $options];
            }
            return $this;
        });
    }

    public function addMethod($methodName, $callable)
    {
        if (is_callable($callable)) {
            $this->methodInjection[$methodName] = $callable;
        }
    }

    public function __call($name, $arguments)
    {
        if (array_key_exists($name, $this->methodInjection)) {
            return call_user_func_array($this->methodInjection[$name], $arguments);
        }
        return call_user_func($name, $arguments);
    }
}

function z(): Zod
{
    $validatorList = include basePath('helpers/zod/zod_callback.php');
    $instance = new Zod();

    foreach ($validatorList as $key => $validator) {
        $instance->addValidatorRule($key, $validator);
    }

    return $instance;
}
