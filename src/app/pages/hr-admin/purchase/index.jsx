
import React, { useEffect, useState } from 'react';
import { TitleWithEditCard } from '../../../components/cards/TitleWithEditCard';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as hractions from '../_redux/hrActions';
import AddPurchase from './AddPurchase';
import ViewPurchase from './ViewPurchase';
import { swalConfirm } from '../../../helpers/swal';

export default function Purchases() {
    const dispatch = useDispatch();

    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [purchaseId, setPurchaseId] = useState(0);

    const initSl = {
        supplier_id: 0,
        outlet_id: 0,
        purchase_number: '',
        purchase_date: '',
        total_amount: 0,
        status: 'PENDING',
        items: [],
    };

    const [selectedData, setSelectedData] = useState(initSl);
    const [action, setAction] = useState('Add Purchase');

    const { purchaseList, user } = useSelector((state) => ({
        purchaseList: state.hr.purchaseList,
        user: state.auth.user,
    }));

    useEffect(() => {
        dispatch(hractions.getPurchaseList());
    }, [dispatch, user]);

    const handleDropdownItemClick = (actionType, item) => {
        const newData = {
            supplier_id: item?.supplier_id,
            outlet_id: item?.outlet_id,
            supplier_name: item?.supplier?.name,
            outlet_name: item?.outlet?.name,
            purchase_number: item?.purchase_number,
            purchase_date: item?.purchase_date,
            total_amount: item?.total_amount,
            status: item?.status,
            items: item?.purchase_items?.map((purchaseItem) => ({
                inventory_item_id: purchaseItem?.inventory_item_id,
                inventory_name: purchaseItem?.inventory_item?.name,
                quantity: purchaseItem?.quantity,
                unit_price: purchaseItem?.unit_price,
                discount: purchaseItem?.discount,
                tax: purchaseItem?.tax,
                total_price: purchaseItem?.total_price,
            })) || [],
        };

        setSelectedData(newData);
        setAction(actionType);
        setPurchaseId(item?.id);
    };

    const handleDelete = async (id) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await dispatch(hractions.deletePurchase(id));
                await dispatch(hractions.getPurchaseList());
            }
        });
    };

    return (
        <>
            <TitleWithEditCard
                title="Purchase List"
                setShowEdit={setShowEdit}
                btn_label="Add Purchase"
                btn_icon="fas fa-plus"
                inventoryId={purchaseId}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initalTr={initSl}
            >
                <div className="table-responsive" style={{ overflowX: 'unset' }}>
                    <table className="hr_admin_table table table-centered mb-0">
                        <thead>
                            <tr className="hr_admin_table_tr">
                                <th>SL</th>
                                <th>Purchase No.</th>
                                <th>Supplier</th>
                                <th>Outlet</th>
                                <th>Purchase Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th style={{ paddingRight: '2rem' }}>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchaseList?.length > 0 &&
                                purchaseList.map((item, k) => (
                                    <tr
                                        key={item.id}
                                        className="hr_admin_table_tr text-left"
                                    >
                                        <td>{k + 1}</td>
                                        <td>{item?.purchase_number}</td>
                                        <td>{item?.supplier?.name || '-'}</td>
                                        <td>{item?.outlet?.name || '-'}</td>
                                        <td>
                                            {item?.purchase_date
                                                ? new Date(item.purchase_date).toLocaleDateString()
                                                : '-'}
                                        </td>
                                        <td>{item?.total_amount}</td>
                                        <td>
                                            {item?.status}
                                        </td>
                                        <td className="table_action_btn">
                                            <Dropdown>
                                                <Dropdown.Toggle
                                                    variant="primary"
                                                    id={`purchase-dropdown-${item.id}`}
                                                >
                                                    <i className="fas fa-ellipsis-v text-dark"></i>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            handleDropdownItemClick(
                                                                'Edit Purchase',
                                                                item
                                                            );
                                                            setShowEdit(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </Dropdown.Item>

                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            handleDropdownItemClick(
                                                                'View Purchase',
                                                                item
                                                            );
                                                            setShowView(true);
                                                        }}
                                                    >
                                                        View
                                                    </Dropdown.Item>

                                                    <Dropdown.Item
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        Delete
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </TitleWithEditCard>

            <AddPurchase
                show={showEdit}
                setShow={setShowEdit}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                purchaseId={purchaseId}
                setPurchaseId={setPurchaseId}
                setAction={setAction}
            />

            <ViewPurchase
                show={showView}
                setShow={setShowView}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                purchaseId={purchaseId}
            />
        </>
    );
}
