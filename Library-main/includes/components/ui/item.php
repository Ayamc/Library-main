<?php 
    $safeKey = isset($p['safeKey']) ? $p['safeKey'] : '';
    $safeIcon = isset($p['safeIcon']) ? $p['safeIcon'] : '';
    $safeTitle = isset($p['safeTitle']) ? $p['safeTitle'] : '';
?>

<li  class='cc-item' data-ripple data-toggle='view' data-toggle-link='<?= $safeKey ?>'> 
    <ui-icon width='15' name='<?= $safeIcon?>'></ui-icon>
    <span><?= $safeTitle ?></span>
</li>