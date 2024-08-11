import { React, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import EditTypeOfProduct from "../components/EditTypeOfProduct";
import { Spinner } from "react-bootstrap";
import apiClient from "../helpers/jwtInterceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";

const urlTypeOfProducts = process.env.REACT_APP_API_URL + '/typesOfProducts';
const TypeOfProducts = () => {
  const [typesOfProducts, setTypeOfProducts] = useState([]);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const getTypeOfProducts = async () => {
      const responseApi = await apiClient.get(urlTypeOfProducts)
      setTypeOfProducts(responseApi.data.typesOfProducts);
    }
    if (typesOfProducts.length === 0) {
      getTypeOfProducts();
    }
  }, [typesOfProducts]);
  //onDelete
  const onDelete = (id) => {
    setLoading([...loading, id]);
    const deleteTypeOfProduct = async () => {
      try {
        const responseApi = await apiClient.delete(`${urlTypeOfProducts}/${id}`);
        if (responseApi.data.typesOfProducts) {
          setTypeOfProducts(typesOfProducts.filter((item) => item.id !== id));
          Swal.fire(
            '¡Eliminado!',
            'El tipo de producto ha sido eliminado.',
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
      title: '¿Estás seguro de eliminar el tipo de producto?',
      text: "¡No podrás revertir esto!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTypeOfProduct();
      } else {
        setLoading(loading.filter((item) => item !== id));
      }
    })
  }
  const handleEdit = (id) => {
    if (id) {
      const typesOfProduct = typesOfProducts.find((item) => item.id === id);
      setEditData(typesOfProduct);
    } else {
      setEditData({ nametype: '', description: '' });
    }
    setShowModal(true);
  }
  const handleSave = async () => new Promise(async (resolve, reject) => {
    let typeOfProductsExists = typesOfProducts.find((item) => item.id === editData.id);
    if (typeOfProductsExists) {
      apiClient.put(`${urlTypeOfProducts}/${editData.id}`, editData)
        .then((response) => {
          if (response.data.typeOfProduct) {
            const updateTypesOfProduct = typesOfProducts.map((item) =>
              item.id === editData.id ? response.data.typeOfProduct : item
            );
            setTypeOfProducts(updateTypesOfProduct);
            setShowModal(false);
            setEditData({ nametype: '', description: '' });
            Swal.fire(
              '¡Actualizado!',
              'El tipo de producto ha sido actualizado.',
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
      apiClient.post(`${urlTypeOfProducts}`, editData)
        .then((response) => {
          if (response.data.typeOfProduct) {
            setTypeOfProducts([...typesOfProducts, response.data.typeOfProduct]);
            setShowModal(false);
            setEditData({ nametype: '', description: '' });
            Swal.fire(
              '¡Ingresado!',
              'El tipo de producto ha sido ingresado.',
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
        <h1>Tipos de Productos</h1>
      </div>
      <div className="col-xl-12 mb-4">
        <Button variant="primary" onClick={() => handleEdit('')}>
          <FontAwesomeIcon className="me-1" icon={faPlus} />
          Agregar Nuevo Tipo de Producto
        </Button>
      </div>
      <div className="col-xl-12">
        <Table hover responsive="sm">
          <thead>
            <tr>
              <th>Tipo de Producto</th>
              <th>Descripción</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {typesOfProducts.map((typesOfProduct) => (
              <tr key={typesOfProduct.id}>
                <td>{typesOfProduct.nametype}</td>
                <td>{typesOfProduct.description}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(typesOfProduct.id)}>
                    <FontAwesomeIcon className="me-1" icon={faEdit} />
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(typesOfProduct.id)}>
                    {loading.includes(typesOfProduct.id) ? (
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
        <EditTypeOfProduct show={showModal} onHide={() => setShowModal(false)} editData={editData} handleChange={handleChange} handleSave={handleSave} />
      </div>
    </>
  );
};

export default TypeOfProducts;