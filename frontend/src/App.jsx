import HomeUser from "./pages/home-user";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';

import CreateUser from "./components/create-user";
import TemplatePage from "./pages/template-page";
import Navbar from "./components/navbar/navbar";
import CreateRange from "./pages/create-range";
import DeployOVATemplate from "./pages/deploy-ova-template";
import { Grid } from "@mui/material";
import AddExistingTemplate from "./pages/add-existing-template";
import HorizontalAppBar from "./components/appbar/appbar";
import { useState } from "react";
import { handleLogin, handleSignup, initialSignupValues, useDatacenters, useHypervisors, initialHardwareValues, onNewInventoryDevice, onGenerateNewAddresses, initialLabRangeValues } from "./lib/utilities";
import { useEffect } from "react";
import VcentersTable from "./pages/vcenter-table";
import LoginForm from "./components/authentication/login";
import TemplateForm from "./pages/form-template";
import SignupForm from "./components/authentication/signup";
import PrivateRoute from "./components/private-route";
import { useAuth } from "./context/auth"; 
import AddHardwareIfraToInventory from './pages/add-hw-infra-to-inventory'
import ShowAnyTable from './pages/show-any-table'
import ShowAndEditContentsTable from "./pages/show-edit-table";
import { getLabsInfo } from "./lib/api";

function App() {

  const { isAuthenticated,token } = useAuth()
  const hypervisors = useHypervisors(token)
  const datacenters =  useDatacenters(token)
  const [ viewedDc, setViewedDc ] = useState({})
  const [ vspheres, setVspheres ] = useState([]) 
  const [idx, setIdx] = useState(0)

  

  useEffect(() => {

    let _isMounted = true


    if (_isMounted) {
      if (datacenters.length&& isAuthenticated ) {
        setViewedDc({name: `${datacenters[idx].name} ${datacenters[idx].cidr}`, value: datacenters[idx]._id })
      }
    }

    return () => _isMounted = false
  }, [datacenters, isAuthenticated, idx])

  useEffect(() =>  {
    if (hypervisors) setVspheres(hypervisors.vspheres) 
  
  } , [hypervisors])

  useEffect(() => {}, [vspheres])

  useEffect(() => {


    if (Object.entries(datacenters).length) setViewedDc({name: `${datacenters[idx].name} ${datacenters[idx].cidr}`, value: datacenters[idx]._id, cidr: datacenters[idx].cidr })


  }, [idx, datacenters])


  const handleViewedDatacenter = (value) => {
    const req_dc_idx = datacenters.map(dc => dc._id).indexOf(value)
    setIdx(req_dc_idx)

  }

  const Elements = {
    TemplateForm,
    HomeUser,
    TemplatePage,
    CreateRange,
    DeployOVATemplate,
    VcentersTable,
    AddExistingTemplate,
    ShowAnyTable,
    ShowAndEditContentsTable
  }


  const allRoutes = [
    { isPrivate: false, path: '/signup', Element: Elements.TemplateForm, props: { Component: SignupForm, initialValues: initialSignupValues, departments: datacenters.map(dc => { return  ({ name: dc.name, key: dc._id, value: dc.name })}),  handleFormSubmission: handleSignup } },
    { isPrivate: false, path: '/login', Element: Elements.TemplateForm, props: { Component: LoginForm, initialValues: { username: '', password: ''}, handleFormSubmission: handleLogin }},
    { isPrivate: true, path: '/' ,Element: Elements.HomeUser, props: { datacenter: viewedDc.value, labs: datacenters, vspheres, viewedLabId: viewedDc.value } },
    { isPrivate: true, path: '/init-datacenter', Element: Elements.TemplateForm, props: { Component: CreateRange, initialValues: initialLabRangeValues, handleFormSubmission: onGenerateNewAddresses  } },
    { isPrivate: true, path: '/users', Element: Elements.TemplatePage,  props: { Component: CreateUser } },
    { isPrivate: true, path: '/datacenters', Element: Elements.ShowAndEditContentsTable, props: { getResources: getLabsInfo }},
    { isPrivate: true, path: '/template', Element: Elements.DeployOVATemplate, props: { vspheres } },
    { isPrivate: true, path: '/cloud/vcenters', Element: Elements.VcentersTable, props:{ vspheres } },
    { isPrivate: true, path: '/template/existing', Element: Elements.AddExistingTemplate, props: { vspheres } },
    { isPrivate: true, path: '/add-inventory', Element: Elements.TemplateForm, props: { Component: AddHardwareIfraToInventory ,initialValues: initialHardwareValues, datacenters , handleFormSubmission: onNewInventoryDevice } },
    { isPrivate: true, path: '/show-infra', Element: Elements.ShowAnyTable, props: { labId: viewedDc.value } }
  ]

  return (
    <div className="App" >
      <Router>

      {
        isAuthenticated && <Navbar />
      }
          <main className="main-container">
            <Grid
              container
              direction="column"
              alignItems="center"
              sx={{ display: 'flex',  flexGrow: 1 }}  
            >
              <HorizontalAppBar 
                options={
                  datacenters.length && datacenters.map((dc, idx) => { return ( 
                    { 
                      name: `${datacenters[idx].name} ${datacenters[idx].cidr}`, 
                      value: datacenters[idx]._id,
                      key: `datacenter${idx}`
                    }) } )
                  } 
                onHandleViewedDatacenter={handleViewedDatacenter} 
                viewedDc={viewedDc}/>

            <Routes>
                {
                  allRoutes.map((route,i) => {
                    return (
                      <Route 
                        key={i} 
                        exact path={route.path}
                        element={
                          route.isPrivate 
                            ?
                              <PrivateRoute>
                                <route.Element {...route.props}/>
                              </PrivateRoute>
                            :
                              <route.Element {...route.props}/>
                          }
                      />
                    )
                  })
                }
            </Routes>
          </ Grid>
          </main>

      </Router>
    </div>
  );
}

export default App;
