import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { Dropdown, Spinner } from 'react-bootstrap';
import apiClient from '../helpers/jwtInterceptor';

const urlTypeOfProducts = process.env.REACT_APP_API_URL + '/typesOfProducts';

function EditProduct({ show, onHide, editData, handleChange, handleSave }) {
  const [validated, setValidated] = useState(false);
  const [typeOfProducts, setTypeOfProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTypeOfProducts = async () => {
      const responseApi = await apiClient.get(urlTypeOfProducts)
      setTypeOfProducts(responseApi.data.typesOfProducts);
    }
    if (typeOfProducts.length === 0) {
      getTypeOfProducts();
    }
  }, [typeOfProducts]);

  const handleSaveChanges = async (event) => {
    const form = document.getElementById('ditForm');
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }
    setValidated(false);
    setLoading(true);
    await handleSave();
    setLoading(false);
  };

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={show} onHide={onHide}>

        <Modal.Header closeButton>
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="ditForm" noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" name="name" value={editData.name} onChange={handleChange} autoFocus required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un Nombre.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control type="text" placeholder="Precio" name="price" value={editData.price} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un Precio.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control type="text" placeholder="Descripción" name="description" value={editData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="text" placeholder="Stock" name="stock" value={editData.stock} onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el Stock.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formStock">
              <Form.Label>Tipo del Producto</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {editData.idtypeofproduct ? typeOfProducts.find(typeOfProduct => typeOfProduct.id === editData.idtypeofproduct).nametype : 'Seleccionar'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {typeOfProducts.map(typeOfProduct => (
                    <Dropdown.Item key={typeOfProduct.id} onClick={() => handleChange({ target: { name: "idtypeofproduct", value: typeOfProduct.id } })}>
                      {typeOfProduct.nametype}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el id del producto.
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

export default EditProduct;