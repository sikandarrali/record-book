export const ParseErrorCodes = (errorCode) =>{

    let message = ''

    if(errorCode === 'membership_already_confirmed'){
        message = `You're member of this Group.`
    }else if(errorCode === 'team_not_found'){
        message = `No matching group found.`
    }else if(errorCode === 'membership_not_found'){
        message = `Invalid Invitation Link.`
    }else if(errorCode === 'team_invalid_secret'){
        message = `Invalid Invitation Link.`
    }else if(errorCode === 'team_invite_mismatch'){
        message = `Invalid Invitation Link.`
    }else if(errorCode === 'team_invite_already_exists'){
        message = `User is already part of the Group.`
    }

    else{
        message = 'Unable to process your request'
    }

    return message
}