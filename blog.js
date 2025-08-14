// Blog functionality
(function() {
    'use strict';
    
    // Blog data - this would typically come from a CMS or API
    let blogArticles = [
        {
            id: 1,
            title: "10 Essential Database Optimization Techniques That Will Transform Your Performance",
            slug: "database-optimization-techniques",
            excerpt: "Discover the most effective database optimization strategies used by top tech companies to achieve lightning-fast query performance and reduce costs.",
            content: `
                <p>Database performance is the backbone of any successful application. Whether you're running a startup or managing enterprise-level systems, slow database queries can cripple user experience and increase operational costs.</p>
                
                <h2>1. Index Optimization</h2>
                <p>Proper indexing is the foundation of database performance. Here's what you need to know:</p>
                <ul>
                    <li>Create indexes on frequently queried columns</li>
                    <li>Avoid over-indexing to prevent write performance degradation</li>
                    <li>Use composite indexes for multi-column queries</li>
                    <li>Regularly analyze and remove unused indexes</li>
                </ul>
                
                <h2>2. Query Optimization</h2>
                <p>Writing efficient queries is an art that every developer should master:</p>
                <blockquote>
                    "A well-optimized query can be 100x faster than a poorly written one. The difference between a 10ms query and a 1000ms query can make or break user experience."
                </blockquote>
                
                <h3>Key Query Optimization Tips:</h3>
                <ul>
                    <li>Use EXPLAIN PLAN to understand query execution</li>
                    <li>Avoid SELECT * in production queries</li>
                    <li>Use appropriate JOIN types</li>
                    <li>Implement proper WHERE clause filtering</li>
                </ul>
                
                <h2>3. Connection Pool Management</h2>
                <p>Managing database connections efficiently can dramatically improve performance:</p>
                <pre><code>// Example connection pool configuration
const pool = new Pool({
  host: 'localhost',
  user: 'dbuser',
  password: 'secretpassword',
  database: 'mydb',
  port: 5432,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
});</code></pre>
                
                <h2>Conclusion</h2>
                <p>Database optimization is an ongoing process that requires constant monitoring and adjustment. By implementing these techniques, you can significantly improve your application's performance and reduce operational costs.</p>
                
                <p>At Datapace, we're building AI-powered tools to automate many of these optimization processes. <a href="/#waiting-list">Join our waiting list</a> to be the first to experience the future of database performance optimization.</p>
            `,
            category: "optimization",
            author: {
                name: "Sarah Chen",
                title: "Database Performance Engineer",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg"
            },
            date: "2025-01-25",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            featured: true
        },
        {
            id: 2,
            title: "How AI is Revolutionizing Database Performance Monitoring",
            slug: "ai-database-monitoring",
            excerpt: "Explore how artificial intelligence and machine learning are transforming the way we monitor, analyze, and optimize database performance in real-time.",
            content: `
                <p>The traditional approach to database monitoring relies heavily on reactive measures and manual analysis. But what if we could predict and prevent performance issues before they impact users?</p>
                
                <h2>The Evolution of Database Monitoring</h2>
                <p>Database monitoring has evolved through several phases:</p>
                <ul>
                    <li><strong>Reactive Monitoring:</strong> Fixing issues after they occur</li>
                    <li><strong>Proactive Monitoring:</strong> Setting up alerts and thresholds</li>
                    <li><strong>Predictive Monitoring:</strong> Using AI to forecast problems</li>
                    <li><strong>Autonomous Optimization:</strong> AI-driven automatic fixes</li>
                </ul>
                
                <h2>AI-Powered Performance Insights</h2>
                <p>Modern AI systems can analyze vast amounts of performance data to identify patterns that humans might miss:</p>
                
                <blockquote>
                    "AI can process millions of query execution plans per second, identifying optimization opportunities that would take human DBAs weeks to discover."
                </blockquote>
                
                <h3>Key AI Capabilities in Database Monitoring:</h3>
                <ol>
                    <li><strong>Anomaly Detection:</strong> Identifying unusual patterns in query performance</li>
                    <li><strong>Root Cause Analysis:</strong> Automatically pinpointing the source of performance issues</li>
                    <li><strong>Predictive Scaling:</strong> Forecasting resource needs before bottlenecks occur</li>
                    <li><strong>Intelligent Query Optimization:</strong> Suggesting index and query improvements</li>
                </ol>
                
                <h2>Real-World Impact</h2>
                <p>Companies using AI-powered database monitoring have reported:</p>
                <ul>
                    <li>70% reduction in mean time to resolution (MTTR)</li>
                    <li>45% decrease in database-related incidents</li>
                    <li>60% improvement in query performance</li>
                    <li>30% reduction in infrastructure costs</li>
                </ul>
                
                <h2>The Future of Database Performance</h2>
                <p>We're moving toward a future where databases will be largely self-optimizing, with AI systems continuously adjusting configurations, indexes, and query plans to maintain optimal performance.</p>
                
                <p>This is exactly what we're building at Datapace - an AI-first approach to database performance that learns from your specific workload patterns and provides actionable insights.</p>
            `,
            category: "ai",
            author: {
                name: "Michael Rodriguez",
                title: "AI Research Lead",
                avatar: "https://randomuser.me/api/portraits/men/45.jpg"
            },
            date: "2025-01-20",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2132&q=80"
        },
        {
            id: 3,
            title: "PostgreSQL vs MySQL: A Performance Comparison Guide",
            slug: "postgresql-vs-mysql-performance",
            excerpt: "An in-depth analysis of PostgreSQL and MySQL performance characteristics, helping you choose the right database for your specific use case.",
            content: `
                <p>Choosing between PostgreSQL and MySQL is one of the most common decisions developers face when building applications. Both are excellent relational databases, but they have different strengths and performance characteristics.</p>
                
                <h2>Performance Overview</h2>
                <p>When it comes to raw performance, both databases can handle massive workloads, but they excel in different scenarios:</p>
                
                <h3>PostgreSQL Strengths:</h3>
                <ul>
                    <li>Complex queries with advanced SQL features</li>
                    <li>Heavy read workloads with complex joins</li>
                    <li>ACID compliance and data integrity</li>
                    <li>Advanced indexing options (GIN, GiST, SP-GiST, BRIN)</li>
                </ul>
                
                <h3>MySQL Strengths:</h3>
                <ul>
                    <li>Simple, high-volume read operations</li>
                    <li>Web applications with straightforward queries</li>
                    <li>Replication and clustering (MySQL Cluster)</li>
                    <li>Lower memory footprint for simple operations</li>
                </ul>
                
                <h2>Benchmark Results</h2>
                <p>Based on our testing with typical web application workloads:</p>
                
                <table>
                    <tr>
                        <th>Test Type</th>
                        <th>PostgreSQL</th>
                        <th>MySQL</th>
                        <th>Winner</th>
                    </tr>
                    <tr>
                        <td>Simple SELECT</td>
                        <td>15,000 QPS</td>
                        <td>18,000 QPS</td>
                        <td>MySQL</td>
                    </tr>
                    <tr>
                        <td>Complex JOIN</td>
                        <td>2,800 QPS</td>
                        <td>1,900 QPS</td>
                        <td>PostgreSQL</td>
                    </tr>
                    <tr>
                        <td>INSERT Heavy</td>
                        <td>12,000 QPS</td>
                        <td>14,000 QPS</td>
                        <td>MySQL</td>
                    </tr>
                    <tr>
                        <td>Mixed Workload</td>
                        <td>8,500 QPS</td>
                        <td>7,200 QPS</td>
                        <td>PostgreSQL</td>
                    </tr>
                </table>
                
                <h2>When to Choose PostgreSQL</h2>
                <p>Consider PostgreSQL when you need:</p>
                <ul>
                    <li>Advanced SQL features (window functions, CTEs, etc.)</li>
                    <li>Strong data consistency and ACID compliance</li>
                    <li>Complex analytical queries</li>
                    <li>JSON/JSONB support for semi-structured data</li>
                    <li>Extensibility with custom functions and types</li>
                </ul>
                
                <h2>When to Choose MySQL</h2>
                <p>MySQL might be better if you have:</p>
                <ul>
                    <li>Simple, high-volume web applications</li>
                    <li>Budget constraints (lower resource requirements)</li>
                    <li>Existing MySQL expertise in your team</li>
                    <li>Need for proven replication solutions</li>
                </ul>
                
                <h2>Optimization Tips for Both</h2>
                <p>Regardless of your choice, these optimization principles apply:</p>
                
                <blockquote>
                    "The database you choose matters less than how well you optimize it for your specific workload."
                </blockquote>
                
                <ol>
                    <li>Profile your actual workload, not synthetic benchmarks</li>
                    <li>Implement proper indexing strategies</li>
                    <li>Configure memory settings appropriately</li>
                    <li>Monitor and analyze slow queries regularly</li>
                    <li>Use connection pooling effectively</li>
                </ol>
                
                <h2>Conclusion</h2>
                <p>Both PostgreSQL and MySQL are excellent choices, and the "winner" depends entirely on your specific use case. The key is to understand your workload characteristics and optimize accordingly.</p>
                
                <p>At Datapace, our AI-powered platform works with both PostgreSQL and MySQL, providing tailored optimization recommendations based on your specific database and workload patterns.</p>
            `,
            category: "tutorials",
            author: {
                name: "Alex Kim",
                title: "Senior Database Engineer",
                avatar: "https://randomuser.me/api/portraits/men/72.jpg"
            },
            date: "2025-01-15",
            readTime: "10 min read",
            image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2134&q=80"
        },
        {
            id: 4,
            title: "Case Study: How We Reduced Database Costs by 60% for a SaaS Startup",
            slug: "database-cost-reduction-case-study",
            excerpt: "A detailed breakdown of how strategic database optimization helped a growing SaaS company dramatically reduce their infrastructure costs while improving performance.",
            content: `
                <p>When TechFlow, a rapidly growing SaaS startup, came to us, they were facing a critical problem: their database costs were growing faster than their revenue, threatening their path to profitability.</p>
                
                <h2>The Challenge</h2>
                <p>TechFlow's challenges were typical of many fast-growing startups:</p>
                <ul>
                    <li>Database costs increasing 40% month-over-month</li>
                    <li>Slow query response times affecting user experience</li>
                    <li>Frequent database timeouts during peak hours</li>
                    <li>No dedicated database expertise on the team</li>
                </ul>
                
                <h3>Initial State</h3>
                <p>When we began our analysis, TechFlow was running:</p>
                <ul>
                    <li>PostgreSQL on AWS RDS with 32 CPU cores</li>
                    <li>Monthly database costs: $12,000</li>
                    <li>Average query response time: 850ms</li>
                    <li>95th percentile response time: 3.2 seconds</li>
                    <li>Database CPU utilization: 85% average</li>
                </ul>
                
                <h2>Our Optimization Approach</h2>
                <p>We implemented a systematic optimization strategy:</p>
                
                <h3>Phase 1: Query Analysis (Week 1-2)</h3>
                <p>We identified the top performance bottlenecks:</p>
                <ol>
                    <li><strong>N+1 Query Problem:</strong> The application was making hundreds of individual queries instead of using JOINs</li>
                    <li><strong>Missing Indexes:</strong> Several frequently-queried columns lacked proper indexes</li>
                    <li><strong>Inefficient Aggregations:</strong> Complex reporting queries were scanning entire tables</li>
                </ol>
                
                <h3>Phase 2: Index Optimization (Week 3)</h3>
                <p>We implemented strategic indexing:</p>
                <pre><code>-- Example of composite index that improved query performance by 95%
CREATE INDEX CONCURRENTLY idx_user_events_timestamp_type 
ON user_events (user_id, event_timestamp, event_type);</code></pre>
                
                <h3>Phase 3: Query Refactoring (Week 4-5)</h3>
                <p>We rewrote the most problematic queries:</p>
                <blockquote>
                    "A single query optimization reduced database load by 30% and improved response time from 2.1 seconds to 180ms."
                </blockquote>
                
                <h3>Phase 4: Architecture Changes (Week 6-7)</h3>
                <p>We implemented several architectural improvements:</p>
                <ul>
                    <li>Read replicas for reporting queries</li>
                    <li>Connection pooling with PgBouncer</li>
                    <li>Caching layer for frequently accessed data</li>
                    <li>Database partitioning for time-series data</li>
                </ul>
                
                <h2>Results</h2>
                <p>After 7 weeks of optimization work, the results were remarkable:</p>
                
                <table>
                    <tr>
                        <th>Metric</th>
                        <th>Before</th>
                        <th>After</th>
                        <th>Improvement</th>
                    </tr>
                    <tr>
                        <td>Monthly Database Costs</td>
                        <td>$12,000</td>
                        <td>$4,800</td>
                        <td>60% reduction</td>
                    </tr>
                    <tr>
                        <td>Average Query Time</td>
                        <td>850ms</td>
                        <td>120ms</td>
                        <td>86% improvement</td>
                    </tr>
                    <tr>
                        <td>95th Percentile</td>
                        <td>3.2s</td>
                        <td>450ms</td>
                        <td>86% improvement</td>
                    </tr>
                    <tr>
                        <td>CPU Utilization</td>
                        <td>85%</td>
                        <td>35%</td>
                        <td>50% reduction</td>
                    </tr>
                </table>
                
                <h2>Key Lessons Learned</h2>
                <p>This project taught us several important lessons:</p>
                
                <ol>
                    <li><strong>Measure First:</strong> You can't optimize what you don't measure</li>
                    <li><strong>Low-Hanging Fruit:</strong> Often, simple index additions provide the biggest wins</li>
                    <li><strong>Application-Level Changes:</strong> Sometimes the database isn't the problem - it's how the application uses it</li>
                    <li><strong>Monitoring is Critical:</strong> Continuous monitoring prevents regression</li>
                </ol>
                
                <h2>Long-term Impact</h2>
                <p>Six months later, TechFlow continues to benefit from these optimizations:</p>
                <ul>
                    <li>Database costs remain stable despite 3x user growth</li>
                    <li>Application performance has improved user satisfaction scores by 40%</li>
                    <li>The team now has the tools and knowledge to prevent future issues</li>
                </ul>
                
                <h2>Conclusion</h2>
                <p>This case study demonstrates that with the right approach, significant database cost reductions are possible while simultaneously improving performance. The key is having the expertise to identify bottlenecks and implement targeted solutions.</p>
                
                <p>At Datapace, we're building AI-powered tools to democratize this level of database expertise, making it accessible to every development team.</p>
            `,
            category: "case-studies",
            author: {
                name: "David Park",
                title: "Performance Optimization Consultant",
                avatar: "https://randomuser.me/api/portraits/men/21.jpg"
            },
            date: "2025-01-10",
            readTime: "12 min read",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80"
        }
    ];
    
    let currentFilter = 'all';
    let articlesPerPage = 6;
    let currentPage = 1;
    
    // Utility functions
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    function createArticleCard(article, isFeatured = false) {
        const cardClass = isFeatured ? 'featured-article-card' : 'article-card';
        const imageHeight = isFeatured ? '300' : '200';
        const contentClass = isFeatured ? 'featured-article-content' : 'article-content';
        const titleClass = isFeatured ? 'featured-article-title' : 'article-title';
        const excerptClass = isFeatured ? 'featured-article-excerpt' : 'article-excerpt';
        const metaClass = isFeatured ? 'featured-article-meta' : 'article-meta';
        const categoryClass = isFeatured ? 'featured-article-category' : 'article-category';
        
        return `
            <article class="${cardClass}" data-category="${article.category}">
                <img src="${article.image}" alt="${article.title}" class="${isFeatured ? 'featured-article-image' : 'article-image'}" loading="lazy" width="800" height="${imageHeight}">
                <div class="${contentClass}">
                    <div class="${metaClass}">
                        <span class="${categoryClass}">${article.category}</span>
                        <span class="article-date">${formatDate(article.date)}</span>
                    </div>
                    <h3 class="${titleClass}">
                        <a href="#" onclick="openArticleModal('${article.slug}'); return false;">${article.title}</a>
                    </h3>
                    <p class="${excerptClass}">${article.excerpt}</p>
                    ${isFeatured ? `
                        <div class="featured-article-author">
                            <img src="${article.author.avatar}" alt="${article.author.name}" class="author-avatar" loading="lazy" width="40" height="40">
                            <div class="author-info">
                                <div class="author-name">${article.author.name}</div>
                                <div class="author-title">${article.author.title}</div>
                            </div>
                        </div>
                    ` : `
                        <div class="article-footer">
                            <span class="read-time">${article.readTime}</span>
                            <a href="#" onclick="openArticleModal('${article.slug}'); return false;" class="read-more">Read More</a>
                        </div>
                    `}
                </div>
            </article>
        `;
    }
    
    function filterArticles(category) {
        return category === 'all' 
            ? blogArticles.filter(article => !article.featured)
            : blogArticles.filter(article => article.category === category && !article.featured);
    }
    
    function renderFeaturedArticle() {
        const featuredContainer = document.getElementById('featured-article');
        if (!featuredContainer) return;
        
        const featuredArticle = blogArticles.find(article => article.featured);
        if (featuredArticle) {
            featuredContainer.innerHTML = createArticleCard(featuredArticle, true);
        }
    }
    
    function renderArticles() {
        const articlesGrid = document.getElementById('articles-grid');
        if (!articlesGrid) return;
        
        const filteredArticles = filterArticles(currentFilter);
        const startIndex = (currentPage - 1) * articlesPerPage;
        const endIndex = startIndex + articlesPerPage;
        const articlesToShow = filteredArticles.slice(0, endIndex);
        
        if (currentPage === 1) {
            articlesGrid.innerHTML = articlesToShow.map(article => createArticleCard(article)).join('');
        } else {
            // Append new articles for "Load More" functionality
            const newArticles = filteredArticles.slice(startIndex, endIndex);
            articlesGrid.innerHTML += newArticles.map(article => createArticleCard(article)).join('');
        }
        
        // Update load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            if (endIndex >= filteredArticles.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
            }
        }
    }
    
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update filter and reset pagination
                currentFilter = btn.dataset.category;
                currentPage = 1;
                
                // Re-render articles
                renderArticles();
            });
        });
    }
    
    function setupLoadMore() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                currentPage++;
                renderArticles();
            });
        }
    }
    
    function setupNewsletter() {
        const newsletterForm = document.querySelector('.newsletter-form');
        const emailInput = document.getElementById('newsletter-email');
        const submitBtn = document.getElementById('newsletter-submit');
        
        if (newsletterForm && emailInput && submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = emailInput.value.trim();
                
                if (!email) {
                    alert('Please enter your email address.');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                // Simulate newsletter signup
                submitBtn.textContent = 'Subscribing...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Thank you for subscribing! You\'ll receive our latest database insights in your inbox.');
                    emailInput.value = '';
                    submitBtn.textContent = 'Subscribe';
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Initialize blog functionality
    function initBlog() {
        renderFeaturedArticle();
        renderArticles();
        setupFilters();
        setupLoadMore();
        setupNewsletter();
        
        // Add smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Enhanced navigation scroll effect (from main site)
    function setupNavigation() {
        const nav = document.querySelector('nav');
        const handleScroll = throttle(() => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }, 16);
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initBlog();
        setupNavigation();
        
        // Add loading states for better UX
        const articlesGrid = document.getElementById('articles-grid');
        if (articlesGrid) {
            articlesGrid.classList.add('loading');
            setTimeout(() => {
                articlesGrid.classList.remove('loading');
            }, 500);
        }
    });
    
    // Article Modal Functions
    function openArticleModal(slug) {
        const article = blogArticles.find(a => a.slug === slug);
        if (!article) return;
        
        createModal(article);
    }
    
    function createModal(article) {
        // Remove existing modal if any
        const existingModal = document.getElementById('article-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'article-modal';
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="article-modal-overlay" onclick="closeArticleModal()"></div>
            <div class="article-modal-content">
                <button class="article-modal-close" onclick="closeArticleModal()" aria-label="Close article">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
                
                <div class="article-modal-header">
                    <div class="article-meta">
                        <span class="article-category">${article.category}</span>
                        <span class="article-date">${formatDate(article.date)}</span>
                        <span class="read-time">${article.readTime}</span>
                    </div>
                    <h1>${article.title}</h1>
                    <div class="featured-article-author">
                        <img src="${article.author.avatar}" alt="${article.author.name}" class="author-avatar" loading="lazy" width="50" height="50">
                        <div class="author-info">
                            <div class="author-name">${article.author.name}</div>
                            <div class="author-title">${article.author.title}</div>
                        </div>
                    </div>
                </div>
                
                <div class="article-modal-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                
                <div class="article-body">
                    ${article.content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Focus trap and accessibility
        modal.focus();
        
        // Add keyboard event listener for ESC key
        document.addEventListener('keydown', handleModalKeydown);
    }
    
    function closeArticleModal() {
        const modal = document.getElementById('article-modal');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleModalKeydown);
        }
    }
    
    function handleModalKeydown(e) {
        if (e.key === 'Escape') {
            closeArticleModal();
        }
    }
    
    // Make functions globally available
    window.openArticleModal = openArticleModal;
    window.closeArticleModal = closeArticleModal;

    // Export functions for potential external use
    window.blogAPI = {
        addArticle: function(article) {
            blogArticles.unshift(article);
            renderFeaturedArticle();
            renderArticles();
        },
        
        getArticles: function() {
            return blogArticles;
        },
        
        getArticleBySlug: function(slug) {
            return blogArticles.find(article => article.slug === slug);
        }
    };
    
})();