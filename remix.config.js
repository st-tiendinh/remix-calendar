/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  serverDependenciesToBundle: [
		/^remix-utils.*/,
		// If you installed is-ip optional dependency you will need these too
		"is-ip",
		"ip-regex",
		"super-regex",
		"clone-regexp",
		"function-timeout",
		"time-span",
		"convert-hrtime",
		"is-regexp",
	],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
