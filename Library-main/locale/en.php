<?php
return array(
    'head' => array(
        'title' => 'Cyber Cohesion -- Documentation',
        'description' => 'Cyber cohesion description'
    ),
    'docs' => array(
        'logo-title' => 'DOCUMENTATION',
        'nav' => array(
            'items' => array(
                'colors' => 'Colors',
                'text' => 'Text',
                ''
            )
        )
    ),
    'form' => array(
        'field' => array(
            'text_input' => array(
                'label' => 'This is a text input ',
                'placeholder' => 'Enter a text'
            ),
            'file' => array(
                'label' => 'This is a file input ',
                'placeholder' => 'Enter a file'
            ),
            "date" => array (
                "label" => "This is a date input",
                "placeholder" => "Enter a date"
            ),
            'email' => array(
                'label' => 'Email',
                'placeholder' => 'Enter your email'
            ),
            "password" => array (
                "label" => "Password",
                "placeholder" => "Password"
            ),
            "password_confirm" => array (
                "label" => "Confirm Password",
                "placeholder" => "Confirm Password"
            ),
            'Phone' => array(
                'label' => 'This is an input for phone numbers',
                'placeholder' => 'Enter a phone number'
            ),
            'select' => array(
                'label' => 'This is a select input',
                'placeholder' => 'Select an option',
                'options' => array(
                    '1' => 'option 1',
                    '2' => 'option 2',
                    '3' => 'option 3',
                )
            )
        ),
        "error" => array(
            "required" => "The {{field}} field is required",
            "email" => "Please enter a valid email address",
            "password" => "The password must contain at least one uppercase letter, one lowercase letter, one digit, one special character and be between 8 and 64 characters long",
            "password_confirm" => "Passwords do not match",
            "min" => "The {{field}} field must be at least {{minLength}} characters long",
            "max" => "The {{field}} field must be less than {{maxLength}} characters long",
        ),
        'button_text' => 'Test The form'
    )
);
?>