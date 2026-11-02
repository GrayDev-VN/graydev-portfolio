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

Blog posts live in [`content/blog/`](./content/blog/) with one directory per article and a separate Markdown file for each language:

```text
content/blog/java-core/en.md
content/blog/java-core/vi.md
```

Copy [`content/blog/_template/`](./content/blog/_template/) to `content/blog/your-post-slug/`. Write each translation directly in its Markdown body. The directory name is the stable URL slug (`/blog/your-post-slug/`); changing a title or category does not change the URL. Existing article URLs have been preserved, including `backend-engineering-roadmap` for the Java Collections article.

Required front matter: `title`, `description`, `category`, `tags`, `status`, and `publishedAt`. Categories are `backend`, `data-engineering`, and `ai`; their translated labels are defined in `src/features/blog/types.ts`. Quote dates using `YYYY-MM-DD`. Optional fields are `updatedAt` (not before publication) and `cover` (a path under `/blog/`). Put images in `public/blog/your-post-slug/` and reference them from Markdown.

Use `##` for sections and `###` for subsections; the page already supplies the `#` article title. Tables, task lists, strikethrough, and fenced code blocks are supported. Reading time is estimated automatically for each language. The table of contents and heading anchors use the same Markdown parser and handle duplicate headings.

Set `status: "draft"` while writing, then change it to `status: "published"` and commit/push to publish. Drafts never appear in public pages, even in development. To preview a draft locally, temporarily set it to published and revert that status before committing. A single-language article is supported: the other locale displays the available translation with a notice. Both published translations must share category and publication date. A published future date does not schedule publication; deployment publishes it immediately.

The server validates all content and reports the file and invalid field on failure. Article pages are generated during the build; publishing or editing content requires a new deployment. The index receives metadata only, and Markdown bodies render on the server. Run `npm run test:blog`, `npx tsc --noEmit`, and `npm run build` before publishing. The content tests require Node.js 22.18+ or Node.js 24+ for native TypeScript support.

No database or in-site admin login is used. Only people with permission to merge or deploy changes to this repository can publish posts; readers can only view the public blog.

## LeetCode blog notes

LeetCode write-ups live in the existing blog. The first article is at /blog/two-pointers-two-sum-ii/, with English and Vietnamese Markdown in content/blog/two-pointers-two-sum-ii/. Use the LeetCode and Two Pointers tags to find it. Edit the same files to expand a solution and add a quoted updatedAt date. There is no separate account connection or activity dashboard.

## Project pages and videos

Each project in `src/data/portfolioData.ts` has a detail page at `/projects/<id>`; FlowAssist keeps its existing case study. The project section links to the full collection without adding a navigation item.

Add actual recordings to `PROJECT_VIDEOS` in `src/data/projectVideos.ts`, keyed by the project ID. Each entry needs a unique `id`, `title`, optional `titleVi`, and `kind` (`overview` or `tutorial`). For YouTube, set `provider: "youtube"` and `videoId` to the ID from the real video URL. For uploaded recordings, put the file in `public/videos/` and set `provider: "file"`, `src: "/videos/your-file.mp4"` (or `.webm`), and optional `poster`. File videos support `captions: [{ src: "/videos/your-file.vi.vtt", language: "vi", label: "Tiếng Việt" }]`.

Videos do not autoplay. YouTube embeds load only after a visitor clicks. The video section and watch button remain hidden until a real recording is configured; no sample videos are published. Commit and redeploy after updating the configuration.

## Backend & AI jobs

Visit `/jobs/` from the Jobs navigation item. The board supports English/Vietnamese, keyword and skill search, career path, level, work arrangement and source filters. It only publishes active, explicitly classified early-career jobs in Ho Chi Minh City.

The collection pipeline supports public employer APIs, authorized JSON feeds and HTML `JobPosting` extraction, with bounded discovery, retries and PostgreSQL persistence. **SmartRecruiters (Bosch Group) and Lever (ShopBack) are enabled through their documented public posting APIs.** The five original job-board sources remain disabled pending suitable access. Only jobs matching the HCM, career and early-career filters appear publicly; a successful source run can produce zero matches. See [live data verification](./docs/jobs-live-data.md), [source research](./docs/job-sources.md) and [collection setup](./docs/jobs-collection.md). CV upload and matching are not implemented.

For local PostgreSQL development, run `npm run jobs:local:setup`, `npm run jobs:local:up`, `npm run jobs:db:migrate`, `npm run jobs:collect`, then `npm run dev`. Standard dev/start commands load private `.env.jobs.local` when it exists. `npm run jobs:local:activate` also enables database access for an already running Next.js dev server by updating only the job settings in `.env.local`; unrelated settings are preserved. `npm run test:jobs:live` verifies actual database jobs render on the local UI.

The snapshot preview remains available with `JOBS_STORAGE=snapshot`. Operators can import a complete authorized snapshot with `npm run jobs:import -- <file.json>`; it replaces `data/jobs.json`, not PostgreSQL rows. See [docs/jobs.md](./docs/jobs.md) for the original snapshot schema.

Run `npm test` for blog, normalization, PostgreSQL/PGlite, collector, HTML parser and pipeline tests; also run `npm run lint`, `npx tsc --noEmit` and a production build. `npm run test:jobs:postgres` additionally tests the real local PostgreSQL server in a temporary isolated schema. `npm run test:smoke` checks a running local production web server.

## Hosting

Import the GitHub repository into Vercel and add the Resend environment variables above. Vercel Hobby is generally free for personal, non-commercial projects; check Vercel's current plan terms for your use case. Vercel can automatically build and deploy each push, so GitHub Actions are optional (they can still run checks).

The app is configured for a Next.js server deployment rather than static export because the contact form needs a server-side API route.
