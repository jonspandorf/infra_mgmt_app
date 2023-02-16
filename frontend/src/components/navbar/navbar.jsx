import * as React from 'react';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import styles from "./navbar.module.css"
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, NavLink } from 'react-router-dom'
import { navData } from './data';
import { useState } from 'react';

const Navbar = () => {

  // const pages = [
  //   {name: 'Main', link: '/'},
  //   {name: 'Users', link: '/users'},
  //   {name: 'Deploy VM to Vsphere', link: '/deploy-vm'},
  //   {name: 'Deploy Setup', link: '/deploy-setup'},
  //   {name: 'Initiate Static Range', link: '/create-ip-range'},
  //   {name: 'Reserve static addresses', link: '/reserve-ips'},
  //   {name: 'Manage Infrastrucutre', link: '/manage-infra'},
  // ]

  const [open, setopen] = useState(true)
  const toggleOpen = () => {
      setopen(!open)
  }

  return (
    <div className={open?styles.sidenav:styles.sidenavClosed}>
        <button className={styles.menuBtn} onClick={toggleOpen}>
            {open? <KeyboardDoubleArrowLeftIcon />: <KeyboardDoubleArrowRightIcon />}
        </button>
        {navData.map(item =>{
            return <NavLink key={item.id} className={styles.sideitem} to={item.link}>
            {item.icon}
            {open && <span className={styles.linkText}>{item.text}</span>}
        </NavLink>
        })}
    </div>
  );
}

export default Navbar