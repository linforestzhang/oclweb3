import React from 'react';
import { useTranslation } from 'react-i18next';
import upperFirst from 'lodash/upperFirst'
import Typography from '@mui/material/Typography'
import APIService from '../../services/APIService'
import { WHITE, SURFACE_COLORS } from '../../common/colors'
import Events from '../common/Events'
import DashboardEvents from './DashboardEvents';
import EventsButtonGroup from './EventsButtonGroup';


const UserDashboard = ({ user }) => {
  const { t } = useTranslation()
  const [selfEvents, setSelfEvents] = React.useState({events: [], headers: {}})
  const [allEvents, setAllEvents] = React.useState({events: [], headers: {}})
  const [followingEvents, setFollowingEvents] = React.useState({events: [], headers: {}})
  const [orgsEvents, setOrgsEvents] = React.useState({events: [], headers: {}})
  const [scope, setScope] = React.useState('all')

  const getService = (scope, page, limit=10) => APIService.users(user.username).appendToUrl('events/').get(null, null, {scopes: scope, limit: limit, page: page})

  const fetchEventsForSelf = () => {
    getService('self', parseInt(selfEvents.headers.page_number || '0') + 1, 5).then(response => {
      setSelfEvents({events: [...selfEvents.events, ...response.data], headers: response.headers})
      if(scroll) {
        setTimeout(() => {
          const el = document.getElementById('events-timeline')
          if(el) {
            el.scrollTop = el.scrollHeight
          }
        }, 50)
      }
    })
  }

  const fetchEventsForAll = () => {
    getService('following,orgs', parseInt(allEvents.headers.page_number || '0') + 1).then(response => {
      setAllEvents({events: [...allEvents.events, ...response.data], headers: response.headers})
    })
  }

  const fetchEventsForFollowing = () => {
    getService('following', parseInt(followingEvents.headers.page_number || '0') + 1).then(response => {
      setFollowingEvents({events: [...followingEvents.events, ...response.data], headers: response.headers})
    })
  }

  const fetchEventsForOrgs = () => {
    getService('orgs', parseInt(orgsEvents.headers.page_number || '0') + 1).then(response => {
      setOrgsEvents({events: [...orgsEvents.events, ...response.data], headers: response.headers})
    })
  }

  const onScopeChange = newScope => {
    if(newScope === scope)
      return
    setScope(newScope)
    if(newScope === 'all')
      !allEvents.events.length && fetchEventsForAll()
    if(newScope === 'following')
      !followingEvents.events.length && fetchEventsForFollowing()
    if(newScope === 'orgs')
      !orgsEvents.events.length && fetchEventsForOrgs()
  }


  React.useEffect(() => {
    fetchEventsForAll()
    fetchEventsForSelf()
  }, [])

  const getScopeEvents = () => {
    if(scope === 'orgs')
      return orgsEvents.events
    if(scope === 'following')
      return followingEvents.events
    return allEvents.events
  }


  return (
    <div className='col-xs-12 padding-0'>
      <div className='col-xs-9' style={{maxWidth: 'calc(100% - 360px)', minWidth: '500px'}}>
        <div className='col-xs-12 padding-0' style={{marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography sx={{fontWeight: 'bold', color: 'secondary.main'}}>
            {upperFirst(t('user.recent_activity'))}
          </Typography>
          <EventsButtonGroup selected={scope} onClick={onScopeChange} />
        </div>
        <DashboardEvents events={getScopeEvents()} />
      </div>
      <div className='col-xs-3 padding-0' style={{minWidth: '360px'}}>
        <div className='col-xs-12' style={{background: WHITE, borderRadius: '10px', border: `1px solid ${SURFACE_COLORS.nv80}`}}>
          <Events user={user} events={selfEvents.events} onLoadMore={selfEvents.headers?.next ? fetchEventsForSelf : false} moreMarginLeft='12px' showAvatar />
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
