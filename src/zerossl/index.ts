import puppeteer, { type Page } from 'puppeteer'
import { sleep } from '../utils'

const signIn = (page: Page) => async (username: string, password: string) => {
  const EMAIL_SELECTOR = 'input[name="login[email]"]'
  const PASSWORD_SELECTOR = 'input[name="login[password]"]'
  const BUTTON_SELECTOR = 'fieldset .form_row .button'
  await page.goto('https://app.zerossl.com/login')
  await Promise.all([page.waitForSelector(EMAIL_SELECTOR), page.waitForSelector(PASSWORD_SELECTOR)])
  await page.type(EMAIL_SELECTOR, username)
  await page.type(PASSWORD_SELECTOR, password)
  await page.waitForSelector(BUTTON_SELECTOR)
  await page.click(BUTTON_SELECTOR)
  await page.waitForNavigation()
}

const newCertificate = (page: Page) => async (domain: string) => {
  await domainSetup(page)(domain)
  await validitySetup(page)()
  await csrSetup(page)()
  await planSetup(page)()
}

const domainSetup = (page: Page) => async (domain: string) => {
  const DOMAIN_SELECTOR = 'input[name="wizard[order][domains][domain]"]'
  const DOMAIN_NEXTSTEP_SELECTOR = 'form[name="wizard[order][domains]"] a[data-action="wizard[next_step]"]'
  await page.goto('https://app.zerossl.com/certificate/new')
  await page.waitForSelector(DOMAIN_SELECTOR)
  await page.type(DOMAIN_SELECTOR, domain)
  await sleep(1000)
  await page.waitForSelector(DOMAIN_NEXTSTEP_SELECTOR)
  await page.click(DOMAIN_NEXTSTEP_SELECTOR)
}

const validitySetup = (page: Page) => async () => {
  const VALIDITY_90D_SELECTOR = 'input[id="wizard[order][validity][90d]"]'
  const VALIDITY_NEXTSTEP_SELECTOR = 'form[name="wizard[order][validity]"] a[data-action="wizard[next_step]"]'
  await page.waitForSelector(VALIDITY_90D_SELECTOR)
  await page.click(VALIDITY_90D_SELECTOR)
  await page.waitForSelector(VALIDITY_NEXTSTEP_SELECTOR)
  await page.click(VALIDITY_NEXTSTEP_SELECTOR)
}

const csrSetup = (page: Page) => async () => {
  const CSR_NEXTSTEP_SELECTOR = 'form[name="wizard[order][csr]"] a[data-action="wizard[next_step]"]'
  await page.waitForSelector(CSR_NEXTSTEP_SELECTOR)
  await page.click(CSR_NEXTSTEP_SELECTOR)
}

const planSetup = (page: Page) => async () => {
  const PLAN_NEXTSTEP_SELECTOR = 'form[name="wizard[order][plan]"] a[data-action="wizard[next_step]"]'
  await page.waitForSelector(PLAN_NEXTSTEP_SELECTOR)
  await page.click(PLAN_NEXTSTEP_SELECTOR)
}

export default async ({ zerossl }: CertgenConfig) => {
  if (!zerossl) { return }
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await signIn(page)(zerossl.username, zerossl.password)
  await newCertificate(page)(zerossl.domain)

  await browser.close()
}
