# Managing careers listings

Edit `data/careers.json` to add or update openings. No HTML, JavaScript, form, or build changes are needed for a new position. Deploy the updated file with the site.

Each entry has:

- `id`: a unique, permanent lowercase slug (for example `software-engineer`). It identifies applications and creates the shareable link `careers.html#software-engineer`. Do not reuse an old ID for a different opening.
- `status`: `open` to display it, or `closed` to remove it from search and prevent opening its application through the board. Closing a position does not delete previous Netlify submissions.
- `title`, `company`, `department`, `type`, `location`, `compensation`: the labels shown to applicants. Use confirmed details; state TBD where appropriate.
- `summary`: a short description for the result card.
- `applicationPrompt`: the role-specific question above the introduction field.
- `sections`: ordered objects with a `heading` and optional `paragraphs` and `bullets` arrays. All content is plain text, not HTML.

Copy an existing entry, give it a new ID, and replace its contents. Department and opportunity-type filters are populated automatically from open positions. Search includes the descriptions and compensation. Keep valid JSON (double quotes, no trailing commas). An empty array displays a no-openings message.

## Applications

The static form in `careers.html` is registered with Netlify as `careers-application`. Every submission includes `job-id`, `position`, and `department`, plus the applicant’s details and résumé. Future jobs use these same fields. Existing submissions to the earlier `careers-sales` and `careers-photo-shoot` forms stay in those Netlify forms.

Enable Netlify form detection and deploy the page to register the shared form. Configure any desired email notifications for `careers-application` in Netlify; notification settings from the previous forms do not automatically transfer. Verify a real submission after deployment. The local Python server previews the page but does not process form POSTs.

The browser accepts PDF/DOC/DOCX résumés up to 5 MB and uses native multipart submission. Validation in the browser is a usability check, not server-side file inspection. Applicant details and selected files stay in memory per job while this page is open; reloading clears them. They are not stored in localStorage or sent until submission.

A native HTML dialog provides keyboard focus containment, Escape to close, and focus restoration. Job URLs can be shared using their hash. If the data file cannot load, the board offers retry and an email contact. JavaScript is required for search and the modal; a no-script contact fallback is provided.

Netlify setup reference: https://docs.netlify.com/manage/forms/setup/
