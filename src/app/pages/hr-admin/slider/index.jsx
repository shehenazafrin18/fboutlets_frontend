import React, { useEffect, useState } from 'react'
import { TitleWithEditCard } from '../../../components/cards/TitleWithEditCard'
import { Dropdown, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AddSlider from './AddSlider';
import * as hractions from "../_redux/hrActions"
import ViewSlider from './ViewSlider';
import { swalConfirm } from '../../../helpers/swal';

export default function SliderList() {
    const dispatch = useDispatch();
    const [showEdit, setShowEdit] = useState(false);
    const [showView, setShowView] = useState(false);
    const [tagline, setTagLine] = useState();
    const [subTitile, setSubTitle] = useState('');
    const [sliderId, setSliderId] = useState(0)
    const initSl = {
        title: '',
        sub_title: 'Available Jobs',
        tag_line: '',
        file_path: '',
    };
    const [selectedData, setSelectedData] = useState([initSl]);
    const [action, setAction] = useState('Add Slider')

    const { sliderList, user } = useSelector((state) => ({
        sliderList: state.hr.sliderList,
        user: state.auth.user,
    }));

    useEffect(() => {
        dispatch(hractions.getSliderList());
    }, [dispatch, user]);

    const handleDropdownItemClick = (actionType, item) => {

        const newData = {
            'title': item?.hrms_career_portal_slider__title,
            'sub_title': item?.hrms_career_portal_slider__sub_title,
            'tag_line': item?.hrms_career_portal_slider__tag_line,
            'file_path': item?.hrms_career_portal_slider__file_path,
        };
        setTagLine(item?.hrms_career_portal_slider__tag_line);
        setSubTitle(item?.hrms_career_portal_slider__sub_title);
        setSelectedData(newData);
        setAction(actionType);
        setSliderId(item?.hrms_career_portal_slider__id);
    };



    const handleDelete = async (id) => {
        swalConfirm().then(async (res) => {
            if (res.isConfirmed) {
                await dispatch(hractions.deleteSlider(id));
                await dispatch(hractions.getSliderList());
            }
        });
    };

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

    return (
        <>

            <TitleWithEditCard
                title="Slider List"
                setShowEdit={setShowEdit}
                btn_label="Add Slider"
                btn_icon="fas fa-plus"
                // setAction={setAction}
                sliderId={sliderId}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initalTr={initSl}
            >
                <div className="table-responsive" style={{overflowX: "unset"}}>
                    <table className="hr_admin_table table table-centered mb-0">
                        <thead>
                            <tr className='hr_admin_table_tr'>
                                <th>Slider Images</th>
                                <th>Title</th>
                                <th>Subtitle</th>
                                <th>Tagline</th>
                                <th style={{ paddingRight: "2rem" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sliderList && sliderList.hrms_career_portal_slider.length > 0 && sliderList.hrms_career_portal_slider.map((item, k) => {
                                    return (
                                        <>

                                            <tr className='hr_admin_table_tr text-left'>
                                                <td className="table-image text-left">
                                                    <img height="45" src={DOC_CONTAINER + item?.hrms_career_portal_slider__file_path + DOC_TOKEN} alt="image" className="rounded" />
                                                </td>
                                                <td>{item?.hrms_career_portal_slider__title}</td>
                                                <td>
                                                    {/* <div dangerouslySetInnerHTML={{ __html: item?.hrms_career_portal_slider__sub_title }} /> */}
                                                    {item?.hrms_career_portal_slider__sub_title}
                                                </td>
                                                <td>
                                                    {/* <div dangerouslySetInnerHTML={{ __html: item?.hrms_career_portal_slider__tag_line }} /> */}
                                                    {item?.hrms_career_portal_slider__tag_line}
                                                </td>
                                                <td className="table_action_btn">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                            <i className="fas fa-ellipsis-v text-dark"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('Edit Slider', item); setShowEdit(true); }}>Edit</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { handleDropdownItemClick('View Slider', item); setShowView(true) }}>View</Dropdown.Item>
                                                            <Dropdown.Item onClick={() => { handleDelete(item?.hrms_career_portal_slider__id) }}>Delete</Dropdown.Item>
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


            <AddSlider
                show={showEdit}
                setShow={setShowEdit}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                sliderId={sliderId}
                // subTitile={subTitile}
                setSubTitle={setSubTitle}
                tagline={tagline}
                setTagLine={setTagLine}
                setSliderId={setSliderId}
            />
            <ViewSlider
                show={showView}
                setShow={setShowView}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                initSl={initSl}
                action={action}
                sliderId={sliderId}
                // subTitile={subTitile}
                setSubTitle={setSubTitle}
                tagline={tagline}
                setTagLine={setTagLine}
            />

        </>
    )
}
