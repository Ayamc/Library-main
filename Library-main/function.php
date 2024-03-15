<?php

// $allowed_langs = ['en'];
define('ALLOWED_LANGS', ['en']);
define('DEFAULT_LANG', 'en');


/**
 * Get the base path of the project.
 *
 * @return string The base path with the appended path.
 */
function getLang(): string {
    $lang = $_GET['lang'] ?? DEFAULT_LANG;
    return in_array($lang, ALLOWED_LANGS) ? $lang : DEFAULT_LANG;
}


$cc_translations = include_once(basePath('locale/' . getLang() . '.php'));

/**
 * Get the base path of the project.
 *
 * @param string $key The optional path to append to the base path.
 * @param array $options The optional path to append to the base path.
 * @return string The base path with the appended path.
 */
function _t(string $key,array $options = []): string
{
    global $cc_translations;
    foreach (explode('.', $key) as $k) {
        $value = $value[$k] ?? $cc_translations[$k] ?? $key;
    }
    if (is_array($value) && count($value) == 1) {
        return array_keys($value)[0];
    }
    if ($options) {
        foreach ($options as $k => $v) {
            $value = str_replace("{{" . $k . "}}", $v, $value);
        }
    }
    return $value;
}

/**
 * @param string $key
 * @param string|null $default
 * @return string|null
 */
function getQuery(string $key, string | null $default = null): string | null
{
    return $_GET[$key] ?? $default;
}

/**
 * @param string $key
 * @return string|null
 */
function cleanHtmlOutput($input)
{
    $html = preg_replace('/\s+/', ' ', $input); // Replace multiple spaces with a single space
    $html = preg_replace('/\s+>/', '>', $html); // Remove spaces before closing tags
    $html = preg_replace('/>\s+/', '>', $html); // Remove spaces after opening tags
    $html = preg_replace('/\s+</', '<', $html); // Remove spaces before closing tags
    $html = preg_replace('/>\s+</', '><', $html); // Remove spaces between tags
    $html = preg_replace('/>\s+/', '>', $html); // Remove spaces after opening tags

    // Remove spaces within attribute values
    $html = preg_replace_callback('/(\w+=")[^"]+"/', function ($matches) {
        // Replace multiple spaces within attribute values
        return preg_replace('/\s+/', ' ', $matches[0]);
    }, $html);

    return htmlspecialchars_decode($html, ENT_QUOTES);
}