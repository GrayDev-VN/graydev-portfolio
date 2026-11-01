import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { analyzeMarkdown, remarkHeadingIds } from "../src/features/blog/markdown.ts";
import { getBlogPost, getBlogPosts, readBlogDirectory } from "../src/features/blog/repository.ts";
import { parsePostMetadata } from "../src/features/blog/schema.ts";

const metadata = {
  title: "Sample", description: "Description", category: "backend",
  tags: ["Java"], status: "published", publishedAt: "2026-10-31",
};

test("all five migrated articles retain their URLs and both translations", async () => {
  const posts = await getBlogPosts();
  const migratedSlugs = ["backend-basics", "backend-engineering-roadmap", "data-pipelines", "java-core", "learning-ai-systems"];
  for (const slug of migratedSlugs) assert.ok(posts.some((post) => post.slug === slug));
  for (const summary of posts.filter((post) => migratedSlugs.includes(post.slug))) {
    assert.deepEqual(summary.availableLocales, ["en", "vi"]);
    assert.ok(!("content" in summary) && !("contentVi" in summary));
    const post = await getBlogPost(summary.slug);
    assert.ok(post && post.content.length > 100 && post.contentVi.length > 100);
    for (const content of [post.content, post.contentVi]) {
      assert.ok(!/^# /m.test(content), `${post.slug} has no duplicate page title`);
      const { headings } = analyzeMarkdown(content);
      assert.ok(headings.length > 0);
      assert.equal(new Set(headings.map(({ id }) => id)).size, headings.length);
    }
  }
  assert.equal(await getBlogPost("unknown-post"), null);
});

test("TOC and rendered heading IDs agree for code fences, formatting, and duplicate headings", async () => {
  const markdown = "## Đọc **Java**\n\n```md\n## Fake heading\n```\n\n## Đọc Java\n\n### [A link](https://example.com) and `code`\n\n## Đọc Java 2";
  const { headings } = analyzeMarkdown(markdown);
  assert.deepEqual(headings.map(({ id }) => id), ["doc-java", "doc-java-2", "a-link-and-code", "doc-java-2-2"]);
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkHeadingIds);
  const tree = await processor.run(processor.parse(markdown));
  const ids = tree.children.filter((node) => node.type === "heading").map((node) => node.data?.hProperties?.id);
  assert.deepEqual(ids, headings.map(({ id }) => id));
});

test("GFM tables parse and reading time follows the actual body", () => {
  const tree = unified().use(remarkParse).use(remarkGfm).parse("| A | B |\n|---|---|\n| 1 | 2 |");
  assert.equal(tree.children[0].type, "table");
  assert.equal(analyzeMarkdown("word ".repeat(401)).readingMinutes, 3);
});

test("metadata validation identifies the file and invalid dates or fields", () => {
  for (const changes of [
    { publishedAt: "2026-02-30" }, { publishedAt: "yesterday" },
    { status: "public" }, { title: "" }, { tags: [42] },
    { category: "constructor" }, { updatedAt: "2026-10-01" },
  ]) {
    assert.throws(() => parsePostMetadata({ ...metadata, ...changes }, "broken/vi.md"), /broken\/vi.md/);
  }
  assert.equal(parsePostMetadata(metadata, "valid/en.md").title, "Sample");
});

test("draft translations stay private, single-language posts fall back, malformed posts fail visibly", async () => {
  const temporaryRoot = path.resolve(tmpdir());
  const directory = await mkdtemp(path.join(temporaryRoot, "gray-blog-test-"));
  try {
    const article = path.join(directory, "sample");
    await mkdir(article);
    const yaml = (status: string, body: string) => `---\ntitle: Sample\ndescription: Description\ncategory: backend\ntags: [Java]\nstatus: ${status}\npublishedAt: "2026-10-31"\n---\n${body}`;
    await writeFile(path.join(article, "en.md"), yaml("draft", "Private draft"));
    await writeFile(path.join(article, "vi.md"), yaml("published", "## Nội dung\nBản tiếng Việt."));
    const [post] = await readBlogDirectory(directory);
    assert.deepEqual(post.availableLocales, ["vi"]);
    assert.equal(post.content, post.contentVi);
    assert.ok(!JSON.stringify(post).includes("Private draft"));
    await writeFile(path.join(article, "vi.md"), yaml("draft", "Another private draft"));
    assert.deepEqual(await readBlogDirectory(directory), []);
    await writeFile(path.join(article, "vi.md"), yaml("invalid", "Bad status"));
    await assert.rejects(readBlogDirectory(directory), /vi\.md.*status/);
  } finally {
    // Verify the resolved deletion target remains inside the test temp directory.
    assert.equal(path.dirname(path.resolve(directory)), temporaryRoot);
    assert.ok(path.basename(directory).startsWith("gray-blog-test-"));
    await rm(directory, { recursive: true, force: true });
  }
});
