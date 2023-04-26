describe('GUI-Testing BY KP18', () => {

  beforeEach(() => { 
    cy.visit('http://localhost:3000')
    cy.contains('Login').click()
    cy.get('[id="email"]').type('khush@admin.com')

// Enter password
cy.get('[id="password"]').type('12345678')

// Click sign in button
cy.get('[class = "MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-fullWidth MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButton-fullWidth css-1vhaqj4-MuiButtonBase-root-MuiButton-root"]').click()

// Verify that the dashboard is visible
// cy.url().should('include', '/dashboard')'
cy.wait(3000)
  })
  it('should visit dashboard as soon as user log in', () => {
    cy.contains('Dashboard').should('be.visible')
  })

  it('if you taken any plan from browse plans then it should be added into the My plans', () => {
    
    cy.contains('Browse Plans').click()
    //click on 3rd view details button on the pag 
    cy.wait(2000)

    
    const viewDetailsButtons = cy.findAllByText('View Details')
    
    // Click the third button in the collection
    viewDetailsButtons.eq(1).click()
    cy.contains('ALREADY TAKEN!',{matchCase: false})
    cy.get('[data-testid="Plan Title"]').contains('Cope with Anxiety 5 day plan').invoke('text').as('textToCompare');

    // Navigate to the second page and retrieve the text to compare
    cy.contains('My Plans',{matchCase: false}).click();
    cy.contains('Cope with Anxiety 5 day plan',{matchCase: false}).should('be.visible')
    // cy.get('[data-testid="MyPlan Title"]').contains('Cope with Anxiety 5 day plan').invoke('text').as('expectedText');

    // // Compare the two text values
    // cy.get('@textToCompare').then((textToCompare) => {
    //   cy.get('@expectedText').then((expectedText) => {
    //     expect(textToCompare).to.eq(expectedText);
    //   })
    // })

  })

  it('Create plan basic workflow', () => {
    // Click on create plan
    cy.contains('Create Plan',{matchCase: false}).click()

    // Enter plan details
    cy.get('#name').type('Test Plan-ByKP18')
    cy.get('#description').type('Test Description-ByKP18')
    cy.get('#demo-multiple-chip').click()
    cy.findByText('Anxiety').click()
    cy.findByText('Depression').click()
    // cy.get('[class = "MuiTypography-root MuiTypography-h3 css-lnlxph-MuiTypography-root"]').click({ force: true })
    cy.wait(1000)
    cy.contains('NEXT', {matchCase: false}).click({ force: true })
    cy.wait(2000)
    // Add videos
    cy.findByText('Mindfulness Meditation').click()
    cy.findByText('Best Exercise for mind.').click()
    cy.findByText('Yoga To Calm Your Mind').click()
    cy.contains('NEXT', {matchCase: false}).click({ force: true })
    cy.contains('Summary', {matchCase: false}).should('be.visible')
    cy.contains('SUBMIT',{matchCase: false}).click()
  })


})