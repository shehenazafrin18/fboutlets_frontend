import React from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import * as Action from "../../pages/my-profile/_redux/recruitementActions";

export function ProfileViewCard({ applicantsInfo }) {
    // const dispatch = useDispatch();
    // const { user } = useSelector((state) => state.auth);
    // const { applicantsInfo } = useSelector(
    //     ({ recruitement }) => ({
    //         applicantsInfo: recruitement.applicantsInfo,
    //     }),
    // );

    // useEffect(() => {
    //     if (user?.data?.applicant_id) {
    //         dispatch(Action.getApplicantsInfoById(user?.data?.applicant_id));
    //     }
    // }, [user, dispatch]);

    const DOC_CONTAINER = process.env.REACT_APP_DOC_CONTAINER;
    const DOC_TOKEN = process.env.REACT_APP_DOC_TOKEN;

    return (
        <div className="row mb-5">
            <div className="col-md-12">
                <div className="card profile_card_main">
                    <div className="left_box">
                        <div className="image_box">
                            <img src={applicantsInfo?.profile_image ? DOC_CONTAINER + applicantsInfo?.profile_image + DOC_TOKEN : ""} alt="No img" />
                        </div>

                        <div className="info_box2">
                            <h2>{`${applicantsInfo?.m_career_portal_user?.first_name || ''} ${applicantsInfo?.m_career_portal_user?.middle_name || ''} ${applicantsInfo?.m_career_portal_user?.last_name || ''}`.trim()}</h2>
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8.00033 2C9.41481 2 10.7714 2.5619 11.7716 3.5621C12.7718 4.56229 13.3337 5.91885 13.3337 7.33333C13.3337 9.54133 11.6507 11.8548 8.35588 14.3259C8.25331 14.4029 8.12854 14.4444 8.00033 14.4444C7.87211 14.4444 7.74734 14.4029 7.64477 14.3259C4.34995 11.8548 2.66699 9.54133 2.66699 7.33333C2.66699 5.91885 3.2289 4.56229 4.22909 3.5621C5.22928 2.5619 6.58584 2 8.00033 2ZM8.00033 5.55556C7.52883 5.55556 7.07664 5.74286 6.74325 6.07625C6.40985 6.40965 6.22255 6.86184 6.22255 7.33333C6.22255 7.80483 6.40985 8.25701 6.74325 8.59041C7.07664 8.92381 7.52883 9.11111 8.00033 9.11111C8.47182 9.11111 8.92401 8.92381 9.2574 8.59041C9.5908 8.25701 9.7781 7.80483 9.7781 7.33333C9.7781 6.86184 9.5908 6.40965 9.2574 6.07625C8.92401 5.74286 8.47182 5.55556 8.00033 5.55556Z" fill="#E6F7FF" />
                                </svg>
                                {applicantsInfo?.per_address_line_1}
                            </p>
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.8375 3.59687L12.1734 1.93438C12.0561 1.81647 11.9165 1.72293 11.7629 1.65911C11.6092 1.59529 11.4445 1.56246 11.2781 1.5625C10.9391 1.5625 10.6203 1.69531 10.3813 1.93438L8.59063 3.725C8.47272 3.84238 8.37918 3.98191 8.31536 4.13555C8.25154 4.2892 8.21871 4.45394 8.21875 4.62031C8.21875 4.95938 8.35156 5.27813 8.59063 5.51719L9.9 6.82656C9.59351 7.50213 9.16738 8.1167 8.64219 8.64062C8.11831 9.16709 7.50379 9.59477 6.82813 9.90312L5.51875 8.59375C5.40137 8.47585 5.26184 8.3823 5.1082 8.31849C4.95455 8.25467 4.78981 8.22184 4.62344 8.22188C4.28438 8.22188 3.96563 8.35469 3.72656 8.59375L1.93438 10.3828C1.81633 10.5004 1.7227 10.6402 1.65888 10.7941C1.59506 10.948 1.56231 11.1131 1.5625 11.2797C1.5625 11.6188 1.69531 11.9375 1.93438 12.1766L3.59531 13.8375C3.97656 14.2203 4.50313 14.4375 5.04375 14.4375C5.15781 14.4375 5.26719 14.4281 5.375 14.4094C7.48125 14.0625 9.57031 12.9422 11.2563 11.2578C12.9406 9.575 14.0594 7.4875 14.4109 5.375C14.5172 4.72969 14.3031 4.06562 13.8375 3.59687Z" fill="white" />
                                </svg>
                                {applicantsInfo?.contact_number}
                            </p>
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M14.5 2.5H1.5C1.22344 2.5 1 2.72344 1 3V13C1 13.2766 1.22344 13.5 1.5 13.5H14.5C14.7766 13.5 15 13.2766 15 13V3C15 2.72344 14.7766 2.5 14.5 2.5ZM13.2375 4.20156L8.30781 8.0375C8.18594 8.13281 8.01562 8.13281 7.89375 8.0375L2.9625 4.20156C2.94391 4.18722 2.93028 4.16741 2.92351 4.14493C2.91674 4.12245 2.91718 4.09841 2.92476 4.07618C2.93234 4.05396 2.94668 4.03466 2.96578 4.021C2.98488 4.00734 3.00777 4 3.03125 4H13.1687C13.1922 4 13.2151 4.00734 13.2342 4.021C13.2533 4.03466 13.2677 4.05396 13.2752 4.07618C13.2828 4.09841 13.2833 4.12245 13.2765 4.14493C13.2697 4.16741 13.2561 4.18722 13.2375 4.20156Z" fill="white" />
                                </svg>
                                {applicantsInfo?.email}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
} 