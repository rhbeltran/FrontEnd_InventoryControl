import { React, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import EditSale from "../components/EditSale";
import { Spinner } from "react-bootstrap";
import apiClient from "../helpers/jwtInterceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";

const urlSales = process.env.REACT_APP_API_URL + '/sales';
const urlClients = process.env.REACT_APP_API_URL + '/clients';
const urlUsers = process.env.REACT_APP_API_URL + '/users';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [editData, setEditData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState([]);

    useEffect(() => {
        const getClients = async () => {
            const responseApi = await apiClient.get(urlClients)
            setClients(responseApi.data.clients);
        }
        if (clients.length === 0) {
            getClients();
        }
    }, [clients]);

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
        const getSales = async () => {
            const responseApi = await apiClient.get(urlSales)
            setSales(responseApi.data.sales);
        }
        if (sales.length === 0) {
            getSales();
        }
    }, [sales]);

    const handleCancelSales = (id) => {
        const cancelSale = () => {
            apiClient.put(`${urlSales}/cancel/${id}`)
                .then((response) => {
                    if (response.data.sales) {
                        const updateSales = sales.map((item) =>
                            item.id === editData.id ? response.data.sales : item
                        );
                        setSales(updateSales);
                        setShowModal(false);
                        setEditData({ iduser: '', idclient: '', saledate: '', paymentmethod: '', state: '' });
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
                cancelSale();
            };
        })
    }

    const handleProcessSales = (id) => {
        const processSale = () => {
            apiClient.put(`${urlSales}/approve/${id}`)
                .then((response) => {
                    if (response.data.sales) {
                        const updateSales = sales.map((item) =>
                            item.id === editData.id ? response.data.sales : item
                        );
                        setSales(updateSales);
                        setShowModal(false);
                        setEditData({ iduser: '', idclient: '', saledate: '', paymentmethod: '', state: '' });
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
                processSale();
            };
        })
    }

    //onDelete
    const onDelete = (id) => {
        setLoading([...loading, id]);
        const deleteSale = async () => {
            try {
                const responseApi = await apiClient.delete(`${urlSales}/${id}`);
                if (responseApi.data.sales) {
                    setSales(sales.filter((item) => item.id !== id));
                    Swal.fire(
                        '¡Eliminado!',
                        'La venta ha sido eliminada.',
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
            title: '¿Estás seguro de eliminar la venta?',
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
            } else {
                setLoading(loading.filter((item) => item !== id));
            }
        })
    }
    const handleEdit = (id) => {
        if (id) {
            const sale = sales.find((item) => item.id === id);
            setEditData(sale);
        } else {
            setEditData({ saledate: '', paymentmethod: '', state: '' });
        }
        setShowModal(true);
    }
    //function esperar(ms) {
    //return new Promise(resolve => setTimeout(resolve, ms));
    //}
    const handleSave = async () => new Promise(async (resolve, reject) => {
        let salesExists = sales.find((item) => item.id === editData.id);
        if (salesExists) {
            apiClient.put(`${urlSales}/${editData.id}`, editData)
                .then((response) => {
                    if (response.data.sales) {
                        const updateSales = sales.map((item) =>
                            item.id === editData.id ? response.data.sales : item
                        );
                        setSales(updateSales);
                        //setShowModal(false);
                        setEditData({ iduser: '', idclient: '', saledate: '', paymentmethod: '', state: '' });
                        Swal.fire(
                            '¡Actualizado!',
                            'La venta ha sido actualizada.',
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
            apiClient.post(`${urlSales}/${user}`, editData)
                .then((response) => {
                    if (response.data.sales) {
                        setSales([...sales, response.data.sales]);
                        setEditData({ ...editData, iduser: response.data.sales.iduser, id: response.data.sales.id });
                        //setShowModal(false);
                        //setEditData({ iduser: '', idclient: '', saledate: '', paymentmethod: '', state: '' });
                        Swal.fire(
                            '¡Ingresado!',
                            'La venta ha sido ingresada.',
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
                <h1>Ventas</h1>
            </div>
            <div className="col-xl-12 mb-4">
                <Button variant="primary" onClick={() => handleEdit('')}>
                    <FontAwesomeIcon className="me-1" icon={faPlus} />
                    Agregar Nueva Venta
                </Button>
            </div>
            <div className="col-xl-12">
                <Table hover responsive="sm">
                    <thead>
                        <tr>
                            <th>Número de Venta</th>
                            <th>Usuario</th>
                            <th>Cliente</th>
                            <th>Fecha de Venta</th>
                            <th>Método de Pago</th>
                            <th>Estado</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sales) => (
                            <tr key={sales.id}>
                                <td>{sales.id}</td>
                                <td>{sales.iduser && users.length > 0 ? users.find(user => user.id === sales.iduser).firstname + " " + users.find(user => user.id === sales.iduser).lastname : 'N/A'}</td>
                                <td>{sales.idclient && clients.length > 0 ? clients.find(client => client.id === sales.idclient).name : 'N/A'}</td>
                                <td>{sales.saledate}</td>
                                <td>{sales.paymentmethod}</td>
                                <td>{sales.state}</td>
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => handleEdit(sales.id)}>
                                        <FontAwesomeIcon className="me-1" icon={faEdit} />
                                        Editar
                                    </Button>
                                    <Button variant="danger" onClick={() => onDelete(sales.id)}>
                                        {loading.includes(sales.id) ? (
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
                <EditSale show={showModal} onHide={() => setShowModal(false)} editData={editData} handleChange={handleChange} handleSave={handleSave} handleProcess={handleProcessSales} handleCancel={handleCancelSales} />
            </div>
        </>
    );
};

export default Sales;