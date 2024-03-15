<div class="flex flex-col gap-3">
    <h5 class="cc-title cc-title_h5 cc-title_degree_2"><?= $p['title'] ?></h5>
    <div class="flex flex-row gap-3 items-start">
        <?php foreach ($p['colors'] as $color) { ?>
            <div class="flex flex-col items-start gap-2">
                <div class="w-16 h-16 rounded-sm border border-solid border-gray-800 <?= $color['classColor'] ?>"></div>
                <div class='flex flex-col gap-0 items-start'>
                    <span class="cc-text cc-text_xs cc-text_degree_2"><?= $color['colorDegree'] ?></span>
                </div>
            </div>
        <?php } ?>
    </div>
</div>