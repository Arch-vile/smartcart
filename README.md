# Smartcart

Better suggestions for KRuoka grocery list items.

## High-level architecture

The gist:
- "capture" Scheduled run to capture the data of previous orders and to store to db
- "analysis" Scheduled run to calculate the suggestions.
- "shopify" A manual trigger (a form submit e.g.) to trigger adding suggested items to list (giving the list identification as argument)

### Capture
A browser automation to collect the data of previous orders. The data is stored to a database.

### Analysis
A scheduled run to calculate the data needed for the suggestions. The data is stored to a database.

### Shopify
A manual trigger to determine the suggestions and to add them to the list. Based on the analysis data and the delivery date of the order being made.

In POC we will just respond with a http page wit the suggestions. 

## The /bookmarklet
Older implemention based on the bookmarklet approach. I ditched this because it would become too complex.

