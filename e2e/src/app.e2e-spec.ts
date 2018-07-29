import { AppPage } from './app.po'

describe('new App', () => {
  let page: AppPage

  beforeEach(() => {
    page = new AppPage()
  })

  it('should display welcome message', () => {
    void page.navigateTo()
    void expect(page.getParagraphText()).toContain('The world is your oyster.')
  })
})
