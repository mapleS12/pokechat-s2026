
import React, { useEffect, useRef } from 'react';
import { Card, Icon, Image, Input, List, Label} from 'semantic-ui-react'
import axios from 'axios';
import {CHAT_API} from '../AppConfig';
import { PokemonCard  } from './PokemonCard';

// HANDLES INTERACTIONS WITH THE LLM (/backend)
const ChatForm = ({setSearchResults})=>{
    const[input, setInput] = React.useState("");
    const[query, setQuery]= React.useState("ditto limit 1");
    const[results, setResults]=React.useState(null);
    const[loading, setLoading]= React.useState(false);
     const[error, setError]= React.useState(null);

    const chat = (query)=>{
        // AXIOS GET on the POKECHAT API POINT 
        setLoading(true);
        setError(null);
        axios.get(`${CHAT_API}/chat/query`, {params:{q:query}})
            .then(response => {
                console.log(response.data, typeof response.data, response.data);
                if(Array.isArray(response.data)){
                setSearchResults(response.data.map(r => r.id));
            }else{
                setError("No pokeymon found for the query");
            }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }

    useEffect(()=>{
        if (query) chat(query);

    }, [query]);


    return (
    <div className='chat'>
        <Input fluid 
        onChange={(e)=> setInput(e.target.value)} onKeyPress={(e)=>{if(e.key === 'Enter') setQuery(input)}}
        icon={<Icon name='send' inverted circular link onClick={() => setQuery(input)}/>}
        placeholder='Ask me a Pokemon Question...'
        />
        <Label pointing='above' message="strongest pokemon limit 1" onClick={(e)=> setQuery(e.target.getAttribute('message'))}> Strongest Pokemon </Label>
        <Label pointing='above' message="weakest pokemon limit 1" onClick={(e)=> setQuery(e.target.getAttribute('message'))}> Weakest Pokemon </Label>
        <Label pointing='above' message="starter pokemon limit 3" onClick={(e)=> setQuery(e.target.getAttribute('message'))}> Starter Pokemon </Label>

        {loading && <p>Loading</p>}
        {error && <p>Error: {error}</p>}
        <div style={{display:'flex', flexWrap:'wrap'}}>{results && results.map(r =>(
    <PokemonCard key={`${query}-${r.id}`} pokemonID={r.id} showInput={false} />
))}
</div>

    </div>
    );
}

export {ChatForm};
