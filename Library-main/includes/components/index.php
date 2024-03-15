<?php

$twigComp = new Twig();

$Color_validator = z()->options([
    'title' => z()->required()->string(),
    'colors' => z()->required()->array()->each(z()->options([
        'classColor' => z()->required()->string(),
        'colorDegree' => z()->required()->string()
    ]))
]);

// Add header components
$twigComp->addFileSystemLoader('header.sidebar', basePath('includes/components/header/header-sidebar.php'));

// Add ui components
$twigComp->addFileSystemLoader('ui.divider', basePath('includes/components/ui/divider.php'));
$twigComp->addFileSystemLoader('ui.sidebar', basePath('includes/components/ui/sidebar.php'));
$twigComp->addFileSystemLoader('ui.sidebar.view', basePath('includes/components/ui/sidebar-view.php'));
$twigComp->addFileSystemLoader('ui.chip', basePath('includes/components/ui/chip.php'));
$twigComp->addFileSystemLoader('ui.rating', basePath('includes/components/ui/rating.php'));
$twigComp->addFileSystemLoader('ui.item', basePath('includes/components/ui/item.php'));
$twigComp->addFileSystemLoader('ui.detail', basePath('includes/components/ui/detail.php'));
$twigComp->addFileSystemLoader('ui.card', basePath('includes/components/ui/card.php'));
$twigComp->addFileSystemLoader('docs.color', basePath('includes/components/docs/color.php'), $Color_validator);




// Warning
// : Undefined array key "colors" in
// F:\fsac\stage\Library-main\helpers\zod\zod.php
// on line
// 198


// Fatal error
// : Uncaught TypeError: array_map(): Argument 
// #2 ($array) must be of type array, null given in F:\fsac\stage\Library-main\helpers\zod\zod.php:235 Stack trace: 
// #0 F:\fsac\stage\Library-main\helpers\zod\zod.php(235): array_map(Object(Closure), NULL) 
// #1 F:\fsac\stage\Library-main\helpers\zod\zod.php(198): Zod->validate(NULL) 
// #2 F:\fsac\stage\Library-main\helpers\zod\zod.php(274): Zod->validate(Array, NULL) 
// #3 F:\fsac\stage\Library-main\helpers\twig.php(34): Zod->validateOrFail(Array, NULL) 
// #4 F:\fsac\stage\Library-main\includes\components\sidebar.php(78): Twig->render('ui.sidebar', Array) 
// #5 F:\fsac\stage\Library-main\pages\docs.php(42): Sidebar->render() 
// #6 F:\fsac\stage\Library-main\index.php(17): include('F:\\fsac\\stage\\L...') 
// #7 {main} thrown in
// F:\fsac\stage\Library-main\helpers\zod\zod.php
// on line
// 235
