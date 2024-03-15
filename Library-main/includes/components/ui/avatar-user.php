<?php
$sizeImagesClasses = [
    'sm' => 'w-7 h-7',
    'md' => 'w-9 h-9',
    'lg' => 'w-12 h-12',
    'xl' => 'w-16 h-16'
];
$colorClasses = [
    'primary' => 'ring-2 ring-offset-2 ring-primary-400 ring-offset-black-400',
    'secondary' => 'ring-2 ring-offset-2 ring-secondary-400 ring-offset-black-400',
    'success' => 'ring-2 ring-offset-2 ring-green-400 ring-offset-black-400',
    'warning' => 'ring-2 ring-offset-2 ring-yellow-400 ring-offset-black-400',
    'danger' => 'ring-2 ring-offset-2 ring-red-400 ring-offset-black-400'
];
$roundedClasses = [
    'full' => 'rounded-full',
    'sm' => 'rounded-sm',
    'md' => 'rounded-md',
    'lg' => 'rounded-lg',
];
// Construct classes based on validated choices
$sizeImage = $sizeImagesClasses[$p['size']];
$colorClass = $color ? $colorClasses[$p['color']] : '';
$roundedClass = $roundedClasses[$p['rounded']];
// Construct the src value
$srcValue = !empty($p['src']) ? htmlspecialchars($src, ENT_QUOTES, 'UTF-8') : "https://ui-avatars.com/api/?name=" . urlencode($p['name']) . "&size=128&background=685cec&color=fff";
?>

<div class='flex flex-row gap-4 items-center'>
    <span
        class='flex relative justify-center items-center box-border overflow-hidden align-middle z-0 outline-none <?= $sizeImage ?> bg-black-200 <?= $roundedClass ?> <?= $colorClass ?>'>
        <img class='flex object-cover w-full h-full transition-opacity border-1' src='<?= $srcValue ?>'
            alt='<?= $p['title'] ?>'>
    </span>
    <div class='flex flex-col gap-0'>
        <?= ($p['name'] ? "<h5 class='text-xxs select-none tracking-wider text-white-400'>{$p['name']}</h5>" : "") ?>
        <?= ($p['title'] ? "<span class='text-xxs select-none tracking-wider text-white-400/60'>{$p['title']}</span>" : "") ?>
    </div>
</div>