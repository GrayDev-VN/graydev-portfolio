# Gray Nguyen Portfolio

Personal portfolio built with Next.js App Router. The site includes a bilingual EN/VN interface, a contact form delivered by Resend, and a Markdown-based blog.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example` and configure the Resend variables before testing contact form delivery.

## Contact email setup

The contact form uses a server-side Next.js route and Resend. It does not store submissions in a database.

1. Create a Resend account and verify a domain you control.
2. Create an API key and set `RESEND_API_KEY`.
3. Set `CONTACT_TO_EMAIL` to the inbox that should receive messages.
4. Set `CONTACT_FROM_EMAIL` to a sender address on the verified domain, for example `Gray Nguyen <portfolio@yourdomain.com>`.
5. Add all three variables to the Vercel project settings for Preview and Production, then redeploy.

Never expose `RESEND_API_KEY` as a `NEXT_PUBLIC_` variable or commit it to Git. Without these settings, the form reports that delivery is not configured instead of claiming a message was sent.

## Blog authoring

Blog posts live in [`content/blog/`](./content/blog/) as Markdown files with front matter. Copy [`content/blog/_template.md`](./content/blog/_template.md), fill in the English and Vietnamese fields, and add the Markdown body. Commit and push the new file to publish it.

No database or in-site admin login is used. Only people with permission to merge or deploy changes to this repository can publish posts; readers can only view the public blog.

## Deploying

Import the GitHub repository into Vercel and add the Resend environment variables above. Vercel Hobby is generally free for personal, non-commercial projects; check Vercel's current plan terms for your use case. Vercel can automatically build and deploy each push, so GitHub Actions are optional (they can still run checks).

The app is configured for a Next.js server deployment rather than static export because the contact form needs a server-side API route.
