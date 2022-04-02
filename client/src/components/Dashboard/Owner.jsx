import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  setHours,
  setMinutes,
  setSeconds,
  addDays,
  subDays,
  isToday,
  format,
} from "date-fns";
import "./style/owner.css";
import FieldCalendar from "../ClubDetail/FieldCalendar/FieldCalendar";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import styles from "./Dashboard.module.css";

function Owner({ id, name, email, rol }) {
  const navigate = useNavigate();
  const [owner, setOwner] = useState({});
  const [club, setClub] = useState({});

  useEffect(() => {
    const getOwner = (email) => {
      axios.get(`/owner?email=${email}`).then((res) => setOwner(res.data));
    };
    getOwner(email);
  }, [email]);

  useEffect(() => {
    setClub(owner.Club);
  }, [setClub, owner.Club]);

  const [selectedDates, setSelectedDates] = useState([]);

  const now = new Date();
  const today = setSeconds(setMinutes(setHours(now, 8), 0), 0);
  const [selectedDay, setSelectedDay] = useState(today);
  const days = [today];
  for (let i = 1; i < 15; i++) {
    days[i] = addDays(today, i);
  }
  const handleNextDay = () => {
    if (selectedDay.toString() === days[days.length - 1].toString()) {
      return;
    } else {
      setSelectedDay((selectedDay) => addDays(selectedDay, 1));
    }
  };

  const handlePrevDay = () => {
    if (selectedDay.toString() === days[0].toString()) {
      return;
    } else {
      setSelectedDay((selectedDay) => subDays(selectedDay, 1));
    }
  };

  const handleCalendar = (e, date, fieldId) => {
    
    let existent = selectedDates.find(
      (d) => d.time.toString() === date.toString()
    );
    if (!existent) {
      setSelectedDates([...selectedDates, { time: date, field: fieldId }]);

      e.target.classList.add("selected");
    } else {
      setSelectedDates([
        ...selectedDates.filter((d) => d.time.toString() !== date.toString()),
      ]);

      e.target.classList.remove("selected");
    }
  };

  const handleBlock = async () => {
    const toPost = { userId: owner.id, dates: selectedDates };

    const post = await axios.post("/booking", toPost);
    console.log("booking response: ", post.data);
    if (post.data.length) window.location.reload();
  };
  const [bookingDetail, setBookingDetail] = useState({detail:{}, show: false})
  
  const handleInfo = (e, fieldId, booking) => {
    e.preventDefault()
    console.log('handling info booking: ', booking)
    setBookingDetail({show: true, detail:{fieldId,booking} })

  }
  const closeInfo = () => {
    setBookingDetail({detail:{}, show: false})
  }

  console.log('booking detail', bookingDetail)
  console.log('club: ', club)
  return (
    <div>
      <h1>Bienvenido {name}</h1>

      <div>
        <NavLink to="/createClub">
          <button> create club</button>
        </NavLink>
      </div>

      {club && (
        <div>
          <h3>Datos de su club </h3>
          <p>Nombre: {club.name}</p>
          <p>Descripción: {club.description}</p>
          <p>Dirección: {`${club.street} ${club.num} ${club.ciudad}`}</p>
          <p>Horario: {`de ${club.openHour} a ${club.closeHour} hs`}</p>

          <button>editar</button>
        </div>
      )}

      <div>
        <h1>Reservas owner</h1>
        {bookingDetail.show && <div className="bookingDetail" >
          
            <div>
              <h5>Detalles de reserva</h5>
               <p>Usuario: {bookingDetail.detail.booking.User.name}</p>
               <p>email: {bookingDetail.detail.booking.User.email}</p>
               <p>cancha: {club.Fields.findIndex( field => field.id === bookingDetail.detail.fieldId)+1}</p>
               <p>hora: {new Date(bookingDetail.detail.booking.time).toLocaleDateString()
               +" "+
               new Date(bookingDetail.detail.booking.time).toLocaleTimeString()}</p>

            </div>
         
        </div>}
       
        <div className="calendarControls">
          <div className="button" onClick={handlePrevDay}>
            ⏪
          </div>
          <p>
            {isToday(selectedDay) ? "hoy" : selectedDay.toLocaleDateString()}
          </p>
          <div className="button" onClick={handleNextDay}>
            ⏩
          </div>
        </div>
        
        {club &&
          club.Fields &&
          club.Fields.map((field) => (
            <>
              <FieldCalendar
                day={selectedDay}
                close={club.closeHour}
                open={club.openHour}
                players={field.players}
                bookings={field.Bookings}
                price={field.price}
                handleClick={handleCalendar}
                handleInfo={handleInfo}
                fieldId={field.id}
                surface={field.surface}
                user='owner'
              />

              <button onClick={handleBlock}>bloquear</button>
            </>
          ))}
      </div>

      {/* <div>
                     <h1>Clubes</h1>
                    {
                        clubes.length && clubes.map((o) =>(   
                            <table id="myTable">
                                <tr className="header">
                                    <th >Name</th>
                                    <th >Descripcion</th>
                                    <th >Location</th>
                                    <th >Ciudad</th>
                                    <th >Horario</th>
                                    <th >Image</th>
                                    <th >Score</th>
                                    <th >Price</th>
                                    <th >Surface</th>
                                    <th >Players</th>
                                </tr>
                                <tr>
                                    <td>{o.name}</td>
                                    <td>{o.description}</td>
                                    <td>{o.location}</td>
                                    <td>{o.ciudad}</td>
                                    <td>{o.openHour} - {o.closeHour}</td>
                                    <td>{o.image}</td>
                                    <td>{o.score}</td>
                                    <td>{o.Fields.price}</td>
                                    <td>{o.Fields.surface}</td>
                                    <td>{o.Fields.players}</td>
                                   
                                </tr>
                                </table>
                        ))
                    }
                    </div> */}
    </div>
  );
}

export default Owner;
