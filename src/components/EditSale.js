import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { Spinner, Dropdown } from 'react-bootstrap';
import apiClient from '../helpers/jwtInterceptor';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Table from 'react-bootstrap/Table';
import { faPlus, faEdit, faTrashCan, faCheckDouble, faXmark } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';



const urlClients = process.env.REACT_APP_API_URL + '/clients';
const urlUsers = process.env.REACT_APP_API_URL + '/users';
const urlProducts = process.env.REACT_APP_API_URL + '/products';
const urlSalesDetails = process.env.REACT_APP_API_URL + '/salesDetails';

function EditSale({ show, onHide, editData, handleChange, handleSave, handleProcess, handleCancel }) {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [saleDetails, setSaleDetails] = useState([]);
  const [editDataDetail, setEditDataDetail] = useState({ idsales: '', idproduct: '', quantity: '', unitprice: '' });
  const [paymentMethods, setPaymentMethods] = useState([{ text: 'Efectivo', value: 'E' }, { text: 'Tarjeta de Credito', value: 'TC' }, { text: 'Transferencia', value: 'T' }]);

  useEffect(() => {
    const getSalesDetails = async () => {
      const responseApi = await apiClient.get(urlSalesDetails);
      const dataDetails = responseApi.data.salesDetails;
      if (dataDetails) {
        const saleDetail = dataDetails.filter(saleDetail => saleDetail.idsales === editData.id);
        setSaleDetails(saleDetail);
      }
    };
    getSalesDetails();
  }, [editData.id]);

  useEffect(() => {
    const getProducts = async () => {
      const responseApi = await apiClient.get(urlProducts)
      setProducts(responseApi.data.products);
    };
    if (products.length === 0) {
      getProducts();
    }
  }, [products]);

  useEffect(() => {
    const getClients = async () => {
      const responseApi = await apiClient.get(urlClients)
      setClients(responseApi.data.clients);
    };
    if (clients.length === 0) {
      getClients();
    }
  }, [clients]);

  useEffect(() => {
    const getUsers = async () => {
      const responseApi = await apiClient.get(urlUsers)
      setUsers(responseApi.data.users);
    };
    if (users.length === 0) {
      getUsers();
    }
  }, [users]);

  const handleSaveChanges = async (event) => {
    const form = document.getElementById('ditForm');
    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }
    setValidated(false);
    setLoading(true);
    try {
      await handleSave();
    } catch (error) {
      Swal.fire(
        '¡Error!',
        error.response.data.message,
        'error'
      );
    }
    setLoading(false);
  };
  const handleChangeDetail = (e) => { setEditDataDetail({ ...editDataDetail, [e.target.name]: e.target.value }) };
  const handleSaveDetails = async (event) => {
    if (!editDataDetail.idproduct) {
      Swal.fire(
        '¡Error!',
        'Por favor ingresa el producto.',
        'error'
      );
      return;
    }
    if (!editDataDetail.quantity) {
      Swal.fire(
        '¡Error!',
        'Por favor ingresa la cantidad.',
        'error'
      );
      return;
    }
    if (!editDataDetail.unitprice) {
      Swal.fire(
        '¡Error!',
        'Por favor ingresa el precio.',
        'error'
      );
      return;
    }
    if (editDataDetail.quantity <= 0 || editDataDetail.unitprice <= 0) {
      Swal.fire(
        '¡Error!',
        'La cantidad o el precio deben ser mayores de cero.',
        'warning'
      );
      return;
    }
    editDataDetail.idsales = editData.id;
    apiClient.post(`${urlSalesDetails}`, editDataDetail)
      .then((response) => {
        if (response.data.salesDetails) {
          setSaleDetails([...saleDetails, response.data.salesDetails]);
          setEditDataDetail({ idsales: '', idproduct: '', quantity: '', unitprice: '' });
        }
      })
      .catch(error => {
        console.log(error);
        Swal.fire(
          '¡Error!',
          error.response.data.message + ' ' + (error.response.data.error || ''),
          'error'
        );
      });
  };
  const handleDeleteDetails = (id) => {
    const deleteSale = async () => {
      try {
        const responseApi = await apiClient.delete(`${urlSalesDetails}/${id}`);
        if (responseApi.data.salesDetails) {
          setSaleDetails(saleDetails.filter((item) => item.id !== id));
          Swal.fire(
            '¡Eliminado!',
            'El detalle de venta ha sido eliminado.',
            'success'
          )
        }
      } catch (error) {
        console.log(error);
        Swal.fire(
          '¡Error!',
          error.response.data.message + ' ' + (error.response.data.error || ''),
          'error'
        );
      };

    }
    Swal.fire({
      title: '¿Estás seguro de eliminar el detalle de la venta?',
      text: "¡No podrás revertir esto!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSale();
      };
    })
  }

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={show} onHide={onHide} size="lg">

        <Modal.Header closeButton>
          <Modal.Title>Editar Venta</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="ditForm" noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formStock">
              <Form.Label>Cliente</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {editData.idclient && clients.length > 0 ? clients.find(client => client.id === editData.idclient).name : 'Seleccionar'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {clients.map(client => (
                    <Dropdown.Item key={client.id} onClick={() => handleChange({ target: { name: "idclient", value: client.id } })}>
                      {client.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el id del Cliente.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSaledate">
              <Form.Label>Fecha de la Venta</Form.Label>
              <Form.Control type="date" placeholder="Fecha de Venta" name="saledate" value={editData.saledate} onChange={handleChange} autoFocus required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa una Fecha.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPaymentmethod">
              <Form.Label>Método de Pago</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {editData.paymentmethod ? paymentMethods.find(paymentMethod => paymentMethod.value === editData.paymentmethod).text : 'Seleccionar'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {paymentMethods.map(paymentMethod => (
                    <Dropdown.Item key={paymentMethod.value} onClick={() => handleChange({ target: { name: "paymentmethod", value: paymentMethod.value } })}>
                      {paymentMethod.text}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa un Método de Pago.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
          <Table hover responsive="sm">
            <thead>{/*encabezado de la tabla*/}
              <tr> {/*fila*/}
                <th>Producto</th> {/*columna de encabezado*/}
                <th>Cantidad</th>
                <th>Precio</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody> {/*cuerpo de la tabla*/}
              <tr key="new">
                <td> {/*celda*/}
                  <Dropdown className='fixed-width-dropdown'>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      {editDataDetail.idproduct ? products.find(product => product.id === editDataDetail.idproduct).name : 'Seleccionar'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {products.map(product => (
                        <Dropdown.Item key={product.id} onClick={() => handleChangeDetail({ target: { name: "idproduct", value: product.id } })}>
                          {product.name}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <Form.Control type="number" placeholder="Cantidad" name="quantity" value={editDataDetail.quantity} onChange={handleChangeDetail} min={0.1} autoFocus required />
                </td>
                <td>
                  <Form.Control type="number" placeholder="Precio" name="unitprice" value={editDataDetail.unitprice} onChange={handleChangeDetail} min={0.1} required />
                </td>
                <td>
                  <Button variant="primary" className='me-2' onClick={handleSaveDetails}>
                    <FontAwesomeIcon className="me-1" icon={faPlus} />
                    Agregar
                  </Button>
                </td>
              </tr>

              {saleDetails ? saleDetails.map((saleDetail) => (
                <tr key={saleDetail.id}>
                  <td>{saleDetail.idproduct && products.length > 0 ? products.find(product => product.id === saleDetail.idproduct).name : 'N/A'}</td>
                  <td>{saleDetail.quantity}</td>
                  <td>{saleDetail.unitprice}</td>
                  <td>

                    <Button variant="outline-danger" className="me-2" onClick={() => handleDeleteDetails(saleDetail.id)}>

                      <><FontAwesomeIcon className="me-1" icon={faTrashCan} /> </>

                    </Button>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </Table>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={() => handleProcess(editData.id)}>
            <FontAwesomeIcon className="me-1" icon={faCheckDouble} />
            Process
          </Button>
          <Button variant="danger" onClick={() => handleCancel(editData.id)}>
            <FontAwesomeIcon className="me-1" icon={faXmark} />
            Cancel
          </Button>
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

export default EditSale;