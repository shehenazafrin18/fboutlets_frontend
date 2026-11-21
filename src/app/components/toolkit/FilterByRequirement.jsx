import React, { useEffect, useState } from 'react';
import { Accordion, Form } from 'react-bootstrap';
import MultiRangeSlider from './MultiRangeSlider';
import {Slider} from 'antd';

export default function FilterByRequirement({onFilter}) {
    const [selectedOption, setSelectedOption] = useState('0');
    const [openItem, setOpenItem] = useState("0");

    const [expectedSalary, setExpectedSalary] = useState({min: 0, max: 1000000});
    const [ageRange, setAgeRange] = useState({min: 0, max: 70});
    const [experienceRange, setExperienceRange] = useState({min: 0, max: 50});

    const [areaOfExperience, setAreaOfExperience] = useState('');
    const [academicData, setAcademicData] = useState('');
    const [keyWordData, setKeyWordData] = useState('');

    const toggleAccordion = (index) => {
        setOpenItem(index);
    };

    const handleButtonClick = (id) => {
        setSelectedOption(id);
    };

    const handleInputChangeExperience = (event) => {
        setAreaOfExperience(event.target.value);
    };
    const handleInputChangeAcademic = (event) => {
        setAcademicData(event.target.value);
    };
    const handleInputChangeKeyWord = (event) => {
        setKeyWordData(event.target.value);
    };

    const onReset = e=>{
        e.preventDefault()
        setSelectedOption('0')
        setOpenItem("0")
        setExpectedSalary({min: 0, max: 1000000})
        setAgeRange({min: 0, max: 70})
        setExperienceRange({min: 0, max: 60})
        setAreaOfExperience("")
        setAcademicData("")
        setKeyWordData("")
        onFilter({
            matched: "0",
            salarymin: 0,
            salarymax: 1000000,
            agemin: 0,
            agermax: 70,
            expmin: 0,
            expmax: 50
        })
    }
    const onSearch = ()=>{
        console.log(openItem)
        let filterObj = {
            matched: selectedOption
        }

        if(openItem==0||openItem){
                filterObj.salarymin = expectedSalary.min;
                filterObj.salarymax = expectedSalary.max;
        
                filterObj.agemin = ageRange.min;
                filterObj.agermax = ageRange.max;
            
            
                filterObj.expmin = experienceRange.min;
                filterObj.expmax = experienceRange.max;
            
        }

        if(openItem==1){
                filterObj.areaofexp = areaOfExperience;
            
        }
        
        if(openItem==2){
                filterObj.academicKeywords = academicData;

        }
        if(openItem==3){
                filterObj.keywords = keyWordData;
            
        }
        
        onFilter(filterObj)

    }

    return (
        <div className='card card_body_box filter_box_div'>
            <p className="filter_by_requirement">Filter by requirement matching</p>

            <Form onSubmit={(e)=>{
                e.preventDefault()
                onSearch()

            }}>

                <div className="filter_by_persent" role="group">
                    <button
                        type="button"
                        className={`btn btn-outline-primary ${selectedOption == '100' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('100')}
                    >
                        100%
                    </button>

                    <button
                        type="button"
                        className={`btn btn-outline-primary ${selectedOption == '75' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('75')}
                    >
                        75%+
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-primary ${selectedOption == '50' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('50')}
                    >
                        50%+
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-primary ${selectedOption == '40' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('40')}
                    >
                        40%+
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-primary ${selectedOption == '25' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('25')}
                    >
                        25%+
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-primary ${selectedOption == '0' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('0')}
                    >
                        0%+
                    </button>
                </div>

                <Accordion className='filter_by_accordion_main' activeKey={openItem}>
                    <Accordion.Item  eventKey="0">
                        <Accordion.Header onClick={() => toggleAccordion("0")}>
                            <span>Quick filters</span>
                            <i className={`fas ${openItem == 0 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </Accordion.Header>
                        <Accordion.Body>
                            <label>Salary</label>
                            <Slider
                                label={'Expected salary range'}
                                min={0}
                                max={1000000}
                                range
                                value={[expectedSalary.min, expectedSalary.max]}
                                onChange={([min, max]) => {
                                    setExpectedSalary({ min, max});
                                }}
                            />
                            <label>Age</label>
                            <Slider
                                range
                                label={'Age range'}
                                min={0}
                                max={70}
                                value={[ageRange.min, ageRange.max]}
                                onChange={([min, max]) => {
                                    setAgeRange({min, max})
                                }}
                            />
                            <label>Experience</label>
                            <Slider
                                
                                range
                                label={'Total years of experience'}
                                min={0}
                                max={50}
                                value={[experienceRange.min, experienceRange.max]}
                                onChange={([min, max]) => {
                                    setExperienceRange({min, max})
                                }}
                            />
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="1">
                        <Accordion.Header onClick={() => toggleAccordion("1")}>
                            <span>Area of experience</span>
                            <i className={`fas ${openItem === "1" ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </Accordion.Header>
                        <Accordion.Body>
                            <input
                                type="text"
                                className='form-control'
                                value={areaOfExperience}
                                onChange={handleInputChangeExperience}
                                placeholder='Type experience...'
                            />
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2">
                        <Accordion.Header onClick={() => toggleAccordion("2")}>
                            <span>Academic</span>
                            <i className={`fas ${openItem == "2" ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </Accordion.Header>
                        <Accordion.Body>
                            <input
                                type="text"
                                className='form-control'
                                value={academicData}
                                onChange={handleInputChangeAcademic}
                                placeholder='Type academic...'
                            />
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="3">
                        <Accordion.Header onClick={() => toggleAccordion("3")}>
                            <span>Key Words</span>
                            <i className={`fas ${openItem == "3" ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </Accordion.Header>
                        <Accordion.Body>
                            <input
                                type="text"
                                className='form-control'
                                value={keyWordData}
                                onChange={handleInputChangeKeyWord}
                                placeholder='Type key words...'
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <div className='search_btn_filter mt-4'>
                    <button className='btn btn-primary mr-5' onClick={onReset} type='submit'>Reset</button>
                    <button className='btn btn-primary' type='submit'>Search</button>
                </div>

            </Form>
        </div>
    )
}