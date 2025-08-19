# Stop Guessing, Start Measuring: A Developer's Guide to `pg_stat_statements` in Supabase

In our last guide, we showed you how to fix the five most common SQL mistakes using `EXPLAIN ANALYZE`. It’s the perfect microscope for inspecting a single, slow query.

But in a real-world application, you have hundreds of queries. How do you find the one that's doing the most damage? You could wait for users to complain, but that's like waiting for the smoke alarm to go off to start cooking.

There's a better way. This guide will introduce you to `pg_stat_statements`, the most important performance monitoring tool in PostgreSQL. We'll show you how to use it to stop guessing and start making data-driven optimizations.

> **TL;DR:**
>
> 1.  Enable the `pg_stat_statements` extension in your Supabase dashboard.
> 2.  Use our SQL queries to find your most expensive queries by "Total Pain" (`total_exec_time`) and average latency (`mean_exec_time`).
> 3.  Combine this with `EXPLAIN ANALYZE` to create a complete, repeatable optimization workflow.

-----

## What is `pg_stat_statements`? 🕵️

`pg_stat_statements` is an official PostgreSQL extension that acts like a profiler for your database. It tracks execution statistics for every query, aggregates them, and gives you a single view to find your worst offenders.

Think of it like a **call summary for your database**. It tells you:

  * **Which queries run most often** (total calls).
  * **Which queries consume the most cumulative time** (your application's **"Total Pain"**).
  * **Which queries are slowest on average** (your application's average latency).

-----

## Step 1: Enabling `pg_stat_statements` in Supabase

First, you need to switch it on. Supabase makes this a one-click process.

1.  Navigate to your project's **Dashboard**.
2.  Go to the **Database** section.
3.  Click on **Extensions**.
4.  Search for `pg_stat_statements` and click the toggle to **enable it**.

That's it\! The extension will now start collecting data. Let your application run for at least an hour to gather meaningful statistics before you move on to the next step.

-----

## Step 2: Finding Your Worst Offenders 📈

You can now query the `pg_stat_statements` view from the Supabase SQL Editor. Here are the two most important queries you'll need.

### Query \#1: The "Death by a Thousand Cuts" Finder (Highest Total Pain)

This query finds the queries that are the biggest overall drain on your database. These are often individually fast queries that run thousands of times, making them your top priority.

```sql
SELECT
  -- Human-readable total time
  (total_exec_time / 1000 / 60) as total_minutes,
  -- Average time in milliseconds
  mean_exec_time as avg_ms,
  calls,
  query
FROM
  pg_stat_statements
ORDER BY
  total_exec_time DESC
LIMIT 10;
```

**How to read the results:** Look for queries with a high `total_minutes`. Even if `avg_ms` is low, a high number of `calls` can make it your \#1 problem. These are your top optimization targets.

### Query \#2: The "Frustration Finder" (Highest Average Latency)

This query finds the slowest individual queries. These are likely causing noticeable delays on specific pages or API endpoints.

```sql
SELECT
  mean_exec_time as avg_ms,
  calls,
  query
FROM
  pg_stat_statements
ORDER BY
  mean_exec_time DESC
LIMIT 10;
```

**How to read the results:** Any query with an `avg_ms` in the hundreds or thousands is a major red flag that likely points to a missing index or a complex, unoptimized `JOIN`.

-----

## Step 3: Your Complete Optimization Workflow

This is how you turn insight into action.

1.  **Discover:** Run the "Total Pain" query to find your most resource-intensive query.
2.  **Diagnose:** Paste that query into a new tab and run `EXPLAIN ANALYZE` on it.
3.  **Fix:** Analyze the plan for red flags like a `"Seq Scan"` and apply the right fix (usually `CREATE INDEX`).
4.  **Verify:** After applying the fix, reset the stats by running `SELECT pg_stat_statements_reset();`. Wait a while, then re-run the "Total Pain" query. Your optimized query should have disappeared from the top of the list.

-----

## The Path to Automation 🚀

This manual workflow is incredibly powerful, but it's also **reactive**. You have to remember to perform these checks, and by the time a query hits the "Total Pain" list, it may have already impacted your users or your cloud bill.

This is the exact challenge we built Datapace to solve.

The process you just learned—identifying high-load queries with statistics and then diagnosing them with an execution plan—is precisely what Datapace **automates and does continuously**. Instead of you having to manually run queries, Datapace monitors `pg_stat_statements` and other signals for you, automatically identifies the most critical performance drains, and provides the recommended fix before it becomes a major problem.

-----

## Conclusion

Guesswork is the enemy of performance. By using `pg_stat_statements` to **identify what is slow** and `EXPLAIN ANALYZE` to **understand why it's slow**, you adopt a data-driven approach that is essential for scaling an application.

Enabling this extension moves you from a reactive firefighter to a proactive performance engineer. It's one of the most impactful habits you can build for the long-term health of your Supabase application and is the foundation for a truly scalable and efficient system.