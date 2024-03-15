<?php
include_once basePath('includes/components/sidebar.php');

try {
    $sidebar = new Sidebar('view');
    $sidebar->addItem([
        'type' => 'view',
        'key' => 'colors',
        'title' => _t('docs.nav.items.colors'),
        'icon' => 'dashboard',
        'view' => basePath('pages/docs/color.php')
    ])->addItem([
        'type' => 'view',
        'key' => 'text', 
        'title' => _t('docs.nav.items.text'),
        'header_title' => _t('docs.nav.items.text'),
        'icon' => 'dashboard',
        'view' => basePath('pages/docs/typography.php'),
        'is_default' => 'true'
    ])->addItem([
        'type' => 'view',
        'key' => 'icons',
        'title' => "Icons",
        'header_title' => 'Icons',
        'icon' => 'dashboard',
        'view' => basePath('pages/docs/icons.php'),
    ])->addItem([
        'type' => 'view',
        'key' => 'card',
        'title' => "Card",
        'header_title' => 'Card',
        'icon' => 'dashboard',
        'view' => basePath('pages/docs/card.php'),
    ]);
} catch (Exception $e) {
    logData($e->getMessage());
    exit();
}
?>

<div class='grid grid-cols-10 gap-0 w-full min-h-screen items-start z-10'>
    <?= $sidebar->render(); ?>
    <div class='col-span-8 flex flex-col gap-8 min-h-screen'>
        <?php echo $sidebar->renderHeader(); ?> 
        <span class='mx-8 flex-1'>
            <?php 
                echo $sidebar->renderViews(); 
            ?>
        </span>
    </div>
</div>
