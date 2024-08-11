import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Dropdown from 'react-bootstrap/Dropdown';
import Swal from 'sweetalert2';


function EditUser({ show, onHide, editData, handleChange, handleSave }) {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([{ text: 'Administrador', value: 'admin' }, { text: 'Operador', value: 'operator' }]);


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
            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Rol</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {editData.role ? roles.find(role => role.value === editData.role).text : 'Seleccionar'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {roles.map(role => (
                    <Dropdown.Item key={role.value} onClick={() => handleChange({ target: { name: "role", value: role.value } })}>
                      {role.text}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el Rol del Usuario.
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

export default EditUser;