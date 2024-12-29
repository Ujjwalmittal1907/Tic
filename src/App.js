import React, { useState, useEffect } from "react";
import {
  WelldoneWallet,
  WelldoneWalletName,
} from "@welldone-studio/aptos-wallet-adapter";

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  // Initialize the Welldone Wallet
  useEffect(() => {
    const initWallet = async () => {
      const walletInstance = new WelldoneWallet(WelldoneWalletName);
      setWallet(walletInstance);
    };
    initWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (!wallet) {
        alert("Wallet not initialized.");
        return;
      }
      const account = await wallet.connect();
      setWalletAddress(account.address);
      console.log("Connected account:", account);
    } catch (error) {
      console.error("Failed to connect wallet:", error.message);
      alert("Failed to connect wallet. Make sure your wallet is installed and unlocked.");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    console.log("Wallet disconnected.");
  };

  const handleCellClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);

    checkWinner(newBoard);
  };

  const checkWinner = (board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }

    if (!board.includes(null)) {
      setWinner("Draw");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        textAlign: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #f39c12, #f1c40f)",
        minHeight: "100vh",
        color: "#2c3e50",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", color: "#9932CC", marginBottom: "20px" }}>
        Classic Tic Tac Toe
      </h1>

      {!walletAddress ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 30px",
            fontSize: "18px",
            cursor: "pointer",
            marginBottom: "20px",
            backgroundColor: "#3498db",
            color: "#ffffff",
            border: "none",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p style={{ fontSize: "18px", color: "#ffffff" }}>
            Connected Wallet: <strong>{walletAddress}</strong>
          </p>
          <button
            onClick={disconnectWallet}
            style={{
              padding: "10px 30px",
              fontSize: "18px",
              cursor: "pointer",
              backgroundColor: "#e74c3c",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            Disconnect Wallet
          </button>
        </div>
      )}

      {walletAddress && (
        <div>
          <h2 style={{ fontSize: "2rem", color: "#ffffff", marginBottom: "20px" }}>
            Tic Tac Toe Game
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 100px)",
              gap: "10px",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            {board.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleCellClick(index)}
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#ecf0f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              >
                {cell}
              </div>
            ))}
          </div>

          {winner && (
            <div style={{ marginTop: "20px" }}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  color: winner === "Draw" ? "#5865F2" : "#5865F2",
                }}
              >
                {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
              </h3>
              <button
                onClick={resetGame}
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  cursor: "pointer",
                  backgroundColor: "#27ae60",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  marginTop: "10px",
                }}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
