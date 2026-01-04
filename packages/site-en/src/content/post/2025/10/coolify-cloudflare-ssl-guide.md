---
title: "How to set up a custom domain with SSL for Coolify using Cloudflare"
description: "Learn how to configure a custom domain for your Coolify applications using Cloudflare as a reverse proxy."
publishDate: "10 October 2025"
tags: ["coolify", "cloudflare", "ssl", "self-hosted"]
---

Hey you! Do you want to be cool?

Sure you do! Let's set up a custom domain with your Coolify setup—I'll show ya!

![Cool dude](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXA3bTV1NjM2MW5ja2xscTgydWZtbzBwZ3d5NDc0ZXJjZWE0YTFyaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KXY5lB8yOarLy/giphy.gif)

:::note[Polish readers]
If you're using Mikrus hosting, check out the Polish version of this guide where I cover Mikrus-specific configuration including IPv6 setup and port limitations.
:::

## What You'll Need

- A VPS server with [Coolify](https://coolify.io/) installed ([installation guide](https://coolify.io/docs/installation))
- A custom domain (from any registrar: Namecheap, GoDaddy, Cloudflare, etc.)
- A [Cloudflare](https://www.cloudflare.com/) account (free)
- SSH access to your server

:::tip[Installing Coolify]
If you haven't installed Coolify yet, it's a one-liner: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash`. Requires 2GB RAM and 30GB disk space. Takes about 5-10 minutes.
:::

## Why Cloudflare?

Cloudflare acts as a reverse proxy between your users and your server, providing:

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

## Step 2: Add Your Domain to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **"Add a Site"**
3. Enter your domain name and click **"Add site"**
4. Select the **Free** plan and click **"Continue"**
5. Cloudflare will scan your existing DNS records

## Step 3: Update Nameservers at Your Domain Registrar

Cloudflare will show you two nameservers, for example:
```
anna.ns.cloudflare.com
brad.ns.cloudflare.com
```

Go to your domain registrar's control panel (Namecheap, GoDaddy, etc.) and change your nameservers to these Cloudflare nameservers.

:::warning[DNS propagation time]
DNS propagation can take anywhere from a few minutes to 24 hours.
:::

## Step 4: Configure DNS Records in Cloudflare

Go to **DNS → Records** in Cloudflare and add records for your domain.

### Understanding A vs AAAA Records

- **A record** - Points domain to IPv4 address (e.g., `95.217.144.47`)
- **AAAA record** - Points domain to IPv6 address (e.g., `2001:db8::1`)

**Which should you use?**
- If your VPS has only IPv4: Use **A records** only
- If your VPS has both IPv4 and IPv6: Add both **A** and **AAAA** records
- If your VPS has only IPv6 (rare): Use **AAAA records** only

Most VPS providers give you IPv4 by default. Check with `curl -4 ifconfig.me` (IPv4) and `curl -6 ifconfig.me` (IPv6).

### For the root domain (IPv4):
| Field | Value |
|-------|-------|
| **Type** | A |
| **Name** | @ |
| **IPv4 address** | [Your server IP from Step 1] |
| **Proxy status** | Proxied (orange cloud) |
| **TTL** | Auto |

### For www subdomain (IPv4):
| Field | Value |
|-------|-------|
| **Type** | A |
| **Name** | www |
| **IPv4 address** | [Same server IP] |
| **Proxy status** | Proxied |
| **TTL** | Auto |

### If you have IPv6 (optional):
Repeat the above but use **Type: AAAA** and enter your IPv6 address instead.

:::important[Proxy status]
Make sure the Proxy status is **Proxied** (orange cloud icon). This enables Cloudflare's features including SSL.
:::

### For email (if you use a separate email server):

Keep your existing **MX** records unchanged and ensure they have **Proxy status: DNS only** (gray cloud).

## Step 5: Configure SSL/TLS in Cloudflare

1. In Cloudflare menu, go to **SSL/TLS → Overview**
2. Select **Flexible** mode
3. Go to **SSL/TLS → Edge Certificates**
4. Enable:
   - **Always Use HTTPS**
   - **Automatic HTTPS Rewrites**

### Understanding SSL Modes

**Flexible** (Recommended for getting started):
- **User ↔ Cloudflare:** HTTPS (encrypted)
- **Cloudflare ↔ Your server:** HTTP (unencrypted)

This is sufficient for most use cases (blogs, portfolios, informational sites).

| SSL Mode | When to Use | Security Level |
|----------|-------------|----------------|
| **Flexible** | Blogs, portfolios, informational sites | Basic |
| **Full** | Apps with sensitive data | High (Cloudflare to server encrypted) |
| **Full (Strict)** | E-commerce, banking, medical data | Maximum (requires valid certificate) |

:::tip[Sensitive data]
For applications processing sensitive data (logins, payments), consider upgrading to **Full** mode with a Cloudflare Origin Certificate.
:::

## Step 6: Verify Coolify is Listening

Before configuring your domain, ensure Coolify's Traefik proxy is running and listening on port 80:

```bash
netstat -plnt | grep :80
```

You should see output showing that Docker is listening on port 80:
```
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      xxxxx/docker-proxy
tcp6       0      0 :::80                   :::*                    LISTEN      xxxxx/docker-proxy
```

### VPS Providers with Port Restrictions

Some VPS providers (like Mikrus, some shared hosting) **block or restrict ports 80/443**. If your provider blocks these ports:

1. **Check your provider's documentation** for available ports
2. **Use a reverse proxy** (nginx/Caddy) to forward from an allowed port to Coolify
3. **Or use Cloudflare Tunnel** (formerly Argo Tunnel) which doesn't require open ports

For detailed setup with port restrictions, check the Polish version of this guide or your provider's documentation.

:::warning[Port 80/443 blocked?]
If `netstat` shows nothing on port 80, or you can't access your server on these ports, contact your VPS provider or check their firewall rules.
:::

## Step 7: Configure Domain in Coolify

1. Log in to your Coolify panel (e.g., `http://your-server-ip:8000`)
2. Go to your application
3. Click **Configuration → Domains**
4. In the **Domains** field, enter:
   ```
   http://yourdomain.com,http://www.yourdomain.com
   ```
   
:::warning[Use HTTP not HTTPS]
Use `http://` (not `https://`) because Cloudflare connects to your server via HTTP in Flexible mode!
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
User → [HTTPS] → Cloudflare → [HTTP] → Your Server → Coolify
```

- Users **always** see HTTPS (thanks to Cloudflare)
- Cloudflare connects to your server via HTTP (Flexible mode)
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

![Successful Borat](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDduZXoxaGFmc2Q2eGtxdWZyOGlzNDF6NnpicXc3a2RiemdxYnBqdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l2YWpMxS3En6fDxfy/giphy.gif)

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
- Cloudflare SSL/TLS is set to **Flexible** (not Full)
- In Coolify you're using `http://` in domains (not `https://`)

### Site Not Loading

- Wait for DNS propagation (up to 24 hours)
- Verify A records (and AAAA if using IPv6) are **Proxied** (orange cloud in Cloudflare)
- Clear browser cache or test in incognito mode
- Check if nameservers were changed: `dig NS yourdomain.com` 

### Cloudflare Shows 502 Bad Gateway

- Check if Coolify is running: `docker ps | grep coolify` 
- Check logs: `docker logs coolify-proxy --tail 100` 
- Ensure your application is running in Coolify

### Connection Timeout

- Verify your firewall allows port 80 (required for Cloudflare Flexible mode)
- Check if your hosting provider blocks port 80 - some providers restrict standard HTTP/HTTPS ports
- Ensure Cloudflare proxy is enabled (orange cloud)
- If your provider blocks port 80, see "VPS Providers with Port Restrictions" in Step 6

## Additional Resources

- [Coolify Documentation](https://coolify.io/docs)
- [Cloudflare Docs - SSL/TLS Modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [Cloudflare Academy - Getting Started](https://www.cloudflare.com/learning/)

## Summary

Congratulations! Your Coolify application is now accessible via your custom domain with a free SSL certificate from Cloudflare.

This configuration provides:
- Free SSL certificate
- Automatic HTTP → HTTPS redirect
- DDoS protection
- Global CDN
- Easy maintenance