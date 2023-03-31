import type { ComponentMeta } from '@storybook/react'

import TeleopPage from './TeleopPage'

export const generated = () => {
  return <TeleopPage />
}

export default {
  title: 'Pages/TeleopPage',
  component: TeleopPage,
} as ComponentMeta<typeof TeleopPage>
