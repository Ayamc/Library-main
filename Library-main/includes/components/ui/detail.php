<?php
    $value = isset($p['value']) ? $p['value'] : '';
    $type = isset($p['type']) ? $p['type'] : '';
    $safeAtt = isset($p['safeAtt']) ? $p['safeAtt'] : '';
?>
<div class="flex flex-row gap-4 items-center justify-start">
    <div class="text-white-100 flex flex-row items-center gap-4 w-40\">
        <ui-icon name="$safeIcon" class="" color="white" width="20"></ui-icon>
        <span class="cc-text cc-text_sm cc-text_degree_1"><?= $safeAtt ?></span>
    </div>
    <div>
        <?php
        switch ($type) {
            case 'text':
                $safeValue = validateString($value);
        ?>
                <span class="cc-text cc-text_sm cc-text_degree_3 cc-text_semibold"><?= $safeValue ?></span>
                <?php
                break;
            case 'list':
                if (is_array($value)) {
                ?>
                    <ul class="flex flex-row gap-2">
                        <?php
                        foreach ($value as $item) {
                            $detailHtml .= ship($item, 'primary', ['size' => 'sm']);
                        }
                        ?>
                    </ul>
        <?php
                }
                break;
        }
        ?>
    </div>
</div>