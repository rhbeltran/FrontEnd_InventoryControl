import { React, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';
import EditProduct from "../components/EditProduct";
import { Spinner } from "react-bootstrap";
import apiClient from "../helpers/jwtInterceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan, faPlus } from "@fortawesome/free-solid-svg-icons";

const urlProducts = '/products';
const Products = () => {
  const [products, setProducts] = useState([]);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const responseApi = await apiClient.get(urlProducts)
      setProducts(responseApi.data.products);
    }
    if (products.length === 0) {
      getProducts();
    }
  }, [products]);
  //onDelete
  const onDelete = (id) => {
    setLoading([...loading, id]);
    const deleteProduct = async () => {
      try {
        const responseApi = await apiClient.delete(`${urlProducts}/${id}`);
        if (responseApi.data.products) {
          setProducts(products.filter((item) => item.id !== id));
          Swal.fire(
            '¡Eliminado!',
            'El Producto ha sido eliminado.',
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
      title: '¿Estás seguro de eliminar el producto?',
      text: "¡No podrás revertir esto!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct();
      } else {
        setLoading(loading.filter((item) => item !== id));
      }
    })
  }
  const handleEdit = (id) => {
    if (id) {
      const product = products.find((item) => item.id === id);
      setEditData(product);
    } else {
      setEditData({ name: '', price: '', description: '', stock: '' });
    }
    setShowModal(true);
  }
  //function esperar(ms) {
  //return new Promise(resolve => setTimeout(resolve, ms));
  //}
  const handleSave = async () => new Promise(async (resolve, reject) => {
    let productExists = products.find((item) => item.id === editData.id);
    if (productExists) {
      apiClient.put(`${urlProducts}/${editData.id}`, editData)
        .then((response) => {
          if (response.data.product) {
            const updateProduct = products.map((item) =>
              item.id === editData.id ? response.data.product : item
            );
            setProducts(updateProduct);
            setShowModal(false);
            setEditData({ name: '', price: '', description: '', stock: '', id: '' });
            Swal.fire(
              '¡Actualizado!',
              'El producto ha sido actualizado.',
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
      apiClient.post(`${urlProducts}`, editData)
        .then((response) => {
          if (response.data.product) {
            setProducts([...products, response.data.product]);
            setShowModal(false);
            setEditData({ name: '', price: '', description: '', stock: '', id: '' });
            Swal.fire(
              '¡Ingresado!',
              'El producto ha sido ingresado.',
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
        <h1>Productos</h1>
      </div>
      <div className="col-xl-12 mb-4">
        <Button variant="primary" onClick={() => handleEdit('')}>
          <FontAwesomeIcon className="me-1" icon={faPlus} />
          Agregar Nuevo Producto
        </Button>
      </div>
      <div className="col-xl-12">
        <Table hover responsive="sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Unidad de Medida</th>
              <th>Tipo de producto</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td>{product.unitmeasurement}</td>
                <td>{product.idtypeofproduct}</td>
                <td>
                  <Button variant="warning" className="me-2" onClick={() => handleEdit(product.id)}>
                    <FontAwesomeIcon className="me-1" icon={faEdit} />
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(product.id)}>
                    {loading.includes(product.id) ? (
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
        <EditProduct show={showModal} onHide={() => setShowModal(false)} editData={editData} handleChange={handleChange} handleSave={handleSave} />
      </div>
    </>
  );
};

export default Products;