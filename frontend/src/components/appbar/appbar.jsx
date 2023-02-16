import { AppBar, Box, Toolbar, Button } from '@mui/material'
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { StyledMenu } from '../../lib/styles';
import { useAuth } from '../../context/auth';

export default function HorizontalAppBar({ options, onHandleViewedDatacenter, viewedDc }) {

    const { isAuthenticated, logout, isReady } = useAuth()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
      setAnchorEl(null)
    }

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleAction = (event) => {
      const { myValue } = event.currentTarget.dataset;
      onHandleViewedDatacenter(myValue)
      setAnchorEl(null);
    };


    return (
      isAuthenticated ?
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: "100%" , pb:4 }} >
          <AppBar position="sticky"  sx={{  width: "100%", p:"10px 0", boxSizing: 'border-box', mb: "80px"}}>
            <Toolbar >
            <Button
              id="demo-customized-button"
              aria-controls={open ? 'demo-customized-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="contained"
              disableElevation
              onClick={handleClick}
              endIcon={<KeyboardArrowDownIcon />}
          >
              {viewedDc.name}
          </Button>
          <StyledMenu
              id="appBarMenu"
              MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}

            >
              {options.length && options.map((opt, i) => {
                return (
                  <MenuItem key={opt.key} data-my-value={opt.value} onClick={handleAction} disableRipple>
                    {opt.name}
                  </MenuItem>
                )
              })}
          </StyledMenu>
          <Button onClick={() => logout()} variant="outlined" color="error">
            {
              isAuthenticated ? 
              <>logout</>
              :
              <>login</>
            }
          </Button>

            </Toolbar>
          </AppBar>
        </Box>
        :
        <></>
    );
  }