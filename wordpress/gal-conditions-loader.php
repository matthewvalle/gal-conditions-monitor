<?php
/**
 * Plugin Name: GAL Conditions Monitor Loader
 * Description: Loads the Northeast Backcountry Conditions Monitor React app on the /conditions/ page
 * Author: Granite Alpine Lab
 * Version: 1.0.0
 */

// Only load on the conditions page
add_action('wp_enqueue_scripts', function() {
    if (!is_page('conditions')) return;

    $base_url = 'https://gal-conditions-monitor.vercel.app';
    $ver = '1.0.0';

    // MapLibre GL CSS
    wp_enqueue_style(
        'maplibre-gl',
        'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css',
        [],
        '4.7.1'
    );

    // Conditions Monitor CSS
    wp_enqueue_style(
        'gal-conditions',
        $base_url . '/conditions.css',
        ['maplibre-gl'],
        $ver
    );

    // Conditions Monitor JS
    wp_enqueue_script(
        'gal-conditions',
        $base_url . '/conditions.js',
        [],
        $ver,
        true // load in footer
    );

    // Pass the API URL to the frontend
    wp_add_inline_script(
        'gal-conditions',
        'window.__GAL_API_URL__ = "' . $base_url . '";',
        'before'
    );
});

// Remove sidebar on conditions page for full-width layout
add_filter('generate_sidebar_layout', function($layout) {
    if (is_page('conditions')) {
        return 'no-sidebar';
    }
    return $layout;
});
