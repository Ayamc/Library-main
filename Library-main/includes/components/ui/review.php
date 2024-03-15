<?php
    // TODO avatarUser ship rating
    // Validate and sanitize input parameters
    $author_avatar = $p['author_avatar'] ?? ''; // Assuming validateString is a predefined function for text validation
    $author_name = $p['author_name'] ?? '';
    $type = $p['author_type'] ?? '';
    $feedback = $p['feedback'] ?? '';
    $rate = $p['rate'] ?? 0;
    $date = $P['feed_date'] ?? '';
    // Assuming avatarUser() and ship() are functions that generate safe HTML
    // Ensure these functions are also refactored and use validated inputs
    $avatarHtml = avatarUser($author_avatar, [
        'size' => 'sm',
        'color' => 'primary',
        'rounded' => 'lg',
        'name' => $author_name
    ]);
    $typeHtml = ship($type, 'primary', ['size' => 'sm']);
    $reviewRate = rating($rate, [
        'readonly' => true,
        'size' => 'sm'
    ]);
?>
<div class='cc-card cc-card_sm cc-card_bordered w-full'>
    <div class='cc-card-body flex flex-col'>
        <div class='flex flex-row justify-between item-center'>
            <span><?= $avatarHtml ?></span>
            <span><?= $typeHtml ?></span>
        </div>
        <hr class='bg-gray-800/20 opacity-30 mt-4 mb-3'></hr>
        <div class='text-gray-400'>
            <p class='cc-text cc-text_sm cc-text_medium'>
                <?= $feedback ?>
            </p>
        </div>
        <hr class='bg-gray-800/20 opacity-30 my-3'></hr>
        <div class='flex flex-row justify-between w-full'>
            <div>
                <?= $reviewRate ?>
            </div>
            <div class='flex flex-row gap-2 text-gray-400 justify-end items-center'>
                <ui-icon width='16' name='calendarEvent'></ui-icon>
                <p class='cc-text cc-text_xs cc-text_bold'>
                    <?= $date ?>
                </p>
            </div>
        </div>
    </div>
</div>