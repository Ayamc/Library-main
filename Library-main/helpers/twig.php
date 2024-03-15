<?php

class Twig
{
    private $fileSystemLoader = [];
    private $validator = null;

    function __construct()
    {
    }

    public function addFileSystemLoader($key, $path, $validator = null)
    {
        if (!file_exists($path)) {
            throw new Exception("File not found: $path");
        }
        if ($validator != null) {
            $this->validator = $validator;
        } else {
            $this->validator = null;
        }

        $this->fileSystemLoader[$key] = $path;
        return $this;
    }

    function render($key, array $props = [], $default = null)
    {
        $loader = $this->fileSystemLoader[$key];
        $p = $props;

        try {
            if ($this->validator != null) {
                $this->validator->validateOrFail($p, $default);
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        ob_start();
        include($loader);
        $content = ob_get_contents();
        ob_end_clean();
        return $content;
    }
}
