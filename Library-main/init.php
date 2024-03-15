<?php 
include_once(basePath('helpers/zod/zod.php'));
include_once(basePath('function.php')); 
include_once(basePath('helpers/twig.php'));
include_once(basePath('includes/components/index.php'));

define('CC_CURRENT_DIRECTORY_PATH', __DIR__);

/**
 * Get the base path of the project.
 *
 * @param string $path The optional path to append to the base path.
 * @return string The base path with the appended path.
 */
function basePath(string $path = ''): string
{
    $basePath = __DIR__;
    
    // Normalize the path separator
    $path = str_replace('\\', '/', $path);
    
    // Remove leading/trailing slashes
    $path = trim($path, '/');
    
    // Add a leading slash if necessary
    
    if (!empty($path)) {
        $basePath .= '/';
    }
    
    // Append the path
    $basePath .= $path;
    
    return $basePath;
}


/**
 * Get the local path of the project.
 *
 * @param string $path The optional path to append to the local path.
 * @return string The local path with the appended path.
 */
function localPath(string $path = ''): string
{
    // return path to the current directory + the path
    return './' . $path;
} 

function logData($data, $options = []) {
    $logToFile = $options['logToFile'] ?? false;
    $key = $options['key'] ?? null;

    // Convert the data to a readable format
    $formattedData = print_r($data, true);

    // Create a separator for clearer reading in logs
    $separator = str_repeat('-', 50) . "\n";

    // Prepare the log message
    $logMessage = $separator . date('Y-m-d H:i:s') . "\n" . $formattedData . "\n" . $separator;

    // If a key is specified, prepend it to the log message
    if ($key) {
        $logMessage = "[$key] " . $logMessage;
    }

    if ($logToFile) {
        // If specified, write the log to a file
        file_put_contents('debug_log.txt', $logMessage, FILE_APPEND);
    } else {
        // Else, output the log to the browser (use <pre> tags for formatting)
        echo '<p class="text-red-400"><pre>' . htmlspecialchars($logMessage, ENT_QUOTES) . '</pre></p>';
    }
}

// @param string $targetFilePath The path to the file to include
// @return string The relative path to the file
function getRelativeIncludePath($targetFilePath) {
    // Get the absolute path of the current directory
    $currentDirPath = CC_CURRENT_DIRECTORY_PATH;

    // Normalize directory separators to handle different environments
    $currentDirPath = str_replace('\\', '/', $currentDirPath);
    $targetFilePath = str_replace('\\', '/', $targetFilePath);

    // Convert paths to arrays for comparison
    $currentPathParts = explode('/', $currentDirPath);
    $targetPathParts = explode('/', $targetFilePath);

    // Remove common path parts
    while (count($currentPathParts) > 0 && count($targetPathParts) > 0 && $currentPathParts[0] == $targetPathParts[0]) {
        array_shift($currentPathParts);
        array_shift($targetPathParts);
    }

    // Construct the relative path
    $relativePath = str_repeat('../', count($currentPathParts)) . implode('/', $targetPathParts);

    return $relativePath;
}


function cc_uniqid() {
    return uniqid('cc-');
}