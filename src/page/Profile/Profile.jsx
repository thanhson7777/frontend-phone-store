import { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import SecurityIcon from '@mui/icons-material/Security'
import PersonIcon from '@mui/icons-material/Person'
import { Link, useLocation } from 'react-router-dom'
import AccountTab from './Account'
import SecurityTab from './Setting'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security'
}

function Profile() {
  const location = useLocation()
  const getDefaultTab = () => {
    if (location.pathname.includes(TABS.SECURITY)) return TABS.SECURITY
    return TABS.ACCOUNT
  }
  const [activeTab, setActiveTab] = useState(getDefaultTab())

  const handleChangeTab = (event, selectedTab) => { setActiveTab(selectedTab) }

  return (
    <Container disableGutters maxWidth={false}>
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab}>
            <Tab
              label="Account"
              value={TABS.ACCOUNT}
              icon={<PersonIcon />}
              iconPosition="start"
              component={Link}
              to="/profile/account" />
            <Tab
              label="Security"
              value={TABS.SECURITY}
              icon={<SecurityIcon />}
              iconPosition="start"
              component={Link}
              to="/profile/security" />
          </TabList>
        </Box>
        <TabPanel value={TABS.ACCOUNT}><AccountTab /></TabPanel>
        <TabPanel value={TABS.SECURITY}><SecurityTab /></TabPanel>
      </TabContext>
    </Container>
  )
}

export default Profile
