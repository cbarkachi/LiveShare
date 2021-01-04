import { getEncodedUrl } from "./url_handler";
import { LISTING_POSTS_PAGE } from "settings/constant";

export default function goToSearchPage(search, history) {
  const query = {
    skill: search,
  };

  const searchQuery = getEncodedUrl(query);

  const url = `${LISTING_POSTS_PAGE}/${searchQuery}`;

  history.push(url);
}
