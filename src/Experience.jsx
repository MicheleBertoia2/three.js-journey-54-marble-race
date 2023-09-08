import Lights from './Lights.jsx'
import { Physics } from '@react-three/rapier'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import useGames from './stores/useGames.jsx'

export default function Experience()
{

    const blocksCount = useGames((state) => { return state.blocksCount})
    const blocksSeed = useGames((state) => { return state.blocksSeed})


    return <>

        <color args={['#bdedfc']} attach={'background'} />


        <Physics debug={false}>

            <Lights />

            <Level count={blocksCount} seed={blocksSeed}/>  

            <Player />  

        </Physics>

    </>
}