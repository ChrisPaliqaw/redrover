import { useState, useEffect } from 'react'

import { RobotClient, createRobotClient, BaseClient } from '@viamrobotics/sdk'

import { MetaTags } from '@redwoodjs/web'

const TeleopPage = () => {
  const [client, setClient] = useState<RobotClient | null>()
  const [baseClient, setBaseClient] = useState<BaseClient | null>(null)

  useEffect(() => {
    const credential = {
      payload: process.env.ROBOT_SECRET,
      type: 'robot-location-secret',
    }
    async function fetchClient() {
      // TODO: Use client API to test if disconnected
      if (client) {
        return
      }
      const host = process.env.HOST
      const signalingAddress = process.env.SIGNALING_ADDRESS
      const iceServers = [{ urls: process.env.ICE_SERVER }]
      const createRobotClientArguments = {
        host,
        credential,
        authEntity: host,
        signalingAddress,
        iceServers,
      }
      console.log(createRobotClientArguments)
      let c: RobotClient | null = null
      try {
        c = await createRobotClient(createRobotClientArguments)
        console.log("c", c)
        setClient(c)
        console.log('connected!')
      } catch (e) {
        console.log(e)
        return
      }
      try {
        // We need to use see, because client won't be available
        // until the next render
        console.log(c)
        const b = new BaseClient(c, process.env.BASE_NAME)
        setBaseClient(b)
        console.log(baseClient)
      } catch (error) {
        console.log(error)
        console.log("Can't locate the base")
        return
      }
    }
    fetchClient()
  }, [baseClient, client])

  return (
    <>
      <MetaTags title="Teleop" description="Teleop page" />

      <h1>TeleopPage</h1>
      <p>{client ? 'Client connected!' : 'Client not connected!'}</p>
      <p>
        {baseClient ? 'Base client connected!' : 'Base client not connected!'}
      </p>
    </>
  )
}

export default TeleopPage
