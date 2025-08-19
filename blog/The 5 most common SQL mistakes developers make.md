# Is your Supabase app slowing down? The 5 most common SQL mistakes developers make

You chose Supabase for a reason: it's an incredible platform that lets you build and ship applications at lightning speed. Your app was flying at first. You were querying data, setting up auth, and building features in record time. But now, a few months later, something has changed. Pages that used to load instantly are taking seconds. Your dashboard feels sluggish. Your users are starting to notice.

If this sounds familiar, you're not alone. Supabase is built on the rock-solid foundation of PostgreSQL, a database powerful enough to handle massive scale. But with great power comes the need for a little bit of know-how. Most performance problems aren't Supabase's fault; they're the result of a few common and easily fixable SQL patterns that sneak into an application as it grows.

This guide is for the developer who is a master of their front-end framework but not a database administrator (DBA). We'll break down the five most common SQL mistakes that are likely slowing down your app and show you exactly how to fix them.

## Mistake \#1: Forgetting to Add Indexes

This is, **without a doubt**, the number one cause of slow queries in any PostgreSQL database.

### What it is

When you create a table, Supabase doesn't automatically create indexes on every column. An index is a special data structure that allows the database to find rows that match a `WHERE` clause extremely quickly.

### Why it's a problem

Without an index, PostgreSQL is forced to perform a "full table scan.". This is like being asked to find a single sentence in a book by reading every single page from front to back. It works for a short book (a small table), but it becomes painfully slow for a large one.

### The Fix

Identify the columns you frequently use for filtering in your `WHERE` clauses (like `user_id`, `status`, or `email`) and add an index to them. Indexing your foreign key columns is almost always the first and most important place to start. You can do this easily in the Supabase SQL Editor.

```sql
-- Your query is slow:
SELECT * FROM orders WHERE user_id = 'some-user-id';

-- The Fix: Add an index to the user_id column.
CREATE INDEX idx_orders_user_id ON orders (user_id);
```

After adding the index, the database can use it like a book's index, instantly jumping to the right "page" without scanning the whole table. This type of missing index is exactly what Datapace is designed to detect and flag automatically, saving you the manual diagnostic time.

> A quick pro-tip: while indexes make reads much faster, they add a small overhead to every write (INSERT, UPDATE). This is why you should only index the columns you actively filter on.

## Mistake \#2: Over-fetching Data with `select *`

It’s tempting to just grab everything, but it comes at a cost.

### What it is

Using `select *` to retrieve every column from a table when you only need a few of them.

### Why it's a problem

Fetching unnecessary data consumes more database resources and increases the amount of data sent over the network. If your `posts` table has a large `content` column but you only need the `id` and `title` for a list view, you're still forcing the database to read and send that large content block for every row.

### The Fix

Be specific. Always list the exact columns you need for that particular query.

```sql
-- Don't do this if you only need the title:
SELECT * FROM posts;

-- Do this instead:
SELECT id, title, created_at FROM posts;
```

## Mistake \#3: The N+1 Query Problem

This is a subtle but deadly performance killer, especially when fetching related data.

### What it is

You execute one query to get a list of items (the "1" query), and then you loop through those items and execute a separate query for each one to get related data (the "N" queries).

### Why it's a problem

One hundred network round trips to the database will always be slower than one. If you fetch 50 posts and then make 50 more queries to fetch the author of each post, you've just created 51 separate database requests.

### The Fix

Fetch all the data you need in a single query. The Supabase client offers a convenient way to fetch related data:

```javascript
// A convenient way using the Supabase client
const { data, error } = await supabase
  .from('posts')
  .select(`
    id,
    title,
    users ( name )
  `);
```

While this is much better than a manual loop, be aware that for complex cases, it can still be less performant than a handcrafted SQL `JOIN`. For maximum performance, especially in critical API endpoints, a dedicated database function (RPC) remains the best tool:

```sql
-- The most performant fix: A single RPC call with a JOIN
SELECT
  p.id,
  p.title,
  u.name as author_name
FROM
  posts p
JOIN
  users u ON p.author_id = u.id;
```

## Mistake \#4: Ignoring Row Level Security (RLS) Performance

RLS is one of Supabase's superpowers, but your security policies are code that runs on every query.

### What it is

Writing a complex or slow function inside an RLS policy.

### Why it's a problem

Your RLS policy is attached to your query's `WHERE` clause. If the function in your policy is slow, every single query against that table will be slow. For example, if your policy calls another function or performs a complex subquery, that overhead is added to every operation.

### The Fix

Keep your RLS policies as simple and fast as possible. Prefer simple checks, and if you need to do a subquery, make sure the columns you're checking are indexed.

```sql
-- A potentially slow RLS policy with a subquery:
CREATE POLICY "Allow users to see their own organization's posts"
ON posts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM memberships
    WHERE memberships.user_id = auth.uid()
    AND memberships.org_id = posts.org_id
  )
);

-- The Fix: Ensure that memberships.user_id and memberships.org_id
-- have a composite index to make the subquery fast.
CREATE INDEX idx_memberships_user_org ON memberships (user_id, org_id);
```

## Mistake \#5: Using `LIMIT` & `OFFSET` for Deep Pagination

This is the standard way to implement pagination, but it breaks down on large datasets.

### What it is

Using `OFFSET` to skip a large number of rows for "deep" pages (e.g., page 1,000).

### Why it's a problem

When you run `LIMIT 10 OFFSET 10000`, PostgreSQL still has to fetch all 10,010 rows from the disk, count through the first 10,000, discard them, and then return the final 10. This gets progressively slower as the `OFFSET` number increases.

### The Fix

Use cursor-based pagination (also known as keyset pagination). Instead of tracking the page number, you track the value of the column you're sorting by (like `created_at`) from the last item on the previous page and ask for the "next" N items after that "cursor". This is incredibly efficient because the database can use an index to jump directly to the starting point.

```sql
-- The slow way for page 1001:
SELECT * FROM events ORDER BY created_at DESC LIMIT 10 OFFSET 10000;

-- The fast, cursor-based way:
-- (Assuming the last event from the previous page had a created_at of '2025-08-19 14:00:00')
SELECT * FROM events
WHERE created_at < '2025-08-19 14:00:00'
ORDER BY created_at DESC
LIMIT 10;
```

## How to Diagnose Your Problems: Meet `EXPLAIN ANALYZE`

You don't have to guess which of these mistakes you're making. PostgreSQL gives you a powerful diagnostic tool that you can run directly in the Supabase SQL Editor.

Simply put `EXPLAIN ANALYZE` in front of any slow query. It will return the database's query execution plan, showing you exactly what steps it took, how long each step took, and whether it used an index.

If you see the words `"Seq Scan"` (Sequential Scan), it's a huge red flag that you're missing an index. After you add an index, the plan should change to `"Index Scan,"` and the query time should drop dramatically.

## Conclusion

Supabase empowers you to build incredible things without being a database expert. But as your application grows, a little bit of database knowledge goes a long way. By avoiding these five common mistakes, you can ensure your application remains fast, scalable, and ready for whatever you throw at it.

Start indexing your foreign keys, be specific with your select statements, JOIN your related data, keep your RLS policies simple, and use cursor-based pagination. And when in doubt, let `EXPLAIN ANALYZE` be your guide.

Mastering these techniques is a **developer superpower**. As your application's complexity continues to grow, automating this detection process with specialized performance platforms is the next step to ensuring your database remains efficient at scale, freeing you up to do what you do best: build.