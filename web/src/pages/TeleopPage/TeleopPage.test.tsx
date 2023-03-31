import { render } from '@redwoodjs/testing/web'

import TeleopPage from './TeleopPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TeleopPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TeleopPage />)
    }).not.toThrow()
  })
})
