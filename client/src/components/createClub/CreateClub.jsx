import React, {useState, useEffect} from 'react';
import FieldForm from './FieldForm';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useSelector } from 'react-redux';
import axios from 'axios';
import './createClub.css'
import { validate } from './validation';

const CreateClub = () => {
    const [showValid, setShowValid] = useState(false)    
    const [ valid, setValid] = useState({}) 
    const [ input, setInput] = useState({fields: []})
    useEffect(()=>{
        setValid(validate(input))
    },[input])    

    const [ location, setLocation] = useState("")
    const [ latLong, setLatLong] =  useState({})
    
    const user = useSelector(state => state.user)
    console.log('user : ', user)

    const handleSubmit = async (e) => {
       e.preventDefault()  
        if (!valid.valid){
            setShowValid(true)
        }
        else {
            const toPost = {...input, image:"TBD", score:"3", userId: user.id}
            axios.post('http://localhost:3001/club', toPost)
            .then(res => console.log('res data : ', res.data))
            .catch(err => console.log(err))
        } 
    }
   

    const handleInput = (e) => {
        e.preventDefault()
        const {name, value} = e.target
        setInput(input => ({...input, [name]: value}))
       
    }   

    const fieldInput = (field) => {        
        setInput({...input, fields: [...input.fields, field]})
    }

    const findMap = (e) => {
        e.preventDefault()
        const queryString = location.split(" ").join("+")
        console.log('querystring is', queryString)
        axios.get(`https://nominatim.openstreetmap.org/search?q=${queryString}&format=json&polygon_geojson=1&addressdetails=1`)
        .then( res => {
            console.log(res.data)
            setInput({...input, latitude:res.data[0].lat, longitude:res.data[0].lon})
            if (!res.data[0].lat){
                return setValid({...valid, map: 'ingrese una dirección válida'})
            }
            setLatLong({lat:res.data[0].lat, lon:res.data[0].lon})
        })
        .catch(err => {
            setInput(input=>({...input, latitude:'34.60', longitude:'58.38' }))
            setLatLong({lat:'34.60', lon:'58.38' })
            //return setValid({...valid, map: 'ingrese una dirección válida'})
        })
    }
    
    console.log('input is ', input)
    console.log('latLong is', latLong)
    //console.log('valid:', valid)
    return (
        <div className='createClub'>
            <form onSubmit={(e) => {
               
                handleSubmit(e)}}>
            <h3>Complete los datos de su establecimiento</h3>
            {valid.all && showValid && <p className='validation'>{valid.all}</p>}
            <label htmlFor="name">Nombre</label>
            <input onChange={(e)=>handleInput(e)} type="text" name="name" />
            {valid.name && <p className='validation'>{valid.name}</p>}        
            <br />
            
            <label htmlFor="descritption">Description</label>
            <input onChange={(e)=>handleInput(e)} type="text" name="description" />
            {valid.name && showValid && <p className='validation'>{valid.description}</p>}
            <br />
            
            <label htmlFor="location">Location</label>
            <input onChange={(e)=> {handleInput(e)
                                    setLocation(e.target.value)
            }} type="text" name="location" />
            <button onClick={(e)=>findMap(e)}>find map</button>
            {valid.location && showValid && <p className='validation'>{valid.location}</p>}
            <br />

{   latLong.lat && 
            <MapContainer center={[latLong.lat, latLong.lon]} zoom={13} id="map">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latLong.lat, latLong.lon]}>
                    <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
            
}            
            <label htmlFor="openHour">horario apertura</label>
            <select onChange={(e)=>handleInput(e)} type="text" name="openHour">
                <option value="5">5am</option>
                <option value="6">6am</option>
                <option value="7">7am</option>
                <option value="8">8am</option>
                <option value="9">9am</option>
                <option value="10">10am</option>
                <option value="11">11m</option>
                <option value="12">12pm</option>
                <option value="13">1pm</option>
                <option value="14">2pm</option>
                <option value="15">3pm</option>
                <option value="16">4pm</option>
                <option value="17">5am</option>
             </select>
            <label htmlFor="closeHour">horario cierre</label>
            <select onChange={(e)=>handleInput(e)} type="text" name="closeHour">
                <option value="18">6pm</option>
                <option value="19">7pm</option>
                <option value="20">8pm</option>
                <option value="21">9pm</option>
                <option value="22">10pm</option>
                <option value="23">11pm</option>
                <option value="0">12am</option>
             </select>
             <br />
             <p>suba una imagen</p>
            <input name="addPhoto" type='file' ></input> 
            {
                input.fields && input.fields.map( (field, i) => (
                 <div className='field' key={i}>
                     <h3>cancha {i+1}</h3>
                     <p>tamaño: {field.size}</p>
                     <p>precio: {field.price}</p>
                 </div>   
                ))

            }
            <p>agregue sus canchas</p>
            {valid.fields && showValid && <p className='validation'>{valid.fields}</p>}
            <FieldForm handleInput={fieldInput} />

            <button type='submit'>guardar</button>
            </form>
            
        </div>
    );
}

export default CreateClub;