import HawkCatcher from "@hawk.so/browser";

const hawk = new HawkCatcher({
  // TODO: Вынужденная мера использования токена напрямую
  token:
    "eyJpbnRlZ3JhdGlvbklkIjoiYjQxMTg3N2QtMDIyYy00MGVlLWJhMGUtNjgyYTg2MzgzMjMxIiwic2VjcmV0IjoiNDMyMWE5MDUtMTJjOC00ZTY2LWFiZTktMzNhNDdhNDk5MGM2In0=",
  consoleTracking: true,
  release: window.HAWK_RELEASE,
});

export default hawk;