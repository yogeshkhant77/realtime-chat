import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core'
import Message from './Message';
import FlipMove from 'react-flip-move'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import axios from './axios.js';
import Pusher from 'pusher-js';
import { auth } from './firebase';
import { ReactComponent as MessengerLogo } from './messenger.svg';

const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY || '', { 
  cluster: process.env.REACT_APP_PUSHER_CLUSTER || 'ap2' 
});

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')
  const [identifier, setIdentifier] = useState('') // username or email
  const [password, setPassword] = useState('')
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  

  // listen to firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const displayName =
          user.displayName ||
          (user.email ? user.email.split('@')[0] : '') ||
          ''
        setUsername(displayName)
        setIdentifier(user.email || displayName)
        setEmail(user.email || '')
        setPhotoUrl(user.photoURL || '')
      } else {
        setUsername('')
        setEmail('')
        setPhotoUrl('')
      }
    })

    return () => unsubscribe()
  }, [])

  //axios setup to retrieve messages from backend
  const sync=async () => {
    await axios.get('http://localhost:9000/retrieve/conversation')
    .then((response) => {
      setMessages(response.data)
      console.log(response.data)
    })  
    .catch((error) => {
      console.error('There was an error retrieving the messages!', error);
    }
    );
  }
  useEffect(() => {
    sync();
  }, []);

  useEffect(() => {
    const channel = pusher.subscribe('messages');
    const handler = function () { sync(); };
    channel.bind('newmessages', handler);

    // cleanup on unmount
    return () => {
      try {
        channel.unbind('newmessages', handler);
        pusher.unsubscribe('messages');
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [username]);

  // auth form submit: use Firebase Auth (email + password)
  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')

    const email = identifier.trim()
    const pwd = password.trim()
    if (!email || !pwd) return

    setAuthLoading(true)
    try {
      let finalDisplayName = username

      if (isLoginMode) {
        // Login existing user
        const result = await auth.signInWithEmailAndPassword(email, pwd)
        const user = result.user
        const displayName =
          user.displayName ||
          (user.email ? user.email.split('@')[0] : '') ||
          ''
        setUsername(displayName)
        finalDisplayName = displayName
      } else {
        // Register new user
        const result = await auth.createUserWithEmailAndPassword(email, pwd)
        const user = result.user
        const displayName = email.includes('@')
          ? email.split('@')[0]
          : email

        // set displayName for future sessions
        if (!user.displayName) {
          await user.updateProfile({ displayName })
        }

        setUsername(displayName)
        finalDisplayName = displayName
      }

      // Save / update user in MongoDB via backend
      try {
        await axios.post('/api/users/save', {
          email,
          username: finalDisplayName || email,
          password: pwd,
        })
      } catch (userErr) {
        // Non-blocking: log but don't break login
        console.error('Failed to save user in backend', userErr)
      }

      setPassword('')
    } catch (error) {
      setAuthError(error.message || 'Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  const sendMessage = (e) => {
    e.preventDefault()

    axios.post('/save/messages', {
      username: username,
      message: input,
      timestamp:Date.now()
    })
      
   setInput('')
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
    } catch (err) {
      // optional: log or show error
      console.error('Logout error', err)
    } finally {
      setUsername('')
      setIdentifier('')
      setPassword('')
      setAuthError('')
      setIsLoginMode(true)
      setEmail('')
      setPhotoUrl('')
    }
  }

  // if username not set, show login/register page first
  if (!username) {
    return (
      <div className="App app__authContainer">
        <div className="app__authContent">
          <MessengerLogo className="app__authLogo" />
          <h2 className="app__authHeading">{isLoginMode ? 'Login to start chatting' : 'Register to start chatting'}</h2>

          {authError && (
            <p className="app__authError">{authError}</p>
          )}

          <form
            className="app__authForm"
            onSubmit={handleAuthSubmit}
          >
            <FormControl className="app__authFormControl" fullWidth>
              <InputLabel htmlFor="auth-identifier">
                Username or Email
              </InputLabel>
              <Input
                id="auth-identifier"
                className="app__authInput"
                placeholder="Enter username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </FormControl>

            <FormControl className="app__authFormControl" fullWidth>
              <InputLabel htmlFor="auth-password">
                Password
              </InputLabel>
              <Input
                id="auth-password"
                type="password"
                className="app__authInput"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <div className="app__authButtons">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={authLoading || !identifier.trim() || !password.trim()}
              >
                {authLoading
                  ? (isLoginMode ? 'Logging in...' : 'Registering...')
                  : (isLoginMode ? 'Login' : 'Register')}
              </Button>
              <Button
                color="secondary"
                fullWidth
                onClick={() => setIsLoginMode(prev => !prev)}
              >
                {isLoginMode
                  ? "Don't have an account? Register"
                  : 'Already have an account? Login'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {/* Header with logo and logout button */}
      <div className="app__header">
        <div className="app__headerContent">
          <MessengerLogo className="app__logo" />
          <div className="app__welcome">
            Welcome {username}
          </div>
        </div>
        
        {/* Logout button at top-right */}
        <div className="app__logoutContainer">
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Messages container */}
      <div className="app__messagesContainer">
        <FlipMove>
          {
            messages.map( message => (
              <Message key={message._id} message={message} username={username} />
            ))
          }
        </FlipMove>
      </div>

      {/* Input form at bottom */}
      <form className='app__form' onSubmit={sendMessage}>
        <FormControl className='app__formControl' >
          <Input className='app__input' placeholder='Enter a message...' value={input} onChange={(e) => setInput(e.target.value)} />
          <IconButton className='app__iconButton' variant='text' color='primary' disabled={!input} type="submit" >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>
    </div>
  );
}

export default App;
