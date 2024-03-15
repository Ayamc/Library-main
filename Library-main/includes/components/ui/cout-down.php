<?php
    $key = isset($p['key']) ? $p['key'] : '';
    $value = isset($p['value']) ? $p['value'] : '';
?>
<p class='flex flex-col justify-center items-center flex-1 p-2 bg-white-100 rounded-md'>
    <span class="cc-text cc-text_md cc-text_bold text-black-200"  <?= $key ?> ></span>
    <span class='cc-text cc-text_xs cc-text_medium text-gray-200 capitalize'>
        <?= $value ?>
    </span>
</p>
<div class='cc-card cc-card_sm cc-card_bordered'>
    <div class='cc-card-body flex flex-col gap-4 w-full'>
        <p class='uppercase cc-title cc-title_h4 cc-title_bold'>Count down</p>
        <div class='flex flex-col gap-2 w-full' data-count_down-init data-target-date='2024-01-19 00:00:00' data-interval='1000'>
            <div class='flex flex-row justify-between gap-2 w-full'>
                <?= dateElement('data-year', 'year') ?>
                <?= dateElement('data-month', 'mon') ?>
                <?= dateElement('data-day', 'day')   ?>
            </div>
            <div class='flex flex-row justify-between gap-2 w-full'>
                <?= dateElement('data-hour', 'hour')  ?>
                <?= dateElement('data-minute', 'min') ?>
                <?= dateElement('data-second', 'sec') ?>
            </div>
        </div>
    </div>
</div>