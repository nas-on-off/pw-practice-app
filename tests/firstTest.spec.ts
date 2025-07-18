import {test, expect} from '@playwright/test'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()

})

test('Locator syntax rules', async({page}) => {
    // by Tag name
    page.locator('input')

    // by ID
    await page.locator('#inputEmail1').click()

    // by Class value
    page.locator('.shape-rectangle')

    // by Attribute name
    page.locator('[placeholder="Email"]')

    // by Class value (full match)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // combine different selectors
    page.locator('input#inputEmail1.input-full-width')

    // by XPath (not recommended)
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')   
})

test('User facing locators', async({page}) => {
    await page.getByRole('textbox', {name: 'Email'}).first().click()
    await page.getByRole('button', {name: 'Sign in'}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    await page.getByTitle('IoT Dashboard').click()

    await page.getByTestId('SignIn').click()
})

test('locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test ('Reusing locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@text.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('123456')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@text.com')
})

test('extracting values', async({page}) => {
    // single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toBe('Submit')

    // all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain('Option 1')

    // input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@text.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toBe('test@text.com')

    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toBe('Email')
})