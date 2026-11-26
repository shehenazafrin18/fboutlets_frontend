

import React, { useEffect, useState } from 'react';
import { TitleWithEditCard } from '../../../components/cards/TitleWithEditCard';
import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AddOutletMenu from './AddOutletMenu';
import * as hractions from '../_redux/hrActions';
import ViewOutletMenu from './ViewOutletMenu';
import { swalConfirm } from '../../../helpers/swal';

export default function OutletMenu() {
    const dispatch = useDispatch();

    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [outletMenuId, setOutletMenuId] = useState(0);

    const initSl = {
        outlet_id: '',
        menu_item_id: '',
        selling_price: 0,
        is_available: true,
    };

    const [selectedData, setSelectedData] = useState(initSl);
    const [action, setAction] = useState('Add Outlet Menu');

    const { outletMenuList, user } = useSelector((state) => ({
        outletMenuList: state.hr.outletMenuList,
        user: state.auth.user,
    }));
    const outlet_id = user?.data?.outlets[0]
    // console.log({ outlet_id })

    useEffect(() => {
        if (outlet_id != undefined) {
            dispatch(hractions.getOutletMenuList(outlet_id));
        }
    }, [dispatch, outlet_id]);

    const handleDropdownItemClick = (actionType, item) => {
        const newData = {
            outlet_id: item?.outlet_id,
            menu_item_id: item?.menu_item_id,
            outlet_name: item?.outlet?.name || item?.outlet,
            menu_name: item?.menu_item?.name || item?.menu,
            selling_price: item?.selling_price,
            is_available: item?.is_available,
        };

        setSelectedData(newData);
        setAction(actionType);
        setOutletMenuId(item?.id);
    };

    const handleDelete = async (id) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await dispatch(hractions.deleteOutletMenu(id));
                if (outlet_id != undefined) {
                    await dispatch(hractions.getOutletMenuList(outlet_id));
                }
            }
        });
    };

    const handleAdd = () => {
        setSelectedData(initSl);
        setOutletMenuId(0);
        setAction('Add Outlet Menu');
    };

    return (
        <>
            <TitleWithEditCard
                title="Outlet Menu List"
                setShowEdit={(show) => {
                    if (show) handleAdd();
                    setShowEdit(show);
                }}
                btn_label="Add Outlet Menu"
                btn_icon="fas fa-plus"
                OutletMenuId={outletMenuId}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initalTr={initSl}
            >
                <div className="table-responsive" style={{ overflowX: 'unset' }}>
                    <table className="hr_admin_table table table-centered mb-0">
                        <thead>
                            <tr className="hr_admin_table_tr">
                                <th>SL</th>
                                <th>Outlet Name</th>
                                <th>Menu Item</th>
                                <th>Selling Price</th>
                                <th>Availability</th>
                                <th style={{ paddingRight: '2rem' }}>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {outletMenuList?.length > 0 ? (
                                outletMenuList.map((item, k) => (
                                    <tr
                                        key={item.id}
                                        className="hr_admin_table_tr text-left"
                                    >
                                        <td>{k + 1}</td>
                                        <td>
                                            {item?.outlet?.name || item?.outlet || '-'}
                                        </td>
                                        <td>
                                            {item?.menu_item?.name || item?.menu_item || '-'}
                                        </td>
                                        <td>
                                            {Number(item?.selling_price || 0).toFixed(2)}
                                        </td>
                                        <td>
                                            <span className={
                                                item?.is_available
                                                    ? 'text-success'
                                                    : 'text-danger'
                                            }>
                                                {item?.is_available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>

                                        <td className="table_action_btn">
                                            <Dropdown>
                                                <Dropdown.Toggle
                                                    variant="primary"
                                                    id={`outlet-menu-${item.id}`}
                                                >
                                                    <i className="fas fa-ellipsis-v text-dark"></i>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item
                                                        onClick={() => {
                                                            handleDropdownItemClick(
                                                                'Edit Outlet Menu',
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
                                                                'View Outlet Menu',
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No outlet menus found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </TitleWithEditCard>

            <AddOutletMenu
                show={showEdit}
                setShow={setShowEdit}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                OutletMenuId={outletMenuId}
                setOutletMenuId={setOutletMenuId}
                setAction={setAction}
            />

            <ViewOutletMenu
                show={showView}
                setShow={setShowView}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                OutletMenuId={outletMenuId}
            />
        </>
    );
}
