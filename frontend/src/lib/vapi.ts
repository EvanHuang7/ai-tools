import Vapi from "@vapi-ai/web";

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
export const vapi = new Vapi(publicKey);
