import React, { useEffect, useState } from 'react';
import { Card, Icon, Image, Input, List, Label, ListItem, Button} from 'semantic-ui-react'
import '../App.scss';
import { POKE_API } from '../AppConfig';
import axios from 'axios';

const COLOR_TYPES ={
    fire:'red', normal:'gray', water:'blue', wlectric:'yellow', grass:'green',
ice:'teal', fighting:'black',
poison:'purple',
ground:'brown',
flying:'cyan',
psychic:'violet',
bug:'olive',
rock:'orange',
ghost:'white',
dragon:'red',
dark:'darkgray',
steel:'darkblue',
fairy:'pink',
}

const PokemonCard = ({pokemonID, showInput=true}) => {
    const [data, setData] = useState(null); // store the result here
    const [inputID, setInputID] = useState(pokemonID); 
    const [currentID, setCurrentID] = useState(pokemonID);
    const [spriteIdx, setSpriteIdx] = useState(0);

    useEffect(() => {
        setData(null);
        setSpriteIdx(0);//the first image of the pokymon
        axios.get(`${POKE_API}/pokemon/${currentID}`)
            .then(response => {
                setData(response.data);
            });
    }, [currentID]);

    useEffect(()=>{
        setCurrentID(pokemonID);

    }, [pokemonID]);

    // const card_color = COLOR_TYPES[data?.types[0].type.name] || 'grey';

    if (!data) {
        return (
            <Card style={{margin: '10px', width: '200px'}}>
                <Card.Content>Loading #{pokemonID}...</Card.Content>
            </Card>
        );
    }
    
    const card_color = COLOR_TYPES[data?.types[0].type.name] || 'grey';

    const sprites=[
        data.sprites.front_default, data.sprites.back_default, data.sprites.front_shiny, data.sprites.back_shiny
    ]
    return (
        <>
        {showInput &&
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <Input placeholder='Enter ID' value={inputID} onChange={(e)=>setInputID(e.target.value)} style={{marginBottom:'10px'}} />
            <Button onClick={()=>setCurrentID(inputID)} color='green'>Enter</Button>
        </div>
}

        <Card style={{margin: '10px', width: '200px'}} color={card_color}>
          {/* {pokemonID} */}
            <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center', background:'#e0e0e0', border:`3px solid ${card_color}`}}>
                <img
                    src={sprites[spriteIdx]}
                    alt={data.name}
                    style={{width:'100%', height:'100%'}}
                />
                {
                    <Button icon='chevron left' onClick={()=>setSpriteIdx((spriteIdx+sprites.length-1)%sprites.length)} style={{position:'absolute', left:'10px', top:'30%'}} size = "mini">
                    </Button>
                }
                {
                    <Button icon='chevron right' onClick={()=>setSpriteIdx((spriteIdx+1)%sprites.length)} style={{position:'absolute', right:'10px', top:'30%'}} size = "mini">
                    </Button>
                }
            </div>
                <Card.Content>
                    <Card.Header style={{fontSize:'1.25em'}}>{data.name}</Card.Header>
                    <div style={{margin: '10px 0'}}>
                        {data.types.map(y=> (
                            <Label key ={y.type.name} color={COLOR_TYPES[y.type.name] || 'grey'}>{y.type.name}</Label>
                        
                        ))}

                    </div>

                    <List divided>
                        {data.stats.map(x=>(
                            <List.Item key={x.stat.name}>
                                {/* <List.Content style={{display: 'flex', justifyContent: 'space-between'}}>
                                     <List.Content>{x.stat.name}</List.Content>

                                </List.Content> */}
                                <List.Content floated="right">{x.base_stat}</List.Content>
                                <List.Content>{x.stat.name}</List.Content>
                            </List.Item>
                        ))}
                    </List>
                </Card.Content>



        </Card>
        </>
    );
}

export {PokemonCard};