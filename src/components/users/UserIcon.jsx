import React from 'react';
import PersonIcon from '@mui/icons-material/Face2';
import StrangerIcon from '@mui/icons-material/Person';
import { isLoggedIn } from '../../common/utils';

const UserIcon = ({ user, color, logoClassName, sx, authenticated }) => {
  const iconStyle = {...(sx || {})}
  return (
    <React.Fragment>
      {
        user?.logo_url ?
          <img
            src={user.logo_url}
            className={logoClassName || 'user-img-small'}
            style={iconStyle}
          /> :
        (authenticated || isLoggedIn()) ?
          <PersonIcon color={color} sx={iconStyle} /> :
        <StrangerIcon color={color} sx={iconStyle} />
      }
    </React.Fragment>
  )
}

export default UserIcon;
