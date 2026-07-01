import DetailView from "../../components/DetailView";
import { getDetails } from "../../../lib/tmdb";

export const revalidate = 3600;

export default async function TvPage({ params }) {
  const item = await getDetails("tv", params.id);
  return <DetailView item={item} mediaType="tv" />;
}
