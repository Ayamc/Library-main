<?php
global $twigComp;
?>
<section class='grid grid-cols-3 [&>*]:col-span-1 gap-4'>
    <?= $twigComp->render('ui.card', [
        'key' => 'card-1',
        'type' => 'degrade_with_bg',
        'img' => [
            'height' => 20,
            'src' => 'public/image/download.png',
        ],
        'body' => '<div class="flex flex-col gap-2">
            <h4 class="cc-title cc-title_h3 cc-title_degree_1">
                Card with blur effect, Red Color ball 
            </h4>
            <p class="cc-text cc-text_md cc-text_degree_4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Quisquam, voluptatum.
            </p>
            ' . $twigComp->render('ui.divider', [
                            'format' => 'gray'
                        ]) . '
            <div class="flex flex-row justify-between items-center mt-2"><a href="http://instagram.com/" >' .
                $twigComp->render('ui.chip', ['text' => 'Primary', 'color' => 'primary']) . '</a>' .
                $twigComp->render('ui.rating', ['value' => 2]) . '
            </div>
            </div>',
        'head' => '<div class="flex flex-row justify-between w-full">' .
            $twigComp->render('ui.chip', ['text' => 'SOLD', 'type' => 'primary']) .
            $twigComp->render('ui.rating', ['value' => 2]) . '
        </div>',
        'action' => [
            'link' => 'https://www.google.com'
        ]
    ]); ?>
    <?= $twigComp->render('ui.card', [
        'key' => 'card-2',
        'type' => 'degrade_with_bg',
        'img' => [
            'height' => 20,
            'src' => 'public/image/download.png',
        ],
        'body' => '<div class="flex flex-col gap-2">
            <h4 class="cc-title cc-title_h3 cc-title_degree_1">
                Card with blur effect, Red Color ball 
            </h4>
            <p class="cc-text cc-text_md cc-text_degree_4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Quisquam, voluptatum.
            </p><div class="flex flex-row justify-between items-center mt-2">' .
                $twigComp->render('ui.chip', ['text' => 'Primary', 'color' => 'primary']) .
                $twigComp->render('ui.rating', ['value' => 2])
                . '</div>
            </div>'
    ]);
    ?>
    <?= $twigComp->render('ui.card', [
        'key' => 'card-3',
        'type' => 'degrade_with_bg',
        'img' => [
            'height' => 20,
            'src' => 'public/image/download.png',
        ],
        'body' => '<div class="flex flex-col gap-2">
            <h4 class="cc-title cc-title_h3 cc-title_degree_1">
                Card with blur effect, Red Color ball 
            </h4>
            <p class="cc-text cc-text_md cc-text_degree_4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                Quisquam, voluptatum.
            </p><div class="flex flex-row justify-between items-center mt-2">' .
                $twigComp->render('ui.chip', ['text' => 'Primary', 'color' => 'primary']) .
                $twigComp->render('ui.rating', ['value' => 2])
                . '</div>
            </div>'
    ]);
    ?>

</section>