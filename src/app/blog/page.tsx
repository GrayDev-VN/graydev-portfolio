import { permanentRedirect } from "next/navigation";

export default function BlogRedirect() {
  permanentRedirect("/en/blog/");
}
