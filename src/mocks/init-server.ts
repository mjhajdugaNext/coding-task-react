let serverStarted = false;

export async function ensureMockServer() {
  if (serverStarted || process.env.MOCK_API !== "true") return;
  const { server } = await import("@/mocks/server");
  server.listen({ onUnhandledRequest: "bypass" });
  serverStarted = true;
}

export async function stopMockServer() {
  if (!serverStarted) return;
  const { server } = await import("@/mocks/server");
  server.close();
  serverStarted = false;
}
