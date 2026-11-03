#!/bin/sh

set -e

echo "Preparing Laravel application..."

# Ensure required Laravel directories exist
mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

# Set correct permissions
chown -R www-data:www-data storage bootstrap/cache

# Ensure public storage link exists
php artisan storage:link --force

# Cache configuration using Render environment variables
php artisan config:cache

echo "Starting application processes..."

# Start Supervisor
exec /usr/bin/supervisord -n \
    -c /etc/supervisor/conf.d/supervisord.conf
