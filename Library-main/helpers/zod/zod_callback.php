<?php 

return [
    'email' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid email format";
        $valid = filter_var($value, FILTER_VALIDATE_EMAIL) && htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        if (!$valid) {
            return $errorMessage;
        }
        return true;
    },
    'file' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['messageFileExist'] ?? "Invalid file exist";
        if (!file_exists($value)) {
            return $errorMessage;
        }
        return true;
    },
    'required' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Field is required";
        if (empty($value)) {
            return $errorMessage;
        }
        return true;
    },
    'string' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid string format";
        
        if (!is_string($value)) {
            return $errorMessage;
        }
        return true;
    },
    'enum' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid value";
        $enum = $options['enum'] ?? [];
        if (!in_array($value, $enum)) {
            return $errorMessage;
        }
        return true;
    },

    'min' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid value";
        $min = $options['min'] ?? 0;
        if (is_string($value) && strlen($value) < $min) {
            return $errorMessage;
        }
        if (is_integer($value) && $value < $min) {
            return $errorMessage;
        }
        if (is_array($value) && count($value) < $min) {
            return $errorMessage;
        }
        return true;
    },

    'max' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid value";
        $max = $options['max'] ?? 0;
        if (is_string($value) && strlen($value) > $max) {
            return $errorMessage;
        }
        if (is_integer($value) && $value > $max) {
            return $errorMessage;
        }
        if (is_array($value) && count($value) > $max) {
            return $errorMessage;
        }
        return true;
    },

    'date' => function (string $value, array $options = []): string | bool {
        $format = $options['format'] ?? 'Y-m-d';
        $errorMessage = $options['message'] ?? "Invalid date format";
        $date = $value;
        $d = DateTime::createFromFormat($format, $date);
        $valid = $d && $d->format($format) == $date;
        if (!$valid) {
            return $errorMessage;
        }
        return true;
    },
    'array' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid array format";
        if (!is_array($value)) {
            return $errorMessage;
        }
        return true;
    },

    'input' => function (string $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid input format";
        $sanitized_input = htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');

        if ($sanitized_input !== $value) {
            return $errorMessage;
        }
        return true;
    },

    'integer' => function (string $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid number format";
        $number = $value;

        $valid = filter_var($number, FILTER_VALIDATE_INT) && (int) $number;
        if (!$valid) {
            return $errorMessage;
        }
        return true;
    },

    'url' => function (string $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid url format";
        $valid = filter_var($value, FILTER_VALIDATE_URL) && htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        if (!$valid) {
            return $errorMessage;
        }
        return true;
    },

    'html' => function (string $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid html format";
        $valid = isset($value) && is_string($value) && !empty($value) && htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        if (!$valid) {
            return $errorMessage;
        }
        return true;
    },

    'regex' => function (string $value, array $options = []): string | bool {
        $pattern = $options['pattern'] ?? '';
        $errorMessage = $options['message'] ?? "Invalid format";

        if (!preg_match($pattern, $value)) {
            return $errorMessage;
        }
        return true;
    },

    

    'object' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid object format";
        if (!is_object($value)) {
            return $errorMessage;
        }
        return true;
    },

    'length' => function (string $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid value";
        $length = $options['length'] ?? 0;
        if (is_string($value) && strlen($value) !== $length) {
            return $errorMessage;
        }
        if (is_integer($value) && $value !== $length) {
            return $errorMessage;
        }
        if (is_array($value) && count($value) !== $length) {
            return $errorMessage;
        }
        return true;
    },

    'tuple' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid tuple format";
        $length = $options['length'] ?? 0;
        if (count($value) !== $length) {
            return $errorMessage;
        }
        return true;
    },

    'union' => function (mixed $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid union format";
        $types = $options['types'] ?? [];
        $valid = false;
        foreach ($types as $type) {
            if (gettype($value) === $type) {
                $valid = true;
                break;
            }
        }
        if (!$valid) {
            return $errorMessage;
        }
        return true;
    },
    'bool' => function (string $value, array $options = []): string | bool {
        $errorMessage = $options['message'] ?? "Invalid boolean format";
        // is 'true' or 'false' string
        $valid = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) !== null;
        if (!$valid) {
            return $errorMessage;
        }
        return true;
    },
];
