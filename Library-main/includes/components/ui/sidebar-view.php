<?php 
foreach ($p['views'] as $view) {
    $viewName = $view['view'];
    $viewKey = $view['key'];
    $sidebarKey = $view['sidebar_key'];
    $viewIsDefault = $view['is_default'];
    ?>
    <div class='hidden' data-toggle='<?= $sidebarKey ?>' data-toggle-view='<?= $viewKey ?>' <?= $viewIsDefault == 'true' ? 'data-toggle-default' : '' ?>>
        <?php include($viewName); ?>
    </div>
<?php
}
?>