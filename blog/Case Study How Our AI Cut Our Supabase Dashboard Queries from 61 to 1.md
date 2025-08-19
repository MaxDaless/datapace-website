# Case Study: How Our AI Cut Our Supabase Dashboard Queries from 61 to 1

Sometimes, the most dangerous performance problems aren't the ones you can see.

It wasn't a crash or a major outage. It was a slow, creeping decline in our user dashboard's performance. At Datapace, we're not just building a performance tool; we're using it every day to optimize our own applications. And recently, our own AI had to save us from ourselves.

We knew the problem was the database, but our manual checks were mystifying. `EXPLAIN ANALYZE` on individual queries showed they were all reasonably fast. There was no single "slow query" to blame. This is the story of how our AI diagnosed a severe N+1 query storm and, with a single recommendation, cut the dashboard's query load by over 98%.

> **TL;DR:**
>
> 1.  **The Problem:** Our user dashboard was making **61 separate database queries** to load a list of 20 projects, causing severe performance issues that were invisible to standard query analysis.
> 2.  **The Diagnosis:** The Datapace AI analyzed the application's query traffic and automatically identified the N+1 anti-pattern, pinpointing the cascade of redundant queries.
> 3.  **The Fix:** We implemented the AI's recommended SQL function, which used `JOINs` and a `LATERAL` subquery to gather all required data in a **single query**.
> 4.  **The Result:** Page load time dropped from **2.8 seconds to 150 milliseconds**, and database CPU usage fell by 40%.

-----

## The "Before": A Death by 61 Database Trips

The dashboard was designed to show a list of projects with their name, the most recent task, the project owner, and a count of active members.

Frustrated by manual checks, we let the Datapace AI analyze the application's query traffic. It surfaced the root cause in under an hour:

Here's what was happening every time a user loaded their dashboard with 20 projects:

#### The "1" Query:

A single query to fetch the user's 20 projects.

```javascript
const { data: projects } = await supabase
  .from('projects')
  .select('*')
  .eq('user_id', userId);
```

#### The "N" Queries:

Then, for **each** of those 20 projects, our code made **three more queries** inside a loop:

1.  One query to get the latest task.
2.  One query to get the project owner's name.
3.  One query to count the active members.

The math was brutal: **1 + (20 Projects × 3 Queries/Project) = 61 Queries.**

Our app was slow because it was making 61 separate round trips to the database to render a single page. This cascade was invisible to basic monitoring but was the undeniable source of our performance issues.

-----

## The "After": The AI's Recommendation

The Datapace AI didn't just identify the problem; it provided the solution. It generated an optimized SQL query for a Supabase RPC function that could gather all the data in one efficient trip.

The recommendation used `JOINs` to fetch the owner's name and a `LATERAL` subquery—a powerful Postgres feature perfect for "get the top-N-per-group" problems like finding the most recent task for each project.

#### The AI-Recommended SQL:

```sql
-- This function gets all required data in one query
SELECT
  p.id,
  p.name,
  u.full_name as owner_name,
  tasks.task_name as latest_task,
  (SELECT COUNT(m.id) FROM members m WHERE m.project_id = p.id) as active_members
FROM
  projects p
JOIN
  users u ON p.owner_id = u.id
LEFT JOIN LATERAL (
  SELECT t.name as task_name
  FROM tasks t
  WHERE t.project_id = p.id
  ORDER BY t.created_at DESC
  LIMIT 1
) tasks ON true
WHERE
  p.user_id = 'some-user-id';
```

Our team implemented this in a Supabase function and replaced the 61 queries with a single RPC call.

```javascript
// One query to rule them all
const { data: dashboardData } = await supabase
  .rpc('get_dashboard_projects');
```

-----

## The Results: A 60x Improvement 🚀

The impact was immediate and dramatic.

  * **Query Count:** Dropped from **61 to 1** per dashboard load.
  * **Page Load Time:** Decreased from **2.8 seconds to 150 milliseconds**.
  * **Database CPU:** Average utilization during peak hours was **reduced by 40%**, allowing us to downgrade our instance for significant cost savings.

-----

## Conclusion: Seeing the Forest for the Trees

The most dangerous performance issues aren't always in a single slow query; they often hide in the patterns *between* your application code and your database. A human developer using `EXPLAIN ANALYZE` on any of the 61 individual queries would have seen a "fast" result, completely missing the larger storm of inefficiency.

This is where AI-driven observability shines. It can analyze thousands of queries in context, identify wasteful application-level patterns like the N+1 problem, and provide a holistic, actionable solution. By automating this deep analysis, we were able to find and fix a problem that was slowing down our app, frustrating our users, and quietly draining our resources.