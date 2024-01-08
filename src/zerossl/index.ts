import puppeteer, { type Page } from 'puppeteer'

const signIn = (page: Page) => async (username: string, password: string) => {
  const EMAIL_SELECTOR = 'input[name="login[email]"]'
  const PASSWORD_SELECTOR = 'input[name="login[email]"]'
  const BUTTON_SELECTOR = 'fieldset .form_row .button'
  await page.goto('https://app.zerossl.com/login')
  await Promise.all([page.waitForSelector(EMAIL_SELECTOR), page.waitForSelector(PASSWORD_SELECTOR)])
  await page.type(EMAIL_SELECTOR, username)
  await page.type(PASSWORD_SELECTOR, password)
  await page.waitForSelector(BUTTON_SELECTOR)
  await page.click(BUTTON_SELECTOR)
}

export default async ({ zerossl }: CertgenConfig) => {
  if (!zerossl) { return }
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  await signIn(page)(zerossl.username, zerossl.password)
  const url = await page.url()

  await browser.close()
}
