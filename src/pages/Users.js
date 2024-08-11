import { React, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import EditUser from "../components/EditUser";
import { Spinner } from "react-bootstrap";
import apiClient from "../helpers/jwtInterceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faUserPlus, faUserPen, } from "@fortawesome/free-solid-svg-icons";


const urlUsers = process.env.REACT_APP_API_URL + '/users';
const Users = () => {
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const responseApi = await apiClient.get(urlUsers)
      setUsers(responseApi.data.users);
    }
    if (users.length === 0) {
      getUsers();
    }
  }, [users]);

  //onDelete
  const onDelete = (id) => {
    setLoading([...loading, id]);
    const deleteUsers = async () => {
      try {
        const responseApi = await apiClient.delete(`${urlUsers}/${id}`);
        if (responseApi.data.users) {
          setUsers(users.filter((item) => item.id !== id));
          Swal.fire(
            '¡Eliminado!',
            'El usuario ha sido eliminado.',
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
      title: '¿Estás seguro de eliminar el usuario?',
      text: "¡No podrás revertir esto!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUsers();
      } else {
        setLoading(loading.filter((item) => item !== id));
      }
    })
  }
  const handleEdit = (id) => {
    if (id) {
      const user = users.find((item) => item.id === id);
      setEditData(user);
    } else {
      setEditData({ firstname: '', lastname: '', gender: '', address: '', phone: '', email: '', username: '' });
    }
    setShowModal(true);
  }

  const handleSave = async () => new Promise(async (resolve, reject) => {
    let userExists = users.find((item) => item.id === editData.id);
    if (userExists) {
      apiClient.put(`${urlUsers}/${editData.id}`, editData)
        .then((response) => {
          if (response.data.user) {
            const updateUser = users.map((item) =>
              item.id === editData.id ? response.data.user : item
            );
            setUsers(updateUser);
            setShowModal(false);
            setEditData({ firstname: '', lastname: '', gender: '', address: '', phone: '', email: '', username: '' });
            Swal.fire(
              '¡Actualizado!',
              'El usuario ha sido actualizado.',
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
      apiClient.post(`${urlUsers}`, editData)
        .then((response) => {
          if (response.data.user) {
            setUsers([...users, response.data.user]);
            setShowModal(false);
            setEditData({ firstname: '', lastname: '', gender: '', address: '', phone: '', email: '', username: '' });
            Swal.fire(
              '¡Ingresado!',
              'El usuario ha sido ingresado.',
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
        <h1>Usuarios</h1>
      </div>
      <div className="col-xl-12 mb-4">
        <Button variant="primary" onClick={() => handleEdit('')}>
          <FontAwesomeIcon className="me-1" icon={faUserPlus} />
          Agregar Nuevo Usuario
        </Button>
      </div>
      <div className="col-xl-12">
        <Table hover responsive="sm">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Género</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.gender}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(user.id)}>
                    <FontAwesomeIcon className="me-1" icon={faUserPen} />
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(user.id)}>
                    {loading.includes(user.id) ? (
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
        <EditUser show={showModal} onHide={() => setShowModal(false)} editData={editData} handleChange={handleChange} handleSave={handleSave} />
      </div>
    </>
  );
};

export default Users;