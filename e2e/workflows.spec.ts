import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('hasSeenWelcome_v1', 'true');
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function createNewFlow(page: import('@playwright/test').Page) {
  await page.goto('/#/home');
  await page.getByTestId('home-create-new').click();
  await expect(page).toHaveURL(/#\/flow\/[^?]+(?:\?.*)?$/);
  await expect(page.getByTestId('topnav-play')).toBeVisible();
}

async function addRectangleNode(page: import('@playwright/test').Page) {
  await page.getByTestId('toolbar-add-toggle').click();
  await page.getByRole('button', { name: 'Rectangle' }).click();
}

// ---------------------------------------------------------------------------
// Create → Edit node label
// ---------------------------------------------------------------------------

test('creates a node and edits its label via double-click', async ({ page }) => {
  await createNewFlow(page);
  await addRectangleNode(page);

  const node = page.locator('.react-flow__node').first();
  await expect(node).toBeVisible();

  // Double-click to enter inline edit
  await node.dblclick();
  const textarea = node.locator('textarea').first();
  await expect(textarea).toBeVisible();

  await textarea.fill('E2E Test Label');
  await textarea.press('Escape');

  await expect(node).toContainText('E2E Test Label');
});

// ---------------------------------------------------------------------------
// Create → Undo / Redo
// ---------------------------------------------------------------------------

test('undo removes a node and redo restores it', async ({ page }) => {
  await createNewFlow(page);

  const nodes = page.locator('.react-flow__node');
  await expect(nodes).toHaveCount(0);

  await addRectangleNode(page);
  await expect(nodes).toHaveCount(1);

  // Undo
  await page.keyboard.press('Meta+Z');
  await expect(nodes).toHaveCount(0);

  // Redo
  await page.keyboard.press('Meta+Shift+Z');
  await expect(nodes).toHaveCount(1);
});

// ---------------------------------------------------------------------------
// Create → Export JSON
// ---------------------------------------------------------------------------

test('exports the diagram as JSON and download starts', async ({ page }) => {
  await createNewFlow(page);
  await addRectangleNode(page);

  // Watch for the download event
  const downloadPromise = page.waitForEvent('download');

  // Open export menu
  await page.getByTestId('topnav-export').click();

  // Click JSON export option
  await page.getByTestId('export-json').click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.json$/);
});

// ---------------------------------------------------------------------------
// Create → Export PNG
// ---------------------------------------------------------------------------

test('exports the diagram as PNG and download starts', async ({ page }) => {
  await createNewFlow(page);
  await addRectangleNode(page);

  const downloadPromise = page.waitForEvent('download');

  await page.getByTestId('topnav-export').click();
  await page.getByTestId('export-png').click();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.png$/);
});

// ---------------------------------------------------------------------------
// Create → Duplicate tab
// ---------------------------------------------------------------------------

test('duplicates the active tab and preserves node count', async ({ page }) => {
  await createNewFlow(page);
  await addRectangleNode(page);
  await addRectangleNode(page);

  const nodes = page.locator('.react-flow__node');
  const originalCount = await nodes.count();

  // Open tab context menu / duplicate via menu
  const activeTab = page.getByTestId('flow-tab').first();
  await activeTab.click({ button: 'right' });
  await page.getByRole('menuitem', { name: /duplicate/i }).click();

  // Should now have two tabs
  const tabs = page.getByTestId('flow-tab');
  await expect(tabs).toHaveCount(2);

  // The new tab should have the same node count
  await expect(nodes).toHaveCount(originalCount);
});

// ---------------------------------------------------------------------------
// Create → Copy-paste selected node
// ---------------------------------------------------------------------------

test('copies and pastes a selected node', async ({ page }) => {
  await createNewFlow(page);
  await addRectangleNode(page);

  const nodes = page.locator('.react-flow__node');
  await expect(nodes).toHaveCount(1);

  // Select the node
  await nodes.first().click();

  // Copy + Paste
  await page.keyboard.press('Meta+C');
  await page.keyboard.press('Meta+V');

  await expect(nodes).toHaveCount(2);
});

// ---------------------------------------------------------------------------
// Create → Delete selected node
// ---------------------------------------------------------------------------

test('deletes a selected node with the Delete key', async ({ page }) => {
  await createNewFlow(page);
  await addRectangleNode(page);

  const nodes = page.locator('.react-flow__node');
  await expect(nodes).toHaveCount(1);

  await nodes.first().click();
  await page.keyboard.press('Delete');

  await expect(nodes).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Share panel opens
// ---------------------------------------------------------------------------

test('share panel opens when share button is clicked', async ({ page }) => {
  await createNewFlow(page);

  await page.getByTestId('topnav-share').click();

  // Share panel or modal should appear
  await expect(page.getByTestId('share-panel')).toBeVisible();
});
