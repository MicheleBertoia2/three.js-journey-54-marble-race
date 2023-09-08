import * as THREE from 'three'
import { RigidBody } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({color: 'limegreen'})
const floor2Material = new THREE.MeshStandardMaterial({color: 'greenyellow'})
const obstacleMaterial = new THREE.MeshStandardMaterial({color: 'orangered'})
const wallMaterial = new THREE.MeshStandardMaterial({color: 'slategrey'})

function BlockStart({ position = [0, 0, 0]})
{
  return <group position={ position }>
      <mesh position={ [ 0, - 0.1, 0 ] } geometry={boxGeometry} material={floor1Material} scale={[4, 0.2, 4]} receiveShadow/>


  </group> 
}

function BlockEnd({ position = [0, 0, 0]})
{
  const burgir = useGLTF('./hamburger.glb')
  burgir.scene.children.forEach((mesh) =>
  {
    mesh.castShadow = true
  })

  return <group position={ position }>
      <mesh position={ [ 0, 0, 0 ] } geometry={boxGeometry} material={floor1Material} scale={[4, 0.2, 4]} receiveShadow/>
      <RigidBody type='fixed' colliders='hull' position={[0, 0.25, 0]} restitution={0.2} friction={0}>
        <primitive object={burgir.scene}  scale={ 0.25}/>
      </RigidBody>
  </group> 
}

export function BlockSpinner({ position = [0, 0, 0]})
{
  const obstacle = useRef()
  const [ speed ] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? - 1 : 1))

  useFrame((state) =>
  {
      const time = state.clock.getElapsedTime()

      const rotation = new THREE.Quaternion()
      rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
      obstacle.current.setNextKinematicRotation(rotation)
  })

  return <group position={ position }>
      <mesh position={ [ 0, - 0.1, 0 ] } geometry={boxGeometry} material={floor2Material} scale={[4, 0.2, 4]} receiveShadow/>

      <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
        <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
      </RigidBody>


  </group> 
}

export function BlockLimbo({ position = [0, 0, 0]})
{
  const obstacle = useRef()
  const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

  useFrame((state) =>
  {
      const time = state.clock.getElapsedTime()

      const y = Math.sin(time + timeOffset) + 1.15
      obstacle.current.setNextKinematicTranslation({x: position[0], y, z: position[2]})
      
  })

  return <group position={ position }>
      <mesh position={ [ 0, - 0.1, 0 ] } geometry={boxGeometry} material={floor2Material} scale={[4, 0.2, 4]} receiveShadow/>

      <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
        <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
      </RigidBody>


  </group> 
}

export function BlockAxe({ position = [0, 0, 0]})
{
  const obstacle = useRef()
  const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

  useFrame((state) =>
  {
      const time = state.clock.getElapsedTime()

      const x = Math.sin(time + timeOffset) * 1.25
      obstacle.current.setNextKinematicTranslation({x: position[0] + x, y: position[1] + 0.75, z: position[2]})
      
  })

  return <group position={ position }>
      <mesh position={ [ 0, - 0.1, 0 ] } geometry={boxGeometry} material={floor2Material} scale={[4, 0.2, 4]} receiveShadow/>

      <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0}>
        <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} castShadow receiveShadow />
      </RigidBody>


  </group> 
}

function Bounds({length = 1})
{
  return <>

    <RigidBody type='fixed' restitution={0.2} friction={0}>
      <mesh geometry={boxGeometry} material={wallMaterial} position={[2.15, 0.75, - (length * 2) + 2]} scale={[0.3, 1.5, 4 * length]} castShadow/>

      <mesh geometry={boxGeometry} material={wallMaterial} position={[-2.15, 0.75, - (length * 2) + 2]} scale={[0.3, 1.5, 4 * length]} receiveShadow/>

      <mesh geometry={boxGeometry} material={wallMaterial} position={[0, 0.75, - (length * 4) + 2]} scale={[4, 1.5, 0.3]} receiveShadow/>
    </RigidBody>
  </>
}

export function Level( { count = 5, types = [BlockSpinner, BlockAxe, BlockLimbo] } )
{

  const blocks = useMemo(() => 
  {
    const blocks = []

    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        blocks.push(type)
    }
    console.log(blocks);
    return blocks

  }, [count, types])
  
  return <>

      <BlockStart position={[0, 0, 0]}/>

      { blocks.map((Block, index) => <Block key={index} position={[ 0, 0, - (index + 1) * 4]} /> ) }
      
      <BlockEnd position={[0, 0, - (count + 1) * 4]}/>

      <Bounds length={count + 2} />
  </>
}