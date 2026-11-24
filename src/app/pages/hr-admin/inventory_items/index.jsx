import React, { useEffect, useState } from 'react'
import { TitleWithEditCard } from '../../../components/cards/TitleWithEditCard'
import { Dropdown, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AddInventoryItems from './AddInventoryItems';
import * as hractions from "../_redux/hrActions"
import ViewInventoryItems from './ViewInventoryItems';
import { swalConfirm } from '../../../helpers/swal';

export default function InventoryItemsList() {
    const dispatch = useDispatch();
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [inventoryItemsId, setInventoryItemsId] = useState(0)
    const initSl = {
        name: '',
        sku: '',
        base_unit: '',
        standard_cost: 0,
        description: '',
    };
    const [selectedData, setSelectedData] = useState([initSl]);
    const [action, setAction] = useState('Add Inventory Items')

    const { inventoryItemList, user } = useSelector((state) => ({
        inventoryItemList: state.hr.inventoryItemList,
        user: state.auth.user,
    }));

    useEffect(() => {
        dispatch(hractions.getInventoryItemList());
    }, [dispatch, user]);

    const handleDropdownItemClick = (actionType, item) => {

        const newData = {
            'name': item?.name,
            'sku': item?.sku,
            'base_unit': item?.base_unit,
            'standard_cost': item?.standard_cost,
            'description': item?.description,
            'status': item?.is_active,
        };
        setSelectedData(newData);
        setAction(actionType);
        setInventoryItemsId(item?.id);
    };

    console.log({ inventoryItemList })

    const handleDelete = async (id) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await dispatch(hractions.deleteInventoryItem(id));
                await dispatch(hractions.getInventoryItemList());
            }
        });
    };
    return (
        <>

            <TitleWithEditCard
                title="Inventory Items List"
                setShowEdit={setShowEdit}
                btn_label="Add Inventory Items"
                btn_icon="fas fa-plus"
                inventoryItemsId={inventoryItemsId}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initalTr={initSl}
            >
                <div className="table-responsive" style={{ overflowX: "unset" }}>
                    <table className="hr_admin_table table table-centered mb-0">
                        <thead>
                            <tr className='hr_admin_table_tr'>
                                <th>SL</th>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Base Unit</th>
                                <th>Standard Cost</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th style={{ paddingRight: "2rem" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                inventoryItemList && inventoryItemList.length > 0 && inventoryItemList.map((item, k) => {
                                    return (
                                        <>

                                            <tr className='hr_admin_table_tr text-left'>
                                                <td>{k + 1}</td>
                                                <td>{item?.name}</td>
                                                <td>{item?.sku}</td>
                                                <td>{item?.base_unit}</td>
                                                <td>{item?.standard_cost}</td>
                                                <td>
                                                    {item?.description}
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
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('Edit Inventory Items', item); setShowEdit(true); }}>Edit</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('View Inventory Items', item); setShowView(true) }}>View</Dropdown.Item>
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


            <AddInventoryItems
                show={showEdit}
                setShow={setShowEdit}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                inventoryItemsId={inventoryItemsId}
                setInventoryItemsId={setInventoryItemsId}
                setAction={setAction}
            />
            <ViewInventoryItems
                show={showView}
                setShow={setShowView}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                inventoryItemsId={inventoryItemsId}
            />

        </>
    )
}
