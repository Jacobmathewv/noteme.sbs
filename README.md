# NoteMe - Technical Blog

A modern, animated blogging platform for AWS, Linux, and DevOps content. Built with vanilla HTML, CSS, and JavaScript with markdown support for blog posts.

## 🌟 Features

- **Modern Animated Design**: Smooth animations and transitions inspired by contemporary web design
- **Markdown Blog Posts**: Write posts in markdown with frontmatter metadata
- **Category Filtering**: Filter posts by AWS, Linux, or DevOps categories
- **Syntax Highlighting**: Beautiful code blocks with highlight.js
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Fast Loading**: No heavy frameworks, pure vanilla JavaScript
- **SEO Friendly**: Proper meta tags and semantic HTML

## 📁 File Structure

```
.
├── index.html              # Homepage
├── blog.html              # Blog listing page
├── post.html              # Individual blog post page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── main.js           # Main JavaScript
│   ├── blog-loader.js    # Blog post loader
│   └── post-loader.js    # Individual post loader
└── posts/
    ├── posts.json        # Blog metadata
    ├── getting-started-aws-ec2.md
    ├── linux-mail-server-setup.md
    └── ... (your blog posts)
```

## 🚀 Quick Start

### Local Development

1. Clone this repository:
```bash
git clone https://github.com/yourusername/noteme-blog.git
cd noteme-blog
```

2. Start a local server:
```bash
# Using Python 3
python3 -m http.server 8000

# Using PHP
php -S localhost:8000

# Using Node.js (install http-server first)
npx http-server
```

3. Open your browser to `http://localhost:8000`

### Adding a New Blog Post

1. Create a new markdown file in the `posts/` directory:

```markdown
---
title: Your Post Title
excerpt: A brief description of your post
category: aws
date: 2025-01-12
readTime: 5 min read
tags: [AWS, Linux, Tutorial]
---

# Your Post Title

Your content here...
```

2. Add the post metadata to `posts/posts.json`:

```json
{
  "id": "your-post-slug",
  "title": "Your Post Title",
  "excerpt": "A brief description",
  "category": "aws",
  "date": "2025-01-12",
  "readTime": "5 min read",
  "tags": ["AWS", "Linux", "Tutorial"],
  "icon": "☁️"
}
```

3. The filename should match the `id` in posts.json (e.g., `your-post-slug.md`)

## 📝 Markdown Frontmatter

Each blog post should start with YAML frontmatter:

```yaml
---
title: Post Title (Required)
excerpt: Post description (Required)
category: aws|linux|devops (Required)
date: YYYY-MM-DD (Required)
readTime: X min read (Optional)
tags: [Tag1, Tag2, Tag3] (Optional)
---
```

## 🎨 Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #06b6d4;
    /* ... more colors */
}
```

### About Section

Edit the about section in `index.html`:

```html
<section id="about" class="about-section">
    <!-- Update your bio here -->
</section>
```

### Contact Links

Update contact information in `index.html`:

```html
<a href="mailto:your@email.com" class="contact-link">
<a href="https://github.com/yourusername" class="contact-link">
```

## 🌐 Deployment to GitHub Pages

### Automatic Deployment

This repository includes a GitHub Actions workflow for automatic deployment.

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source

3. The site will automatically deploy on every push to `main`

### Manual Deployment

If you prefer manual deployment:

1. Go to repository Settings → Pages
2. Select "Deploy from a branch"
3. Choose `main` branch and `/ (root)` folder
4. Click Save

Your site will be available at: `https://yourusername.github.io/repository-name`

## 🔧 Configuration

### Update Site Title and Domain

In all HTML files, update:

```html
<title>Your Site Name | Tech Blog</title>
<meta name="description" content="Your site description">
```

In `index.html`, update the logo:

```html
<a href="index.html" class="logo">
    <span class="logo-text">Your</span><span class="logo-accent">Name</span>
</a>
```

### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the root with your domain:
```
noteme.sbs
```

2. Configure DNS settings:
   - Add CNAME record pointing to `yourusername.github.io`
   - Or add A records to GitHub's IPs

## 📦 Dependencies

All dependencies are loaded via CDN:

- [Marked.js](https://marked.js.org/) - Markdown parser
- [Highlight.js](https://highlightjs.org/) - Syntax highlighting
- [Google Fonts](https://fonts.google.com/) - Inter font family

## 🎯 Categories

The blog supports three main categories:

- **AWS**: Cloud computing, EC2, S3, etc.
- **Linux**: System administration, configurations
- **DevOps**: CI/CD, automation, best practices

## 🖼️ Post Icons

Each post can have an emoji icon. Common choices:

- ☁️ AWS/Cloud
- 🐧 Linux
- ⚙️ DevOps/Configuration
- 🔒 Security
- 🚀 Deployment
- 🌐 Networking
- 📦 Containers

## 📈 Performance Tips

1. **Optimize Images**: Use compressed images (WebP format recommended)
2. **Lazy Loading**: The blog loader shows posts progressively
3. **Caching**: GitHub Pages automatically caches static assets
4. **Minification**: Consider minifying CSS/JS for production

## 🐛 Troubleshooting

### Posts Not Loading

- Check that `posts.json` is valid JSON
- Verify markdown file names match the `id` in posts.json
- Check browser console for errors

### Syntax Highlighting Not Working

- Ensure Highlight.js CDN is loading
- Check that code blocks use proper markdown syntax with language tags

### Mobile Menu Not Working

- Clear browser cache
- Check that JavaScript files are loading correctly

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Email: your@email.com

## 🎓 Learning Resources

Building this blog? Here are some helpful resources:

- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [MDN Web Docs](https://developer.mozilla.org/)

## ✨ Credits

Design inspired by modern portfolio websites with a focus on:
- Clean animations
- Smooth transitions
- Dark theme aesthetics
- Professional typography

---

**Built with ❤️ for the DevOps community**
