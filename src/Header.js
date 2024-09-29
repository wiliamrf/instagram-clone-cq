import { useEffect, useState } from "react";
import firebase from "firebase";
import { auth, storage, db } from "./firebase.js";

function Header(props) {

  const [progress, setProgress] = useState(0);

  const [file, setFile] = useState(null);

  useEffect(() => {
    props.setUser();
  },[]);

  function criarConta(e) {
    e.preventDefault();
    let email = document.getElementById("email-cadastro").value;
    let username = document.getElementById("username-cadastro").value;
    let senha = document.getElementById("senha-cadastro").value;

    //Criar conta Firebase;

    auth
      .createUserWithEmailAndPassword(email, senha)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
        alert("Conta Criada com sucesso!");

        let modal = document.querySelector(".modalCriarConta");

        modal.style.display = "none";
      })
      .catch((error) => {
        alert(error.message);
      })
  }
  function logar(e) {
    let email = document.getElementById('email-login').value;
    let senha = document.getElementById('senha-login').value;

    // login usuario

    auth.signInWithEmailAndPassword(email, senha)
      .then((auth) => {
        props.setUser(auth.user.displayName);
        alert('Login realizado com sucesso!');
      }).catch((err) => {
        alert(err.message);
      })
  }

  function abrirModalCriarConta(e) {
    e.preventDefault();

    let modal = document.querySelector(".modalCriarConta");

    modal.style.display = "block";
  }
  function abrirModalUpload(e) {
    e.preventDefault();

    let modal = document.querySelector(".modalUpload");

    modal.style.display = "block";
  }

  function fecharModalCriar() {
    let modal = document.querySelector(".modalCriarConta");

    modal.style.display = "none";
  }

  function fecharModalUpload() {
    let modal = document.querySelector(".modalUpload");

    modal.style.display = "none";
  }

  function uploadPost(e) {
    e.preventDefault();

    let tituloPost = document.getElementById("titulo-upload").value;

  

    const uploadTask = storage.ref(`imagens/${file.name}`).put(file);

    uploadTask.on(
      "state_change",
      function (snapshot) {
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      function (error) { },
      function () {
        storage.ref("Imagens").child(file.name).getDownloadURL()
          .then(function (url) {
            db.collection("posts").add({
              titulo: tituloPost,
              image: url,
              username: props.user,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })

            setProgress(0);
            setFile(null);

            alert("Upload realizado com sucesso");

            document.getElementById("form-upload").reset();
          })
      })
  }

  return (
    <div className="header">
      <div className="modalCriarConta">
        <div className="formCriarConta">
          <div onClick={() => fecharModalCriar()} className="close-modal-criar">
            X
          </div>
          <h2>Criar Conta</h2>
          <form onSubmit={(e) => criarConta(e)}>
            <input id="email-cadastro" type="text" placeholder="Seu e-mail..." />
            <input id="username-cadastro" type="text" placeholder="Seu Username..." />
            <input id="senha-cadastro" type="password" placeholder="Seu Senha..." />
            <input type="submit" value="Criar Conta" />
          </form>
        </div>
      </div>

      <div className="modalUpload">
        <div className="formUpload">
          <div onClick={() => fecharModalUpload()} className="close-modal-upload">
            X
          </div>
          <h2>Fazer upload</h2>
          <form id="form-upload" onSubmit={(e)=>uploadPost(e)}>
            <progress id="progress-upload" value={progress}></progress>
            <input id="titulo-upload" type="text" placeholder="Nome da sua foto..." />
            <input onChange={(e)=>setFile(e.target.files[0])} type="file" name="file" />
            <input type="submit" value="Postar no Instagram" />
          </form>
        </div>
      </div>

      <div className="center">
        <div className="header__logo">
          <a href=''><img alt='home' src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgMi4xNjNjMy4yMDQgMCAzLjU4NC4wMTIgNC44NS4wNyAzLjI1Mi4xNDggNC43NzEgMS42OTEgNC45MTkgNC45MTkuMDU4IDEuMjY1LjA2OSAxLjY0NS4wNjkgNC44NDkgMCAzLjIwNS0uMDEyIDMuNTg0LS4wNjkgNC44NDktLjE0OSAzLjIyNS0xLjY2NCA0Ljc3MS00LjkxOSA0LjkxOS0xLjI2Ni4wNTgtMS42NDQuMDctNC44NS4wNy0zLjIwNCAwLTMuNTg0LS4wMTItNC44NDktLjA3LTMuMjYtLjE0OS00Ljc3MS0xLjY5OS00LjkxOS00LjkyLS4wNTgtMS4yNjUtLjA3LTEuNjQ0LS4wNy00Ljg0OSAwLTMuMjA0LjAxMy0zLjU4My4wNy00Ljg0OS4xNDktMy4yMjcgMS42NjQtNC43NzEgNC45MTktNC45MTkgMS4yNjYtLjA1NyAxLjY0NS0uMDY5IDQuODQ5LS4wNjl6bTAtMi4xNjNjLTMuMjU5IDAtMy42NjcuMDE0LTQuOTQ3LjA3Mi00LjM1OC4yLTYuNzggMi42MTgtNi45OCA2Ljk4LS4wNTkgMS4yODEtLjA3MyAxLjY4OS0uMDczIDQuOTQ4IDAgMy4yNTkuMDE0IDMuNjY4LjA3MiA0Ljk0OC4yIDQuMzU4IDIuNjE4IDYuNzggNi45OCA2Ljk4IDEuMjgxLjA1OCAxLjY4OS4wNzIgNC45NDguMDcyIDMuMjU5IDAgMy42NjgtLjAxNCA0Ljk0OC0uMDcyIDQuMzU0LS4yIDYuNzgyLTIuNjE4IDYuOTc5LTYuOTguMDU5LTEuMjguMDczLTEuNjg5LjA3My00Ljk0OCAwLTMuMjU5LS4wMTQtMy42NjctLjA3Mi00Ljk0Ny0uMTk2LTQuMzU0LTIuNjE3LTYuNzgtNi45NzktNi45OC0xLjI4MS0uMDU5LTEuNjktLjA3My00Ljk0OS0uMDczem0wIDUuODM4Yy0zLjQwMyAwLTYuMTYyIDIuNzU5LTYuMTYyIDYuMTYyczIuNzU5IDYuMTYzIDYuMTYyIDYuMTYzIDYuMTYyLTIuNzU5IDYuMTYyLTYuMTYzYzAtMy40MDMtMi43NTktNi4xNjItNi4xNjItNi4xNjJ6bTAgMTAuMTYyYy0yLjIwOSAwLTQtMS43OS00LTQgMC0yLjIwOSAxLjc5MS00IDQtNHM0IDEuNzkxIDQgNGMwIDIuMjEtMS43OTEgNC00IDR6bTYuNDA2LTExLjg0NWMtLjc5NiAwLTEuNDQxLjY0NS0xLjQ0MSAxLjQ0cy42NDUgMS40NCAxLjQ0MSAxLjQ0Yy43OTUgMCAxLjQzOS0uNjQ1IDEuNDM5LTEuNDRzLS42NDQtMS40NC0xLjQzOS0xLjQ0eiIvPjwvc3ZnPg==" /></a>
        </div>
        {
          (props.user)?
            <div className="header__logadoInfo">
              <span>Ola <b>{props.user}</b></span>
              <a onClick={(e) => abrirModalUpload(e)} href="#">Postar!</a>
            </div>
        : 
            <div className="header__loginForm">
              <form onSubmit={(e)=>logar(e)}>
                <input id="email-login" type="text" placeholder="Login..." />
                <input id="senha-login" type="password" placeholder="Senha..." />
                <input type="submit" name="acao" value="Logar!"/>
              </form>
              <div className="btn_criarConta">
                <a onClick={(e)=>abrirModalCriarConta(e)} href="#">Criar Conta!</a>
              </div>
            </div>
        
      }
      </div>
    </div>
  )
}

export default Header;
