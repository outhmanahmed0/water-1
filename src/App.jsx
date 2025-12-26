import { useState, useEffect } from 'react'
import './App.css'
import History from './components/History'
import InfoSection from './components/InfoSection'

function App() {

  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('water-count')
    return saved ? parseInt(saved, 10) : 0
  })

  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('water-goal')
    return saved ? parseInt(saved, 10) : 8
  })

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('water-history')
    return saved ? JSON.parse(saved) : []
  })

  const [lastDate, setLastDate] = useState(() => {
    return localStorage.getItem('water-last-date') ||
      new Date().toISOString().split('T')[0]
  })

  const [authCode, setAuthCode] = useState('')


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]

    if (lastDate !== today) {
      if (count > 0) {
        const entry = { date: lastDate, count }
        const newHistory = [...history, entry]
        setHistory(newHistory)
        localStorage.setItem('water-history', JSON.stringify(newHistory))
      }

      setCount(0)
      setLastDate(today)
      localStorage.setItem('water-last-date', today)
      localStorage.setItem('water-count', 0)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('water-count', count)
  }, [count])

  useEffect(() => {
    localStorage.setItem('water-goal', goal)
  }, [goal])

  useEffect(() => {
    localStorage.setItem('water-history', JSON.stringify(history))
  }, [history])

  const handleDrink = () => {
    setCount(c => c + 1)
  }

  const handleReset = () => {
    setCount(0)
  }
  var tokenid = "";

  const getMessage = () => {
    if (count === 0) return "Let’s start drinking water 💧"
    if (count >= goal) return "Great! You are well hydrated 🎉"
    if (count >= goal / 2) return "Good job, keep going 👍"
    return "Keep hydrated! 💧"
  }

  const progressPercentage = Math.min((count / goal) * 100, 100)

  const authenticate = () => {

    if (!window.my) {
      alert('Auth يعمل فقط داخل Mini App (my غير متوفر)')
      return
    }

    window.my.getAuthCode({
      scopes: ['auth_base', 'USER_ID'],
      success: (res) => {
        setAuthCode(res.authCode)

        fetch('https://its.mouamle.space/api/auth-with-superQi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: tokenid = res.authCode,
          }),
        })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP Error: ${res.status}`)
            }
            return res.json()
          })
          .then(data => {
            window.my.alert({
              content: data.token,
            })
            console.log('Auth response:', data)
          })
          .catch(err => {
            window.my.alert({
              content: "Error: " + err.message,
            })
          })
      },
      fail: (err) => {
        console.error('Auth failed:', err)
      },
    })
  }

  const copyAuthCode = () => {
    navigator.clipboard.writeText(authCode)
  }

          function pay() {
            fetch('https://its.mouamle.space/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            }).then(res => res.json()).then(data => {
                my.tradePay({
                    paymentUrl: data.url,
                    success: (res) => {
                        my.alert({
                            content: "Payment successful",
                        });
                    },
                });
            }).catch(err => {
                my.alert({
                    content: "Payment failed",
                });
            });
        }





//   const trade = ()=> {
//     my.tradePay({
//     paymentUrl: "https://www.wallet.com/cashier?orderId=xxxxxxx", // get the redirectUrl from the server first
//   success: (res) => {
//     my.alert({
//       content: JSON.stringify(res),
//     });
//   },
//   fail: (res) => {
//     my.alert({
//       content: JSON.stringify(res),
//     });
//   }
// });
// }


  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Water Reminder 💧</h1>
        <p className="subtitle">By Othman Ahmed</p>
      </header>

      <main className="dashboard-grid">

        <section className="card glass-panel main-tracker">
          <div className="counter-container">
            <div className="counter-display">{count}</div>
            <div className="message">{getMessage()}</div>
          </div>

          <div className="button-group">
            <button
              className="secondary-btn"
              onClick={handleReset}
            >
              Reset ↺
            </button>

            <button
              className="primary-btn pulse-anim"
              onClick={handleDrink}
            >
              Drink Water 💧
            </button>
          </div>

          <div className="progress-info">
            <div className="progress-labels">
              <span>0</span>
              <span>Goal: {goal}</span>
            </div>

            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </section>

        {/* AUTH BUTTON */}
        <button onClick={authenticate}>
          Auth
        </button>

        <button onClick={pay}>
          Pay
        </button>

        {authCode && (
          <button onClick={copyAuthCode}>
            Copy Auth Code
          </button>
        )}

        <InfoSection />
        <History history={history} />

      </main>
    </div>
  )
}

export default App
