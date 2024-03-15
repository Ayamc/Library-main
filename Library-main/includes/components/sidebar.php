<?php

$validatorItem = z()->options([
    'key' => z()->required()->string(),
    'type' => z()->required()->string(),
    'title' => z()->required()->string(),
    'icon' => z()->required()->string(),
    'is_default' => z()->bool(),
    'view' => z()->required()->file(),
]);

class Sidebar {
    private $key;
    private $items = [];
    private $views = [];
    private $titles = [];
    public function __construct($key = null) {
        $this->key = empty($key) ? cc_uniqid() : $key;
    }
    public function addItem(array $options = []): Sidebar {
        global $validatorItem;
        try{
            $options = $validatorItem->validateOrFail($options, [
                'key' => 'sidebar-' . cc_uniqid(),
                'type' => 'view',
                'title' => 'Sidebar Item',
                'icon' => 'dashboard',
                'view' => basePath('pages/docs/typography.php'),
                'is_default' => 'false'
            ]);
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $toggleAttribute = "data-toggle='$this->key' data-toggle-view='{$options['key']}'" . ($options['is_default'] ? ' data-toggle-default' : '');

        if(!file_exists($options['view'])) {
            throw new Exception("File not found: " . $options['view']);
        }

        $this->items[] = [
            'key' => $options['key'],
            'view' => $options['view'],
            'att' => $toggleAttribute,
            'icon' => $options['icon'],
            'title' => $options['title'],
            'is_default' => $options['is_default']
        ];

        $this->views[] = [
            'key' => $options['key'],
            'view' => $options['view'],
            'is_default' => $options['is_default'],
            'sidebar_key' => $this->key
        ];

        $this->titles[] = [
            'sidebar_key' => $this->key,
            'key' => $options['key'],
            'title' => $options['title']
        ];

        return $this;
    }
    public function renderHeader(): string {
        global $twigComp;

        return $twigComp->render('header.sidebar', [
            'titles' => $this->titles
        ]);
    }
    public function renderViews() {
        global $twigComp;
        return $twigComp->render('ui.sidebar.view', ['views' => $this->views]);
    }
    public function render() {
        global $twigComp;
        return $twigComp->render('ui.sidebar', [
            'key' => $this->key,
            'titleLogo' => 'CC',
            'items' => $this->items,
        ]);
    }
}