import { React, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import EditSupplier from "../components/EditSupplier";
import { Spinner } from "react-bootstrap";
import apiClient from "../helpers/jwtInterceptor";

const urlSuppliers = process.env.REACT_APP_API_URL + '/suppliers';
const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
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
  //onDelete
  const onDelete = (id) => {
    setLoading([...loading, id]);
    const deleteSupplier = async () => {
      const responseApi = await apiClient.delete(`${urlSuppliers}/${id}`);
      if (responseApi.data.suppliers) {
        setLoading(loading.filter((item) => item !== id));
        setSuppliers(suppliers.filter((item) => item.id !== id));
        Swal.fire(
          '¡Eliminado!',
          'El Proveedor ha sido eliminado.',
          'success'
        )
      }
    }
    Swal.fire({
      title: '¿Estás seguro de eliminar el proveedor?',
      text: "¡No podrás revertir esto!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSupplier();
      }else{
        setLoading(loading.filter((item) => item !== id));
      }
    })
  }
  const handleEdit = (id) => {
    if (id) {
      const supplier = suppliers.find((item) => item.id === id);
      setEditData(supplier);
    } else {
      setEditData({ firstname: '', lastname: '', address: '', contactphone: '', email: '' });
    }
    setShowModal(true);
  }
  const handleSave = async () => new Promise(async (resolve, reject) =>{
    let supplierExists = suppliers.find((item) => item.id === editData.id);
    if (supplierExists) {
      apiClient.put(`${urlSuppliers}/${editData.id}`, editData)
        .then((response) => {
          if (response.data.supplier) {
            const updateSupplier = suppliers.map((item) =>
              item.id === editData.id ? response.data.supplier : item
            );
            setSuppliers(updateSupplier);
            setShowModal(false);
            setEditData({ firstname: '', lastname: '', address: '', contactphone: '', email: '' });
            Swal.fire(
              '¡Actualizado!',
              'El proveedor ha sido actualizado.',
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
      apiClient.post(`${urlSuppliers}`, editData)
        .then((response) => {
          if (response.data.supplier) {
            setSuppliers([...suppliers, response.data.supplier]);
            setShowModal(false);
            setEditData({ firstname: '', lastname: '', address: '', contactphone: '', email: '' });
            Swal.fire(
              '¡Ingresado!',
              'El proveedor ha sido ingresado.',
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
        <h1>Proveedores</h1>
      </div>
      <div className="col-xl-12 mb-4">
        <Button variant="primary" onClick={() => handleEdit('')}>
          Agregar Nuevo Proveedor
        </Button>
      </div>
      <div className="col-xl-12">
        <Table hover responsive="sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Dirección</th>
              <th>Teléfono de Contacto</th>
              <th>Correo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.firstname}</td>
                <td>{supplier.lastname}</td>
                <td>{supplier.address}</td>
                <td>{supplier.contactphone}</td>
                <td>{supplier.email}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(supplier.id)}>Editar</Button>
                  <Button variant="danger" onClick={() => onDelete(supplier.id)}>
                  {loading.includes(supplier.id)?<><Spinner animation="border" size="sm" role="status"/>Eliminando...</>:'Eliminar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <EditSupplier show={showModal} onHide={() => setShowModal(false)} editData={editData} handleChange={handleChange} handleSave={handleSave}/>
      </div>
    </>
  );
};

export default Suppliers;