import React, { useState } from 'react'
import './ContentHome.css'
import firebase from 'firebase/app'
import fbref from '../Firebase'
import DeleteIcon from '@material-ui/icons/Delete'
import { Button, makeStyles } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom'

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
}))

export default function ContentHome() {
    const classes = useStyles()
    const [isLoading, setIsLoading] = useState('1')
    const [staffList, setStaffList] = useState([])

    if (isLoading === '1') {
        var staffListInit = [], lvl1 = [], lvl2 = [], lvl3 = [], lvl4 = []
        firebase.database().ref('StaffList/').once('value', (snap) => {
            snap.forEach(csnap => {
                if (csnap.val().position === "Prof. & Head") lvl1.push(csnap.val())
                if (csnap.val().position === "Prof.") lvl2.push(csnap.val())
                if (csnap.val().position === "Asso. Prof.") lvl3.push(csnap.val())
                if (csnap.val().position === "Asst. Prof.") lvl4.push(csnap.val())
            })
            let already = '0'
            lvl1.forEach(staff => {
                if (staff.theory1) already = '1'
                else already = '0'
                staffListInit.push([staff.fullName,already])
            })
            lvl2.forEach(staff => {
                if (staff.theory1) already = '1'
                else already = '0'
                staffListInit.push([staff.fullName,already])
            })
            lvl3.forEach(staff => {
                if (staff.theory1) already = '1'
                else already = '0'
                staffListInit.push([staff.fullName,already])
            })
            lvl4.forEach(staff => {
                if (staff.theory1) already = '1'
                else already = '0'
                staffListInit.push([staff.fullName,already])
            })
            setStaffList(staffListInit)
        })

        setIsLoading('0')
    }

    function ListEntity() {
        let blue = '#50B2C0', red = 'red', colorBtn = blue
        return (
            staffList.map(name => {
                let linkto = '/addData/' + name[0]
                if (name[1] === '1') {
                    colorBtn = red
                    linkto = '/'
                }
                else {
                    colorBtn = blue
                    linkto= '/addData/' + name[0]
                }
                return (
                    <div className='consoleListItem'>
                        <div className='cliName'>{name[0]}</div>
                        <div className='cliButton'><Link style={{textDecoration: 'none'}} to={linkto}><Button
                            style={{color: colorBtn}}
                            size="medium"
                            className={classes.button}
                            startIcon={<AddIcon />}
                        >
                            Add Data
                        </Button></Link></div>
                    </div>
                )
            })
        )
    }

    function WaitForDataRender() {
        if(isLoading === '1')return <div>Loading</div>
        return (
            <div className='ContentHome'>
                <div className='NamesHolder'>
                    <ListEntity />
                </div>
            </div>
        )
    }

    return (
        <WaitForDataRender />
    )
}
