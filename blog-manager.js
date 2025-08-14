// Blog Management System
class BlogManager {
    constructor() {
        this.articles = this.loadArticles();
        this.currentEditId = null;
        this.displayedArticles = 6; // Number of articles to show initially
        this.currentFilter = 'all';
        this.isAdminLoggedIn = false;
        this.adminCredentials = {
            username: 'admin',
            password: 'password'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleArticles();
        this.renderArticles();
        this.renderFeaturedArticle();
        this.checkAdminSession();
    }

    // Event Listeners
    setupEventListeners() {
        // Admin authentication
        document.getElementById('admin-login-form')?.addEventListener('submit', (e) => this.handleAdminLogin(e));
        document.getElementById('logout-admin')?.addEventListener('click', () => this.logoutAdmin());

        // Article creation (admin only)
        document.getElementById('create-article')?.addEventListener('click', () => this.openCreateModal());
        document.getElementById('import-articles')?.addEventListener('click', () => this.importSampleArticles());
        document.getElementById('export-articles')?.addEventListener('click', () => this.exportArticles());

        // Modal handling
        document.getElementById('article-form')?.addEventListener('submit', (e) => this.handleFormSubmit(e));
        document.querySelector('.article-modal-close')?.addEventListener('click', () => this.closeModal());
        document.querySelector('.article-modal-overlay')?.addEventListener('click', () => this.closeModal());
        document.getElementById('delete-article')?.addEventListener('click', () => this.deleteCurrentArticle());

        // Filtering
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterArticles(e.target.dataset.category));
        });

        // Load more
        document.getElementById('load-more')?.addEventListener('click', () => this.loadMoreArticles());
    }

    // Authentication Management
    showAdminLogin() {
        document.getElementById('admin-login-modal').style.display = 'flex';
    }

    handleAdminLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.isAdminLoggedIn = true;
            localStorage.setItem('datapace-admin-session', 'true');
            document.getElementById('admin-login-modal').style.display = 'none';
            document.getElementById('admin-section').style.display = 'block';
            this.renderArticles();
            this.renderFeaturedArticle();
            this.showNotification('Admin login successful!', 'success');
        } else {
            this.showNotification('Invalid credentials!', 'error');
        }
    }

    logoutAdmin() {
        this.isAdminLoggedIn = false;
        localStorage.removeItem('datapace-admin-session');
        document.getElementById('admin-section').style.display = 'none';
        this.renderArticles();
        this.renderFeaturedArticle();
        this.showNotification('Logged out successfully!', 'success');
    }

    checkAdminSession() {
        const adminSession = localStorage.getItem('datapace-admin-session');
        if (adminSession === 'true') {
            this.isAdminLoggedIn = true;
            document.getElementById('admin-section').style.display = 'block';
        }
    }

    // Modal Management
    openCreateModal() {
        this.currentEditId = null;
        document.getElementById('modal-title').textContent = 'Create New Article';
        document.getElementById('delete-article').style.display = 'none';
        document.getElementById('article-form').reset();
        document.getElementById('article-author').value = 'Datapace Team';
        document.getElementById('article-read-time').value = '5';
        document.getElementById('article-modal').style.display = 'flex';
    }

    openEditModal(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        this.currentEditId = articleId;
        document.getElementById('modal-title').textContent = 'Edit Article';
        document.getElementById('delete-article').style.display = 'block';

        // Populate form
        document.getElementById('article-title').value = article.title;
        document.getElementById('article-excerpt').value = article.excerpt;
        document.getElementById('article-category').value = article.category;
        document.getElementById('article-author').value = article.author;
        document.getElementById('article-read-time').value = article.readTime;
        document.getElementById('article-content').value = article.content || article.excerpt;
        document.getElementById('article-featured').checked = article.featured || false;

        document.getElementById('article-modal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('article-modal').style.display = 'none';
        this.currentEditId = null;
    }

    // Article Management
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const articleData = {
            title: formData.get('title'),
            excerpt: formData.get('excerpt'),
            category: formData.get('category'),
            author: formData.get('author'),
            readTime: parseInt(formData.get('readTime')),
            content: formData.get('content'),
            featured: formData.has('featured'),
            date: new Date().toISOString().split('T')[0],
            image: `https://placehold.co/800x400/${this.getColorForCategory(formData.get('category'))}/ffffff?text=${encodeURIComponent(formData.get('title'))}`
        };

        if (this.currentEditId) {
            this.updateArticle(this.currentEditId, articleData);
        } else {
            this.createArticle(articleData);
        }

        this.closeModal();
        this.renderArticles();
        this.renderFeaturedArticle();
    }

    createArticle(articleData) {
        const newArticle = {
            id: Date.now().toString(),
            ...articleData
        };
        
        this.articles.unshift(newArticle);
        this.saveArticles();
        this.showNotification('Article created successfully!', 'success');
    }

    updateArticle(id, articleData) {
        const index = this.articles.findIndex(a => a.id === id);
        if (index !== -1) {
            this.articles[index] = { ...this.articles[index], ...articleData };
            this.saveArticles();
            this.showNotification('Article updated successfully!', 'success');
        }
    }

    deleteCurrentArticle() {
        if (!this.currentEditId || !confirm('Are you sure you want to delete this article?')) return;

        this.articles = this.articles.filter(a => a.id !== this.currentEditId);
        this.saveArticles();
        this.closeModal();
        this.renderArticles();
        this.renderFeaturedArticle();
        this.showNotification('Article deleted successfully!', 'success');
    }

    // Data Management
    loadArticles() {
        const stored = localStorage.getItem('datapace-blog-articles');
        return stored ? JSON.parse(stored) : [];
    }

    saveArticles() {
        localStorage.setItem('datapace-blog-articles', JSON.stringify(this.articles));
    }

    loadSampleArticles() {
        if (this.articles.length === 0) {
            this.importSampleArticles();
        }
    }

    importSampleArticles() {
        const sampleArticles = this.getSampleArticles();
        this.articles = [...sampleArticles, ...this.articles];
        this.saveArticles();
        this.renderArticles();
        this.renderFeaturedArticle();
        this.showNotification('Sample articles loaded!', 'success');
    }

    exportArticles() {
        const dataStr = JSON.stringify(this.articles, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'datapace-blog-articles.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Articles exported successfully!', 'success');
    }

    // Rendering
    renderArticles() {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;

        const filteredArticles = this.currentFilter === 'all' 
            ? this.articles 
            : this.articles.filter(article => article.category === this.currentFilter);

        const articlesToShow = filteredArticles.slice(0, this.displayedArticles);

        grid.innerHTML = articlesToShow.map(article => `
            <article class="article-card" data-category="${article.category}">
                <img src="${article.image}" alt="${article.title}" class="article-image" loading="lazy">
                <div class="article-content">
                    <div class="article-meta">
                        <span class="article-category">${this.formatCategory(article.category)}</span>
                        <span class="article-date">${this.formatDate(article.date)}</span>
                    </div>
                    <h3 class="article-title">
                        <a href="#" onclick="blogManager.openArticleModal('${article.id}'); return false;">${article.title}</a>
                    </h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-footer">
                        <span class="read-time">${article.readTime} min read</span>
                        <a href="#" class="read-more" onclick="blogManager.openArticleModal('${article.id}'); return false;">Read More</a>
                    </div>
                </div>
                ${this.isAdminLoggedIn ? `
                <button class="article-edit-btn" onclick="blogManager.openEditModal('${article.id}')" title="Edit Article">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                    </svg>
                </button>
                ` : ''}
            </article>
        `).join('');

        // Update load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = filteredArticles.length > this.displayedArticles ? 'block' : 'none';
        }
    }

    renderFeaturedArticle() {
        const featuredContainer = document.getElementById('featured-article');
        if (!featuredContainer) return;

        const featured = this.articles.find(article => article.featured) || this.articles[0];
        if (!featured) {
            featuredContainer.innerHTML = '<p>No articles available. Create your first article!</p>';
            return;
        }

        featuredContainer.innerHTML = `
            <img src="${featured.image}" alt="${featured.title}" class="featured-article-image" loading="lazy">
            <div class="featured-article-content">
                <div class="featured-article-meta">
                    <span class="featured-article-category">${this.formatCategory(featured.category)}</span>
                    <span class="article-date">${this.formatDate(featured.date)}</span>
                </div>
                <h2 class="featured-article-title">
                    <a href="#" onclick="blogManager.openArticleModal('${featured.id}'); return false;">${featured.title}</a>
                </h2>
                <p class="featured-article-excerpt">${featured.excerpt}</p>
                <div class="featured-article-author">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="${featured.author}" class="author-avatar" loading="lazy">
                    <div class="author-info">
                        <div class="author-name">${featured.author}</div>
                        <div class="author-title">Database Performance Expert</div>
                    </div>
                </div>
            </div>
            ${this.isAdminLoggedIn ? `
            <button class="featured-edit-btn" onclick="blogManager.openEditModal('${featured.id}')" title="Edit Featured Article">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                </svg>
                Edit
            </button>
            ` : ''}
        `;
    }

    // Article Modal for Reading
    openArticleModal(articleId) {
        const article = this.articles.find(a => a.id === articleId);
        if (!article) return;

        // Create article reading modal (if it doesn't exist)
        let modal = document.getElementById('article-reading-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'article-reading-modal';
            modal.className = 'article-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="article-modal-overlay"></div>
            <div class="article-modal-content">
                <button class="article-modal-close" onclick="this.closest('.article-modal').style.display='none'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                <div class="article-modal-header">
                    <div class="article-meta" style="justify-content: center; margin-bottom: var(--space-lg);">
                        <span class="article-category">${this.formatCategory(article.category)}</span>
                        <span class="article-date">${this.formatDate(article.date)}</span>
                        <span class="read-time">${article.readTime} min read</span>
                    </div>
                    <h1>${article.title}</h1>
                    <div class="featured-article-author" style="justify-content: center; margin-top: var(--space-lg);">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="${article.author}" class="author-avatar">
                        <div class="author-info">
                            <div class="author-name">${article.author}</div>
                            <div class="author-title">Database Performance Expert</div>
                        </div>
                    </div>
                </div>
                <div class="article-modal-image">
                    <img src="${article.image}" alt="${article.title}">
                </div>
                <div class="article-body">
                    ${this.formatContent(article.content || article.excerpt)}
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        
        // Close on overlay click
        modal.querySelector('.article-modal-overlay').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Filtering and Pagination
    filterArticles(category) {
        this.currentFilter = category;
        this.displayedArticles = 6; // Reset pagination
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderArticles();
    }

    loadMoreArticles() {
        this.displayedArticles += 6;
        this.renderArticles();
    }

    // Utility Functions
    formatCategory(category) {
        const categoryMap = {
            'optimization': 'Optimization',
            'tutorials': 'Tutorials',
            'ai': 'AI & ML',
            'case-studies': 'Case Studies'
        };
        return categoryMap[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatContent(content) {
        // Simple markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    getColorForCategory(category) {
        const colors = {
            'optimization': '0ea5e9',
            'tutorials': '8b5cf6',
            'ai': '10b981',
            'case-studies': 'f59e0b'
        };
        return colors[category] || '6b7280';
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'info': '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getSampleArticles() {
        return [
            {
                id: '1',
                title: 'Optimizing PostgreSQL Queries with AI-Driven Index Recommendations',
                excerpt: 'Learn how our AI recommendation engine analyzes query patterns to suggest precise index optimizations that can improve performance by up to 80%.',
                category: 'optimization',
                author: 'Datapace Team',
                readTime: 8,
                date: '2025-01-25',
                featured: true,
                image: 'https://placehold.co/800x400/0ea5e9/ffffff?text=PostgreSQL+Optimization',
                content: `# Optimizing PostgreSQL Queries with AI-Driven Index Recommendations

PostgreSQL performance optimization has traditionally required deep database expertise. With our AI recommendation engine, we're changing that paradigm.

## The Challenge

Most development teams struggle with database performance issues because they lack dedicated DBA expertise. When queries slow down, they often resort to adding random indexes or over-provisioning resources.

## Our AI Approach

Our recommendation engine analyzes:
- **Query execution patterns** - Understanding which queries run most frequently
- **Index usage statistics** - Identifying unused or underutilized indexes  
- **Table relationship patterns** - Recognizing optimal join strategies

## Real Results

One Series C fintech company saw:
- **80% improvement** in query response time
- **40% reduction** in cloud costs
- **5 hours saved** per developer per week

The key insight: specific recommendations like "Add index to users.email" instead of generic performance alerts.`
            },
            {
                id: '2',
                title: 'Database Performance Monitoring for Series B Companies Without DBAs',
                excerpt: 'Discover how scale-ups can achieve enterprise-level database performance without hiring expensive database administrators.',
                category: 'case-studies',
                author: 'Datapace Team',
                readTime: 6,
                date: '2025-01-20',
                image: 'https://placehold.co/800x400/f59e0b/ffffff?text=Series+B+Case+Study',
                content: `# Database Performance Monitoring for Series B Companies Without DBAs

Series B companies face a unique challenge: they need enterprise-level database performance but can't justify hiring a full-time DBA.

## The Series B Dilemma

Growing companies often experience:
- Sudden traffic spikes that expose database bottlenecks
- Limited budget for specialized database talent
- Pressure to scale quickly without breaking systems

## AI as Your Virtual DBA

Our recommendation engine acts as a virtual DBA by:
- **Continuously monitoring** all database metrics
- **Identifying root causes** of performance issues
- **Providing specific fixes** like "Rewrite this query" or "Add this index"

## Success Story

A Series B e-commerce company reduced their database response time by 70% and saved $30K/month in cloud costs—all without hiring a DBA.`
            },
            {
                id: '3',
                title: 'Building CI/CD Pipeline Integration for Database Performance',
                excerpt: 'Learn how to catch database performance regressions before they hit production with our CI/CD integration.',
                category: 'tutorials',
                author: 'Datapace Team',
                readTime: 10,
                date: '2025-01-15',
                image: 'https://placehold.co/800x400/8b5cf6/ffffff?text=CI%2FCD+Integration',
                content: `# Building CI/CD Pipeline Integration for Database Performance

Catching performance regressions before production is crucial for maintaining system reliability.

## Why CI/CD Integration Matters

Most performance issues are introduced during development:
- Inefficient queries added in new features
- Schema changes that break existing optimizations
- Missing indexes for new query patterns

## Implementation Guide

1. **Install our CI/CD plugin**
2. **Configure performance thresholds**
3. **Set up automated alerts**
4. **Review recommendations in pull requests**

## Best Practices

- Test against production-like data volumes
- Monitor both individual query performance and overall system impact
- Use our AI recommendations to optimize queries before merge`
            },
            {
                id: '4',
                title: 'The Future of Autonomous Database Management',
                excerpt: 'Explore how AI will enable fully autonomous database systems that self-optimize without human intervention.',
                category: 'ai',
                author: 'Datapace Team',
                readTime: 7,
                date: '2025-01-10',
                image: 'https://placehold.co/800x400/10b981/ffffff?text=Autonomous+AI',
                content: `# The Future of Autonomous Database Management

The ultimate vision for database management is full autonomy—systems that optimize themselves without human intervention.

## Current State vs. Future Vision

**Today:** Reactive monitoring and manual optimization
**Tomorrow:** Proactive, self-healing database systems

## Key Technologies Enabling Autonomy

- **Machine Learning** for pattern recognition
- **Automated Schema Evolution** based on usage patterns
- **Predictive Scaling** before bottlenecks occur
- **Self-Healing Indexes** that create and drop automatically

## Getting Started Today

While full autonomy is still emerging, you can prepare by:
1. Implementing AI-driven recommendations
2. Automating routine maintenance tasks
3. Building performance monitoring into your CI/CD pipeline

The future of database management is autonomous, and it starts with intelligent recommendations.`
            }
        ];
    }
}

// Global functions for onclick handlers
window.closeArticleModal = function() {
    document.getElementById('article-modal').style.display = 'none';
};

// Initialize blog manager when DOM is loaded
let blogManager;
document.addEventListener('DOMContentLoaded', function() {
    blogManager = new BlogManager();
});

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}