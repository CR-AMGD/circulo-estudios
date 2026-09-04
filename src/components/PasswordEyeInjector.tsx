'use client'
import { useEffect } from 'react'

export default function PasswordEyeInjector() {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement
      
      if (passwordInput && !passwordInput.parentElement?.dataset.eyeInjected) {
        passwordInput.parentElement!.dataset.eyeInjected = 'true'
        passwordInput.parentElement!.style.position = 'relative'
        passwordInput.style.paddingRight = '38px'

        const button = document.createElement('button')
        button.type = 'button'
        button.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `
        button.style.cssText = `
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          color: #888;
          display: flex;
          align-items: center;
          padding: 4px;
        `

        let show = false
        button.onclick = (e) => {
          e.preventDefault()
          show = !show
          passwordInput.type = show ? 'text' : 'password'
          button.innerHTML = show ? `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ` : `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          `
        }

        passwordInput.parentElement!.appendChild(button)
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}