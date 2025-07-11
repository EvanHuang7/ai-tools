import Vapi from "@vapi-ai/web";

let vapiClient: Vapi | null = null;

export const getVapi = () => {
  if (!vapiClient) {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    vapiClient = new Vapi(publicKey);
  }
  return vapiClient;
};
