import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { UserAPI } from "api/user.api"
import { SetUserContext } from "App"
import React from "react"

interface PwdLoginProps {
    open: boolean
    setOpen: Function
    setLoggedIn: Function
}

export const PwdLogin = ({
    open, 
    setOpen,
    setLoggedIn
}: PwdLoginProps) => {

    const [error, setError] = React.useState<string>('');
    const [errorPwd, setErrorPwd] = React.useState<string>('');
    const [pwd, setPwd] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const setUser: Function = React.useContext(SetUserContext);

    const login = async() => {
        const resp = await UserAPI.pwdLogin(name, pwd);
        if (resp && resp.loggedIn) {
            setLoggedIn(resp.loggedIn);
            const respUser = await UserAPI.getUserProfile();
            setUser(respUser);
            setOpen(false);
        }
        setError('Ids invalids');
    }

    const onLogin = () => {
        if (name === '') {
            setError('Please enter a name')
        }
        else if (name.length > 15) {
            setError('Name too long (15 char max)')
        }
        else if (pwd.length < 5) {
            setErrorPwd('Password to short (5 char min)')
        }
        else if (pwd.length > 30) {
            setErrorPwd('Password to long (30 char max)')
        }
        else {
            login();
        }
    }
    return (

    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Login
        </DialogTitle>
        <DialogContent>

        <TextField
            error={error === '' ? false : true}
            id="outlined-name"
            label="Room name"
            helperText={error}
            onChange={(e: any) => { setName(e.target.value) }}
            sx ={{ ml:3, mr:3 }}
            />

            <TextField
            error={errorPwd === '' ? false : true}
            id="outlined-name"
            label="password"
            helperText={errorPwd}
            value={pwd}
            onChange={(e: any) => { setPwd(e.target.value) }}
            sx ={{ ml:3, mr:3 }}
            />

        </DialogContent>
        <DialogActions>
            <Button onClick={onLogin} >
                login 
            </Button>
            <Button onClick={() => setOpen(false)} >
                cancel 
            </Button>
        </DialogActions>
      </Dialog>
    </div>

    );
}