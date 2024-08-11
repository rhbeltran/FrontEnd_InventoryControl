import { React, useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import apiClient from "../helpers/jwtInterceptor";

const urlProductsStock = process.env.REACT_APP_API_URL + '/productsstock';

const InventoryMovements = () => {
    const [inventoryMovements, setInventoryMovements] = useState([]);


    useEffect(() => {
        const getProductsStock = async () => {
            const responseApi = await apiClient.get(urlProductsStock)
            setInventoryMovements(responseApi.data.productsStock);
        }
        if (inventoryMovements.length === 0) {
            getProductsStock();
        }
    }, [inventoryMovements]);
    
    return (
        <>
            <div className="col-xl-12 mb-4" >
                <h1>Inventario</h1>
            </div>
            <div className="col-xl-12">
                <Table hover responsive="sm">
                    <thead>
                        <tr>
                            <th>Número de Articulo</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryMovements.map((inventoryMovements) => (
                            <tr key={inventoryMovements.id}>
                                <td>{inventoryMovements.id}</td>
                                <td>{inventoryMovements.name}</td>
                                <td>{inventoryMovements.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default InventoryMovements;