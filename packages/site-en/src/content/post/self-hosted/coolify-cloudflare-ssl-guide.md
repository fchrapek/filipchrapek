---
title: "How to Connect Coolify with CloudFlare and Get Free SSL"
description: "Step-by-step guide to connecting your Coolify VPS with a custom domain using CloudFlare as a proxy with free SSL certificate."
publishDate: "17 October 2025"
tags: ["coolify", "cloudflare", "ssl", "self-hosted"]
---

Have you installed Coolify on your VPS and want to connect your custom domain with SSL? This guide will show you step-by-step how to do it using CloudFlare as a proxy with a free SSL certificate.

:::note[Polish readers]
If you're using Mikrus hosting, check out the Polish version of this guide where I cover Mikrus-specific configuration including IPv6 setup and port limitations.
:::

## What You'll Need

- A VPS server with [Coolify](https://coolify.io/) installed
- A custom domain (from any registrar: Namecheap, GoDaddy, CloudFlare, etc.)
- A [CloudFlare](https://www.cloudflare.com/) account (free)
- SSH access to your server

## Why CloudFlare?

CloudFlare acts as a reverse proxy between your users and your server, providing:

- **Free SSL certificates** (automatic, no configuration needed)
- **DDoS protection** 
- **CDN caching** for faster load times
- **Global network** with 300+ data centers
- **Analytics and monitoring**

All of this is available on their free plan!

## Step 1: Check Your Server's IP Address

SSH into your server and get your public IP address:

```bash
# Get your IPv4 address
curl -4 ifconfig.me

# Or check IPv6 if available
curl -6 ifconfig.me
```

Save this IP address - you'll need it for DNS configuration.

## Step 2: Add Your Domain to CloudFlare

1. Log in to [CloudFlare Dashboard](https://dash.cloudflare.com/)
2. Click **"Add a Site"**
3. Enter your domain name and click **"Add site"**
4. Select the **Free** plan and click **"Continue"**
5. CloudFlare will scan your existing DNS records

## Step 3: Update Nameservers at Your Domain Registrar

CloudFlare will show you two nameservers, for example:
```
anna.ns.cloudflare.com
brad.ns.cloudflare.com
```

Go to your domain registrar's control panel (Namecheap, GoDaddy, etc.) and change your nameservers to these CloudFlare nameservers.

:::warning[DNS propagation time]
DNS propagation can take anywhere from a few minutes to 24 hours.
:::

## Step 4: Configure DNS Records in CloudFlare

Go to **DNS → Records** in CloudFlare and add A records for your domain:

### For the root domain:
| Field | Value |
|-------|-------|
| **Type** | A |
| **Name** | @ |
| **IPv4 address** | [Your server IP from Step 1] |
| **Proxy status** | Proxied (orange cloud) |
| **TTL** | Auto |

### For www subdomain:
| Field | Value |
|-------|-------|
| **Type** | A |
| **Name** | www |
| **IPv4 address** | [Same server IP] |
| **Proxy status** | Proxied |
| **TTL** | Auto |

:::important[Proxy status]
Make sure the Proxy status is **Proxied** (orange cloud icon). This enables CloudFlare's features including SSL.
:::

### For email (if you use a separate email server):

Keep your existing **MX** records unchanged and ensure they have **Proxy status: DNS only** (gray cloud).

## Step 5: Configure SSL/TLS in CloudFlare

1. In CloudFlare menu, go to **SSL/TLS → Overview**
2. Select **Flexible** mode
3. Go to **SSL/TLS → Edge Certificates**
4. Enable:
   - **Always Use HTTPS**
   - **Automatic HTTPS Rewrites**

### Understanding SSL Modes

**Flexible** (Recommended for getting started):
- **User ↔ CloudFlare:** HTTPS (encrypted)
- **CloudFlare ↔ Your server:** HTTP (unencrypted)

This is sufficient for most use cases (blogs, portfolios, informational sites).

| SSL Mode | When to Use | Security Level |
|----------|-------------|----------------|
| **Flexible** | Blogs, portfolios, informational sites | Basic |
| **Full** | Apps with sensitive data | High (end-to-end) |
| **Full (Strict)** | E-commerce, banking, medical data | Maximum |

:::tip[Sensitive data]
For applications processing sensitive data (logins, payments), consider upgrading to **Full** mode with a CloudFlare Origin Certificate.
:::

## Step 6: Verify Coolify is Listening

On your server, check that Coolify/Traefik is listening on the correct ports:

```bash
netstat -plnt | grep :80
```

You should see output showing that Docker is listening on port 80:
```
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      xxxxx/docker-proxy
tcp6       0      0 :::80                   :::*                    LISTEN      xxxxx/docker-proxy
```

## Step 7: Configure Domain in Coolify

1. Log in to your Coolify panel (e.g., `http://your-server-ip:8000`)
2. Go to your application
3. Click **Configuration → Domains**
4. In the **Domains** field, enter:
   ```
   http://yourdomain.com,http://www.yourdomain.com
   ```
   
:::warning[Use HTTP not HTTPS]
Use `http://` (not `https://`) because CloudFlare connects to your server via HTTP in Flexible mode!
:::

5. In the **Direction** field, choose:
   - **"Redirect to non-www"** - if you want to redirect www to the main domain
   - **"Allow www & non-www"** - if you want to serve both versions

6. Click **Set Direction**
7. Click **Save**
8. At the top of the page, click **Redeploy**

### Why http:// in Coolify?

This might seem counterintuitive, but it's the **correct configuration**:

```
User → [HTTPS] → CloudFlare → [HTTP] → Your Server → Coolify
```

- Users **always** see HTTPS (thanks to CloudFlare)
- CloudFlare connects to your server via HTTP (Flexible mode)
- Coolify must accept HTTP connections, hence `http://` in the configuration

:::important[Avoid redirect loops]
If you enter `https://` in Coolify, you'll get a "Too Many Redirects" error.
:::

## Step 8: Testing

Wait 2-5 minutes for the configuration to propagate, then test:

- `https://yourdomain.com` - should work
- `https://www.yourdomain.com` - should work or redirect
- `http://yourdomain.com` - should redirect to HTTPS

You can also test from the command line:
```bash
curl -I https://yourdomain.com
```

## Troubleshooting

### Error 404

Check Traefik logs:
```bash
docker logs coolify-proxy --tail 50 | grep yourdomain
```

If you see errors related to `PathPrefix` or empty `Host()`, make sure:
- You entered the domain with `http://` (not `https://`) in Coolify
- You clicked **Redeploy** after saving changes
- You selected an option in Direction and clicked **Set Direction**

### Too Many Redirects Loop

This indicates an SSL conflict. Check:
- CloudFlare SSL/TLS is set to **Flexible** (not Full)
- In Coolify you're using `http://` in domains (not `https://`)

### Site Not Loading

- Wait for DNS propagation (up to 24 hours)
- Verify AAAA/A records are **Proxied** (orange cloud in CloudFlare)
- Clear browser cache or test in incognito mode
- Check if nameservers were changed: `dig NS yourdomain.com` 

### CloudFlare Shows 502 Bad Gateway

- Check if Coolify is running: `docker ps | grep coolify` 
- Check logs: `docker logs coolify-proxy --tail 100` 
- Ensure your application is running in Coolify

### Connection Timeout

- Verify your firewall allows ports 80 and 443
- Check if your hosting provider blocks these ports
- Ensure CloudFlare proxy is enabled (orange cloud)

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [CloudFlare Docs - SSL/TLS Modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [CloudFlare Academy - Getting Started](https://www.cloudflare.com/learning/)

## Summary

Congratulations! Your Coolify application is now accessible via your custom domain with a free SSL certificate from CloudFlare.

This configuration provides:
- Free SSL certificate
- Automatic HTTP → HTTPS redirect
- DDoS protection
- Global CDN
- Easy maintenance

### Next Steps

**For Enhanced Security (apps with sensitive data):**
1. Generate a CloudFlare Origin Certificate (SSL/TLS → Origin Server)
2. Install the certificate in Coolify
3. Change CloudFlare SSL to **Full**
4. Update Coolify domains to use `https://` 

**For Better Performance:**
- Configure cache rules in CloudFlare
- Enable Brotli compression
- Set up CloudFlare Workers for dynamic content
- Configure Page Rules for specific routes

**For Production:**
- Set up monitoring and alerts in CloudFlare
- Configure rate limiting to prevent abuse
- Enable Web Application Firewall (WAF) rules
- Set up automatic backups in Coolify

---

*Questions? Check out the [Coolify Discord community](https://discord.gg/coolify) or [CloudFlare Community](https://community.cloudflare.com/).*
