// The certificate decoder uses the Buffer of Node.js, which the WebView does
// not have. The trailing slash names the npm package, not the module of Node.js.
import { Buffer } from "buffer/";

(globalThis as { Buffer?: typeof Buffer }).Buffer ??= Buffer;
