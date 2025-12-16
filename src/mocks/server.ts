import { setupServer } from "msw/node";

import { handlers } from "@/mocks/handlers";

export const server = setupServer(...handlers);

export function useHandlers(...newHandlers: Parameters<typeof server.use>) {
  server.use(...newHandlers);
}

export function resetHandlers() {
  server.resetHandlers();
}
