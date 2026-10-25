import { NextResponse } from "next/server";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const allowedTopics = new Set([
  "banking",
  "goutms",
  "backend",
  "ai-developer",
  "aws",
  "data-eng",
  "networking",
  "academic",
  "other",
]);

function readText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 16_384) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_submission" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "invalid_submission" }, { status: 400 });
  }

  const fields = payload as Record<string, unknown>;
  const name = readText(fields.name);
  const email = readText(fields.email);
  const topic = readText(fields.topic);
  const message = readText(fields.message);
  const company = readText(fields.company);

  if (
    company ||
    !name ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    !allowedTopics.has(topic) ||
    !message ||
    message.length > 1000
  ) {
    return NextResponse.json({ error: "invalid_submission" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_TO_EMAIL || "graynguyen.dev@gmail.com";
  const sender = process.env.CONTACT_FROM_EMAIL;

  const topicLabels: Record<string, string> = {
    banking: "Banking App / Core Fintech",
    goutms: "GoutMS Healthcare AI",
    backend: "Backend Engineering & API Design",
    "ai-developer": "AI Developer Collaboration",
    aws: "AWS Cloud Infrastructure",
    "data-eng": "Data Engineering",
    networking: "Networking",
    academic: "Academic",
    other: "Other Inquiry",
  };

  const topicTitle = topicLabels[topic] || topic;

  // Persist submission locally to inbox.json so messages in dev or local are never lost
  try {
    const inboxPath = path.join(process.cwd(), "src", "data", "inbox.json");
    let messages: Array<Record<string, unknown>> = [];
    try {
      const raw = await readFile(inboxPath, "utf-8");
      messages = JSON.parse(raw);
    } catch {
      messages = [];
    }
    messages.unshift({
      id: `msg-${Date.now()}`,
      name,
      email,
      topic: topicTitle,
      message,
      receivedAt: new Date().toISOString(),
    });
    await writeFile(inboxPath, JSON.stringify(messages.slice(0, 100), null, 2), "utf-8");
    console.log(`[CONTACT INBOX] New message from ${name} (${email}): [${topicTitle}] ${message.slice(0, 60)}...`);
  } catch (err) {
    console.error("Could not write to local inbox.json:", err);
  }

  // Generate mailto link for direct client email dispatch
  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
    `[Portfolio Contact] ${topicTitle} - from ${name}`
  )}&body=${encodeURIComponent(
    `Chào Gray,\n\n${message}\n\n---\nNgười gửi: ${name}\nEmail liên hệ: ${email}\nChủ đề: ${topicTitle}`
  )}`;

  // If Resend API credentials are provided, dispatch via Resend
  if (apiKey && sender) {
    const emailText = [
      `From: ${name}`,
      `Reply to: ${email}`,
      `Topic: ${topicTitle}`,
      "",
      message,
    ].join("\n");

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: sender,
          to: [recipient],
          reply_to: email,
          subject: `Portfolio contact: ${topicTitle} from ${name}`,
          text: emailText,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (response.ok) {
        return NextResponse.json({ sent: true });
      }
      console.warn("Resend email dispatch failed, falling back to direct mailto.");
    } catch (error) {
      console.warn("Resend request error, falling back to direct mailto:", error);
    }
  }

  // Smooth fallback when Resend key is not yet set: message is saved locally and mailto URL is ready
  return NextResponse.json({
    sent: true,
    fallback: "mailto",
    mailtoUrl,
  });
}
