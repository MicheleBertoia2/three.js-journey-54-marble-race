import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";

export default function Player()
{

  const marble = useRef()

  const [ subscribeKeys, getKeys ] = useKeyboardControls()

  const { rapier, world } = useRapier()

  const jump = () =>
  {
    const origin = marble.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: - 1, z: 0 }

    const ray = new rapier.Ray(origin, direction)
    const hit = world.castRay(ray, 10, true)
    
    if(hit.toi < 0.15)
    {
      marble.current.applyImpulse({x: 0, y: 0.5, z: 0})
    }
  }

  useEffect(() => 
        {
          subscribeKeys(
            (state) => state.jump,          
            (value) =>
            {
              if(value)
              {
                jump()
              }
            }
          )
  }, [])

  useFrame((state, delta) =>
  {
      const { forward, backward, leftward, rightward } = getKeys()

      

      const impulse = { x: 0, y:0, z:0 }
      const torque = { x: 0, y:0, z:0 }

      const impulseStrength = 0.6 * delta
      const torqueStrength = 0.2 * delta

      if(rightward)
      {
        impulse.x += impulseStrength
        torque.z -= torqueStrength
      }

      if(forward)
      {
        impulse.z -= impulseStrength
        torque.x -= torqueStrength
      }

      if(backward)
      {
        impulse.z += impulseStrength
        torque.x += torqueStrength
      }

      if(leftward)
      {
        impulse.x -= impulseStrength
        torque.z += torqueStrength
      }

      marble.current.applyImpulse(impulse)
      marble.current.applyTorqueImpulse(torque)
  })

  return <>
    <RigidBody 
      ref={marble} 
      canSleep={false} 
      position={[0, 1, 0]} 
      colliders='ball' 
      restitution={0.2} 
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color={'mediumpurple'} />
      </mesh>
    </RigidBody>
  </>
}