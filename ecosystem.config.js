module.exports = {
    apps: [{
        name: 'szymonbaranowski',
        script: 'npm',
        args: 'start',
        cwd: '/var/www/szymonbaranowski',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'production',
            PORT: 3001  // Use 3001 if you have another app on 3000
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm Z'
    }]
}
