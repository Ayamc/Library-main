<?php
$options = isset($p['options']) ? $p['options'] : [
    'autohide' => 'true',
    'delay' => '5000',
    'title' => 'Notification',
    'id' => 'toast-element',
    'type' => 'success',
];
$type = isset($p['type']) ? $p['type'] : 'success';
$message = isset($p['message']) ? $p['message'] : '';
$icons = array(
    'success' => 'check',
    'warning' => 'exclamationMark',
    'danger' => 'X',
    'primary' => 'arrowUp',
);
$iconBgColor = array(
    'success' => 'bg-green-400/40 text-black-200',
    'warning' => 'bg-yellow-400/40 text-black-200',
    'danger' => 'bg-red-400/40 text-black-200',
    'primary' => 'bg-primary-400/40 text-black-200',
);
$ballColor = array(
    'success' => 'cc-card_ball_green',
    'warning' => 'cc-card_ball_orange',
    'danger' => 'cc-card_ball_red',
    'primary' => 'cc-card_ball_blue',
);
?>
<div class='pointer-events-auto cc-card cc-card_sm cc-card_bordered {<?= $ballColor[$type] ?>} data-[toast-show]:block data-[toast-hide]:hidden' id='{<?= $options[' id'] ?>}' role='alert' aria-live='assertive' aria-atomic='true' data-delay='{<?= $options['delay'] ?>}' data-animation='true' data-autohide='{<?= $options[' autohide'] ?>}' data-toast-init data-toast-show='true'>
    <div class='cc-card-body flex flex-row gap-4 items-center'>
        <div class='p-2 flex flex-row justify-center items-center rounded-full {<?= $iconBgColor[$type] ?>}'>
            <ui-icon name='{ <?= $icons[$type] ?>}' class='z-10' width='16' height='16'></ui-icon>
        </div>
        <div>
            <h5 class='cc-title cc-title_h5 cc-title_degree_1'>
                <?= $message ?>
            </h5>
        </div>
    </div>
    <span class='cc-card_deco'>
        <span class='cc-card_ball opacity-100'></span>
    </span>
    <span>
        <div class='absolute top-0 right-0 z-40'>
            <button type='button' class='text-gray-100 mr-2 mt-2 box-content border-none opacity-70 hover:no-underline hover:opacity-50 focus:opacity-100 focus:shadow-none focus:outline-none' data-toast-dismiss aria-label='Close'>
                <span class='focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25'>
                    <ui-icon name='X' height='18' width='18'></ui-icon>
                </span>
            </button>
        </div>
    </span>
</div>