<?php
include_once '../../init.php';
include_once(basePath('helpers/zod/zod.php'));

$validator = z()->options([
    'Emails' => z()->required()->array()->min(['min' => 1])->max(['max' => 9])->each(z()->options([
        'nom' => z()->required()->string(),
        'email' => z()->required()->email()
    ])),
]);

// $validatornames = z()->array()->each(z()->string());

try {
    $optionTest = $validator->validate([
        'Emails' => [
            ['nom'=>'abdo', 'email' => 'abd@email.com'],
            ['nom'=>'test', 'email' =>'test1@email.com'],
            ['nom'=>'test2', 'email' =>'test2@email.com']
        ]
    ]);
    logData($optionTest);
    // $value = $validatornames->validate(['57', 'test2', 'test3']);
    // logData($value);
} catch (Exception $e) {
    logData($e->getMessage());
    exit();
}
