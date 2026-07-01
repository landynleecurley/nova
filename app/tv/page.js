import { redirect } from "next/navigation";

export default function TvIndexPage() {
  redirect("/browse?type=tv");
}
