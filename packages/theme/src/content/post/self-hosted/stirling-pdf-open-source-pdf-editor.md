---
title: "Stirling-PDF – (almost) perfect tool for editing those damn PDFs that won't let you edit them"
description: "Stirling-PDF is an open-source tool that does (almost) everything you might need with PDFs. It's pretty, responsive, and local. In short, it's very nice. And boom, another middle finger goes to Adobe (bleh)."
publishDate: "16 October 2025"
tags: ["pdf", "self-hosted", "open source"]
---

## Stirling-PDF is awesome

[Stirling-PDF](https://stirlingpdf.io/) is an open-source tool that does (almost) everything you might need with PDFs. It's pretty, responsive, and local. In short, it's very nice. And boom, another middle finger goes to Adobe (bleh).
### What Stirling-PDF can do

**Basic operations:**
- Merge and split PDFs
- Rotate pages
- Extract specific pages
- Reorder pages

**More advanced stuff:**
- Convert to/from various formats (Word, Excel, images)
- OCR - text recognition from scanned documents (supports Polish!)
- PDF compression
- Add/remove watermarks
- Digital document signing
- Encryption and password protection

**And a few extra treats:**
- Add page numbering
- Clean metadata
- Overlay PDFs on each other
- Auto-split by size/number of pages

All of this is packed into a decent, responsive UI that works on both desktop and mobile.
## Let me edit you, stupid PDF

:::warning[ ]
Unfortunately, the most useful feature for me, which is **editing existing PDF text, is currently unavailable**. And that, I won't lie, hurts a bit.
:::

I can't count how many times I had to quickly fix a typo or some invoice data. In those moments, I still have to reach for other tools or (what I do most often) export to Word, fix it, and generate a PDF from scratch.
## Self-hosted Stirling-PDF on your VPS

The moment you break free from the chains placed by a greedy, crappy shared hosting provider is undoubtedly a breakthrough moment in a person's life.

Suddenly, the entire virtual world stands open before you, and the only limit is your imagination. You feel adrenaline rushing through your veins, and in the distance, you hear the siren song of Linux commands. Time to put on gloves, take off your pants, and type the secret, elven runes `ssh`...

3 hours and 88 commands later, you close the terminal, go for a walk, and consider becoming a mobile massage therapist.

:)

This hilarious, almost comically genius insertion above has nothing to do with reality, and if you can just read and have seen a terminal at least once, you'll handle it no problem (especially now, when you basically don't even have to read because an LLM does everything for you).

And if you're using a decent VPS provider, it's even simpler because you already have a lot of things *out of the box*.

### About the VPS setup

For this guide, I'm using a VPS with Docker pre-installed. The beauty of self-hosting on a VPS is that you have full control over your environment - no restrictions, no sharing resources with hundreds of other users, and you can install whatever you want.

The key advantages of running your own VPS:
1. It works as it should
2. Cost-effective for multiple self-hosted apps
3. You learn actual server management skills
4. Complete control over your data and privacy

The downside? You need to be comfortable with the terminal and basic Linux commands. But honestly, if you can follow a tutorial, you're good to go.

:::note[ ]
**If it happens that you're Polish**, check out [mikrus.io - Polish VPS for enthusiasts](#) - it's an excellent, affordable option with an active community
:::
### Installing Stirling-PDF

The easiest way to self-host Stirling-PDF is using [Docker](https://www.docker.com/).
Make sure your VPS has Docker installed, and let's get started.

**Step by step:**

1. Log into your server via `ssh`
2. Create a directory `mkdir -p ~/stirling-pdf` and navigate to it `cd ~/stirling-pdf`
3. Create `docker-compose` file with `nano docker-compose.yml`
4. Paste the config:

```yml
version: '3.3'
services:
  stirling-pdf:
    image: docker.stirlingpdf.com/stirlingtools/stirling-pdf:latest
    container_name: stirling-pdf
    ports:
      - '8080:8080'
    volumes:
      - ./trainingData:/usr/share/tessdata
      - ./extraConfigs:/configs
      - ./customFiles:/customFiles/
      - ./logs:/logs/
      - ./pipeline:/pipeline/

    environment:
      - DOCKER_ENABLE_SECURITY=false
      - DISABLE_ADDITIONAL_FEATURES=false
      - LANGS=en_GB,pl_PL
    restart: unless-stopped
```

5. Save and exit `nano`: `Ctrl+X, Y, Enter`
6. Start the container: `docker compose up -d`
7. If everything went well, you should see something like `Started StirlingPdfApplication`

**Verification:**

Check if Stirling is running with:
```bash
curl http://localhost:8080/api/v1/info/status
```

If you see something like `{"status":"UP"}`, we're good.

:::important[ ]
Check your server's capabilities. In my case, with [n8n](https://n8n.io/) already running, I needed to bump to a higher tier because I was running out of RAM. Stirling can be quite resource-hungry, especially when doing OCR on larger documents.
:::
### Accessing Stirling

I needed Stirling to integrate with [n8n](https://n8n.io/), which is hosted on the same VPS. For my needs, passing the endpoint locally was enough: `http://localhost:8080/api/v1/convert/pdf/img`

**If you want to access the panel from your browser**, you need to:

1. **Open a port in your VPS firewall** (method depends on your provider)
2. **Change the port mapping in `docker-compose.yml`**:

```yml
ports:
  - '40116:8080'  # or any other external port you choose
```

The pattern is simple: `EXTERNAL_PORT:CONTAINER_PORT`

Where:
- **40116** (or another) - the port you'll use to connect from the internet
- **8080** - the internal port where Stirling listens inside the container

3. **Restart the container**:
```bash
docker compose down
docker compose up -d
```

Now you can access Stirling via: `http://your-server-ip:40116`

:::tip[ ]
If you're using Stirling only locally (to integrate with other apps on the same server), you don't need to open any external ports. Docker containers can see each other by name, so you can use `http://stirling-pdf:8080` instead of localhost.
:::

## Summary

Stirling-PDF is a solid PDF tool that you can have on your own server, completely under your control. You spin it up, use it, it works.

Is it perfect? No - the lack of direct text editing hurts. But for everything else, it's really good. And when you add the fact that you can host it on a cheap VPS, it makes for a pretty nice setup.

Give it a try and see you next time!

---

**Useful links:**
- [Stirling-PDF on GitHub](https://github.com/Stirling-Tools/Stirling-PDF)
- [Stirling-PDF Documentation](https://stirlingpdf.io/)
- [Docker Documentation](https://docs.docker.com/)
