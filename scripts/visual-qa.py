from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
output = root / "docs" / "design-references"
output.mkdir(parents=True, exist_ok=True)

def warm_lazy_images(page):
    height = page.evaluate("document.documentElement.scrollHeight")
    for y in range(0, height, 700):
        page.evaluate("(y) => window.scrollTo(0, y)", y)
        page.wait_for_timeout(90)
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(500)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    errors = []

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    desktop.on("pageerror", lambda error: errors.append(str(error)))
    desktop.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    desktop.goto("http://127.0.0.1:3000", wait_until="load", timeout=60_000)
    desktop.wait_for_timeout(1_500)
    assert desktop.locator("h1").first.is_visible()
    assert desktop.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth") <= 1
    warm_lazy_images(desktop)
    desktop.screenshot(path=str(output / "jamwisata-redesign-desktop.png"), full_page=True)

    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    mobile.on("pageerror", lambda error: errors.append(str(error)))
    mobile.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    mobile.goto("http://127.0.0.1:3000", wait_until="load", timeout=60_000)
    mobile.wait_for_timeout(1_500)
    assert mobile.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth") <= 1
    mobile.get_by_role("button", name="Buka menu").click()
    mobile.get_by_role("dialog", name="Menu navigasi").wait_for(state="visible")
    mobile.keyboard.press("Escape")
    warm_lazy_images(mobile)
    mobile.screenshot(path=str(output / "jamwisata-redesign-mobile.png"), full_page=True)

    mobile.goto("http://127.0.0.1:3000/journey-planner", wait_until="load", timeout=60_000)
    mobile.wait_for_timeout(1_000)
    mobile.get_by_role("button", name="Umrah pertama kali").click()
    mobile.get_by_role("button", name="Selanjutnya").click()
    assert mobile.get_by_role("heading", name="Bersama siapa Anda akan melakukan perjalanan?").is_visible()
    mobile.screenshot(path=str(output / "jamwisata-journey-planner-mobile.png"), full_page=True)

    browser.close()

if errors:
    raise AssertionError("Browser errors:\n" + "\n".join(errors))

print("Visual QA passed: desktop, mobile, navigation, and Journey Planner.")
