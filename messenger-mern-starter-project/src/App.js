import React, { useEffect, useState } from 'react';
import './App.css';
import { Button, FormControl, InputLabel, Input } from '@material-ui/core'
import Message from './Message';
import logo from './logo.jpg'
import FlipMove from 'react-flip-move'
import SendIcon from '@material-ui/icons/Send'
import IconButton from '@material-ui/core/IconButton'
import axios from './axios.js';
import Pusher from 'pusher-js';
import { auth } from './firebase';

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
      <div className="App">
        <img src={logo} alt="messenger logo" className="app__logo" />
        <h2>{isLoginMode ? 'Login to start chatting' : 'Register to start chatting'}</h2>

        {authError && (
          <p style={{ color: 'red', marginTop: 8 }}>{authError}</p>
        )}

        <form
          className="app__form"
          onSubmit={handleAuthSubmit}
          style={{ maxWidth: 400, margin: '20px auto' }}
        >
          <FormControl className="app__formControl" fullWidth>
            <InputLabel htmlFor="auth-identifier">
              Username or Email
            </InputLabel>
            <Input
              id="auth-identifier"
              className="app__input"
              placeholder="Enter username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </FormControl>

          <FormControl className="app__formControl" fullWidth style={{ marginTop: 16 }}>
            <InputLabel htmlFor="auth-password">
              Password
            </InputLabel>
            <Input
              id="auth-password"
              type="password"
              className="app__input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={authLoading || !identifier.trim() || !password.trim()}
            >
              {authLoading
                ? (isLoginMode ? 'Logging in...' : 'Registering...')
                : (isLoginMode ? 'Login' : 'Register')}
            </Button>
            <Button
              color="secondary"
              onClick={() => setIsLoginMode(prev => !prev)}
            >
              {isLoginMode
                ? "Don't have an account? Register"
                : 'Already have an account? Login'}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="App">
      {/* Full-width header container so logout really sits at screen right */}
      <div style={{ position: 'relative', width: '100%', paddingTop: 8 }}>
        {/* Center block: logo and welcome text */}
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto 16px',
            padding: '0 16px',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        >
          <img
            src={logo}
            alt="messenger logo"
            className="app__logo"
            style={{
              height: 48,
              objectFit: 'contain',
              display: 'inline-block',
            }}
          />
          <div style={{ marginTop: 4, fontWeight: 500 }}>
            Welcome {username}
          </div>
          {email && (
            <div style={{ fontSize: 12, opacity: 0.8 }}>{email}</div>
          )}
        </div>

        {/* Right side: avatar + logout, fixed to top-right of viewport */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {/* Avatar circle: photo or first letter */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              overflow: 'hidden',
              backgroundColor: '#3f51b5',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              textTransform: 'uppercase',
            }}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={username}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              (username || email || '?')[0]
            )}
          </div>

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

      <form className='app__form' >
        <FormControl className='app__formControl' >
          <Input className='app__input' placeholder='Enter a message...' value={input} onChange={(e) => setInput(e.target.value)} />
          <IconButton className='app__iconButton' variant='text' color='primary' disabled={!input} onClick={sendMessage} type="submit" >
            <SendIcon />
          </IconButton>
        </FormControl>
      </form>

      <FlipMove>
        {
          messages.map( message => (
            <Message key={message._id} message={message} username={username} />
          ))
        }
      </FlipMove>
    </div>
  );
}

export default App;
