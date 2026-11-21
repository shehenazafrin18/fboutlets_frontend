import React, { useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import Axios from "axios";
import { useSelector } from "react-redux";
import swal from 'sweetalert';

export default function UserType() {

  const [state, setState] = useState({
		user_type: '',
		user_rank: '',
    is_management: '',
		remarks: ''
	});

  const {
    user: { accessToken, refreshToken },
  } = useSelector((state) => state.auth);

  function handleChange(evt) {
		const value = evt.target.value;
		setState({
			...state,
			[evt.target.name]: value,
		});
	}

  function handleSubmit(event) {
		event.preventDefault();

		const usertype = {
			type: state.user_type,
			rank: state.user_rank,
      is_management: state.is_management,
			remark: state.remarks
		};

    console.log("data:", usertype)

		Axios
			.post(`${process.env.REACT_APP_API_URL}/user-type`, usertype, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          refreshToken: refreshToken,
        },
      })
			.then((res) => {
				if (res) {
          swal({
            title: "Done!",
            text: "New User Type Added Successfully",
            icon: "success",
            timer: 2000,
            button: false
          })
          console.log(res.data);
				}
			})
			.catch((err) => console.log("error:",err));
	}

  return (
    
    <>
      <div className="row">

        <div className="col-md-6">
          <div className="card card-custom gutter-b example example-compact">
            <div className="card-title">
              <h3 className="card-label" style={{ marginTop: "1.5rem", marginBottom: "-1rem", marginLeft: "60px" }}>User Type Form</h3>
            </div>
            <div className="card-header">
              <div className="card-body">
                <Form onSubmit={handleSubmit}> 
                  <Form.Group as={Row} controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                      Type
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control type="text" placeholder="User Type" name="user_type" value={state.user_type}
												onChange={handleChange} />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                      Rank
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control type="number" placeholder="Rank" name="user_rank" value={state.user_rank}
												onChange={handleChange} />
                    </Col>
                  </Form.Group>
                  <fieldset>
                    <Form.Group as={Row}>
                    <Form.Label as="legend" column sm={5}>
                      Management Type:
                    </Form.Label>
                      <Col sm={7} onChange={handleChange}>
                        <Form.Check
                          type="radio"
                          label="Management"
                          name="is_management"
                          id="formHorizontalRadios1"
                          value="1"
                        />
                        <Form.Check
                          type="radio"
                          label="Non-management"
                          name="is_management"
                          id="formHorizontalRadios2"
                          value="0"
                        />
               
                      </Col>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control as="textarea" rows="3" name="remarks" value={state.remarks}
												onChange={handleChange} />
                    </Form.Group>
                  </fieldset>


                  <Form.Group as={Row}>
                    <Col>
                      <Button type="submit">Submit</Button>
                    </Col>
                  </Form.Group>
                </Form>

              </div>
            </div>
          </div>



        </div>
      </div>
    </>
  );
}

