import './App.css';
import './firebase.js';
import { db } from './firebase'; 
import { useEffect, useState } from 'react';
import Header from './Header';




function App() {

  const [user, setUser] = useState();  

   const [posts,setPosts] = useState([]);

  useEffect(() => {

    db.collection('posts').orderBy('timestamp','desc').onSnapshot(function(snapshot){


    })

  },[])

  return (
    <div className="App">
      <Header setUser={setUser} user={user}></Header>
      
    </div>
  );
}

export default App;
