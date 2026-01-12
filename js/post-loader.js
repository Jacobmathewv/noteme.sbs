// Load and render individual blog post
async function loadPost() {
    // Get post ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        document.getElementById('post-content').innerHTML = 
            '<p style="color: var(--text-secondary);">Post not found. <a href="blog.html">Return to blog listing</a></p>';
        return;
    }

    try {
        // Load the markdown file
        const response = await fetch(`posts/${postId}.md`);
        
        if (!response.ok) {
            throw new Error('Post not found');
        }

        const markdown = await response.text();
        
        // Parse frontmatter and content
        const { frontmatter, content } = parseFrontmatter(markdown);
        
        // Update page metadata
        updatePostMetadata(frontmatter);
        
        // Render markdown to HTML
        renderMarkdown(content);
        
        // Load related posts
        loadRelatedPosts(frontmatter.category, postId);
        
    } catch (error) {
        console.error('Error loading post:', error);
        document.getElementById('post-content').innerHTML = 
            `<p style="color: var(--text-secondary);">Error loading post. <a href="blog.html">Return to blog listing</a></p>`;
    }
}

// Parse frontmatter from markdown
function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: {}, content: markdown };
    }
    
    const frontmatterText = match[1];
    const content = match[2];
    
    const frontmatter = {};
    frontmatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
            let value = valueParts.join(':').trim();
            // Remove quotes if present
            value = value.replace(/^["']|["']$/g, '');
            // Parse arrays
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
            }
            frontmatter[key.trim()] = value;
        }
    });
    
    return { frontmatter, content };
}

// Update post metadata in the page
function updatePostMetadata(frontmatter) {
    document.title = `${frontmatter.title || 'Blog Post'} | NoteMe`;
    
    document.getElementById('post-title').textContent = frontmatter.title || 'Untitled Post';
    document.getElementById('post-excerpt').textContent = frontmatter.excerpt || '';
    document.getElementById('post-category').textContent = (frontmatter.category || 'general').toUpperCase();
    document.getElementById('post-date').textContent = formatDate(frontmatter.date || new Date().toISOString());
    document.getElementById('post-read-time').textContent = frontmatter.readTime || '5 min read';
    
    // Add tags
    const tagsContainer = document.getElementById('post-tags');
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
        tagsContainer.innerHTML = frontmatter.tags.map(tag => 
            `<span class="post-tag">${tag}</span>`
        ).join('');
    }
}

// Render markdown content
function renderMarkdown(content) {
    // Configure marked options
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {
                    console.error('Highlight error:', err);
                }
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });
    
    // Render markdown
    const html = marked.parse(content);
    document.getElementById('post-content').innerHTML = html;
    
    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Load related posts
async function loadRelatedPosts(category, currentPostId) {
    try {
        const response = await fetch('posts/posts.json');
        if (!response.ok) return;
        
        const data = await response.json();
        const allPosts = data.posts || [];
        
        // Filter posts by category and exclude current post
        const relatedPosts = allPosts
            .filter(post => post.category === category && post.id !== currentPostId)
            .slice(0, 3);
        
        if (relatedPosts.length === 0) {
            document.querySelector('.related-posts').style.display = 'none';
            return;
        }
        
        const relatedGrid = document.getElementById('related-posts-grid');
        relatedGrid.innerHTML = relatedPosts.map(post => createBlogCard(post)).join('');
        
    } catch (error) {
        console.error('Error loading related posts:', error);
        document.querySelector('.related-posts').style.display = 'none';
    }
}

// Create blog card (reused from blog-loader.js)
function createBlogCard(post) {
    return `
        <a href="post.html?id=${post.id}" class="blog-card" data-category="${post.category}">
            <div class="blog-image">${post.icon || '📝'}</div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${post.category.toUpperCase()}</span>
                    <span class="blog-date">${formatDate(post.date)}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <span class="blog-read-more">Read More →</span>
            </div>
        </a>
    `;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize post loading
if (window.location.pathname.includes('post.html')) {
    loadPost();
}
