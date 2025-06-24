# I-983 Templates

This directory contains the I-983 form templates that employees can download.

## Files

- `i983-empty-template.pdf` - Empty I-983 form template for employees to fill out
- `i983-sample-template.pdf` - Sample filled I-983 form for reference

## Setup

1. Place the actual PDF files in this directory
2. The files will be automatically served via the API endpoints:
   - `GET /api/documents/templates/i983-empty`
   - `GET /api/documents/templates/i983-sample`

## Note

If the template files are not present, the API will return a 404 error with a message asking to contact HR. 