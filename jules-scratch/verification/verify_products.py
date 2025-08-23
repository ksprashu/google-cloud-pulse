import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            # Capture console logs
            page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

            await page.goto("http://localhost:5173/")

            # Wait for the product grid to be visible
            await expect(page.locator(".grid")).to_be_visible(timeout=20000)

            # Wait for at least one product tile to be rendered
            await expect(page.locator(".group").first).to_be_visible(timeout=20000)

            # Take a screenshot
            await page.screenshot(path="jules-scratch/verification/verification.png")

            print("Screenshot taken successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            print(f"Page content: {await page.content()}")

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
