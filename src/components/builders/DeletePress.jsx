import React from "react";
import { Button, Col } from "reactstrap";
import Axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function DeletePress({ uuid }) {
  const token = useSelector((state) => state.admin.token);

  const notifySuccess = () => {
    toast.success("Relation Presse supprimée!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const notifyError = () => {
    toast.error("Erreur !", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const deletePress = async () => {
    try {
      await Axios.delete(
        `https://btz-js-202003-p3-lookup-back.jsrover.wilders.dev/press/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      notifySuccess();
    } catch (error) {
      notifyError();
    }
  };
  return (
    <Col>
      <Button onClick={deletePress}>Supprimer</Button>
    </Col>
  );
}