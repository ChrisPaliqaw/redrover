import { useState, useEffect } from 'react'

import { RobotClient, createRobotClient, BaseClient } from '@viamrobotics/sdk'

import { MetaTags } from '@redwoodjs/web'

const TeleopPage = () => {
  const [client, setClient] = useState<RobotClient | null>()
  const [baseClient, setBaseClient] = useState<BaseClient | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    const credential = {
      payload: process.env.ROBOT_SECRET,
      type: 'robot-location-secret',
    }
    async function fetchClient() {
      // TODO: Use client API to test if disconnected
      // This test is necessary to prevent infinite reconnections
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
        console.log('c', c)
        setClient(c)
        console.log('connected!')
      } catch (e) {
        console.log(e)
        return
      }
      try {
        // We need to use "c", because client won't be available
        // until the next render
        console.log(c)
        const b = new BaseClient(c, process.env.BASE_NAME)
        setBaseClient(b)
        console.log(b)
      } catch (error) {
        console.log(error)
        console.log("Can't locate the base")
        return
      }
    }
    fetchClient()
  }, [baseClient, client])

  async function moveStraight(isForward: boolean) {
    if (!baseClient) {
      return
    }
    setIsMoving(true)
    let distance = 100
    if (!isForward) {
      distance = -distance
    }
    try {
      await baseClient.moveStraight(distance, 100)
    } catch (error) {
      console.log(error)
    }
    setIsMoving(false)
  }

  async function spin(isLeft: boolean) {
    if (!baseClient) {
      return
    }
    setIsMoving(true)
    let degrees = 15
    if (!isLeft) {
      degrees = -degrees
    }
    try {
      await baseClient.spin(degrees, 15)
    } catch (error) {
      console.log(error)
    }
    setIsMoving(false)
  }

  async function moveForward() {
    moveStraight(true)
  }

  async function moveBack() {
    moveStraight(false)
  }

  async function spinLeft() {
    spin(true)
  }

  async function spinRight() {
    spin(false)
  }

  return (
    <>
      <MetaTags title="Teleop" description="Teleop page" />

      <h1>Rover Teleoperation</h1>
      <p>{client ? 'Client connected!' : 'Client not connected!'}</p>
      <p>
        {baseClient ? 'Base client connected!' : 'Base client not connected!'}
      </p>
      <p>
        <button onClick={moveForward} disabled={!baseClient || isMoving}>
          ↑
        </button>
      </p>
      <p>
        {/* ← → ↑ ↓ */}
        <button onClick={spinLeft} disabled={!baseClient || isMoving}>
          ←
        </button>
        <button onClick={spinRight} disabled={!baseClient || isMoving}>
          →
        </button>
      </p>
      <p>
        <button onClick={moveBack} disabled={!baseClient || isMoving}>
          ↓
        </button>
      </p>
    </>
  )
}

export default TeleopPage
