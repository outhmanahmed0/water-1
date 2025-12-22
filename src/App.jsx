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
    return localStorage.getItem('water-last-date') || new Date().toISOString().split('T')[0]
  })


  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]

    if (lastDate !== today) {
      if (count > 0) {
        const entry = { date: lastDate, count: count }
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

  const getMessage = () => {
    if (count === 0) return "Let’s start drinking water 💧"
    if (count >= goal) return "Great! You are well hydrated 🎉"
    if (count >= goal / 2) return "Good job, keep going 👍"
    return "Keep hydrated! 💧"
  }

  const progressPercentage = Math.min((count / goal) * 100, 100)
  var authCode = '';

  function test(){
    my.getAuthCode({
                scopes: ['auth_base', 'USER_ID'],
                success: (res) => {
                    authCode = res.authCode;
                    document.getElementById('authCode').textContent = authCode;

                    fetch('https://its.mouamle.space/api/auth-with-superQi', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            token: authCode
                        })
                    }).then(res => res.json()).then(data => {
                        my.alert({
                            content: "Login successful",
                        });
                    }).catch(err => {
                        let errorDetails = '';
                        if (err && typeof err === 'object') {
                            errorDetails = JSON.stringify(err, null, 2);
                        } else {
                            errorDetails = String(err);
                        }
                        my.alert({
                            content: "Error: " + errorDetails,
                        });
                    });
                },
                fail: (res) => {
                    console.log(res.authErrorScopes)
                },
            });
  }

  function copyAuthCode() {
            navigator.clipboard.writeText(authCode);
        }


    
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Water Reminder 💧</h1>
        <p className="subtitle">By Othman Ahmed</p>
      </header>

      <main className="dashboard-grid">
        {}
        <section className="card glass-panel main-tracker">
          <div className="counter-container">
            <div className="counter-display">{count}</div>
            <div className="message">{getMessage()}</div>
          </div>

          <div className="button-group">
            <button className="secondary-btn" onClick={handleReset} title="Reset Counter">
              Reset ↺
            </button>
            <button className="primary-btn pulse-anim" onClick={handleDrink}>
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
        <button onClick={()=>test()}>Auth</button>

        {}
        <InfoSection />

        {}
        <History history={history} />
      </main>
    </div>
  )
}

export default App
