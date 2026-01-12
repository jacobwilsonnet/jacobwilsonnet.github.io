# jacobwilson.net

Personal portfolio website for Jacob Wilson - Senior Site Reliability Engineer

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Analytics**: Google Analytics 4 + Datadog RUM
- **Deployment**: GitHub Pages
- **Performance**: Optimized images, minified CSS

## 📊 Monitoring & Analytics

### Google Analytics
- Tracks visitor metrics, traffic sources, conversions
- Custom event tracking for user interactions
- Setup guide: `ANALYTICS_SETUP.md`

### Datadog RUM
- Real User Monitoring with session replay
- Performance metrics (Core Web Vitals)
- JavaScript error tracking
- Resource monitoring

### Tracked Events
- Resume downloads
- Contact clicks (email, social media)
- Timeline section expansions
- Command palette usage (⌘K / Ctrl+K)
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page milestones
- Skills filter interactions

## 🎯 Features

- **Command Palette** - Press `⌘K` or `Ctrl+K` for quick navigation
- **Skills Filter** - Interactive filtering of tech stack by category
- **Responsive Images** - Optimized for all device sizes
- **Accessibility** - ARIA labels and keyboard navigation
- **SEO Optimized** - Canonical URLs, sitemap, structured data

## 📁 File Structure

```
├── index.html              # Main page
├── 404.html               # Custom 404 page
├── Jacob_Wilson_Resume_2026.html  # Resume page
├── styles.css             # Source styles
├── styles.min.css         # Minified production styles
├── script.js              # All JavaScript functionality
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Crawler instructions
├── ANALYTICS_SETUP.md     # GA setup guide
└── assets/
    ├── jacob-wilson.jpg         # Optimized hero image (164KB)
    ├── jacob-wilson-medium.jpg  # Tablet size (92KB)
    └── jacob-wilson-small.jpg   # Mobile size (25KB)
```

## 🛠️ Local Development

1. Clone the repository:
```bash
git clone https://github.com/jacobwilsonnet/jacobwilsonnet.github.io.git
cd jacobwilsonnet.github.io
```

2. Open in browser:
```bash
open index.html
# or use a local server:
python -m http.server 8000
```

3. Visit: `http://localhost:8000`

## 🚢 Deployment

Automatically deployed via GitHub Pages when pushing to `master` branch.

```bash
git add .
git commit -m "Update site"
git push origin master
```

Site updates live at `https://jacobwilson.net` within minutes.

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Image Optimization**: 84% reduction (1MB → 164KB)
- **CSS Minification**: 19% reduction (26KB → 21KB)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s

## 🔑 Key Configuration

### Google Analytics
- Property ID: `G-8269KF2S8G`
- Tracking: Full IP addresses (not anonymized)

### Datadog RUM
- Application ID: `05759d7a-5419-46fb-88a7-e9f15a1433c0`
- Service: `jacobwilson.net`
- Environment: `prod`
- Session Replay: 100% sampling

## 🤝 Credits

Built with care in Chicago by Jacob Wilson and Claude Code.

## 📄 License

All rights reserved © 2026 Jacob Wilson
