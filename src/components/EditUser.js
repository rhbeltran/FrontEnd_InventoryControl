import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';

function EditUser({ show, onHide, editData, handleChange, handleSave }) {
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
    handleSave();
    setLoading(false);
  };

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={show} onHide={onHide}>

        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="ditForm" noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" name="firstname" value={editData.firstname} onChange={handleChange} autoFocus required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un Nombre.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Apellido</Form.Label>
              <Form.Control type="text" placeholder="Apellido" name="lastname" value={editData.lastname} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un Apellido.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGender">
              <Form.Label>Género</Form.Label>
              <Form.Control type="text" placeholder="Género" name="gender" value={editData.gender} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el Género.
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
              <Form.Control type="text" placeholder="Teléfono" name="phone" value={editData.phone} onChange={handleChange} required />
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
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control type="text" placeholder="Nombre de Usuario" name="username" value={editData.username} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el Nombre de Usuario.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="text" placeholder="Contraseña" name="password" value={editData.password} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa una Contraseña.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save changes</Button>
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

export default EditUser;