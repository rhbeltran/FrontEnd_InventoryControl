import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

function EditTypeOfProduct({ show, onHide, editData, handleChange, handleSave }) {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = (event) => {
    const form = document.getElementById('ditForm');
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }
    setValidated(false);
    setLoading(true);
    try {
      handleSave();
    } catch (error) {
      Swal.fire(
        '¡Error!',
        error.response.data.message,
        'error'
      );
    }
    setLoading(false);
  };

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={show} onHide={onHide}>

        <Modal.Header closeButton>
          <Modal.Title>Editar Tipo de Producto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="ditForm" noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formNameType">
              <Form.Label>Nombre del Tipo de Producto</Form.Label>
              <Form.Control type="text" placeholder="Nombre del Tipo de Producto" name="nametype" value={editData.nametype || ''} onChange={handleChange} autoFocus required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un Tipo de Producto.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" placeholder="Descripción" name="description" value={editData.description} onChange={handleChange} required />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            <FontAwesomeIcon className="me-1" icon={faTimes} />
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            <FontAwesomeIcon className="me-1" icon={faSave} />
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
      {loading && (
        <div className="loading">
          <Spinner animation="border" role="status" size="lg">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </div>
  );
}

export default EditTypeOfProduct;