import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import HomeIcon from '@mui/icons-material/Home';
import PublishIcon from '@mui/icons-material/Publish';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import CloudIcon from '@mui/icons-material/Cloud';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import ScienceIcon from '@mui/icons-material/Science';

export const navData = [
        {
                id: 0,
                icon: <HomeIcon/>,
                text: "Home",
                link: "/"
        },
        {
                id: 1,
                icon: <DesignServicesIcon/>,
                text: "Initialize new Lab",
                link: "/init-datacenter"
        },
        {
                id: 523,
                icon: <ScienceIcon />,
                text: "Show my datacenters",
                link: "/datacenters"
        },
        {
                id: 5,
                icon: <CloudIcon />,
                text: "vCenter Environments",
                link: '/cloud/vcenters'
        },
        {
                id: 3,
                icon: <PublishIcon />,
                text: "Deploy Template or Upload OVA",
                link: "/template"
        },
        {
                id: 4,
                icon: <AddToQueueIcon />,
                text: 'Add an existing template to DB',
                link: "/template/existing"
        },
        {
                id: 2,
                icon: <SettingsApplicationsIcon/>,
                text: "Add inventory",
                link: "/add-inventory"
        },
        {
                id: 51,
                icon: <DevicesIcon />,
                text: "Show Infrastructure",
                link: "/show-infra"
        },
        {
                id: 6,
                icon: <PeopleIcon />,
                text: "Add new user",
                link: 'signup'
        }
    ]