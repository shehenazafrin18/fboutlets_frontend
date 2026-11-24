import React, { useEffect, useState } from 'react'
import { TitleWithEditCard } from '../../../components/cards/TitleWithEditCard'
import { Dropdown, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AddInventories from './AddInventories';
import * as hractions from "../_redux/hrActions"
import ViewInventories from './ViewInventories';
import { swalConfirm } from '../../../helpers/swal';

export default function Inventories() {
    const dispatch = useDispatch();
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [inventoryId, setInventoryId] = useState(0)

    const initSl = {
        outlet_id: 0,
        inventory_item_id: 0,
        quantity: 0,
        reserved_quantity: 0,
        reorder_level: 0,
        unit: '',
    };
    const [selectedData, setSelectedData] = useState([initSl]);
    const [action, setAction] = useState('Add Inventory')

    const { inventories, user } = useSelector((state) => ({
        inventories: state.hr.inventories,
        user: state.auth.user,
    }));

    useEffect(() => {
        dispatch(hractions.getInventories());
    }, [dispatch, user]);

    {
        /*
        outlet_id
        inventory_item_id 
        "quantity" numeric(12,3) NOT NULL DEFAULT 0,
      "reserved_quantity" numeric(12,3) NOT NULL DEFAULT 0,
      "reorder_level" numeric(12,3) NOT NULL DEFAULT 0,
      "unit" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
      "is_active" */
    }

    const handleDropdownItemClick = (actionType, item) => {

        const newData = {
            'outlet_id': item?.outlet_id,
            'inventory_item_id': item?.inventory_item_id,
            'outlet_name': item?.outlet?.name,
            'inventory_name': item?.inventory_item?.name,
            'quantity': item?.quantity,
            'reserved_quantity': item?.reserved_quantity,
            'reorder_level': item?.reorder_level,
            'unit': item?.unit,
            'status': item?.is_active,
        };
        setSelectedData(newData);
        setAction(actionType);
        setInventoryId(item?.id);
    };

    console.log({ selectedData })

    const handleDelete = async (id) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await dispatch(hractions.deleteInventories(id));
                await dispatch(hractions.getInventories());
            }
        });
    };
    return (
        <>

            <TitleWithEditCard
                title="Inventory List"
                setShowEdit={setShowEdit}
                btn_label="Add Inventory"
                btn_icon="fas fa-plus"
                inventoryId={inventoryId}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initalTr={initSl}
            >
                <div className="table-responsive" style={{ overflowX: "unset" }}>
                    <table className="hr_admin_table table table-centered mb-0">
                        <thead>
                            <tr className='hr_admin_table_tr'>
                                <th>SL</th>
                                <th>Outlet</th>
                                <th>Inventory Item</th>
                                <th>Quantity</th>
                                <th>Reserved Qnty </th>
                                <th>Reorder Level</th>
                                <th>Unit</th>
                                <th>Status</th>
                                <th style={{ paddingRight: "2rem" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                inventories && inventories.length > 0 && inventories.map((item, k) => {
                                    return (
                                        <>

                                            <tr className='hr_admin_table_tr text-left'>
                                                <td>{k + 1}</td>
                                                <td>{item?.outlet?.name}</td>
                                                <td>{item?.inventory_item?.name}</td>
                                                <td>{item?.quantity}</td>
                                                <td>{item?.reserved_quantity}</td>
                                                <td>
                                                    {item?.reorder_level}
                                                </td>
                                                <td>
                                                    {item?.unit}
                                                </td>
                                                <td>
                                                    {item?.is_active ? 'Active' : 'Inactive'}
                                                </td>
                                                <td className="table_action_btn">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                            <i className="fas fa-ellipsis-v text-dark"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('Edit Inventory', item); setShowEdit(true); }}>Edit</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('View Inventory', item); setShowView(true) }}>View</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { handleDelete(item?.id) }}>Delete</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>

                                        </>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </TitleWithEditCard>


            <AddInventories
                show={showEdit}
                setShow={setShowEdit}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                inventoryId={inventoryId}
                setInventoryId={setInventoryId}
                setAction={setAction}
            />
            <ViewInventories
                show={showView}
                setShow={setShowView}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                inventoryId={inventoryId}
            />

        </>
    )
}
