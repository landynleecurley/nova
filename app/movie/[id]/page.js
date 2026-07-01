import DetailView from "../../components/DetailView";
import { getDetails } from "../../../lib/tmdb";

export const revalidate = 3600;

export default async function MoviePage({ params }) {
  const item = await getDetails("movie", params.id);
  return <DetailView item={item} mediaType="movie" />;
}
