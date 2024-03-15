<?php 
$listIconName = ["affiliate", "alertCircle", "archive", "arrowDown", "arrowNarrowDown", "arrowNarrowRight", "arrowNarrowUp", "arrowUpRight", "award", "bookOpen", "bookmark", "brain", "brightnessUp", "bulb", "calendarEvent", "certificate", "chartBar", "chevronDown", "clipboardList", "coins", "cpu", "currencyDollar", "dashboard", "deviceComputerCamera", "deviceDesktopAnalytics", "diamond", "directions", "edit", "eyeQuestion", "globe", "grid3x3", "hand", "handShake", "heart", "help", "layers", "linkedin", "logout", "mail", "message2", "news", "password", "people", "pipMoney", "puzzle", "questionMark", "refresh","robot", "rocket", "routeX", "settings", "share", "shield", "shieldLock", "shoppingCart", "strategy", "tag", "target", "timeDurationOff", "tools", "tournament", "trash", "userCheck", "userScan", "users", "usersGroup", "video", "view", "world", "youtube"];
?>

<div class='flex flex-row flex-wrap w-full p-12 gap-12'>
    <?php foreach ($listIconName as $iconName) : ?>
        <div class='flex flex-col gap-4 items-center justify-center w-32'>
            <ui-icon color='white' name='<?= $iconName; ?>' width="500"></ui-icon>
            <span class='cc-text cc-text_xs cc-text_degree_3 cc-text_semibold'><?= $iconName; ?></span>
        </div>
    <?php endforeach; ?>
</div>