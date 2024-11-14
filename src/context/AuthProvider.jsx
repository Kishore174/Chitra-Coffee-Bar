import React, { Children, createContext, useContext, useEffect, useState } from 'react'
import {getAuditorBytoken} from "../API/auth"
 
const AuthContext = createContext()

const AuthProvider = ({children}) => {
  const [isLogin,setLogin] = useState(false)
  const [user,setUser] = useState(null)

  useEffect(()=>{
    const localData  =  localStorage.getItem('user')
    getAuditorBytoken().then((res)=>{
      setUser(res.data)
      setLogin(true)
    }).catch((err)=>{
      console.log(err.message)
      setLogin(false)
    })
  },[])
  return ( 
    <AuthContext.Provider value={{isLogin,setLogin,user,setUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=>{
  return useContext(AuthContext)
}

export default AuthProvider