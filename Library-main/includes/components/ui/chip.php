<?php 
    $size = isset($p['size']) ? $p['size'] : 'md';
    $color = isset($p['color']) ? $p['color'] : 'primary';

    $text = isset($p['text']) ? $p['text'] : '';
?>
<div class='cc-ship cc-ship_<?= $size ?> cc-ship_r_full cc-ship_<?= $color ?>' data-overlay="Edit">
    <span><?= $text ?></span>
</div>