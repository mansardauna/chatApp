import './App.css';

import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import logo from './images/logo.svg'


const firebaseConfig = {
  apiKey: "AIzaSyCb3ReqzrciEOXn3_RcoPapt6i7Ukn0Hu8",
  authDomain: "chatapp-a9809.firebaseapp.com",
  projectId: "chatapp-a9809",
  storageBucket: "chatapp-a9809.appspot.com",
  messagingSenderId: "1052369672230",
  appId: "1:1052369672230:web:e0de12f3467d3c7c8ceee7",
  measurementId: "G-7HHKDFS11L"
};

firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const firestore = firebase.firestore();
// const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header class=' bg-emerald-100 shadow-md '>
        <div class='flex w-fit p-2 m-auto items-center'>
          <img src={logo} alt="logo" class='w-10 h-10' />
          <div class=' font-sans font-light text-3xl'>OpenText</div>
        </div>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <div class='w-6/12 shadow-md m-auto h-72 mt-48 bg-gradient-to-b from-green-100 to-slate-500  relative'>
        <button className="sign-in" onClick={signInWithGoogle} class='mt-10 p-2 sign'>Sign in with Google</button>
        <p class='text-lg absolute bottom-2 ml-5 text-white text-xs'>Have fun and connect to the world</p>
      </div>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()} class='p-2 bg-red-300 rounded-lg text-white font-bold absolute right-2 text-xs top-3'>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage} class=' fixed bottom-0 m-auto w-full sm:w-10/12 sm:left-20 p-3 bg-emerald-100'>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Say something" class='p-2 w-72 rounded-xl shadow-lg typing' />

      <button type="submit" disabled={!formValue} class='w-fit bg-slate-100 p-1 px-3 uppercase text-xs ml-3 rounded-lg shadow-lg'>Send</button>

    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div class='w-6/12 relative m-3 sm:m-auto mt-5'>
      <div className={`message ${messageClass}`} class='p-2 px-4 rounded-xl mt-2 w-fit h-fit bg-gray-200 flex items-center'>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='dp' class='w-10 rounded-full' />
        <span class='ml-3'>{text}</span>
      </div>
    </div>
  </>)
}


export default App;

