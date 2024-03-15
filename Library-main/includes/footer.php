<?php 

if (basename($_SERVER['SCRIPT_FILENAME']) == basename(__FILE__)) {
    header('Location: /');
    exit;
}