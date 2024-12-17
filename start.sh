#!/bin/sh

# Replace the environment variable in the nginx configuration
envsubst '$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx in the foreground
nginx -g 'daemon off;'