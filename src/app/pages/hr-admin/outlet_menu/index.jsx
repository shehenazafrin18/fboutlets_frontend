import React, { useEffect, useState } from 'react'
import { TitleWithEditCard } from '../../../components/cards/TitleWithEditCard'
import { Dropdown, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AddOutletMenu from './AddOutletMenu';
import * as hractions from "../_redux/hrActions"
import ViewOutletMenu from './ViewOutletMenu';
import { swalConfirm } from '../../../helpers/swal';

export default function OutletMenu() {
    // console.log({})
    const dispatch = useDispatch();
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [OutletMenuId, setOutletMenuId] = useState(0)
    const initSl = {
        name: '',
        description: '',
    };
    const [selectedData, setSelectedData] = useState([initSl]);
    const [action, setAction] = useState('Add Outlet Menu')

    const { outletMenuList, user } = useSelector((state) => ({
        outletMenuList: state.hr.outletMenuList,
        user: state.auth.user,
    }));

    useEffect(() => {
        dispatch(hractions.getOutletMenuList());
    }, [dispatch, user]);

    const handleDropdownItemClick = (actionType, item) => {

        const newData = {
            'name': item?.name,
            'description': item?.description,
            'status': item?.is_active,
        };
        setSelectedData(newData);
        setAction(actionType);
        setOutletMenuId(item?.id);
    };

    console.log({ selectedData })

    const handleDelete = async (id) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await dispatch(hractions.deleteOutletMenu(id));
                await dispatch(hractions.getOutletMenuList());
            }
        });
    };
    return (
        <>

            <TitleWithEditCard
                title="Outlet Menu List"
                setShowEdit={setShowEdit}
                btn_label="Add Outlet Menu"
                btn_icon="fas fa-plus"
                OutletMenuId={OutletMenuId}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initalTr={initSl}
            >
                <div className="table-responsive" style={{ overflowX: "unset" }}>
                    <table className="hr_admin_table table table-centered mb-0">
                        <thead>
                            <tr className='hr_admin_table_tr'>
                                <th>SL</th>
                                <th>Outlet Name</th>
                                <th>Menu Category</th>
                                <th>Selling Price</th>
                                <th>Status</th>
                                <th style={{ paddingRight: "2rem" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                outletMenuList && outletMenuList.length > 0 && outletMenuList.map((item, k) => {
                                    return (
                                        <>

                                            <tr className='hr_admin_table_tr text-left'>
                                                <td>{k + 1}</td>
                                                <td>{item?.outlet}</td>
                                                <td>
                                                    {item?.menu}
                                                </td>
                                                <td>
                                                    {item?.selling_price}
                                                </td>
                                                <td>
                                                    {item?.is_available ? 'Yes' : 'No'}
                                                </td>
                                                <td className="table_action_btn">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                            <i className="fas fa-ellipsis-v text-dark"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('Edit Outlet Menu', item); setShowEdit(true); }}>Edit</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('View Outlet Menu', item); setShowView(true) }}>View</Dropdown.Item>
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


            <AddOutletMenu
                show={showEdit}
                setShow={setShowEdit}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                OutletMenuId={OutletMenuId}
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
                OutletMenuId={OutletMenuId}
            />

        </>
    )
}
