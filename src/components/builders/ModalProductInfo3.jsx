import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import Axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import jwt from "jsonwebtoken";
import { imgurToken } from "../../imgurToken";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactHtmlParser from "react-html-parser";

import { logout } from "../../store/actionCreators";

toast.configure();

function ModalProductInfo({ uuid, description3, picture3, getProductInfo }) {
  const notifySuccess = () => {
    toast.success("Information produit bien modifié !", {
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
    toast.error("Erreur Notification !", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const [modal, setModal] = useState(false);

  const [productInfo3, setProductInfo3] = useState({
    description3,
    picture3,
  });
  const [loading, setLoading] = useState(false);

  const { register } = useForm();
  const dispatch = useDispatch();

  const toggle = () => setModal(!modal);

  const token = useSelector((state) => state.admin.token);

  const handlePicture3 = (e) => {
    setProductInfo3({ ...productInfo3, picture3: e.target.files[0] });
  };

  const putProductInfo = async (e) => {
    e.preventDefault();
    try {
      const resImgur = await Axios.post(
        "https://api.imgur.com/3/image",
        productInfo3.picture3,
        {
          headers: { Authorization: `Client-ID ${imgurToken}` },
        }
      );
      await Axios.put(
        `https://btz-js-202003-p3-lookup-back.jsrover.wilders.dev/products_info/${uuid}`,
        {
          description3: productInfo3.description3,
          picture3: resImgur.data.data.link,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getProductInfo();
      notifySuccess();
    } catch (err) {
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const { exp } = jwt.decode(token);
        if (exp < (new Date().getTime() + 1) / 1000) {
          return dispatch(logout());
        }
        return toggle();
      } catch (err) {
        notifyError();
      }
    }
    return dispatch(logout());
  };

  return (
    <Container>
      <Button color="warning" onClick={isAuthenticated}>
        Modifier
      </Button>

      <Modal isOpen={modal} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Produits informations</ModalHeader>
        <Form onSubmit={putProductInfo}>
          <ModalBody>
            <Row>
              <Col lg="12">
                <label>
                  <h6>Description</h6>{" "}
                </label>
              </Col>
            </Row>
            <Row>
              <Col lg="6">{ReactHtmlParser(description3)}</Col>
              <Col lg="6">
                <CKEditor
                  editor={ClassicEditor}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setProductInfo3({
                      ...productInfo3,
                      description3: data,
                    });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <label>
                  <h6>Image</h6>
                </label>
              </Col>
            </Row>
            <Row>
              <Col lg="6">{picture3}</Col>
              <Col lg="6">
                <input
                  ref={register({ required: true })}
                  type="file"
                  files={productInfo3.picture3}
                  name="picture2"
                  onChange={handlePicture3}
                />
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="success" type="submit" onClick={toggle}>
              {loading ? <Spinner size="sm" /> : "Valider"}
            </Button>{" "}
            <Button color="danger" onClick={toggle}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  );
}

export default ModalProductInfo;
