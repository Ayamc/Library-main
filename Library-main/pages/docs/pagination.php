<?php
$currentPage = $p['currentPage'];
$pageSize = $p['pageSize'];
$total = $p['total'];
$maxPageSize = $p['maxPageSize'];
$maxPageToShow = $p['maxPageToShow'];
$color = $p['color'];
?>
<nav class='cc-pagination cc-pagination_<?= $color ?>' role='navigation' data-pagination-init data-key='<?= $p['key'] ?>' data-current-page='<?= $currentPage ?>' data-page-size='<?= $pageSize ?>' data-total-items='<?= $total ?>' data-max-page-size='<?= $maxPageSize ?>' data-max-page-to-show='<?= $maxPageToShow ?>' aria-label='pagination navigation'>
    <ul data-slot='wrapper'>
        <span class='cc-pagination_cursor'></span>
        <li role='button' tabindex='0' aria-label='pagination item' data-slot='item' class='cc-pagination_item' data-pagination-prev>
            <svg fill='none' focusable='false' height='1em' role='presentation' viewBox='0 0 24 24' width='1em'>
                <path d='M15.5 19l-7-7 7-7' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'></path>
            </svg>
        </li>
        <li role='button' tabindex='0' aria-label='pagination item' data-slot='item' class='cc-pagination_item' data-pagination-dots>
            <svg aria-hidden='true' fill='none' height='1em' shape-rendering='geometricPrecision' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24' width='1em' class=''>
                <circle cx='12' cy='12' fill='currentColor' r='1'></circle>
                <circle cx='19' cy='12' fill='currentColor' r='1'></circle>
                <circle cx='5' cy='12' fill='currentColor' r='1'></circle>
            </svg>
        </li>
        <li role='button' tabindex='0' aria-label='pagination item' data-slot='item' class='cc-pagination_page' data-pagination-page>
        </li>
        <li role='button' tabindex='0' aria-label='pagination item' data-slot='item' class='cc-pagination_item' data-pagination-next>
            <svg aria-hidden='true' fill='none' focusable='false' height='1em' role='presentation' viewBox='0 0 24 24' width='1em' class='rotate-180'>
                <path d='M15.5 19l-7-7 7-7' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5'></path>
            </svg>
        </li>
    </ul>
</nav>