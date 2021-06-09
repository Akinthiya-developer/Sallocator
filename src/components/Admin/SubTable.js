import React, { useState } from 'react'
import './SubTable.css'
import firebase from 'firebase/app'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

export default function SubTable() {
    const [isLoading, setIsLoading] = useState('1')
    const [courseData, setCourseData] = useState([])
    const [yearSem, setYearSem] = useState(['2021-2022','ODD'])

    function dataLoader() {
        let courseDataInit = [], clia=[], sem1=[], sem2=[], sem3=[], sem4=[], leftovers=[], courseListTheory=[], me1=[], me2=[]
        firebase.database().ref('CourseList/').once('value', snap => {
            snap.forEach(item => {
                clia.push(item.val())
            })

            for (var a = 0; a < clia.length; a++) {
                if (clia[a].semester === "Ist-Sem" || clia[a].semester === "IInd-Sem") {
                    if(clia[a].degree === "ME")me1.push(clia[a])
                    else sem1.push(clia[a])
                }
                else if (clia[a].semester === "IIIrd-Sem" || clia[a].semester === "IVth-Sem") {
                    if(clia[a].degree === "ME")me2.push(clia[a])
                    else sem2.push(clia[a])
                }
                else if(clia[a].semester === "Vth-Sem" || clia[a].semester === "VIth-Sem")sem3.push(clia[a])
                else if (clia[a].semester === "VIIth-Sem" || clia[a].semester === "VIIIth-Sem") sem4.push(clia[a])
                else courseListTheory.push(clia[a])
            }
            sem1.forEach(course => {
                if (course.department === 'CSE') courseListTheory.push(course)
                else leftovers.push(course)
            })
            sem2.forEach(course=>{
                if (course.department === 'CSE') courseListTheory.push(course)
                else leftovers.push(course)
            })
            sem3.forEach(course=>{
                if (course.department === 'CSE') courseListTheory.push(course)
                else leftovers.push(course)
            })
            sem4.forEach(course => {
                if (course.department === 'CSE') courseListTheory.push(course)
                else leftovers.push(course)
            })
            leftovers.forEach(course=>courseListTheory.push(course))
            me1.forEach(course=>courseListTheory.push(course))
            me2.forEach(course => courseListTheory.push(course))

            courseListTheory.forEach(course => {
                let staffPref = ""
                let staffPref1 = course.Prefered1
                let staffPref2 = course.Prefered2
                let staffPref3 = course.Prefered3
                let staffPref4 = course.Prefered4
                if (staffPref1 !== undefined) {
                    for (let key in staffPref1) {
                        staffPref += staffPref1[key] + ", "
                    }
                }
                if (staffPref2 !== undefined) {
                    for (let key in staffPref2) {
                        staffPref += staffPref2[key] + ", "
                    }
                }
                if (staffPref3 !== undefined) {
                    for (let key in staffPref3) {
                        staffPref += staffPref3[key] + ", "
                    }
                }
                if (staffPref4 !== undefined) {
                    for (let key in staffPref4) {
                        staffPref += staffPref4[key] + ", "
                    }
                }
                courseDataInit.push([course.courseName, staffPref])
            })

            setCourseData(courseDataInit)
        })
        setIsLoading('0')
    }

    function Tabler() {
        return (
            <div className='StaffBasedList'>
                <Table>
                    <TableContainer component={Paper}>
                        <TableHead>
                            <TableRow>
                                <TableCell align='center' style={{fontFamily: 'Mulish', fontWeight: 'bolder'}}>CourseName</TableCell>
                                <TableCell align='center' style={{fontFamily: 'Mulish', fontWeight: 'bolder'}}>Prefered List</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{
                            courseData.map(item => {
                                return (
                                    <TableRow>
                                        <TableCell>{item[0]}</TableCell>
                                        <TableCell>{item[1]}</TableCell>
                                    </TableRow>
                                )
                            })
                        }</TableBody>
                    </TableContainer>
                </Table>
            </div>
        )
    }

    function Loader() {
        let yearInit = ""
        let courseInit = ""
        if (isLoading === '1') {
            dataLoader()
            return <div>Loading</div>
        } else return (
            <div>
                <Typography fullWidth style={{ fontFamily: 'Mulish', textAlign: 'center'}} variant='h5'>PSNA College Of Engineering and Technology</Typography>
                <Typography style={{ fontFamily: 'Mulish', textAlign: 'center'}} variant='h6'>Computer Science And Engineering Department</Typography>
                <Typography onClick={val => {
                    yearInit = prompt("Enter the year", "2021-2022")
                    courseInit = prompt("Enter the Sem Type", "ODD/EVEN")
                    setYearSem([yearInit, courseInit])
                }} style={{ fontFamily: 'Mulish', textAlign: 'center'}} variant='h6'>{"Academic year: "+yearSem[0]+" / "+yearSem[1]+" Semester"}</Typography>
                <div className='border'></div>
                <Tabler />
                <Typography style={{marginTop: '50px', marginRight: '5%', fontFamily: 'Mulish', textAlign: 'right', fontSize: '12pt', fontWeight: 'bolder'}}>HOD Signature</Typography>
            </div>
        )
    }

    return (
        <Loader />
    )
}
