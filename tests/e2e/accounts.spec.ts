import { expect, test } from "@playwright/test";

const mockScenarioEndpoint = "/api/mock-scenario";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3100";

async function writeMockScenario(page: import("@playwright/test").Page, data: unknown) {
  const res = await page.request.post(`${baseURL}${mockScenarioEndpoint}`, {
    data,
    headers: { "content-type": "application/json" },
  });
  expect(res.ok()).toBeTruthy();
}

async function clearMockScenario(page: import("@playwright/test").Page) {
  await page.request.delete(`${baseURL}${mockScenarioEndpoint}`);
}

test.afterEach(async ({ page }) => {
  await clearMockScenario(page);
});

test.describe("Accounts table", () => {
  test("renders mock data and sorts", async ({ page }) => {
    await page.goto("/");

    const rows = page.getByRole("row");
    await expect(rows.nth(1)).toBeVisible();

    // Mock data should be present
    await expect(page.getByRole("cell", { name: "ACT0145W" })).toBeVisible();

    // Sort by Value descending and ensure the highest value surfaces to the top
    const valueHeader = page.getByRole("button", { name: /value/i });
    await valueHeader.click(); // asc
    await valueHeader.click(); // desc

    const sortedFirstRow = rows.nth(1);
    await expect(sortedFirstRow).toContainText("ACT06KOD");
  });

  test("shows empty account type when dictionary is empty", async ({ page }) => {
    await writeMockScenario(page, { scenario: "empty-account-types", accountTypes: [] });

    await page.goto("/");

    const row = page.getByRole("row", { name: /ACT0145W/ });
    await expect(row.getByRole("cell").nth(1)).toHaveText("ID: prp");
  });

  test("keeps account type empty when account types API fails", async ({ page }) => {
    await writeMockScenario(page, { scenario: "error-account-types" });

    await page.goto("/");

    const row = page.getByRole("row", { name: /ACT0145W/ });
    await expect(row.getByRole("cell").nth(1)).toHaveText("ID: prp");
  });

  test("renders error boundary when accounts fetch fails", async ({ page }) => {
    await writeMockScenario(page, { scenario: "error-accounts" });

    await page.goto("/");
    await expect(page.getByText(/something went wrong/i)).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole("button", { name: /retry/i })).toBeVisible({ timeout: 5_000 });
  });
});
