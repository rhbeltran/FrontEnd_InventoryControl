import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

function EditClient({ show, onHide, editData, handleChange, handleSave }) {
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
          <Modal.Title>Editar Cliente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="ditForm" noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" name="name" value={editData.name || ''} onChange={handleChange} autoFocus required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un Nombre.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Dirección</Form.Label>
              <Form.Control type="text" placeholder="Dirección" name="address" value={editData.address} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa una Dirección.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control type="text" placeholder="Teléfono" name="telephone" value={editData.telephone} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un Número de Teléfono.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" placeholder="Correo" name="email" value={editData.email} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un correo válido.
              </Form.Control.Feedback>
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

export default EditClient;