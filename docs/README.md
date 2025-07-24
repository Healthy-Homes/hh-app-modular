# Healthy Homes Practitioner App (Modular Rebuild)

This project rebuilds the Healthy Homes field assessment tool using a modular file structure for clarity, debugging, and scalability.

## Features
- Modular JS (checklist, consent, SDOH, i18n)
- CSV-driven form content
- Bilingual support
- Scalable for shelter.health migration

## Folder Structure
See `docs/data-schema.md` for CSV format. Expand modules via `js/` and `data/`.

## Getting Started
Open `index.html` in your browser. Make edits in `data/`, `lang/`, or `js/` as needed.

## To Do
- Add export logic
- Add IndexedDB for offline use
- Enhance language toggle
