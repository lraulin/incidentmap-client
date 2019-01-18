export default function isTweet(obj) {
  // returns false if the object does not have all properties required by
  // react-tweet with non-null or undefined values
  if (!obj.id_str) {
    console.log("missing id_str");
    return false;
  } else if (!obj.user) {
    console.log("missing user");
    return false;
  } else if (!obj.user.name) {
    console.log("missing user.name");
    return false;
  } else if (!obj.user.screen_name) {
    console.log("missing user.screen_name");
    return false;
  } else if (!obj.user.profile_image_url) {
    console.log("missing user.profile_image_url");
    return false;
  } else if (!obj.text) {
    console.log("missing text");
    return false;
  } else if (!obj.created_at) {
    console.log("missing created_at");
    return false;
  } else if (!obj.favorite_count) {
    console.log("missing favorite_count");
    return false;
  } else if (!obj.entities) {
    console.log("missing entities");
    return false;
  } else if (!obj.entities.media) {
    console.log("missing entities.media");
    return false;
  } else if (!obj.entities.urls) {
    console.log("missing entities.urls");
    return false;
  } else if (!obj.entities.user_mentions) {
    console.log("missing entities.user_mentions");
    return false;
  } else if (!obj.entities.user_mentions) {
    console.log("missing entities.hashtags");
    return false;
  } else if (!obj.entities.symbols) {
    console.log("missing entities.symbols");
    return false;
  } else {
    return true;
  }
}

export function isTweetWithCoords(obj) {
  // verifies that object is a tweet and has lat/long

  if (!isTweet(obj)) return false;
  if (!!typeof obj.coordinates) return false;
  if (!!typeof obj.coordinates.Latitude) return false;
  if (!!typeof obj.coordinates.Longitude) return false;
  return true;
}
