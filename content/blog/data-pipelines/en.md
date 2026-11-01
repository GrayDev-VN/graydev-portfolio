---
title: A first look at reliable data pipelines
description: >-
  A practical checklist for moving data from raw files to something a team can
  trust.
category: data-engineering
tags:
  - Data Engineering
  - ETL
  - Data Quality
status: published
publishedAt: '2026-10-26'
---
When I started learning data engineering, I thought a pipeline was simply a sequence of steps: read data, transform it, and write the result. A useful pipeline also needs to be rerunnable, catch bad data, and explain where its output came from.

## Start with the raw data

Keep an unchanged copy of incoming data before applying transformations. A raw layer helps with lineage and makes it possible to replay a pipeline when transformation logic changes. Record ingestion time and source information as well.

## Validate before trusting

Check the schema, identifiers, required values, and business constraints. A pipeline that completes successfully can still produce incorrect data. Validation should make failures visible when data does not meet expectations.

## Make reruns safe

Processing the same interval twice should not create duplicate records or surprising results. Stable keys, upserts, and repeatable transformations make retries easier to reason about.

My first takeaway: reliability does not come from making a pipeline more complicated. It comes from making every step observable, testable, and safe to run again.
