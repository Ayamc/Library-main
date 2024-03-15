<aside class='sticky top-0 h-screen col-span-2 cc-sidebar'>
    <div class='flex flex-col h-screen gap-4 px-3 py-8'>
        <div class='flex flex-row items-center justify-start w-full gap-3 px-4'>
            <img src="public/image/logo.png" class="object-contain w-8 h-8" alt="">
            <h4 class="flex-1 uppercase cc-title cc-title_h5 cc-title_bold cc-title_degree_1">
                <?= $p['titleLogo'] ?>
            </h4>
            <span class="cursor-pointer text-white-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="" width="20" height="20" viewBox="0 0 24 24"
                    stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M11 7l-5 5l5 5" />
                    <path d="M17 7l-5 5l5 5" class="opacity-80" />
                </svg>
            </span>
        </div>
        <span class='list-item w-full h-px bg-gradient-to-r from-transparent via-gray-100/30 to-transparent'></span>

        <div>
            <h6 class='opacity-50 cc-text cc-text_xs cc-text_degree_1'>
                Menu
            </h6>
            <ul class='flex flex-col divide-y divide-gray-700/20'>
                <?php foreach ($p['items'] as $item) { ?>
                    <li class='cc-item' data-ripple data-toggle="<?= $p['key']; ?>" data-toggle-link='<?= $item['key']; ?>'>
                        <ui-icon width='15' name='<?= $item['icon']; ?>'></ui-icon>
                        <span>
                            <?= $item['title']; ?>
                        </span>
                    </li>
                <?php } ?>
            </ul>
        </div>
        
    </div>
    <span class='absolute top-0 right-0 w-px bg-gradient-to-b from-gray-700 h-[90vh] to-transparent'></span>
</aside>
<script type='module'>
    import { Toggle } from '<?= localPath(); ?>ui/index.js';
    new Toggle('<?= $p['key']; ?>');
</script>