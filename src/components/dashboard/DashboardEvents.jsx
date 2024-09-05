import React from 'react';
import moment from 'moment'
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { WHITE } from '../../common/colors'
import EntityIcon from '../common/EntityIcon';

const EventCard = ({ event }) => {
  const { t } = useTranslation()
  const getTitle = (event, object, includeSubtitle) => {
    let title = object?.name || object?.id || object?.username
    let subTitle = `${event.event_type.toLowerCase()} ${t('common.a')} ${event.referenced_object.type.toLowerCase()}`
    return (
      <span>
             <Typography component='span' sx={{fontWeight: 'bold'}}>
               {title}
             </Typography>
             {
               includeSubtitle &&
                 <Typography component='span' sx={{marginLeft: '4px'}}>
                   {subTitle}
                 </Typography>
             }
            </span>
           )
  }
  return (
    <Card sx={{boxShadow: 'none', border: '1px solid', borderColor: 'surface.nv80', margin: '16px 0', borderRadius: '10px'}}>
      <CardHeader
        avatar={
          <Avatar sx={{backgroundColor: 'primary.60'}}>
            <EntityIcon noLink strict entity={event.object} sx={{color: WHITE}} />
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={getTitle(event, event.object, true)}
        subheader={moment(event.created_at).fromNow()}
      />
      <CardContent sx={{backgroundColor: 'surface.main', margin: '0 16px 16px 16px', borderRadius: '10px', paddingBottom: '16px !important', display: 'flex'}}>
        <CardHeader
          avatar={
            <Avatar sx={{backgroundColor: 'secondary.main'}}>
              <EntityIcon noLink strict entity={event.referenced_object} isVersion={(event.referenced_object?.short_code && event.referenced_object?.version_url)} sx={{color: WHITE}} />
            </Avatar>
          }
          title={getTitle(event, event.referenced_object, false)}
        />
      </CardContent>
    </Card>
  )
}

const DashboardEvents = ({ events }) => {
  return (
      <div className='col-xs-12 padding-0' style={{maxHeight: '90vh', overflow: 'auto'}}>
      {
        events.map(event => (
          <EventCard key={event.id} event={event} />
        ))
      }
        </div>
  )
}

export default DashboardEvents
