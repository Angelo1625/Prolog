import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [suspect, setSuspect] = useState("");
  const [crime, setCrime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!suspect || !crime) {
      toast.error("⚠️ Veuillez remplir tous les champs");
      return;
    }

    const suspectLower = suspect;
    const crimeLower = crime.toLowerCase();

    try {
      const response = await fetch(
        `http://localhost:1414/check_guilt?suspect=${encodeURIComponent(
          suspectLower
        )}&crime=${encodeURIComponent(crimeLower)}`
      );

      const data = await response.json();

      if (data.result === "coupable") {
        toast.error(`❌ ${data.suspect} est ${data.result} de ${data.crime}`);
      } else {
        toast.success(`✅ ${data.suspect} est ${data.result}`);
      }
    } catch (error) {
      toast.error("Erreur lors de la connexion au backend");
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Partie gauche : formulaire */}
      <div style={styles.left}>
        <div style={styles.card}>
          <h2 style={styles.title}>Vérification de culpabilité</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Nom du suspect"
              value={suspect}
              onChange={(e) => setSuspect(e.target.value)}
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Crime commis"
              value={crime}
              onChange={(e) => setCrime(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Vérifier
            </button>
          </form>
        </div>
      </div>

      {/* Partie droite */}
      <div style={styles.right}>
        <img src="image.png" alt="illustration" style={styles.image} />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
        style={{ borderRadius: "12px" }}
      />
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    width: "100%",
    fontFamily: "'Inter', sans-serif",
  },
  left: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: "0 0 400px",
    backgroundColor: "#111827",
  },
  card: {
    backgroundColor: "#1f2937",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    width: "100%",
    maxWidth: "350px",
    textAlign: "center",
  },
  title: {
    color: "#f3f4f6",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #374151",
    backgroundColor: "#111827",
    color: "#f3f4f6",
    outline: "none",
    fontSize: "1rem",
  },
  button: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#10b981",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  right: {
    flex: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

export default App;
