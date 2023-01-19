import { test, expect } from "@playwright/test";

test("can navigate to posts", async ({ page }) => {
  await page.goto("http://localhost:8080/");
  await page.getByRole("link", { name: "Browse posts" }).click();
  await expect(page).toHaveTitle("Material e621 - Posts");
});

test("shows tags", async ({ page }) => {
  await page.goto("http://localhost:8080/#/posts");
  await page.getByText("Tags on this page").waitFor({ state: "visible" });
  expect(await page.getByText("Tags on this page").isVisible()).toBeTruthy();
});
