<?php 
include_once(__DIR__ . '/init.php');

$page = getQuery('page', 'docs');

?>  
<!DOCTYPE html>
<html lang='en' >   
    <head>
        <?php include(basePath('includes/head.php')); ?>
    </head>
    <body class='cc-front bg-black overflow-x-hidden'>
        <main class='' >
            <?php 
                if(isset($page)) {
                    if(file_exists(basePath("pages/$page.php"))) {
                        include(basePath("pages/$page.php"));
                    } else {
                        include(basePath("pages/404.php"));
                    }
                } else {
                    include(basePath("pages/home.php"));
                }
            ?>
        </main>
        <?php include(basePath('includes/footer.php')); ?>
        <?php include(basePath('includes/scripts.php')); ?>
        <?php include(basePath('includes/toast.php')); ?>   
    </body>
</html>