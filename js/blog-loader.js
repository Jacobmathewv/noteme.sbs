
// Blog posts configuration
// This will load blog posts from the posts/ directory
const POSTS_DIR = 'posts/';

// Blog posts metadata (you can also generate this dynamically)
let blogPosts = [];

// Load blog posts metadata from JSON file
async function loadBlogMetadata() {
    try {
        const response = await fetch('posts/posts.json');
        if (!response.ok) {
            console.warn('posts.json not found, using default posts');
            blogPosts = getDefaultPosts();
            return;
        }
        const data = await response.json();
        blogPosts = data.posts || [];
    } catch (error) {
        console.error('Error loading blog metadata:', error);
        blogPosts = getDefaultPosts();
    }
}

// Default sample posts if posts.json doesn't exist
function getDefaultPosts() {
    return [
        {
            id: 'getting-started-aws-ec2',
            title: 'Getting Started with AWS EC2: A Complete Guide',
            excerpt: 'Learn how to launch and configure your first EC2 instance on AWS, including security groups, key pairs, and best practices.',
            category: 'aws',
            date: '2025-01-10',
            readTime: '8 min read',
            tags: ['AWS', 'EC2', 'Cloud Computing'],
            icon: '☁️'
        },
        {
            id: 'linux-mail-server-setup',
            title: 'Setting Up a Mail Server with Postfix and Dovecot',
            excerpt: 'Step-by-step guide to configuring a secure mail server on AlmaLinux using Postfix for SMTP and Dovecot for IMAP.',
            category: 'linux',
            date: '2025-01-08',
            readTime: '12 min read',
            tags: ['Linux', 'Postfix', 'Dovecot', 'AlmaLinux'],
            icon: '🐧'
        },
        {
            id: 'custom-ami-creation',
            title: 'Creating Custom AMIs for Faster EC2 Deployment',
            excerpt: 'Optimize your AWS deployment workflow by creating custom Amazon Machine Images with pre-configured applications.',
            category: 'aws',
            date: '2025-01-05',
            readTime: '10 min read',
            tags: ['AWS', 'AMI', 'DevOps', 'Automation'],
            icon: '⚙️'
        },
        {
            id: 'firewall-configuration-linux',
            title: 'Linux Firewall Configuration: firewalld vs iptables',
            excerpt: 'Compare firewalld and iptables, and learn which one to use for your Linux server security needs.',
            category: 'linux',
            date: '2025-01-03',
            readTime: '7 min read',
            tags: ['Linux', 'Security', 'Firewall', 'iptables'],
            icon: '🔒'
        },
        {
            id: 'devops-cicd-pipeline',
            title: 'Building a CI/CD Pipeline with GitHub Actions',
            excerpt: 'Automate your deployment process with GitHub Actions. Learn to set up testing, building, and deployment workflows.',
            category: 'devops',
            date: '2025-01-01',
            readTime: '15 min read',
            tags: ['DevOps', 'CI/CD', 'GitHub Actions', 'Automation'],
            icon: '🚀'
        },
        {
            id: 'dns-configuration-guide',
            title: 'Complete DNS Configuration Guide for System Admins',
            excerpt: 'Master DNS concepts and learn to configure DNS servers, zones, and records for your infrastructure.',
            category: 'linux',
            date: '2024-12-28',
            readTime: '9 min read',
            tags: ['DNS', 'Linux', 'Networking'],
            icon: '🌐'
        }
    ];
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Create blog card HTML
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

// Load latest blog posts for homepage
async function loadLatestPosts() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    await loadBlogMetadata();

    // Get latest 3 posts
    const latestPosts = blogPosts.slice(0, 3);
    
    if (latestPosts.length === 0) {
        blogGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No blog posts yet. Check back soon!</p>';
        return;
    }

    blogGrid.innerHTML = latestPosts.map(post => createBlogCard(post)).join('');
}

// Load all blog posts for blog page
async function loadAllPosts() {
    const blogGrid = document.getElementById('all-blogs-grid');
    if (!blogGrid) return;

    await loadBlogMetadata();

    if (blogPosts.length === 0) {
        blogGrid.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No blog posts yet. Check back soon!</p>';
        return;
    }

    blogGrid.innerHTML = blogPosts.map(post => createBlogCard(post)).join('');
}

// Initialize based on page
if (document.getElementById('blog-grid')) {
    loadLatestPosts();
}

if (document.getElementById('all-blogs-grid')) {
    loadAllPosts();
}
