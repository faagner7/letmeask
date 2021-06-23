import { createContext, useEffect, useState } from 'react'
import { firebase, auth } from '../services/firebase'

interface UserProps {
  id: String
  name: String
  avatar: String
}
interface AuthContextTypes {
  user: UserProps | undefined
  signInWithGoogle: () => Promise<void>
}

interface AuthContextProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContextTypes)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account')
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const [user, setUser] = useState<UserProps>()

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)

    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account')
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
