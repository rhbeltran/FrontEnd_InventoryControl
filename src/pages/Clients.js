import { React, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import EditClient from "../components/EditClient";
import { Spinner } from "react-bootstrap";
import apiClient from "../helpers/jwtInterceptor";

const urlClients = process.env.REACT_APP_API_URL + '/clients';
const Clients = () => {
  const [clients, setClients] = useState([]);
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
  //onDelete
  const onDelete = (id) => {
    setLoading([...loading, id]);
    const deleteClient = async () => {
      const responseApi = await apiClient.delete(`${urlClients}/${id}`);
      if (responseApi.data.clients) {
        setLoading(loading.filter((item) => item !== id));
        setClients(clients.filter((item) => item.id !== id));
        Swal.fire(
          '¡Eliminado!',
          'El cliente ha sido eliminado.',
          'success'
        )
      }
    }
    Swal.fire({
      title: '¿Estás seguro de eliminar el cliente?',
      text: "¡No podrás revertir esto!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClient();
      }else{
        setLoading(loading.filter((item) => item !== id));
      }
    })
  }
  const handleEdit = (id) => {
    if (id) {
      const client = clients.find((item) => item.id === id);
      setEditData(client);
    } else {
      setEditData({ firstname: '', lastname: '', address: '', telephone: '', email: '' });
    }
    setShowModal(true);
  }
  const handleSave = async () => new Promise(async (resolve, reject) =>{
    let clientExists = clients.find((item) => item.id === editData.id);
    if (clientExists) {
      apiClient.put(`${urlClients}/${editData.id}`, editData)
        .then((response) => {
          if (response.data.client) {
            const updateClient = clients.map((item) =>
              item.id === editData.id ? response.data.client : item
            );
            setClients(updateClient);
            setShowModal(false);
            setEditData({ firstname: '', lastname: '', address: '', telephone: '', email: '' });
            Swal.fire(
              '¡Actualizado!',
              'El cliente ha sido actualizado.',
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
      apiClient.post(`${urlClients}`, editData)
        .then((response) => {
          if (response.data.client) {
            setClients([...clients, response.data.client]);
            setShowModal(false);
            setEditData({ firstname: '', lastname: '', address: '', telephone: '', email: '' });
            Swal.fire(
              '¡Ingresado!',
              'El cliente ha sido ingresado.',
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
  })
  const handleChange = (e) => { setEditData({ ...editData, [e.target.name]: e.target.value }) };

  return (
    <>
      <div className="col-xl-12 mb-4" >
        <h1>Clientes</h1>
      </div>
      <div className="col-xl-12 mb-4">
        <Button variant="primary" onClick={() => handleEdit('')}>
          Agregar Nuevo Cliente
        </Button>
      </div>
      <div className="col-xl-12">
        <Table hover responsive="sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.firstname}</td>
                <td>{client.lastname}</td>
                <td>{client.address}</td>
                <td>{client.telephone}</td>
                <td>{client.email}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(client.id)}>Editar</Button>
                  <Button variant="danger" onClick={() => onDelete(client.id)}>
                  {loading.includes(client.id)?<><Spinner animation="border" size="sm" role="status"/>Eliminando...</>:'Eliminar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <EditClient show={showModal} onHide={() => setShowModal(false)} editData={editData} handleChange={handleChange} handleSave={handleSave} />
      </div>
    </>
  );
};

export default Clients;