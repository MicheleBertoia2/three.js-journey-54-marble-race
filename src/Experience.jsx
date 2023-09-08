import Lights from './Lights.jsx'
import { Physics } from '@react-three/rapier'
import { Level } from './Level.jsx'
import Player from './Player.jsx'

export default function Experience()
{
    return <>


        <Physics debug={false}>

            <Lights />

            <Level />  

            <Player />  

        </Physics>

    </>
}