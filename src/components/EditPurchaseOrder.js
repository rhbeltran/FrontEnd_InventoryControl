import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { Dropdown, Spinner } from 'react-bootstrap';
import apiClient from '../helpers/jwtInterceptor';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import { faPlus, faEdit, faTrashCan, faCheckDouble, faXmark } from "@fortawesome/free-solid-svg-icons";
import Table from 'react-bootstrap/Table';



const urlUsers = process.env.REACT_APP_API_URL + '/users';
const urlSuppliers = process.env.REACT_APP_API_URL + '/suppliers';
const urlProducts = process.env.REACT_APP_API_URL + '/products';
const urlPurchaseDetails = process.env.REACT_APP_API_URL + '/purchaseDetails';

function EditPurchaseOrder({ show, onHide, editData, handleChange, handleSave, handleProcess, handleCancel }) {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [editDataDetail, setEditDataDetail] = useState({ idpurchaseorders: '', idproduct: '', quantity: '', unitprice: '' });



  useEffect(() => {
    const getPurchaseDetails = async () => {
      const responseApi = await apiClient.get(urlPurchaseDetails)
      const dataDetails = responseApi.data.purchaseDetails;
      if (dataDetails) {
        console.log(editData.id);
        const purchaseDetail = dataDetails.filter(purchaseDetail => purchaseDetail.idpurchaseorders === editData.id);
        setPurchaseDetails(purchaseDetail);
      }
    };
    getPurchaseDetails();
  }, [editData.id]);

  useEffect(() => {
    const getProducts = async () => {
      const responseApi = await apiClient.get(urlProducts)
      setProducts(responseApi.data.products);
    }
    if (products.length === 0) {
      getProducts();
    }
  }, [products]);

  useEffect(() => {
    const getSuppliers = async () => {
      const responseApi = await apiClient.get(urlSuppliers)
      setSuppliers(responseApi.data.suppliers);
    }
    if (suppliers.length === 0) {
      getSuppliers();
    }
  }, [suppliers]);

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
  const handleChangeDetail = (e) => { console.log(editDataDetail); setEditDataDetail({ ...editDataDetail, [e.target.name]: e.target.value }) };
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
    editDataDetail.idpurchaseorders = editData.id;
    apiClient.post(`${urlPurchaseDetails}`, editDataDetail)
      .then((response) => {
        if (response.data.purchaseDetails) {
          setPurchaseDetails([...purchaseDetails, response.data.purchaseDetails]);
          setEditDataDetail({ idpurchaseorders: '', idproduct: '', quantity: '', unitprice: '' });
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
    const deletePurchaseOrder = async () => {
      try {
        const responseApi = await apiClient.delete(`${urlPurchaseDetails}/${id}`);
        if (responseApi.data.purchaseDetails) {
          setPurchaseDetails(purchaseDetails.filter((item) => item.id !== id));
          Swal.fire(
            '¡Eliminado!',
            'El detalle de compra ha sido eliminado.',
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
      title: '¿Estás seguro de eliminar el detalle de la compra?',
      text: "¡No podrás revertir esto!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deletePurchaseOrder();
      };
    })
  };

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={show} onHide={onHide} size="lg">

        <Modal.Header closeButton>
          <Modal.Title>Editar Orden de Compra</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="ditForm" noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="formStock">
              <Form.Label>Proveedor</Form.Label>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {editData.idsupplier && suppliers.length > 0 ? suppliers.find(supplier => supplier.id === editData.idsupplier).name : 'Seleccionar'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {suppliers.map(supplier => (
                    <Dropdown.Item key={supplier.id} onClick={() => handleChange({ target: { name: "idsupplier", value: supplier.id } })}>
                      {supplier.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Form.Control.Feedback type="invalid">
                Por favor ingresa el id del Proveedor.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formOrderDate">
              <Form.Label>Fecha de la Orden</Form.Label>
              <Form.Control type="date" placeholder="Fecha de la Orden" name="orderdate" value={editData.orderdate} onChange={handleChange} autoFocus required />
              <Form.Control.Feedback type="invalid">
                Por favor ingresa una Fecha.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
          <Table hover responsive="sm">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr key="new">
                <td>
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
                  <Form.Control type="number" placeholder="Cantidad" name="quantity" value={editDataDetail.quantity} onChange={handleChangeDetail} autoFocus required />
                </td>
                <td>
                  <Form.Control type="number" placeholder="Precio" name="unitprice" value={editDataDetail.unitprice} onChange={handleChangeDetail} required />
                </td>
                <td>
                  <Button variant="primary" className='me-2' onClick={handleSaveDetails}>
                    <FontAwesomeIcon className="me-1" icon={faPlus} />
                    Agregar
                  </Button>
                </td>
              </tr>

              {purchaseDetails ? purchaseDetails.map((purchaseDetail) => (
                <tr key={purchaseDetail.id}>
                  <td>{purchaseDetail.idproduct && products.length > 0 ? products.find(product => product.id === purchaseDetail.idproduct).name : 'N/A'}</td>
                  <td>{purchaseDetail.quantity}</td>
                  <td>{purchaseDetail.unitprice}</td>
                  <td>
 
                    <Button variant="outline-danger" className="me-2" onClick={() => handleDeleteDetails(purchaseDetail.id)}>

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

export default EditPurchaseOrder;