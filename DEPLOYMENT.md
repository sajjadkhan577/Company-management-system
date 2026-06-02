# Deployment Guide

Instructions for deploying Nexus Enterprise to production.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and merged to main
- [ ] Environment variables configured
- [ ] Database backups taken
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] HTTPS certificates prepared
- [ ] Monitoring tools configured

## Environment Configuration

### Production .env

```env
NODE_ENV=production
SERVER_PORT=5000

# Database
DB_HOST=db.example.com
DB_NAME=nexus_enterprise_prod
DB_USER=dbuser
DB_PASSWORD=secure_password_here

# JWT
JWT_SECRET=very_long_secure_random_string_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://nexusenterprise.com

# API Base URL (for frontend)
API_BASE_URL=https://api.nexusenterprise.com

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@nexusenterprise.com
EMAIL_PASSWORD=email_app_password
```

## Deployment Options

### Option 1: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create nexus-enterprise`
4. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   ```
5. Deploy: `git push heroku main`

### Option 2: AWS (EC2)

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Node.js, npm, MongoDB
4. Clone repository
5. Configure environment variables
6. Install dependencies: `npm run install-all`
7. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "nexus-backend"
   pm2 start "npm run client" --name "nexus-frontend"
   ```

### Option 3: DigitalOcean App Platform

1. Push code to GitHub
2. Connect repository to DigitalOcean
3. Configure build and deployment settings
4. Set environment variables
5. Deploy

### Option 4: Docker

See `Dockerfile` and `docker-compose.yml` for containerized deployment.

## SSL/HTTPS Setup

### Let's Encrypt (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d nexusenterprise.com
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name nexusenterprise.com;

    ssl_certificate /etc/letsencrypt/live/nexusenterprise.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/nexusenterprise.com/privkey.pem;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## Database Migration to Production

1. Backup current database:
   ```bash
   mysqldump -u root -p nexus_enterprise > backup.sql
   ```

2. Export data from MySQL:
   ```bash
   npm run seed
   ```

3. Migrate to MongoDB (if applicable):
   ```bash
   cd server
   npm run migrate-mongo
   ```

## Monitoring & Logging

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
pm2 save
```

### Log Rotation

Install pm2-logrotate:
```bash
pm2 install pm2-logrotate
```

### Error Tracking

Set up Sentry or similar:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: "your_sentry_dsn" });
```

## Performance Optimization

### Frontend Build

```bash
cd client
npm run build
# Output in client/dist/
```

Serve with CDN for static assets.

### Backend Optimization

- Enable gzip compression
- Implement caching
- Database query optimization
- Connection pooling
- Load balancing (for multiple instances)

## Backup Strategy

### Daily Backups

```bash
# MySQL backup
mysqldump -u root -p nexus_enterprise > /backups/backup_$(date +%Y%m%d).sql

# MongoDB backup
mongodump --uri="mongodb://localhost:27017/nexus_enterprise"
```

### Automated Backup

Set up cron job:
```bash
0 2 * * * /backup.sh
```

## Scaling

### Horizontal Scaling

1. Multiple backend instances behind load balancer
2. Database replication
3. Redis for session management

### Vertical Scaling

- Increase server resources
- Optimize database indices
- Implement caching layer

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port
sudo lsof -ti:5000 | xargs kill -9
```

### Database Connection Issues

- Verify credentials
- Check firewall rules
- Ensure database is running
- Check connection limits

### Memory Leaks

```bash
# Monitor memory usage
top
# Or with PM2
pm2 monit
```

## Rollback Plan

1. Keep previous version running
2. Use blue-green deployment
3. Database migrations with backups
4. Quick rollback script

## Post-Deployment

1. Run smoke tests
2. Monitor error rates
3. Check performance metrics
4. Notify team/users
5. Document deployment

## Maintenance

### Regular Tasks

- Weekly: Check logs and errors
- Weekly: Monitor resource usage
- Monthly: Security updates
- Monthly: Database maintenance
- Quarterly: Performance review

### Update Procedure

1. Test updates on staging
2. Create backup
3. Update dependencies carefully
4. Restart services
5. Verify functionality

## Support & Monitoring

- Set up uptime monitoring
- Configure error alerts
- Monitor API response times
- Track user transactions
- Performance dashboards

---

For questions, see DEVELOPMENT.md or contact the deployment team.
