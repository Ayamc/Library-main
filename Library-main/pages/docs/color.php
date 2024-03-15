
<?php
include_once(basePath('includes/components/index.php'));
global $twigComp;
?>
<div class='flex flex-col gap-6 items-start'>
    <?= $twigComp->render('docs.color', [
        'title' => 'Primary',
        'colors' => array(
            array('classColor' => 'bg-primary-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-primary-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-primary-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-primary-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-primary-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-primary-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-primary-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-primary-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-primary-900', 'colorDegree' => '900'),
        )
    ]); ?>
    <?= $twigComp->render('docs.color', [
        'title' => 'Secondary',
        'colors' => array(
            array('classColor' => 'bg-secondary-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-secondary-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-secondary-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-secondary-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-secondary-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-secondary-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-secondary-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-secondary-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-secondary-900', 'colorDegree' => '900'),
        )
    ]); ?>
    <?= $twigComp->render('docs.color', [
        'title' => 'Third',
        'colors' => array(
            array('classColor' => 'bg-third-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-third-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-third-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-third-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-third-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-third-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-third-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-third-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-third-900', 'colorDegree' => '900'),
        )
    ]); ?>
    <?= $twigComp->render('docs.color', [
        'title' => 'White',
        'colors' => array(
            array('classColor' => 'bg-white-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-white-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-white-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-white-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-white-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-white-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-white-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-white-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-white-900', 'colorDegree' => '900')
        )
    ]); ?>
    <?= $twigComp->render('docs.color', [
        'title' => 'Gray',
        'colors' => array(
            array('classColor' => 'bg-gray-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-gray-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-gray-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-gray-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-gray-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-gray-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-gray-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-gray-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-gray-900', 'colorDegree' => '900')
        )
    ]); ?>
    <?= $twigComp->render('docs.color', [
        'title' => 'Black',
        'colors' => array(
            array('classColor' => 'bg-black-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-black-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-black-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-black-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-black-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-black-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-black-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-black-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-black-900', 'colorDegree' => '900')
        )
    ]); ?>
    <?= $twigComp->render('docs.color', [
        'title' => 'Red',
        'colors' => array(
            array('classColor' => 'bg-red-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-red-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-red-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-red-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-red-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-red-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-red-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-red-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-red-900', 'colorDegree' => '900')
        )
    ]); ?>
    <?= $twigComp->render('docs.color', [
        'title' => 'Green',
        'colors' => array(
            array('classColor' => 'bg-green-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-green-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-green-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-green-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-green-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-green-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-green-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-green-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-green-900', 'colorDegree' => '900')
        )
    ]); ?>
    <?= $twigComp->render('docs.color', [
        'title' => 'Yellow',
        'colors' => array(
            array('classColor' => 'bg-yellow-100', 'colorDegree' => '100'),
            array('classColor' => 'bg-yellow-200', 'colorDegree' => '200'),
            array('classColor' => 'bg-yellow-300', 'colorDegree' => '300'),
            array('classColor' => 'bg-yellow-400', 'colorDegree' => '400'),
            array('classColor' => 'bg-yellow-500', 'colorDegree' => '500'),
            array('classColor' => 'bg-yellow-600', 'colorDegree' => '600'),
            array('classColor' => 'bg-yellow-700', 'colorDegree' => '700'),
            array('classColor' => 'bg-yellow-800', 'colorDegree' => '800'),
            array('classColor' => 'bg-yellow-900', 'colorDegree' => '900')
        )
    ]); ?>
</div>
