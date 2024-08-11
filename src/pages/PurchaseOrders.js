import { React, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import EditPurchaseOrder from "../components/EditPurchaseOrder";
import { Spinner } from "react-bootstrap";
import apiClient from "../helpers/jwtInterceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";

const urlPurchaseOrders = process.env.REACT_APP_API_URL + '/purchaseorders';
const urlSuppliers = process.env.REACT_APP_API_URL + '/suppliers';
const urlUsers = process.env.REACT_APP_API_URL + '/users';

const PurchaseOrders = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [users, setUsers] = useState([]);
    const [editData, setEditData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState([]);

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
        }
        if (users.length === 0) {
            getUsers();
        }
    }, [users]);

    useEffect(() => {
        const getPurchaseOrders = async () => {
            const responseApi = await apiClient.get(urlPurchaseOrders)
            setPurchaseOrders(responseApi.data.purchaseOrders);
        }
        if (purchaseOrders.length === 0) {
            getPurchaseOrders();
        }
    }, [purchaseOrders]);

    const handleCancelPurchaseOrders = (id) => {
        const cancelPurchaseOrder = () => {
            apiClient.put(`${urlPurchaseOrders}/cancel/${id}`)
                .then((response) => {
                    if (response.data.purchaseOrder) {
                        const updatePurchaseOrders = purchaseOrders.map((item) =>
                            item.id === editData.id ? response.data.purchaseOrder : item
                        );
                        setPurchaseOrders(updatePurchaseOrders);
                        setShowModal(false);
                        setEditData({ iduser: '', idsupplier: '', orderdate: '', state: '' });
                        Swal.fire(
                            '¡Cancelada!',
                            'La orden de compra ha sido cancelada.',
                            'success'
                        );
                    }
                })
                .catch(error => {
                    console.log(error);
                    Swal.fire(
                        '¡Error!',
                        error.response.data.message + '// ' + error.response.data.error,
                        'error'
                    );
                });
        }
        Swal.fire({
            title: '¿Estás seguro de cancelar la orden de compra?',
            text: "¡No podrás revertir esto!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, Cancelar la order!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                cancelPurchaseOrder();
            };
        })
    }


    const handleProcessPurchaseOrders = (id) => {
        const processPurchaseOrder = () => {
            apiClient.put(`${urlPurchaseOrders}/approve/${id}`)
                .then((response) => {
                    if (response.data.purchaseOrder) {
                        const updatePurchaseOrders = purchaseOrders.map((item) =>
                            item.id === editData.id ? response.data.purchaseOrder : item
                        );
                        setPurchaseOrders(updatePurchaseOrders);
                        setShowModal(false);
                        setEditData({ iduser: '', idsupplier: '', orderdate: '', state: '' });
                        Swal.fire(
                            '¡Procesada!',
                            'La orden de compra ha sido procesada.',
                            'success'
                        );
                    }
                })
                .catch(error => {
                    console.log(error);
                    Swal.fire(
                        '¡Error!',
                        error.response.data.message + '// ' + error.response.data.error,
                        'error'
                    );
                });
        }

        Swal.fire({
            title: '¿Estás seguro de procesar la orden de compra?',
            text: "¡No podrás revertir esto!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, Procesar la order!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                processPurchaseOrder();
            };
        })
    }
    //onDelete
    const onDelete = (id) => {
        setLoading([...loading, id]);
        const deletePurchaseOrder = async () => {
            try {
                const responseApi = await apiClient.delete(`${urlPurchaseOrders}/${id}`);
                if (responseApi.data.purchaseOrders) {
                    setPurchaseOrders(purchaseOrders.filter((item) => item.id !== id));
                    Swal.fire(
                        '¡Eliminado!',
                        'La orden de compra ha sido eliminada.',
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
                setLoading(loading.filter((item) => item !== id));
            }

        }
        Swal.fire({
            title: '¿Estás seguro de eliminar la orden de compra?',
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
            } else {
                setLoading(loading.filter((item) => item !== id));
            }
        })
    }
    const handleEdit = (id) => {
        if (id) {
            const purchaseOrder = purchaseOrders.find((item) => item.id === id);
            setEditData(purchaseOrder);
        } else {
            setEditData({ iduser: '', idsupplier: '', orderdate: '', state: '' });
        }
        setShowModal(true);
    }
    //function esperar(ms) {
    //return new Promise(resolve => setTimeout(resolve, ms));
    //}
    const handleSave = async () => new Promise(async (resolve, reject) => {
        let purchaseOrdersExists = purchaseOrders.find((item) => item.id === editData.id);
        if (purchaseOrdersExists) {
            apiClient.put(`${urlPurchaseOrders}/${editData.id}`, editData)
                .then((response) => {
                    if (response.data.purchaseOrder) {
                        const updatePurchaseOrders = purchaseOrders.map((item) =>
                            item.id === editData.id ? response.data.purchaseOrder : item
                        );
                        setPurchaseOrders(updatePurchaseOrders);
                        //setShowModal(false);
                        setEditData({ iduser: '', idsupplier: '', orderdate: '', state: '' });
                        Swal.fire(
                            '¡Actualizado!',
                            'La orden de compra ha sido actualizado.',
                            'success'
                        );
                        resolve();
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        } else {
            const user = localStorage.getItem('userName');
            editData.state = 'P';
            apiClient.post(`${urlPurchaseOrders}/${user}`, editData)
                .then((response) => {
                    if (response.data.purchaseOrder) {
                        setPurchaseOrders([...purchaseOrders, response.data.purchaseOrder]);
                        setEditData({ ...editData, iduser: response.data.purchaseOrder.iduser, id: response.data.purchaseOrder.id });
                        //setShowModal(false);
                        //setEditData({ iduser: '', idsupplier: '', orderdate: '', state: '' });
                        Swal.fire(
                            '¡Ingresado!',
                            'La orden de compra ha sido ingresada.',
                            'success'
                        );
                        resolve();
                    }
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        }
    });
    const handleChange = (e) => { setEditData({ ...editData, [e.target.name]: e.target.value }) };

    return (
        <>
            <div className="col-xl-12 mb-4" >
                <h1>Ordenes de Compra</h1>
            </div>
            <div className="col-xl-12 mb-4">
                <Button variant="primary" onClick={() => handleEdit('')}>
                    <FontAwesomeIcon className="me-1" icon={faPlus} />
                    Agregar Nueva Orden de Compra
                </Button>
            </div>
            <div className="col-xl-12">
                <Table hover responsive="sm">
                    <thead>
                        <tr>
                            <th>Número de Orden</th>
                            <th>Usuario</th>
                            <th>Proveedor</th>
                            <th>Fecha de realización de la Orden</th>
                            <th>Estado de la Orden</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseOrders.map((purchaseOrders) => (
                            <tr key={purchaseOrders.id}>
                                <td>{purchaseOrders.id}</td>
                                <td>{purchaseOrders.iduser && users.length > 0 ? users.find(user => user.id === purchaseOrders.iduser).firstname + " " + users.find(user => user.id === purchaseOrders.iduser).lastname : 'N/A'}</td>
                                <td>{purchaseOrders.idsupplier && suppliers.length > 0 ? suppliers.find(supplier => supplier.id === purchaseOrders.idsupplier).name : 'N/A'}</td>
                                <td>{purchaseOrders.orderdate}</td>
                                <td>{purchaseOrders.state}</td>
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => handleEdit(purchaseOrders.id)}>
                                        <FontAwesomeIcon className="me-1" icon={faEdit} />
                                        Editar
                                    </Button>
                                    <Button variant="danger" onClick={() => onDelete(purchaseOrders.id)}>
                                        {loading.includes(purchaseOrders.id) ? (
                                            <><Spinner className="me-1" animation="border" size="sm" role="status" />Eliminando...</>
                                        ) : (
                                            <><FontAwesomeIcon className="me-1" icon={faTrashCan} />Eliminar</>
                                        )}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <EditPurchaseOrder show={showModal} onHide={() => setShowModal(false)} editData={editData} handleChange={handleChange} handleSave={handleSave} handleProcess={handleProcessPurchaseOrders} handleCancel={handleCancelPurchaseOrders}/>
            </div>
        </>
    );
};

export default PurchaseOrders;