export default function getUrlComponents(history) {
  const components = history.location.pathname.split("/");
  return components.slice(1, components.length);
}
