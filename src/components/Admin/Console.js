// add course
// add staff

import { Button, FormControl, FormHelperText, InputLabel, makeStyles, MenuItem, OutlinedInput, TextField, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import './Console.css'
import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'
import firebase from 'firebase/app'
import fbref from '../../Firebase'

const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
    },
    form: {
        marginLeft: '30px',
        width: '40%',
        // eslint-disable-next-line no-useless-computed-key
        ['@media (max-width:400px)']: {
            marginLeft: 'unset',
            width: '60%',
            marginTop: "2%"
        }
    }
}));

export default function Console() {
    const classes = useStyles()
    const [isLoading, setIsLoading] = useState('1')
    const [courseList, setCourseList] = useState([])
    const [staffList, setStaffList] = useState([])
    let courseName, staffName, staffShortForm
    let prefixSelection, positionSelection, semesterSelection, typeSelection, deptSelection
    
    const annotation = [
        {
          value: 'Mr.',
          label: 'Mr.',
        },
        {
          value: 'Dr.',
          label: 'Dr.',
        },
        {
          value: 'Mrs.',
          label: 'Mrs.',
        },
        {
          value: 'Ms.',
          label: 'Ms.',
        },
        {
            value: '',
            label: 'Custom'
        }
    ];

    const position = [
        {
            label: 'Professor & Head',
            value: 'Prof. & Head'
        },
        {
            label: 'Professor',
            value: 'Prof.'
        },
        {
            label: 'Associate Professor',
            value: 'Asso. Prof.'
        },
        {
            label: 'Assistant Professor',
            value: 'Asst. Prof.'
        },
        {
            label: '',
            value: 'Custom'
        }
    ]

    const sem = [
        {
            value: 'Ist-Sem',
            label: 'I'
        },
        {
            value: 'IInd-Sem',
            label: 'II'
        },
        {
            value: 'IIIrd-Sem',
            label: 'III'
        },
        {
            value: 'IVth-Sem',
            label: 'IV'
        },
        {
            value: 'Vth-Sem',
            label: 'V'
        },
        {
            value: 'VI',
            label: 'VI'
        },
        {
            value: 'VII',
            label: 'VII'
        },
        {
            value: 'VIII',
            label: 'VIII'
        },
    ]

    const type = [
        {
            value: 'Theory',
            label: 'Theory'
        },
        {
            value: 'Lab',
            label: 'Lab'
        }
    ]

    const dept = [
        {
            value: 'CSE',
            label: 'CSE'
        },
        {
            value: 'ECE',
            label: 'ECE'
        },
        {
            value: 'IT',
            label: 'IT'
        },
        {
            value: 'EEE',
            label: 'EEE'
        },
        {
            value: 'Civil',
            label: 'Civil'
        },
        {
            value: 'Mech',
            label: 'Mech'
        },
        {
            value: 'BME',
            label: 'BME'
        },
    ]

    if (isLoading === '1') {
        var courseListInit = [], staffListInit = []
        firebase.database().ref('CourseList/').once('value', (snap) => {
            snap.forEach(csnap => {
                var key = csnap.key
                courseListInit.push(key)
            })
            setCourseList(courseListInit)
        })

        firebase.database().ref('StaffList/').once('value', (snap) => {
            snap.forEach(csnap => {
                var key = csnap.key
                staffListInit.push(key)
            })
            setStaffList(staffListInit)
        })

        setIsLoading('0')
    }

    function ConsoleList(props) {

        function ListEntity() {
            if (props.heading === 'Staff List') {
                return (
                    staffList.map(name=>{
                        return (
                            <div className='consoleListItem'>
                                <div className='cliName'>{name}</div>
                                <Button
                                    onClick={() => {
                                        firebase.database().ref('StaffList/').child(name).remove()
                                        firebase.database().ref('StaffList/').on('value', snap => {
                                            let staffListUpdated = []
                                            snap.forEach(item => {
                                                staffListUpdated.push(item.key)
                                            })
                                            setStaffList(staffListUpdated)
                                        })
                                    }}
                                    size="medium"
                                    className={classes.button}
                                    startIcon={<DeleteIcon />}
                                >
                                    Delete
                                </Button>
                            </div>
                        )
                    })
                )
            }
            return (
                courseList.map(name=>{
                    return (
                        <div className='consoleListItem'>
                            <div className='cliName'>{name}</div>
                            <Button
                                onClick={() => {
                                    firebase.database().ref('CourseList/').child(name).remove()
                                    firebase.database().ref('CourseList/').on('value', snap => {
                                        let courseListUpdated = []
                                        snap.forEach(item => {
                                            courseListUpdated.push(item.key)
                                        })
                                        setCourseList(courseListUpdated)
                                    })
                                }}
                                size="medium"
                                className={classes.button}
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </div>
                    )
                })
            )
        }

        return (
            <>
                <Typography style={{ fontFamily: 'Mulish', textAlign: 'center' }} variant='h4'>{props.heading}</Typography>
                <ListEntity />
                <Button
                    onClick={() => {
                        if (props.heading === 'Staff List') {
                            if (window.confirm("Are you sure wanna wipe out all the data?"))
                                firebase.database().ref('StaffList/').remove()
                                setStaffList([])
                        } else {
                            if (window.confirm("Are you sure wanna wipe out all the courses?")) {
                                firebase.database().ref('CourseList/').remove()
                                setCourseList([])
                            }
                        }}
                    }
                    fullWidth
                    style={{color:'red'}}
                    size="medium"
                    className={classes.button}
                    startIcon={<DeleteIcon />}
                >
                    Flush whole Staff List
                </Button>
            </>
        )
    }
       
    function StaffEntry(props) {

        function ShortFormRendering() {
            if (props.ShortRen) {
                return (
                    <>
                        <FormControl className={classes.form} variant="outlined">
                            <InputLabel htmlFor="standard-adornment-amount" >ShortForm</InputLabel>
                            <OutlinedInput labelWidth={100} onChange={(e) => staffShortForm= e.target.value}/>
                            <FormHelperText>Enter the Short Format</FormHelperText>
                        </FormControl>
                    </>
                )
            } else return null;
        }

        function ConditionalRendering() {
            if (props.CondRen) {
                return (
                    <TextField
                        className={classes.form}
                        id="outlined-select-dept"
                        select
                        label={props.t3}
                        helperText={props.h3}
                        variant="outlined"
                        onChange={e=>deptSelection = e.target.value}
                    >
                        {props.source3.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                )
            } else return null;
        }

        function handleChangeTXT1(e) {
            // let prefixSelection, positionSelection, semesterSelection, typeSelection
            if (props.title === 'Add Staff') {
                prefixSelection = e.target.value
            } else if (props.title === 'Add Course') {
                semesterSelection = e.target.value
            }
        }
        
        function handleChangeTXT2(e) {
            // let prefixSelection, positionSelection, semesterSelection, typeSelection
            if (props.title === 'Add Staff') {
                positionSelection = e.target.value
            } else if (props.title === 'Add Course') {
                typeSelection = e.target.value
            }
        }

        return (
            <>
                <Typography style={{fontFamily: 'Mulish', textAlign: 'center'}} variant='h5'>{props.title}</Typography>
                <div style={{marginTop: '4%'}}></div>
                <TextField
                    id="outlined-select-annotation"
                    select
                    label={props.t1}
                    helperText={props.h1}
                    variant="outlined"
                    onChange={handleChangeTXT1}
                >
                    {props.source1.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <ConditionalRendering />
                <ShortFormRendering />
                <div style={{marginTop: '2%'}}></div>
                <TextField
                    id="outlined-select-position"
                    select
                    label={props.t2}
                    helperText={props.h2}
                    variant="outlined"
                    onChange={handleChangeTXT2}
                >
                    {props.source2.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <div style={{marginTop: '2%'}}></div>
                <FormControl style={{width: '90%'}} variant="outlined">
                    <InputLabel htmlFor="standard-adornment-amount" >Name</InputLabel>
                    <OutlinedInput labelWidth={100} onChange={(e)=>{
                        if (props.title === 'Add Staff') staffName = e.target.value
                        else courseName = e.target.value
                    }} />
                    <FormHelperText>Enter the Name and custom annotations if needed</FormHelperText>
                </FormControl>
                <div style={{marginTop: '5%'}}></div>
                <Button
                    onClick={() => {
                        if (props.title === 'Add Staff') {
                            const finalName = prefixSelection + ' ' + staffName + ' ' + positionSelection
                            const staffData = {
                                fullName: finalName,
                                shortName: staffShortForm,
                                prefix: prefixSelection,
                                position: positionSelection
                            }
                            console.log(finalName, staffShortForm)
                            const staffRef = firebase.database().ref()
                            staffRef.child('StaffList/'+finalName.split('.').join("")).set(staffData)
                            firebase.database().ref('StaffList/').on('value', snap => {
                                let staffListUpdated = []
                                snap.forEach(item => {
                                    staffListUpdated.push(item.key)
                                })
                                setStaffList(staffListUpdated)
                            })
                        } else if (props.title === 'Add Course') {
                            const finalCourse = semesterSelection + '-' + deptSelection + '-' + courseName + '-' + typeSelection
                            const courseData = {
                                courseName: finalCourse,
                                semester: semesterSelection,
                                department: deptSelection,
                                type: typeSelection
                            }                            
                            console.log(finalCourse)
                            const courseRef = firebase.database().ref()
                            courseRef.child('CourseList/' + finalCourse.split('.').join(" ")).set(courseData)
                            firebase.database().ref('CourseList/').on('value', snap=>{
                                let courseListUpdated = []
                                snap.forEach(item => {
                                    courseListUpdated.push(item.key)
                                })
                                setCourseList(courseListUpdated)
                            })
                        }
                    }}
                    variant="contained"
                    size="medium"
                    startIcon={<SaveIcon />}
                    style={{marginLeft: '70%', backgroundColor: '#E6AF2E'}}
                >
                    Save
                </Button>
                <div style={{marginTop: '3%'}}></div>
            </>
        )
    }

    function NumberBanner() {
        return (
            <div className='Databanner'>
                <div className='Staffcount'>
                    <div className='labelName'>StaffCount:</div>
                    <div className='Numberbanner'>{staffList.length}</div>
                </div>
                <div className='Coursecount'>
                    <div className='labelName'>CourseCount:</div>
                    <div className='Numberbanner'>{courseList.length}</div>
                </div>
            </div>
        )
    }

    function WaitForDataRender() {
        if(isLoading === '1'){
            return (
                <div>loading</div>
            )
        } else if (isLoading === '0') {
            return (
                <div className='adminConsole'>
                    <NumberBanner />
                    <div className='consoleListName'>
                        <ConsoleList heading='Staff List'/>
                    </div>
                    <div className='consoleListSubject'>
                        <ConsoleList heading='Course List'/>
                    </div>
                    <div className='consoleOptions'>
                        <StaffEntry source1={annotation} source2={position}  t1="Prefix" t2='Position' CondRen={false} ShortRen={true} h1='Please select the annotation' h2='Please select the position' title='Add Staff'/>
                    </div>
                    <div className='consoleOptions'>
                        <StaffEntry source1={sem} source2={type} source3={dept} t1="Semester" t2='Type' t3='Dept' CondRen={true} ShortRen={false} h1='Please select the semester' h2='Please select the type' h3='Please select the dept' title='Add Course'/>
                    </div>
                </div>
            )
        }
    }

    return (
        <WaitForDataRender />
    )
}