import VideoPlayer from "../../../components/VideoPlayer";
import { getDetails, titleOf, IMG_ORIGINAL } from "../../../../lib/tmdb";

export const revalidate = 3600;

export default async function WatchPage({ params }) {
  const type = params.type === "tv" ? "tv" : "movie";
  const item = await getDetails(type, params.id);
  const backdrop = item?.backdrop_path ? `${IMG_ORIGINAL}${item.backdrop_path}` : null;

  return <VideoPlayer title={item ? titleOf(item) : "Now Playing"} backdrop={backdrop} />;
}
