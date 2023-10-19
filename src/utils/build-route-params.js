export function buildRoutePath(path) {
  const routeParemetersRegex = /:([a-zA-Z]+)/g;
  const uuidRegex = "(?<$1>[a-z0-9-_]+)";
  const pathWithParams = path.replaceAll(routeParemetersRegex, uuidRegex);

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  return pathRegex;
}
