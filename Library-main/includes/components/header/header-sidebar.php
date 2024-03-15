<div id='header-dashboard' class='contents z-header top-0'>
    <header class='mx-8 flex flex-row justify-between items-center pt-4 pb-3 border-b border-gray-700' style='min-height: 70px;'>
        <span class='contents'>
            <?php foreach ($p['titles'] as $title) { ?>
                <h4 class='cc-title cc-title_h4 capitalize cc-title_bold cc-title_degree_3 hidden' data-toggle='<?= $title['sidebar_key'] ?>' data-toggle-view='<?= $title['key'] ?>'>
                    <?= $title['title']; ?>
                </h4>
            <?php } ?>
        </span>
        <div data-ripple data-view-link='profile' class='p-2'>
        </div>
    </header>
</div>