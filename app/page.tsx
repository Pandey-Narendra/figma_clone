import dynamic from "next/dynamic";

/**
 * Disable SSR to avoid pre-rendering issues of Next.js.
 * We're doing this because we're using a canvas element that can't be pre-rendered by Next.js on the server.
 */
const App = dynamic(() => import("./App"), { ssr: false });

export default App;
