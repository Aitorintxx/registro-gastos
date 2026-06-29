import { test, expect } from "@playwright/test";

test.describe("Registro de Gastos — E2E", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector(".app-header");
  });

  test("muestra el título principal", async ({ page }) => {
    await expect(page.locator(".app-header h1")).toContainText("Registro de Gastos");
  });

  test("muestra las pestañas Gastos y Resumen", async ({ page }) => {
    await expect(page.locator(".tabs")).toBeVisible();
    await expect(page.locator(".tab").first()).toContainText("Gastos");
    await expect(page.locator(".tab").nth(1)).toContainText("Resumen");
  });

  test("abre y cierra el formulario de nuevo gasto", async ({ page }) => {
    const boton = page.locator("button", { hasText: "Nuevo gasto" });
    await boton.click();
    await expect(page.locator(".gasto-form")).toBeVisible();

    await page.locator("button", { hasText: "Cancelar" }).first().click();
    await expect(page.locator(".gasto-form")).not.toBeVisible();
  });

  test("el formulario tiene todos los campos necesarios", async ({ page }) => {
    await page.locator("button", { hasText: "Nuevo gasto" }).click();
    await expect(page.locator("input[name='importe']")).toBeVisible();
    await expect(page.locator("select[name='categoria']")).toBeVisible();
    await expect(page.locator("input[name='fecha']")).toBeVisible();
    await expect(page.locator("input[name='descripcion']")).toBeVisible();
  });

  test("añade un gasto y aparece en la lista", async ({ page }) => {
    await page.locator("button", { hasText: "Nuevo gasto" }).click();
    await page.fill("input[name='importe']", "42.50");
    await page.selectOption("select[name='categoria']", "Ocio");
    await page.fill("input[name='descripcion']", "Cine con amigos");
    await page.fill("input[name='fecha']", "2026-06-15");
    await page.locator("button[type='submit']").click();

    await expect(page.locator(".tabla-gastos")).toBeVisible();
    await expect(page.locator(".tabla-gastos")).toContainText("Cine con amigos");
    await expect(page.locator(".tabla-gastos")).toContainText("42.50");
    await expect(page.locator(".tabla-gastos")).toContainText("Ocio");
  });

  test("muestra mensaje cuando no hay gastos", async ({ page }) => {
    await expect(page.locator(".empty")).toBeVisible();
  });

  test("cambia a la pestaña Resumen", async ({ page }) => {
    await page.locator(".tab").nth(1).click();
    await expect(page.locator(".tab.active").nth(0)).toContainText("Resumen");
  });

  test("los filtros están visibles", async ({ page }) => {
    await expect(page.locator(".filtros")).toBeVisible();
    await expect(page.locator("select[name='categoria']").first()).toBeVisible();
    await expect(page.locator("input[name='fecha_inicio']")).toBeVisible();
    await expect(page.locator("input[name='fecha_fin']")).toBeVisible();
  });

  test("el botón Exportar CSV está disponible", async ({ page }) => {
    await expect(page.locator("button", { hasText: "Exportar CSV" })).toBeVisible();
  });

  test("el select de categorías tiene opciones predefinidas", async ({ page }) => {
    await page.locator("button", { hasText: "Nuevo gasto" }).click();
    const opciones = await page.locator("select[name='categoria'] option").allTextContents();
    expect(opciones).toContain("Alimentación");
    expect(opciones).toContain("Transporte");
    expect(opciones).toContain("Ocio");
  });

  test("el filtro de limpiar resetea los campos", async ({ page }) => {
    await page.fill("input[name='fecha_inicio']", "2026-01-01");
    await page.locator(".filtros button", { hasText: "Limpiar" }).click();
    const valor = await page.inputValue("input[name='fecha_inicio']");
    expect(valor).toBe("");
  });

});
