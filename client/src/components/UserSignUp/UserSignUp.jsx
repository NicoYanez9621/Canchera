import React, { useEffect, useState } from "react";
import style from "./UserSignUp.module.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { get_users_email, post_users_owner } from "../../redux/action";
import { Validate } from "./validaciones/validaciones";
import Modal from "./Modal/Modal";
import ModalError from "./Modal/ModalError";
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

const UserSignUp = () => {
  /* let users = useSelector((state) => state.users); */
  let dispatch = useDispatch();

  /*  let [info, setInfo] = useState([]); */
  const [openModal, setOpenModal] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [error, setError] = useState({});
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /*useEffect(() => {
    dispatch(get_users());
    /* setInfo(usuarios); 
  }, [dispatch]);*/

  const handlerInputChange = (e) => {
    var value = e.target.value;
    var name = e.target.name;
    setData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
    setError(Validate({ ...data, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (data.name && data.email && data.password && data.confirmPassword) {
      /* await dispatch(get_users_email(data.email)); */
      let users = await axios.get(
        `http://localhost:3001/user?email=${data.email}`
      );

      console.log(users.data);
      if (users.data.hasOwnProperty("msg")) {
        console.log("no existe un usuario registrado con este email");
        dispatch(post_users_owner(data));
        setOpenModal(true);
        let formulario = document.getElementById("formul");
        formulario.reset();
      } else {
        console.log("existe un usuario registrado con este email");
        setOpenModalError(true);
      }
    } else {
      console.log("no enviado");
      setOpenModalError(true);
    }
  };

  /* const disabeledSubmit = useMemo(() => {
    if (error.name || error.email || error.password) {
      return true;
    }

    return false;
  }, [error]); */

  return (
    <div className={style.contenedor}>
      <form
        id="formul"
        className={style.signInForm}
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
        <h2 className={style.title}>Register User</h2>
        <div className={style.inputField}>
          <FaUserAlt className={style.fasFaUser} />
          <input
            autoComplete="off"
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            onChange={(e) => handlerInputChange(e)}
          />
        </div>
        <div className={style.containerError}>
          {error.name && <p className={style.error}>{error.name}</p>}
        </div>
        <div className={style.inputField}>
          <MdEmail className={style.fasFaUser} />
          <input
            autoComplete="off"
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            onChange={(e) => handlerInputChange(e)}
          />
        </div>
        <div className={style.containerError}>
          {error.email && <p className={style.error}>{error.email}</p>}
        </div>
        <div className={style.inputField}>
          <RiLockPasswordFill className={style.fasFaUser} />
          <input
            autoComplete="off"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={(e) => handlerInputChange(e)}
          />
        </div>
        <div className={style.containerError}>
          {error.password && <p className={style.error}>{error.password}</p>}
        </div>
        <div className={style.inputField}>
          <RiLockPasswordFill className={style.fasFaUser} />
          <input
            autoComplete="off"
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={(e) => handlerInputChange(e)}
          />
        </div>
        <div className={style.containerError}>
          {error.confirmPassword && (
            <p className={style.error}>{error.confirmPassword}</p>
          )}
        </div>
        <div>
          <input
            type="submit"
            className={style.boton}
            /* disabled={disabeledSubmit} */
            value="Register"
          />
          {openModal && <Modal closeModal={setOpenModal} />}
          {openModalError && <ModalError closeModal={setOpenModalError} />}
        </div>
        <p className={style.socialText}>O inicia con tu red social favorita</p>
        <div className={style.socialMedia}>
          <a href="#" className={style.socialIcon}>
            <FcGoogle className={style.fabFaGoogle} />
          </a>
        </div>
      </form>
    </div>
  );
};

export default UserSignUp;