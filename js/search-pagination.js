// Search and Pagination Configuration
const POSTS_PER_PAGE = 9; // Number of posts per page
let currentPage = 1;
let filteredPosts = [];
let allPosts = [];
let currentCategory = 'all';
let searchQuery = '';

// Initialize search and pagination
async function initializeSearchPagination() {
    // Load all posts first
    await loadAllPostsData();
    
    // Set up event listeners
    setupSearchListeners();
    setupFilterListeners();
    setupPaginationListeners();
    
    // Initial display
    displayPosts();
}

// Load all posts data
async function loadAllPostsData() {
    try {
        const response = await fetch('posts/posts.json');
        if (!response.ok) {
            throw new Error('Failed to load posts');
        }
        const data = await response.json();
        allPosts = data.posts || [];
        filteredPosts = [...allPosts];
        
        // Hide loading state
        hideLoadingState();
    } catch (error) {
        console.error('Error loading posts:', error);
        allPosts = [];
        filteredPosts = [];
        hideLoadingState();
        showNoResults();
    }
}

// Setup search listeners
function setupSearchListeners() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    const resetBtn = document.getElementById('reset-search');
    
    if (!searchInput) return;
    
    // Search input with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchQuery = e.target.value.toLowerCase().trim();
            
            // Show/hide clear button
            if (clearBtn) {
                clearBtn.style.display = searchQuery ? 'flex' : 'none';
            }
            
            // Reset to page 1 on new search
            currentPage = 1;
            filterAndDisplayPosts();
        }, 300);
    });
    
    // Clear search button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearBtn.style.display = 'none';
            currentPage = 1;
            filterAndDisplayPosts();
            searchInput.focus();
        });
    }
    
    // Reset search button (in no results)
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            if (clearBtn) clearBtn.style.display = 'none';
            currentCategory = 'all';
            
            // Reset filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === 'all');
            });
            
            currentPage = 1;
            filterAndDisplayPosts();
        });
    }
}

// Setup filter listeners
function setupFilterListeners() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update category
            currentCategory = btn.dataset.category;
            currentPage = 1;
            
            // Filter and display
            filterAndDisplayPosts();
        });
    });
}

// Setup pagination listeners
function setupPaginationListeners() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPosts();
                scrollToTop();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
            if (currentPage < totalPages) {
                currentPage++;
                displayPosts();
                scrollToTop();
            }
        });
    }
}

// Filter and display posts
function filterAndDisplayPosts() {
    // Start with all posts
    filteredPosts = [...allPosts];
    
    // Apply category filter
    if (currentCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
            post.category === currentCategory
        );
    }
    
    // Apply search filter
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => {
            const searchableText = [
                post.title,
                post.excerpt,
                post.category,
                ...(post.tags || [])
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchQuery);
        });
    }
    
    // Display results
    displayPosts();
}

// Display posts for current page
function displayPosts() {
    const blogGrid = document.getElementById('all-blogs-grid');
    const noResults = document.getElementById('no-results');
    const pagination = document.getElementById('pagination');
    const resultsCount = document.getElementById('results-count');
    
    if (!blogGrid) return;
    
    // Check if we have results
    if (filteredPosts.length === 0) {
        blogGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'flex';
        if (pagination) pagination.style.display = 'none';
        if (resultsCount) resultsCount.textContent = 'No posts found';
        return;
    }
    
    // Hide no results
    if (noResults) noResults.style.display = 'none';
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = Math.min(startIndex + POSTS_PER_PAGE, filteredPosts.length);
    const postsToDisplay = filteredPosts.slice(startIndex, endIndex);
    
    // Update results count
    if (resultsCount) {
        const showing = `Showing ${startIndex + 1}-${endIndex} of ${filteredPosts.length} posts`;
        resultsCount.textContent = showing;
    }
    
    // Display posts with stagger animation
    blogGrid.innerHTML = postsToDisplay.map((post, index) => {
        return createBlogCard(post, index);
    }).join('');
    
    // Animate cards
    animateBlogCards();
    
    // Update pagination
    updatePagination(totalPages);
}

// Create blog card with animation delay
function createBlogCard(post, index) {
    return `
        <a href="post.html?id=${post.id}" 
           class="blog-card animate-in" 
           data-category="${post.category}"
           style="animation-delay: ${index * 0.1}s">
            <div class="blog-image">${post.icon || '📝'}</div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-category">${post.category.toUpperCase()}</span>
                    <span class="blog-date">${formatDate(post.date)}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-footer">
                    <span class="blog-read-more">Read More →</span>
                    ${post.readTime ? `<span class="read-time">${post.readTime}</span>` : ''}
                </div>
            </div>
        </a>
    `;
}

// Animate blog cards
function animateBlogCards() {
    const cards = document.querySelectorAll('.blog-card.animate-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => observer.observe(card));
}

// Update pagination controls
function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    
    if (!pagination) return;
    
    // Show/hide pagination
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Update prev/next buttons
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
    
    // Generate page numbers
    if (pageNumbers) {
        pageNumbers.innerHTML = generatePageNumbers(currentPage, totalPages);
        
        // Add click listeners to page numbers
        pageNumbers.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page !== currentPage) {
                    currentPage = page;
                    displayPosts();
                    scrollToTop();
                }
            });
        });
    }
}

// Generate page number buttons
function generatePageNumbers(current, total) {
    let pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    let rangeStart = Math.max(2, current - 1);
    let rangeEnd = Math.min(total - 1, current + 1);
    
    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
        pages.push('...');
    }
    
    // Add pages around current
    for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (rangeEnd < total - 1) {
        pages.push('...');
    }
    
    // Always show last page if more than 1 page
    if (total > 1) {
        pages.push(total);
    }
    
    // Generate HTML
    return pages.map(page => {
        if (page === '...') {
            return '<span class="page-ellipsis">...</span>';
        }
        
        const isActive = page === current;
        return `
            <button class="page-number ${isActive ? 'active' : ''}" 
                    data-page="${page}"
                    ${isActive ? 'disabled' : ''}>
                ${page}
            </button>
        `;
    }).join('');
}

// Scroll to top smoothly
function scrollToTop() {
    const searchSection = document.querySelector('.search-filter-section');
    if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Hide loading state
function hideLoadingState() {
    const loadingState = document.getElementById('loading-state');
    if (loadingState) {
        setTimeout(() => {
            loadingState.style.opacity = '0';
            setTimeout(() => {
                loadingState.style.display = 'none';
            }, 300);
        }, 500);
    }
}

// Show no results
function showNoResults() {
    const noResults = document.getElementById('no-results');
    const blogGrid = document.getElementById('all-blogs-grid');
    
    if (noResults) noResults.style.display = 'flex';
    if (blogGrid) blogGrid.innerHTML = '';
}

// Initialize when DOM is loaded
if (document.getElementById('all-blogs-grid')) {
    document.addEventListener('DOMContentLoaded', initializeSearchPagination);
}
