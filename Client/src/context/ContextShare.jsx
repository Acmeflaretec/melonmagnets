import React, {  createContext, useState } from 'react'

export const cartResponseContext = createContext()

function ContextShare({children}) {
    const [ toggleCart , setToggleCart] = useState(false)
  return (
    <cartResponseContext.Provider value={{toggleCart , setToggleCart}}>
        {children}
    </cartResponseContext.Provider>
  )
}

export default ContextShare