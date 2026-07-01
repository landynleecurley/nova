import DetailView from "../../components/DetailView";
import { getDetails, titleOf, yearOf } from "../../../lib/tmdb";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const item = await getDetails("tv", params.id);
  if (!item) return { title: "Not Found" };
  const name = titleOf(item);
  const year = yearOf(item);
  return {
    title: year ? `${name} (${year})` : name,
    description:
      item.tagline || item.overview?.slice(0, 160) || "Watch Anywhere, Anytime on Nova.",
  };
}

export default async function TvPage({ params }) {
  const item = await getDetails("tv", params.id);
  return <DetailView item={item} mediaType="tv" />;
}
