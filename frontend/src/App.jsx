import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from "./lib/queryClient";
import CurrentTime from "./components/CurrentTime";
import RedisPanel from "./components/RedisPanel";
import PostgrePanel from "./components/PostgrePanel";
import "./App.css";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1>AI Tools App 👋</h1>
      <CurrentTime api="/api/node/" />
      <CurrentTime api="/api/go/" />
      <CurrentTime api="/api/python/" />
      <RedisPanel />
      <PostgrePanel />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
