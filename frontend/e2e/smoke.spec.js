import { test, expect } from "@playwright/test";

test("homepage renders core UI", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByText("Contest Notifier")).toBeVisible();
    await expect(page.getByRole("searchbox", { name: /search contests/i })).toBeVisible();
});

test("route navigation works", async ({ page }) => {
    await page.goto("/");
    await page
        .getByRole("link", { name: /recent/i })
        .first()
        .click();
    await expect(page).toHaveURL(/\/past/);
    await page
        .getByRole("link", { name: /bookmarks/i })
        .first()
        .click();
    await expect(page).toHaveURL(/\/bookmarks/);
});
