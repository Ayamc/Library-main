<?php

$link = $p['link'] ?? null;
$actionAtt = $link ? "data-link='$link' tabindex='0'" : "";
$actionClass = $link ? "cc-card-clickable" : "";

$paginate = $p['paginate'] ?? false;
$paginateClass = $paginate ? "hidden" : "";
$type = $p['type'] ?? 'degrade_with_bg';

$head = $p['head'] ?? '';
$body = $p['body'] ?? '';

$mt = $p['mt'] ?? '0';
$key = $p['key'] ?? '';

$img = $p['img']['src'] ?? null;
$imageHeight = $p['img']['height'] ?? 0;
$imageHeightStyle = $imageHeight . 'rem';

switch ($type) {
    case 'degrade_with_bg':
        $degrade = 'bg-gradient-to-t from-black-300 via-black-300/80 to-transparent';
        if (is_string($img)) {
            $mt = ($imageHeight - ($imageHeight * 1.2)) . 'rem';
        } else {
            $mt = '0';
        }
        break;
    case 'degrade_with_img':
        $degrade = 'bg-gradient-to-t from-black-300 via-black-300/60 to-transparent';
        break;
    case 'normal':
        break;
}

$img = $img ? cleanHtmlOutput(
    "
            <div class='relative w-full z-10'>
                <img src='$img' alt='image gallery $key' class='object-cover w-full' style='height: $imageHeightStyle;'>
                <div class='absolute top-0 left-0 w-full h-[101%] z-10 $degrade'>
                    <div class='cc-card-header' >
                        $head
                    </div>
                </div>
            </div>
        "
) : "";
?>

<span <?= $actionAtt ?> class='<?= $actionClass . ' ' . $paginateClass ?>'>
    <div class='cc-card cc-card_md cc-card_bordered cc-card_hovered cc-card_shadow'>
        <?= $img ?>
        <div class='cc-card-body mb-4' style='margin-top: <?= $mt ?>;margin-bottom: -<?= $mt ?>'>
            <?= $body ?>
        </div>
    </div>
</span>