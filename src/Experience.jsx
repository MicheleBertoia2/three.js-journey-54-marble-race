import Lights from './Lights.jsx'
import { Physics } from '@react-three/rapier'
import { Level } from './Level.jsx'
import Player from './Player.jsx'
import useGames from './stores/useGames.jsx'

export default function Experience()
{

    const blocksCount = useGames((state) => { return state.blocksCount})


    return <>


        <Physics debug={false}>

            <Lights />

            <Level count={blocksCount}/>  

            <Player />  

        </Physics>

    </>
}