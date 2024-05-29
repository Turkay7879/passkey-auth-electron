import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import AuthenticationRemote, { AddPasskeyPayload, ChallengePayload, LoginBasicPayload, LoginPasskeyPayload } from "../remote/AuthenticationRemote";
import Alert from "../ui/alerts/Alert";
import "./Login.css";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            {new Date().getFullYear()}
        </Typography>
    );
}

const Login = () => {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [usePasskeyAuth, setUsePasskeyAuth] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const payload: LoginBasicPayload = {
            email: data.get('email')?.toString() || "",
            password: data.get('password')?.toString() || "",
            usePasskeyAuth: usePasskeyAuth
        };
        
        if (!usePasskeyAuth) {
            AuthenticationRemote.login(payload).then(() => {
                Alert.success(null, "Logged in successfully!");
            }).catch((err: string) => {
                Alert.error("Failed to login!", err);
            });
        } else {
            const getChallengePayload: ChallengePayload = {
                email: data.get('email')?.toString() || ""
            }

            AuthenticationRemote.getChallenge(getChallengePayload).then(async (serverChallenge) => {
                const digest: string = await window.electron.signChallenge(serverChallenge);
                const loginPayload: LoginPasskeyPayload = {
                    email: getChallengePayload.email,
                    usePasskeyAuth: usePasskeyAuth,
                    challenge: serverChallenge.challenge,
                    digest: digest
                };

                AuthenticationRemote.login(loginPayload).then(() => {
                    Alert.success(null, "Logged in successfully!");
                }).catch((err: string) => {
                    Alert.error("Failed to login!", err);
                });
            });
        }
    };

    const registerPasskey = async () => {
        if (!mail || mail === "") {
            return Alert.error(null, "Please enter your e-mail to continue!");
        }

        const pubKey: string = await window.electron.createPubKey();
        const payload: AddPasskeyPayload = {
            email: mail,
            userPasskeys: [
                {
                    publicKey: pubKey
                }
            ]
        };

        AuthenticationRemote.addPasskey(payload).then(() => {
            Alert.success(null, "Added passkey to your account successfully!");
        }).catch((err) => {
            Alert.error(null, err);
        })
    }

    return (
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={mail || ""}
              onChange={(e) => setMail(e.target.value)}
            />
            <TextField
              margin="normal"
              required={!usePasskeyAuth}
              disabled={usePasskeyAuth}
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormGroup>
                <FormControlLabel control={
                    <Checkbox onChange={(e) => setUsePasskeyAuth(e.target.checked)}/>
                } label="Use Passkey Authentication with TPM"/>
            </FormGroup>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={registerPasskey}
            >
              Register Passkey
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    );
}

export default Login;