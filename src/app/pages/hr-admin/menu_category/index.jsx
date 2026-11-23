import React, { useEffect, useState } from 'react'
import { TitleWithEditCard } from '../../../components/cards/TitleWithEditCard'
import { Dropdown, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AddMenuCategory from './AddMenuCategory';
import * as hractions from "../_redux/hrActions"
import ViewMenuCategory from './ViewMenuCategory';
import { swalConfirm } from '../../../helpers/swal';

export default function MenuCategoryList() {
    const dispatch = useDispatch();
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [menuCategoryId, setMenuCategoryId] = useState(0)
    const initSl = {
        name: '',
        description: '',
    };
    const [selectedData, setSelectedData] = useState([initSl]);
    const [action, setAction] = useState('Add Menu Category')

    const { menuCategoryList, user } = useSelector((state) => ({
        menuCategoryList: state.hr.menuCategoryList,
        user: state.auth.user,
    }));

    useEffect(() => {
        dispatch(hractions.getMenuCategoryList());
    }, [dispatch, user]);

    const handleDropdownItemClick = (actionType, item) => {

        const newData = {
            'name': item?.name,
            'description': item?.description,
            'status': item?.is_active,
        };
        setSelectedData(newData);
        setAction(actionType);
        setMenuCategoryId(item?.id);
    };

    console.log({ selectedData })

    const handleDelete = async (id) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await dispatch(hractions.deleteMenuCategory(id));
                await dispatch(hractions.getMenuCategoryList());
            }
        });
    };
    return (
        <>

            <TitleWithEditCard
                title="Menu Category List"
                setShowEdit={setShowEdit}
                btn_label="Add Menu Category"
                btn_icon="fas fa-plus"
                menuCategoryId={menuCategoryId}
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
                                <th>Description</th>
                                <th>Status</th>
                                <th style={{ paddingRight: "2rem" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                menuCategoryList && menuCategoryList.length > 0 && menuCategoryList.map((item, k) => {
                                    return (
                                        <>

                                            <tr className='hr_admin_table_tr text-left'>
                                                <td>{k + 1}</td>
                                                <td>{item?.name}</td>
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
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('Edit Menu Category', item); setShowEdit(true); }}>Edit</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('View Menu Category', item); setShowView(true) }}>View</Dropdown.Item>
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


            <AddMenuCategory
                show={showEdit}
                setShow={setShowEdit}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                menuCategoryId={menuCategoryId}
                setMenuCategoryId={setMenuCategoryId}
                setAction={setAction}
            />
            <ViewMenuCategory
                show={showView}
                setShow={setShowView}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                menuCategoryId={menuCategoryId}
            />

        </>
    )
}
