
# --------------------------------------------------
# 1. Base image: PHP 8.4 with Apache
# --------------------------------------------------
FROM php:8.4-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
ENV PORT=10000

WORKDIR /var/www/html

# --------------------------------------------------
# 2. Install system packages and PHP extensions
# --------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    unzip \
    supervisor \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libonig-dev \
    libatomic1 \
    ca-certificates \
    gnupg \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
    && rm -rf /var/lib/apt/lists/*

# --------------------------------------------------
# 3. Install Node.js 22
# --------------------------------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# --------------------------------------------------
# 4. Install Composer
# --------------------------------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# --------------------------------------------------

# --------------------------------------------------
# 5. Configure Apache
# --------------------------------------------------
RUN a2enmod rewrite headers \
    && sed -ri 's!/var/www/html!/var/www/html/public!g' \
        /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's/AllowOverride None/AllowOverride All/' \
        /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's/<VirtualHost \*:80>/<VirtualHost *:10000>/' \
        /etc/apache2/sites-available/000-default.conf \
    && printf 'Listen 10000\n' > /etc/apache2/ports.conf


# --------------------------------------------------
# 6. Install Laravel dependencies
# --------------------------------------------------
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --no-scripts

# --------------------------------------------------
# 7. Install React dependencies
# --------------------------------------------------
COPY package.json package-lock.json ./

RUN npm ci

# --------------------------------------------------
# 8. Copy the complete Laravel application
# --------------------------------------------------
COPY . .

# --------------------------------------------------
# 9. Generate optimized Laravel autoload files
# --------------------------------------------------
RUN APP_ENV=production \
    APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= \
    composer dump-autoload --no-dev --optimize --no-scripts

# --------------------------------------------------
# 10. Discover Laravel packages
# --------------------------------------------------
RUN APP_ENV=production \
    APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= \
    php artisan package:discover --ansi

# --------------------------------------------------
# 11. Build React frontend using Vite Plus
# --------------------------------------------------
RUN APP_ENV=production \
    APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= \
    npm run build

# --------------------------------------------------
# 12. Prepare Laravel storage
# --------------------------------------------------
RUN mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && php artisan storage:link \
    && chown -R www-data:www-data storage bootstrap/cache

# --------------------------------------------------
# 13. Remove frontend development dependencies
# --------------------------------------------------
RUN rm -rf node_modules /root/.npm

# --------------------------------------------------

# --------------------------------------------------
# 14. Configure container startup
# --------------------------------------------------
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint

# Convert Windows line endings to Linux line endings
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint \
    && chmod +x /usr/local/bin/docker-entrypoint

EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]

