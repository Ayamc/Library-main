
<?php
    $opacity_values = [
        '0' => 'opacity-0',
        '10' => 'opacity-10',
        '20' => 'opacity-20',
        '30' => 'opacity-30',
        '40' => 'opacity-40',
        '50' => 'opacity-50',
        '60' => 'opacity-60',
        '70' => 'opacity-70',
        '80' => 'opacity-80',
        '90' => 'opacity-90',
        '100' => 'opacity-100'
    ];
    // $opacity = $opacity_values[$p['opacity']];
    $opacity_val = array_key_exists('opacity', $p) ? $p['opacity'] : '100';  
    $opacity = $opacity_values[$opacity_val] ?? 'opacity-100';
?>

<span class="cc-divider cc-divider_<?= $p['format']; ?> <?= $opacity; ?> my-2">
    <div></div>
</span>