import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import { Spinner, Dropdown } from 'react-bootstrap';
import apiClient from '../helpers/jwtInterceptor';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import Table from 'react-bootstrap/Table';
import { faPlus, faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';


const urlUsers = process.env.REACT_APP_API_URL + '/users';
const urlProducts = process.env.REACT_APP_API_URL + '/products';
const urlInventoryMovements = process.env.REACT_APP_API_URL + '/inventorymovements';

function EditInventoryMovement({ show, onHide, editData, handleChange, handleSave }) {
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [inventoryMovements, setInventoryMovements] = useState([]);
    const [editDataDetail, setEditDataDetail] = useState({ idrefdetail: '', idproduct: '', iduser: '', movementdate: '', typemovement: '', quantity: '', unitprice: ''  });

    useEffect(() => {
        const getInventoryMovements = async () => {
            const responseApi = await apiClient.get(urlInventoryMovements)
            setInventoryMovements(responseApi.data.inventoryMovements);
        };
        if (inventoryMovements.length === 0) {
            getInventoryMovements();
        }
    }, [inventoryMovements]);

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
        editDataDetail.idinventorymomevent = editData.id;
        apiClient.post(`${urlInventoryMovements}`, editDataDetail)
            .then((response) => {
                if (response.data.inventoryMovements) {
                    setInventoryMovements([...inventoryMovements, response.data.inventoryMovements]);
                    setEditDataDetail({  idrefdetail: '', idproduct: '', iduser: '', movementdate: '', typemovement: '', quantity: '', unitprice: ''  });
                }
            })
            .catch(error => {
                console.log(error);
            });
    };
    const handleDeleteDetails = (id) => {
        const deleteInventoryMovement = async () => {
            try {
                const responseApi = await apiClient.delete(`${urlInventoryMovements}/${id}`);
                if (responseApi.data.inventoryMovements) {
                    setInventoryMovements(inventoryMovements.filter((item) => item.id !== id));
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
                    error.response.data.message,
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
                deleteInventoryMovement();
            };
        })
    }

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal show={show} onHide={onHide}>

                <Modal.Header closeButton>
                    <Modal.Title>Editar Articulo</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form id="ditForm" noValidate validated={validated}>
                        
                        <Form.Group className="mb-3" controlId="formMovementDate">
                            <Form.Label>Fecha del Movimiento</Form.Label>
                            <Form.Control type="date" placeholder="Fecha de Movimiento" name="movementdate" value={editData.movementdate} onChange={handleChange} autoFocus required />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingresa una Fecha.
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
                                    <Dropdown>
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

                            {inventoryMovements ? inventoryMovements.map((inventoryMovement) => (
                                <tr key={inventoryMovement.id}>
                                    <td>{inventoryMovement.idproduct && products.length > 0 ? products.find(product => product.id === inventoryMovement.idproduct).name : 'N/A'}</td>
                                    <td>{inventoryMovement.quantity}</td>
                                    <td>{inventoryMovement.unitprice}</td>
                                    <td>
                                        <Button variant="outline-warning" className="me-2">
                                            <FontAwesomeIcon className="me-1" icon={faEdit} />

                                        </Button>
                                        <Button variant="outline-danger" className="me-2" onClick={() => handleDeleteDetails(inventoryMovement.id)}>

                                            <><FontAwesomeIcon className="me-1" icon={faTrashCan} /> </>

                                        </Button>
                                    </td>
                                </tr>
                            )) : null}
                        </tbody>
                    </Table>
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

export default EditInventoryMovement;