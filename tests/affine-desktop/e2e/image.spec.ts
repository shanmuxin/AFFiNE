import path from 'node:path';

import { test } from '@affine-test/kit/playwright';
import { importImage } from '@affine-test/kit/utils/image';
import { pasteByKeyboard } from '@affine-test/kit/utils/keyboard';
import { openHomePage } from '@affine-test/kit/utils/load-page';
import {
  clickNewPageButton,
  getBlockSuiteEditorTitle,
  waitForEditorLoad,
} from '@affine-test/kit/utils/page-logic';
import { expect } from '@playwright/test';

test('should be able to insert SVG images', async ({ page }) => {
  await page.waitForTimeout(500);
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  const title = getBlockSuiteEditorTitle(page);
  await title.click();
  await page.keyboard.press('Enter');

  await importImage(page, path.join(__dirname, '../../fixtures/affine.svg'));

  const svg = page.locator('affine-image').first();
  await expect(svg).toBeVisible();
});

test('should paste it as PNG after copying SVG', async ({ page }) => {
  await page.waitForTimeout(500);
  await openHomePage(page);
  await waitForEditorLoad(page);
  await clickNewPageButton(page);
  const title = getBlockSuiteEditorTitle(page);
  await title.click();
  await page.keyboard.press('Enter');

  await importImage(page, path.join(__dirname, '../../fixtures/affine.svg'));

  const svg = page.locator('affine-image').first();
  await expect(svg).toBeVisible();

  await svg.hover();

  const imageToolbar = page.locator('affine-image-toolbar');
  await imageToolbar.getByRole('button', { name: 'Move' }).click();

  const moveMenu = page.locator('.image-more-popup-menu');
  await moveMenu.getByRole('button', { name: 'Copy' }).click();

  await svg.click();

  await page.keyboard.press('Enter');
  await pasteByKeyboard(page);

  const png = page.locator('affine-image').nth(1);
  await expect(png).toBeVisible();
});
