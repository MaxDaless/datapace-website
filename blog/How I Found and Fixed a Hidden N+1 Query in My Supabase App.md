# How I Found and Fixed a Hidden N+1 Query in My Supabase App (A Case Study)

My app felt slow.

It wasn't one specific page; it was a general sluggishness, especially on pages displaying lists of data. The weird part? No single query was taking five seconds. It felt like a death by a thousand cuts, and I had no idea where to start looking.

This is the story of how I diagnosed and fixed a classic **N+1 query problem**. It's a subtle but devastating performance bug that doesn't live in a single line of SQL, but in your application code. Here's the step-by-step process I used to find and fix it.

> **TL;DR:**
>
> 1.  **Symptom:** Used `pg_stat_statements` to discover a simple, fast query being called an enormous number of times—the classic signature of an N+1 problem.
> 2.  **Diagnosis:** Traced the query back to a `map()` loop in my application code that was making a separate database call for each item in a list.
> 3.  **Fix:** Refactored the code to fetch all the data in a single round trip using either the Supabase client's nested selects or a more performant RPC function with a `JOIN`.

-----

## Step 1: The Symptom - Finding the "Thousand Cuts" 🕵️

My first instinct led me to `pg_stat_statements`. I ran my favorite "Total Pain" query to see which queries were consuming the most database time *overall*.

```sql
SELECT
  (total_exec_time / 1000 / 60) as total_minutes,
  mean_exec_time as avg_ms,
  calls,
  query
FROM
  pg_stat_statements
ORDER BY
  total_exec_time DESC
LIMIT 5;
```

The result was shocking. The \#1 query wasn't some complex analytics query. It was this:

```text
total_minutes   avg_ms   calls         query
--------------- -------- ------------- ----------------------------------------------------
15.4            0.85     1,087,058     SELECT "name" FROM "public"."users" WHERE "id" = $1
```

This was the clue. The query was incredibly fast on average (**\<1 ms**), but it had been called **over a million times**. This is the classic signature of an N+1 problem.

-----

## Step 2: The "Aha\!" Moment - Finding the Loop in the Code

The database told me *what* was happening, but not *where*. I searched my application code for where I was fetching a user's name by their ID and found it buried in my code for rendering a list of blog posts.

#### The "Before" Code (The N+1 Mistake):

```javascript
// 1. Fetch the list of the 50 most recent posts (The "1" Query)
const { data: posts, error } = await supabase
  .from('posts')
  .select('id, title, author_id')
  .limit(50);

// 2. Loop through the posts to get each author's name
const postsWithAuthors = await Promise.all(
  posts.map(async (post) => {
    // THIS RUNS 50 TIMES! (The "N" Queries)
    const { data: author } = await supabase
      .from('users')
      .select('name')
      .eq('id', post.author_id)
      .single();
    
    return { ...post, author_name: author.name };
  })
);
```

There it was. For a page with 50 posts, my code was making **51 separate requests** to the database. This cascade of network latency was the source of the sluggishness.

-----

## Step 3: The Fix - Getting Everything in a Single Trip

The fix is to get all the required information in a single query. Here are two ways to do it.

#### Option A: The Easy Fix (Supabase Client)

The Supabase client has a beautiful syntax for fetching related data. This is often the quickest and cleanest way to solve an N+1 problem.

```javascript
// The easy, client-side fix
const { data: postsWithAuthors, error } = await supabase
  .from('posts')
  .select(`
    id,
    title,
    users ( name )
  `)
  .limit(50);
```

#### Option B: The Pro Fix (RPC Function)

For maximum performance on critical API endpoints, a dedicated database function (RPC) with a manual `JOIN` is unbeatable.

First, create the function in the Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION get_posts_with_authors()
RETURNS TABLE (id int, title text, author_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.title, u.name as author_name
  FROM posts p
  JOIN users u ON p.author_id = u.id
  ORDER BY p.created_at DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
```

Then, call it with a single line in your application code:

```javascript
// The most performant fix
const { data: postsWithAuthors, error } = await supabase
  .rpc('get_posts_with_authors');
```

The result was immediate. Page load time dropped from several seconds to **under 200 milliseconds.**

-----

## The Challenge: Seeing Beyond the Database

This manual workflow works, but it's **reactive and time-consuming**. The database stats showed me the *symptom*, but finding the root cause required a manual hunt through my application code.

This is exactly why **Datapace** is built to be more than just a database tool. Traditional performance platforms stop at the database layer. Datapace is designed to **bridge the gap between your database and your application code.**

Our platform not only flags the suspicious query pattern from `pg_stat_statements` but can also use application-level tracing to **pinpoint the exact line of code** generating the N+1 loop. Instead of a manual hunt, you get a direct alert:

> *"N+1 pattern detected in `api/posts.js`. The query fetching `users` is being called inside this `.map()` function."*

This turns a multi-hour investigation into a proactive, specific notification.

-----

## Conclusion: Performance is an Application-Level Problem

Sometimes, the biggest bottlenecks aren't in a single slow query, but in how your application code interacts with the database. A perfectly optimized query called in a loop can be more damaging than a complex query called once.

Using `pg_stat_statements` to spot the symptom is a great skill, but a tool that automatically connects that symptom to the root cause in your code is what allows you to build and scale with confidence.